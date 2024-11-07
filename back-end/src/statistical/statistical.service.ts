import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { Bills } from 'src/bill/entities/bill.entity';
import { CommonException } from 'src/common/exception';
import { Products } from 'src/product/entities/products.entity';
import { Repository } from 'typeorm';
import { StatisticalDto } from './statistical.dto';

@Injectable()
export class StatisticalService {
    constructor(
        @InjectRepository(Accounts)
        private readonly accountsRepository: Repository<Accounts>,
        @InjectRepository(Bills)
        private readonly billsRepository: Repository<Bills>,
        @InjectRepository(Products)
        private readonly productsRepository: Repository<Products>,
    ){}

    async statistical(): Promise<any> {
        try {

            const totalRevenue = await this.billsRepository.createQueryBuilder('bills')
                .select('SUM(bills.totalPayment) as totalProfit')
                .where('bills.status = :status', {status: 'success'})
                .getRawOne();
                
            const totalProducts = await this.productsRepository.count();
            const totalUsers = await this.accountsRepository.count();
            // total bill
            const totalBills = await this.billsRepository.count();
            return {
                totalRevenue: parseInt(totalRevenue.totalProfit),
                totalProducts,
                totalUsers,
                totalBills
            };


        } catch (error) {
            CommonException.handle(error);
        }
    }

    // statistical calculation revenue for each date range
    // async statisticalByDate(statisticalDto: StatisticalDto): Promise<any> {
    //     try {
    //         const totalRevenue = await this.billsRepository.createQueryBuilder('bills')
    //             .select('DATE(CONVERT_TZ(bills.createdAt, "+00:00", "+07:00"))', 'date') // Adjust timezone as needed
    //             .addSelect('SUM(bills.totalPayment)', 'totalProfit')
    //             .where('bills.status = :status', { status: 'success' })
    //             .andWhere('bills.createdAt >= :startDate', { startDate: statisticalDto.startDate })
    //             .andWhere('bills.createdAt <= :endDate', { endDate: statisticalDto.endDate })
    //             .groupBy('DATE(CONVERT_TZ(bills.createdAt, "+00:00", "+07:00"))') // Use same timezone conversion in GROUP BY
    //             .getRawMany();
    //         return totalRevenue;
    //     } catch (error) {
    //         CommonException.handle(error);
    //     }
    // }

   async statisticalByDate(statisticalDto: StatisticalDto): Promise<any> {
        try {
            const { startDate, endDate } = statisticalDto;

            const totalRevenue = await this.billsRepository.query(`
                WITH RECURSIVE date_range AS (
                    SELECT ? AS date
                    UNION ALL
                    SELECT DATE_ADD(date, INTERVAL 1 DAY)
                    FROM date_range
                    WHERE DATE_ADD(date, INTERVAL 1 DAY) <= ?
                )
                SELECT date_range.date AS date, 
                    IFNULL(SUM(bills.totalPayment), 0) AS totalProfit
                FROM date_range
                LEFT JOIN bills ON DATE(CONVERT_TZ(bills.createdAt, "+00:00", "+07:00")) = date_range.date
                            AND bills.status = 'success'
                GROUP BY date_range.date
                ORDER BY date_range.date ASC;
            `, [startDate, endDate]);

            return totalRevenue;
        } catch (error) {
            CommonException.handle(error);
        }
    }

 
    async statisticalByStatusAndDate(statisticalDto: StatisticalDto): Promise<any> {
        try {
            const totalBillsByStatusAndDate = await this.billsRepository.createQueryBuilder('bills')
                .select('DATE(CONVERT_TZ(bills.createdAt, "+00:00", "+07:00"))', 'date') // Adjust timezone as needed
                .addSelect('bills.status', 'status')
                .addSelect('COUNT(bills.id)', 'totalBills')
                .where('bills.createdAt >= :startDate', { startDate: statisticalDto.startDate })
                .andWhere('bills.createdAt <= :endDate', { endDate: statisticalDto.endDate })
                .groupBy('DATE(CONVERT_TZ(bills.createdAt, "+00:00", "+07:00"))')
                .addGroupBy('bills.status')
                .getRawMany();

                console.log(totalBillsByStatusAndDate)

            // Group by date and aggregate status totals
            const result = this.groupByDateAndStatus(totalBillsByStatusAndDate);
            // This will return the expected structure
            return result;
        } catch (error) {
            CommonException.handle(error);
        }
    }

    // statistical calculation quantity sell product by product
    async statisticalByProduct(statisticalDto: StatisticalDto): Promise<any> {
        try {
            // Fetching all relevant data for the specified date range
            const totalQuantityByProduct = await this.billsRepository.createQueryBuilder('bills')
                .leftJoinAndSelect('bills.billDetails', 'billDetails')
                .leftJoinAndSelect("billDetails.productAttributes", 'productAttributes')
                .leftJoinAndSelect("productAttributes.products", "products") // Ensure the alias is consistent
                .where('bills.createdAt >= :startDate', { startDate: statisticalDto.startDate })
                .andWhere('bills.createdAt <= :endDate', { endDate: statisticalDto.endDate })
                .getMany();

            // Process and return the sales statistics
            return this.getSalesStatistics(totalQuantityByProduct);
        } catch (error) {
            // Handle error if any occurs during the query execution
            CommonException.handle(error);
            throw new Error('Failed to fetch product statistics');
        }
    }


    getSalesStatistics(totalQuantityByProduct) {
        const salesCount: { [key: string]: { name: string, totalQuantity: number } } = {};

        // Loop through all orders and calculate the total quantity for each product
        totalQuantityByProduct.forEach((order) => {
            // Loop through each bill detail in the order
            order.billDetails.forEach((billDetail) => {
                const product = billDetail.productAttributes.products; // Get the product details
                const productId = product.id; // Get the product ID
                const productName = product.name; // Get the product name
                const quantity = billDetail.quantity; // Get the quantity of that product in this bill detail

                // If the product already exists in the salesCount object, update its total quantity
                if (salesCount[productId]) {
                    salesCount[productId].totalQuantity += quantity;
                } else {
                    // If the product is encountered for the first time, initialize its entry
                    salesCount[productId] = {
                        name: productName,
                        totalQuantity: quantity,
                    };
                }
            });
        });

        // Return the aggregated sales data for each product, including the product name
        return salesCount;
    }



    groupByDateAndStatus(data: any[]): any[] {
        // Step 1: Grouping the data by date and status
        const grouped = data.reduce((acc, { date, status, totalBills }) => {
            // Convert date to a consistent YYYY-MM-DD format (ignoring time)
            const dateKey = new Date(date).toISOString().split('T')[0];

            // If the date is not already in the accumulator, add it
            if (!acc[dateKey]) {
                acc[dateKey] = [];
            }

            // Find if this status already exists for this date
            const statusEntry = acc[dateKey].find(item => item.status === status);

            if (statusEntry) {
                // If status exists, aggregate the total
                statusEntry.total += parseInt(totalBills, 10);
            } else {
                // If status doesn't exist, create a new entry
                acc[dateKey].push({ status, total: parseInt(totalBills, 10) });
            }

            return acc;
        }, {});

        // Step 2: Convert the accumulator into an array
        const result = Object.entries(grouped).map(([date, statuses]) => ({
            date,
            status: statuses,
        }));

        return result;
    }








    








}
