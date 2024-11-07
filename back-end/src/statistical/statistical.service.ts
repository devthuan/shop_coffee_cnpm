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
                SELECT  DATE_FORMAT(date_range.date, '%Y-%m-%d') AS date, 
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
    const salesCount: { name: string, totalQuantity: number }[] = [];

    // Loop through all orders and calculate the total quantity for each product
    totalQuantityByProduct.forEach((order) => {
        order.billDetails.forEach((billDetail) => {
            const product = billDetail.productAttributes.products;
            const productName = product.name;
            const quantity = billDetail.quantity;

            // Find if the product already exists in salesCount array
            const existingProduct = salesCount.find(item => item.name === productName);

            if (existingProduct) {
                // If found, update the total quantity
                existingProduct.totalQuantity += quantity;
            } else {
                // If not found, add a new entry
                salesCount.push({
                    name: productName,
                    totalQuantity: quantity,
                });
            }
        });
    });

    return salesCount;
}




    groupByDateAndStatus(data: any[]): any[] {
    // Step 1: Grouping the data by date and status
    const grouped = data.reduce((acc, { date, status, totalBills }) => {
        // Convert date to a consistent YYYY-MM-DD format (ignoring time)
        const dateKey = new Date(date).toISOString().split('T')[0];

        // Initialize the date entry in the accumulator if it doesn't exist
        if (!acc[dateKey]) {
            acc[dateKey] = { date: dateKey };
        }

        // Aggregate the total bills for each status under the respective status key
        acc[dateKey][status] = (acc[dateKey][status] || 0) + parseInt(totalBills, 10);

        return acc;
    }, {});

    // Step 2: Convert the accumulator into an array format
    const result = Object.values(grouped);

    return result;
}









    








}
