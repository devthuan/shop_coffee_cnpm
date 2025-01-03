import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Attributes } from 'src/attribute/entities/attributes.entity';
import { AuthService } from 'src/auth/auth.service';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { BillService } from 'src/bill/bill.service';
import { CreateBillDto } from 'src/bill/dto/create-bill.dto';
import { Categories } from 'src/categories/entities/category.entity';
import { CommonException } from 'src/common/exception';
import { Functions } from 'src/function/entities/functions.entity';
import { Payments } from 'src/payment/entities/payment.entity';
import { Products } from 'src/product/entities/products.entity';
import { RoleHasFunctions } from 'src/role-permission/entities/roles_has_functions.entity';
import { Roles } from 'src/role/entities/roles.entity';
import { Supplier } from 'src/supplier/entities/supplier.entity';
import { Vouchers } from 'src/voucher/entities/vouchers.entity';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class SeederService {
    constructor(
        @InjectRepository(Accounts)
        private accountsRepository: Repository<Accounts>,   
        @InjectRepository(Roles)
        private rolesRepository: Repository<Roles>,  
        @InjectRepository(Functions)
        private functionsRepository: Repository<Functions>,  
        @InjectRepository(RoleHasFunctions)
        private roleHasFunctionsRepository: Repository<RoleHasFunctions>,  
        
        @InjectRepository(Categories)
        private categoriesRepository: Repository<Categories>,  

        @InjectRepository(Vouchers)
        private vouchersRepository: Repository<Vouchers>,

        @InjectRepository(Attributes)
        private attributesRepository: Repository<Attributes>,  

        @InjectRepository(Payments)
        private paymentsRepository: Repository<Payments>,  

        @InjectRepository(Supplier)
        private supplierRepository: Repository<Supplier>,  

  
        private readonly dataSource: DataSource
    ){}


    async createRoleAndPermission(): Promise<any>{
        const queryRunner =  this.dataSource.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const checkDataRole = await this.rolesRepository.find()
            if (checkDataRole.length > 3) {
                return {
                    message: 'Role already created',
                }
            }

            const checkDataFunction = await this.functionsRepository.find()
            if (checkDataFunction.length > 2) {
                return {
                    message: 'Function already created',
                }
            }

            const listRole = [
                {name: 'Admin', codeName: 'ADMIN', guardName: 'admin', isActive: true},
                {name: 'Quản lý sản phẩm', codeName: 'MANAGE_PRODUCT', guardName: 'manage_product', isActive: true},
                {name: 'Nhân viên bán hàng', codeName: 'STAFF_SALES', guardName: 'staff_sales', isActive: true},
                {name: 'Quản lý kho', codeName: 'MANAGE_WAREHOUSE', guardName: 'manage_warehouse', isActive: true},
                {name: 'Nhà cung cấp', codeName: 'SUPPLIER', guardName: 'supplier', isActive: true},
                {name: 'Chăm sóc khách hàng', codeName: 'SUPPORT_CLIENT', guardName: 'support_client', isActive: true},
                {name: 'Người dùng', codeName: 'USER', guardName: 'user', isActive: true},
            ]
            for (const role of listRole) {
                const newRole =  this.rolesRepository.create(role);
                await queryRunner.manager.save(newRole);
            }

            const listFunctionAPIEndpoint = [
                // auth
                {name: 'Đăng ký tài khoản', codeName: 'REGISTER', module: "Auth", method: "POST", endpoint:"auth/register", isActive: true},
                {name: 'Đăng nhập', codeName: 'LOGIN', module: "Auth", method: "POST", endpoint:"auth/login", isActive: true},
                {name: 'Xác thực mã OTP', codeName: 'VERIFY_OTP', module: "Auth", method: "POST", endpoint:"auth/verify-otp", isActive: true},
                {name: 'Gửi mã OTP đến email', codeName: 'SEND_OTP', module: "Auth", method: "POST", endpoint:"auth/send-otp", isActive: true},
                {name: 'Đổi mật khẩu', codeName: 'CHANGE_PASSWORD', module: "Auth", method: "POST", endpoint:"auth/change-password", isActive: true},
                {name: 'Khôi phục mật khẩu qua email', codeName: 'FORGOT_PASSWORD', module: "Auth", method: "POST", endpoint:"auth/forgot-password", isActive: true},
                // account
                {name: 'Tạo tài khoản mới', codeName: 'CREATE_ACCOUNT', module: "Account", method: "POST", endpoint:"account", isActive: true},
                {name: 'Xem thông tin tài khoản', codeName: 'VIEW_ACCOUNT', module: "Account", method: "GET", endpoint:"account", isActive: true},
                {name: 'Khóa tài khoản theo ID', codeName: 'LOCK_ACCOUNT', module: "Account", method: "PATCH", endpoint:"account/lock/:id", isActive: true},
                {name: 'Cập nhật thông tin tài khoản', codeName: 'UPDATE_ACCOUNT', module: "Account", method: "PATCH", endpoint:"account/:id", isActive: true},
                {name: 'Đặt lại mật khẩu tài khoản', codeName: 'RESET_PASSWORD', module: "Account", method: "PATCH", endpoint:"account/reset-password/:id", isActive: true},
                // role
                {name: 'Lấy danh sách vai trò', codeName: 'GET_ROLES', module: "Role", method: "GET", endpoint:"role-permission/roles", isActive: true},
                {name: 'Tạo vai trò mới', codeName: 'CREATE_ROLE', module: "Role", method: "POST", endpoint:"role-permission/roles", isActive: true},
                {name: 'Khôi phục vai trò bị xóa', codeName: 'RECOVER_ROLE', module: "Role", method: "PATCH", endpoint:"role-permission/roles/recover/:id", isActive: true},
                {name: 'Xóa vai trò theo ID', codeName: 'DELETE_ROLE', module: "Role", method: "DELETE", endpoint:"role-permission/roles/:id", isActive: true},
                // function
                {name: 'Lấy danh sách chức năng', codeName: 'GET_FUNCTIONS', module: "Function", method: "GET", endpoint:"role-permission/functions", isActive: true},
                {name: 'Tạo chức năng mới', codeName: 'CREATE_FUNCTION', module: "Function", method: "POST", endpoint:"role-permission/functions", isActive: true},
                {name: 'Khôi phục chức năng bị xóa', codeName: 'RECOVER_FUNCTION', module: "Function", method: "PATCH", endpoint:"role-permission/functions/recover/:id", isActive: true},
                {name: 'Xóa chức năng theo ID', codeName: 'DELETE_FUNCTION', module: "Function", method: "DELETE", endpoint:"role-permission/functions/:id", isActive: true},
                // role-permission
                {name: 'Lấy danh quyền', codeName: 'GET_PERMISSION', module: "Permission", method: "GET", endpoint:"role-permission", isActive: true},
                {name: 'Lấy danh quyền theo vai trò', codeName: 'GET_PERMISSION_BY_ROLE', module: "Permission", method: "GET", endpoint:"role-permission/by-role/:role", isActive: true},
                {name: 'Cập nhật quyền cho quyền', codeName: 'CREATE_PERMISSION', module: "Permission", method: "POST", endpoint:"role-permission", isActive: true},
                {name: 'Thay đổi trạng thái cho quyền', codeName: 'CHANGE_STATUS_PERMISSION', module: "Permission", method: "PATCH", endpoint:"role-permission/change-status/:id", isActive: true},
                // product
                {name: 'Lấy danh sách sản phẩm', codeName: 'GET_PRODUCTS', module: "Product", method: "GET", endpoint:"products", isActive: true},
                {name: 'Xem chi tiết thông tin sản phẩm', codeName: 'VIEW_PRODUCT', module: "Product", method: "GET", endpoint:"products/:id", isActive: true},
                {name: 'Xem thông tin chi tiết sản phẩm', codeName: 'VIEW_PRODUCT_DETAILS', module: "Product", method: "GET", endpoint:"products/detail/:id", isActive: true},
                {name: 'Tạo sản phẩm mới', codeName: 'CREATE_PRODUCT', module: "Product", method: "POST", endpoint:"product", isActive: true},
                {name: 'Cập nhật thông tin sản phẩm theo ID', codeName: 'UPDATE_PRODUCT', module: "Product", method: "PATCH", endpoint:"product/:id", isActive: true},
                {name: 'Xóa sản phẩm theo ID', codeName: 'DELETE_PRODUCT', module: "Product", method: "DELETE", endpoint:"product/:id", isActive: true},
                {name: 'Khôi phục sản phẩm bị xóa', codeName: 'RECOVER_PRODUCT', module: "Product", method: "PATCH", endpoint:"product/recover/:id", isActive: true},
                {name: 'Tải lên hình ảnh sản phẩm', codeName: 'UPLOAD_PRODUCT_IMAGE', module: "Product", method: "POST", endpoint:"upload", isActive: true},
                // attribute product
                {name: 'Lấy danh sách thuộc tính sản phẩm', codeName: 'GET_ATTRIBUTES', module: "Attribute product", method: "GET", endpoint:"attribute", isActive: true},
                {name: 'Xem thuộc tính đã bị xóa', codeName: 'VIEW_DELETED_ATTRIBUTES', module: "Attribute product", method: "GET", endpoint:"attribute/deleted", isActive: true},
                {name: 'Xem thông tin thuộc tính theo ID', codeName: 'VIEW_ATTRIBUTE', module: "Attribute product", method: "GET", endpoint:"attribute/:id", isActive: true},
                {name: 'Tạo thuộc tính mới cho sản phẩm', codeName: 'CREATE_ATTRIBUTE', module: "Attribute product", method: "POST", endpoint:"attribute", isActive: true},
                {name: 'Cập nhật thông tin thuộc tính', codeName: 'UPDATE_ATTRIBUTE', module: "Attribute product", method: "PATCH", endpoint:"attribute", isActive: true},
                {name: 'Khôi phục thuộc tính bị xóa', codeName: 'RECOVER_ATTRIBUTE', module: "Attribute product", method: "PATCH", endpoint:"attribute/recover/:id", isActive: true},
                {name: 'Xóa thuộc tính theo ID', codeName: 'DELETE_ATTRIBUTE', module: "Attribute product", method: "DELETE", endpoint:"attribute/:id", isActive: true},
                // discount product
                {name: 'Lấy danh sách chương trình giảm giá', codeName: 'GET_DISCOUNTS', module: "Discount product", method: "GET", endpoint:"discount", isActive: true},
                {name: 'Xem chi tiết chương trình giảm giá', codeName: 'VIEW_DISCOUNT', module: "Discount product", method: "GET", endpoint:"discount/:id", isActive: true},
                {name: 'Tạo chương trình giảm giá', codeName: 'CREATE_DISCOUNT', module: "Discount product", method: "POST", endpoint:"discount", isActive: true},
                {name: 'Chỉnh sửa chương trình giảm giá', codeName: 'UPDATE_DISCOUNT', module: "Discount product", method: "PATCH", endpoint:"discount/:id", isActive: true},
                {name: 'Khôi phục chương trình giảm giá', codeName: 'RECOVER_DISCOUNT', module: "Discount product", method: "PATCH", endpoint:"discount/recover/:id", isActive: true},
                {name: 'Xóa chương trình giảm giá', codeName: 'DELETE_DISCOUNT', module: "Discount product", method: "DELETE", endpoint:"discount/:id", isActive: true},
                // categories
                {name: 'Lấy danh sách danh mục sản phẩm', codeName: 'GET_CATEGORIES', module: "Categories", method: "GET", endpoint:"categories", isActive: true},
                {name: 'Xem danh mục sản phẩm đã bị xóa', codeName: 'VIEW_DELETED_CATEGORIES', module: "Categories", method: "GET", endpoint:"categories/deleted", isActive: true},
                {name: 'Xem thông tin danh mục theo ID', codeName: 'VIEW_CATEGORY', module: "Categories", method: "GET", endpoint:"categories/:id", isActive: true},
                {name: 'Tạo danh mục sản phẩm mới', codeName: 'CREATE_CATEGORY', module: "Categories", method: "POST", endpoint:"categories", isActive: true},
                {name: 'Cập nhật thông tin danh mục', codeName: 'UPDATE_CATEGORY', module: "Categories", method: "PATCH", endpoint:"categories/:id", isActive: true},
                {name: 'Khôi phục danh mục bị xóa', codeName: 'RECOVER_CATEGORY', module: "Categories", method: "PATCH", endpoint:"categories/recover/:id", isActive: true},
                {name: 'Xóa danh mục sản phẩm', codeName: 'DELETE_CATEGORY', module: "Categories", method: "DELETE", endpoint:"categories/:id", isActive: true},
                // reviews
                {name: 'Xem đánh giá theo sản phẩm', codeName: 'GET_REVIEWS_BY_PRODUCT', module: "Review", method: "GET", endpoint:"reviews/by-product/:id", isActive: true},
                {name: 'Lấy danh sách đánh giá', codeName: 'GET_REVIEWS', module: "Review", method: "GET", endpoint:"reviews", isActive: true},
                {name: 'Tạo đánh giá mới', codeName: 'CREATE_REVIEW', module: "Review", method: "POST", endpoint:"reviews", isActive: true},
                {name: 'Chỉnh sửa đánh giá', codeName: 'UPDATE_REVIEW', module: "Review", method: "POST", endpoint:"reviews/:id", isActive: true},
                {name: 'xoá đánh giá', codeName: 'DELETE_REVIEW', module: "Review", method: "DELETE", endpoint:"reviews/:id", isActive: true},
                // supplier
                { name: "Lấy danh sách nhà cung cấp", codeName: 'GET_SUPPLIERS', module: "Supplier", method: "GET", endpoint: "supplier", isActive: true },
                { name: "Xem nhà cung cấp đã bị xóa", codeName: 'GET_DELETED_SUPPLIERS', module: "Supplier", method: "GET", endpoint: "supplier/deleted", isActive: true },
                { name: "Xem thông tin nhà cung cấp theo ID", codeName: 'GET_SUPPLIER_BY_ID', module: "Supplier", method: "GET", endpoint: "supplier/:id", isActive: true },
                { name: "Tạo nhà cung cấp mới", codeName: 'CREATE_SUPPLIER', module: "Supplier", method: "POST", endpoint: "supplier", isActive: true },
                { name: "Xem chi tiết nhà cung cấp", codeName: 'GET_SUPPLIER_DETAIL', module: "Supplier", method: "POST", endpoint: "supplier/detail-supplier", isActive: true },
                { name: "Cập nhật thông tin nhà cung cấp", codeName: 'UPDATE_SUPPLIER', module: "Supplier", method: "PATCH", endpoint: "supplier/:id", isActive: true },
                { name: "Khôi phục nhà cung cấp bị xóa", codeName: 'RECOVER_SUPPLIER', module: "Supplier", method: "PATCH", endpoint: "supplier/recover/:id", isActive: true },
                { name: "Xóa nhà cung cấp theo ID", codeName: 'DELETE_SUPPLIER', module: "Supplier", method: "DELETE", endpoint: "supplier/:id", isActive: true },
                { name: "Xóa thông tin chi tiết nhà cung cấp", codeName: 'DELETE_SUPPLIER_DETAIL', module: "Supplier", method: "DELETE", endpoint: "supplier/detail/:id", isActive: true },
                // cart
                { name: "Xem giỏ hàng", codeName: 'GET_CART', module: "Cart", method: "GET", endpoint: "cart", isActive: true },
                { name: "Tạo mới giỏ hàng", codeName: 'CREATE_CART', module: "Cart", method: "POST", endpoint: "cart", isActive: true },
                { name: "Cập nhật sản phẩm trong giỏ hàng", codeName: 'UPDATE_CART_PRODUCT', module: "Cart", method: "PATCH", endpoint: "cart/:id", isActive: true },
                { name: "Tăng số lượng sản phẩm trong giỏ hàng", codeName: 'INCREASE_CART_PRODUCT', module: "Cart", method: "PATCH", endpoint: "cart/increase/:id", isActive: true },
                { name: "Giảm số lượng sản phẩm trong giỏ hàng", codeName: 'DECREASE_CART_PRODUCT', module: "Cart", method: "PATCH", endpoint: "cart/decrease/:id", isActive: true },
                { name: "Xóa sản phẩm trong giỏ hàng", codeName: 'DELETE_CART_PRODUCT', module: "Cart", method: "DELETE", endpoint: "cart/:id", isActive: true },
                // order
                { name: "Tạo hóa đơn mới", codeName: 'CREATE_BILL', module: "Order", method: "POST", endpoint: "bills", isActive: true },
                { name: "Lấy danh sách hóa đơn", codeName: 'GET_BILLS', module: "Order", method: "GET", endpoint: "bills", isActive: true },
                { name: "Xem hóa đơn theo tài khoản", codeName: 'GET_BILLS_BY_ACCOUNT', module: "Order", method: "GET", endpoint: "bills/account", isActive: true },
                { name: "Xem thông tin hóa đơn theo ID", codeName: 'GET_BILL_BY_ID', module: "Order", method: "GET", endpoint: "bills/:id", isActive: true },
                { name: "Cập nhật hóa đơn theo ID", codeName: 'UPDATE_BILL', module: "Order", method: "PATCH", endpoint: "bills/:id", isActive: true },
                // voucher
                { name: "Lấy danh sách voucher", codeName: 'GET_VOUCHERS', module: "Voucher", method: "GET", endpoint: "vouchers", isActive: true },
                { name: "Xem thông tin voucher theo ID", codeName: 'GET_VOUCHER_BY_ID', module: "Voucher", method: "GET", endpoint: "vouchers/:id", isActive: true },
                { name: "Tạo voucher mới", codeName: 'CREATE_VOUCHER', module: "Voucher", method: "POST", endpoint: "vouchers", isActive: true },
                { name: "Chỉnh sửa voucher ", codeName: 'UPDATE_VOUCHER', module: "Voucher", method: "PATCH", endpoint: "vouchers/:id", isActive: true },
                { name: "Sử dụng voucher theo ID", codeName: 'USE_VOUCHER', module: "Voucher", method: "PATCH", endpoint: "vouchers/use-voucher/:id", isActive: true },
                { name: "Khôi phục voucher bị xóa", codeName: 'RECOVER_VOUCHER', module: "Voucher", method: "PATCH", endpoint: "vouchers/recover/:id", isActive: true },
                { name: "Xóa voucher theo ID", codeName: 'DELETE_VOUCHER', module: "Voucher", method: "DELETE", endpoint: "vouchers/:id", isActive: true },
                // import receipt
                { name: "Lấy danh sách phiếu nhập hàng", codeName: 'GET_IMPORT_RECEIPTS', module: "Import receipt", method: "GET", endpoint: "import-receipt", isActive: true },
                { name: "Xem thông tin phiếu nhập hàng theo ID", codeName: 'GET_IMPORT_RECEIPT_BY_ID', module: "Import receipt", method: "GET", endpoint: "import-receipt/:id", isActive: true },
                { name: "Xem chi tiết phiếu nhập hàng", codeName: 'GET_IMPORT_RECEIPT_DETAIL', module: "Import receipt", method: "GET", endpoint: "import-receipt/detail/:id", isActive: true },
                { name: "Tạo phiếu nhập hàng mới", codeName: 'CREATE_IMPORT_RECEIPT', module: "Import receipt", method: "POST", endpoint: "import-receipt", isActive: true },
                { name: "Cập nhật trạng thái phiếu nhập hàng", codeName: 'UPDATE_IMPORT_RECEIPT_STATUS', module: "Import receipt", method: "PATCH", endpoint: "import-receipt/status/:id", isActive: true },
                // notifications
                { name: "Lấy danh sách thông báo", codeName: 'GET_NOTIFICATIONS', module: "Notifications", method: "GET", endpoint: "notification", isActive: true },
                { name: "Xem thông báo của người dùng", codeName: 'GET_USER_NOTIFICATIONS', module: "Notifications", method: "GET", endpoint: "notification/user", isActive: true },
                { name: "Tạo thông báo mới", codeName: 'CREATE_NOTIFICATION', module: "Notifications", method: "POST", endpoint: "notification", isActive: true },
                { name: "Đánh dấu thông báo đã đọc", codeName: 'MARK_NOTIFICATION_READ', module: "Notifications", method: "PATCH", endpoint: "notification/read/:id", isActive: true },
                { name: "Cập nhật thông báo", codeName: 'UPDATE_NOTIFICATION', module: "Notifications", method: "PATCH", endpoint: "notification/:id", isActive: true },
                { name: "Xóa thông báo theo ID", codeName: 'DELETE_NOTIFICATION', module: "Notifications", method: "DELETE", endpoint: "notification/:id", isActive: true },
                { name: "Xóa thông báo của người dùng theo ID", codeName: 'DELETE_USER_NOTIFICATION', module: "Notifications", method: "DELETE", endpoint: "notification/user/:id", isActive: true },
                // user information
                { name: "Xem thông tin người dùng", codeName: 'GET_USER_INFORMATION', module: "Information user", method: "GET", endpoint: "user-information/user", isActive: true },
                { name: "Tạo mới danh sách yêu thích", codeName: 'CREATE_FAVORITE_LIST', module: "Information user", method: "POST", endpoint: "user-information/favorite", isActive: true },
                // { name: "Xóa yêu thích theo ID", codeName: 'DELETE_FAVORITE_BY_ID', module: "Information user", method: "POST", endpoint: "user-information/favorite/:id", isActive: true },
                { name: "Cập nhật thông tin người dùng", codeName: 'UPDATE_USER_INFORMATION', module: "Information user", method: "PATCH", endpoint: "user-information", isActive: true },
                // list favorite
                { name: "Lấy danh sách yêu thích", codeName: 'GET_FAVORITES', module: "List favorite", method: "GET", endpoint: "favorite", isActive: true },
                { name: "Tạo mới yêu thích", codeName: 'CREATE_FAVORITE', module: "List favorite", method: "POST", endpoint: "favorite", isActive: true },
                { name: "Xóa yêu thích theo ID", codeName: 'DELETE_FAVORITE_BY_ID', module: "List favorite", method: "DELETE", endpoint: "favorite/:id", isActive: true },
                { name: "Lấy danh sách yêu thích theo người dùng", codeName: 'GET_FAVORITES_BY_USER', module: "List favorite", method: "GET", endpoint: "favorite/user", isActive: true },
                // transactions
                { name: "Xem lịch sử giao dịch", codeName: 'GET_TRANSACTION_HISTORY', module: "Transaction", method: "GET", endpoint: "transaction-history", isActive: true },
                // inventory
                { name: "Xem danh sách kho", codeName: 'GET_INVENTORY', module: "Inventory", method: "GET", endpoint: "inventory", isActive: true },
                
                // payment method
                { name: "Xem danh sách phương thức thanh toán", codeName: 'GET_PAYMENT_METHOD', module: "Payment method", method: "GET", endpoint: "payment", isActive: true },
                { name: "Xem phương thức thanh toán theo ID", codeName: 'GET_PAYMENT_METHOD_BY_ID', module: "Payment method", method: "GET", endpoint: "payment/:id", isActive: true },
                { name: "Tạo mới thức thanh toán", codeName: 'CREATE_PAYMENT_METHOD', module: "Payment method", method: "CREATE", endpoint: "payment", isActive: true },
                { name: "Chỉnh sửa thức thanh toán", codeName: 'UPDATE_PAYMENT_METHOD', module: "Payment method", method: "PATCH", endpoint: "payment/id", isActive: true },
                { name: "Khôi phục thức thanh toán", codeName: 'RECOVER_PAYMENT_METHOD', module: "Payment method", method: "PATCH", endpoint: "payment/recover/id", isActive: true },
                { name: "Xoá thức thanh toán", codeName: 'DELETE_PAYMENT_METHOD', module: "Payment method", method: "DELETE", endpoint: "payment/:id", isActive: true },
            ];

            for(const item of listFunctionAPIEndpoint){
               const newFunction = this.functionsRepository.create(item)
               await queryRunner.manager.save(newFunction)
            }

            await queryRunner.commitTransaction();

            return {
                message: 'Seeding roles and functions successful'
            }

        } catch (error) {
            await queryRunner.rollbackTransaction();
            CommonException.handle(error)
        } finally {
            await queryRunner.release();
        }
    }

    async createRoleHasFunction(): Promise<any>{
       const queryRunner =  this.dataSource.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            // check data
            const roles_has_functions = await this.roleHasFunctionsRepository.find()
            if(roles_has_functions.length > 0){
                return {
                    message: 'permisison already created'
                }
            }

            const listPermissionAdmin = [
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "CREATE_ACCOUNT",
                "VIEW_ACCOUNT",
                "LOCK_ACCOUNT",
                "UPDATE_ACCOUNT",
                "RESET_PASSWORD",
                "GET_ROLES",
                "CREATE_ROLE",
                "RECOVER_ROLE",
                "DELETE_ROLE",
                "GET_FUNCTIONS",
                "CREATE_FUNCTION",
                "RECOVER_FUNCTION",
                "DELETE_FUNCTION",
                "GET_PERMISSION",
                "GET_PERMISSION_BY_ROLE",
                "CREATE_PERMISSION",
                "CHANGE_STATUS_PERMISSION",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "CREATE_PRODUCT",
                "UPDATE_PRODUCT",
                "DELETE_PRODUCT",
                "RECOVER_PRODUCT",
                "UPLOAD_PRODUCT_IMAGE",
                "GET_ATTRIBUTES",
                "VIEW_DELETED_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "CREATE_ATTRIBUTE",
                "UPDATE_ATTRIBUTE",
                "RECOVER_ATTRIBUTE",
                "DELETE_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "CREATE_DISCOUNT",
                "UPDATE_DISCOUNT",
                "RECOVER_DISCOUNT",
                "DELETE_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_DELETED_CATEGORIES",
                "VIEW_CATEGORY",
                "CREATE_CATEGORY",
                "UPDATE_CATEGORY",
                "RECOVER_CATEGORY",
                "DELETE_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "CREATE_REVIEW",
                "UPDATE_REVIEW",
                "DELETE_REVIEW",
                "GET_SUPPLIERS",
                "GET_DELETED_SUPPLIERS",
                "GET_SUPPLIER_BY_ID",
                "CREATE_SUPPLIER",
                "GET_SUPPLIER_DETAIL",
                "UPDATE_SUPPLIER",
                "RECOVER_SUPPLIER",
                "DELETE_SUPPLIER",
                "DELETE_SUPPLIER_DETAIL",
                "GET_CART",
                "CREATE_CART",
                "UPDATE_CART_PRODUCT",
                "INCREASE_CART_PRODUCT",
                "DECREASE_CART_PRODUCT",
                "DELETE_CART_PRODUCT",
                "CREATE_BILL",
                "GET_BILLS",
                "GET_BILLS_BY_ACCOUNT",
                "GET_BILL_BY_ID",
                "UPDATE_BILL",
                "GET_VOUCHERS",
                "GET_VOUCHER_BY_ID",
                "CREATE_VOUCHER",
                "UPDATE_VOUCHER",
                "USE_VOUCHER",
                "RECOVER_VOUCHER",
                "DELETE_VOUCHER",
                "GET_IMPORT_RECEIPTS",
                "GET_IMPORT_RECEIPT_BY_ID",
                "GET_IMPORT_RECEIPT_DETAIL",
                "CREATE_IMPORT_RECEIPT",
                "UPDATE_IMPORT_RECEIPT_STATUS",
                "GET_NOTIFICATIONS",
                "GET_USER_NOTIFICATIONS",
                "CREATE_NOTIFICATION",
                "MARK_NOTIFICATION_READ",
                "UPDATE_NOTIFICATION",
                "DELETE_NOTIFICATION",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_INVENTORY",
                "GET_PAYMENT_METHOD",
                "GET_PAYMENT_METHOD_BY_ID",
                "CREATE_PAYMENT_METHOD",
                "UPDATE_PAYMENT_METHOD",
                "RECOVER_PAYMENT_METHOD",
                "DELETE_PAYMENT_METHOD",
            ]

            const listPermissionsManageProduct = [
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "CREATE_PRODUCT",
                "UPDATE_PRODUCT",
                "GET_ATTRIBUTES",
                "VIEW_DELETED_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "CREATE_ATTRIBUTE",
                "UPDATE_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "UPDATE_DISCOUNT",
                "CREATE_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_DELETED_CATEGORIES",
                "VIEW_CATEGORY",
                "CREATE_CATEGORY",
                "UPDATE_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "CREATE_REVIEW",
                "UPDATE_REVIEW",
                "DELETE_REVIEW",
                "GET_CART",
                "GET_NOTIFICATIONS",
                "MARK_NOTIFICATION_READ",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_PERMISSION_BY_ROLE"
            ]

            const listPermissionStaffSales =[
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "GET_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "GET_CART",
                "GET_BILLS",
                "GET_BILLS_BY_ACCOUNT",
                "GET_BILL_BY_ID",
                "UPDATE_BILL",
                "GET_VOUCHERS",
                "GET_VOUCHER_BY_ID",
                "CREATE_VOUCHER",
                "GET_NOTIFICATIONS",
                "CREATE_NOTIFICATION",
                "MARK_NOTIFICATION_READ",
                "UPDATE_NOTIFICATION",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_PERMISSION_BY_ROLE"
            ]

            const listPermissionManageWarehouse = [
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "GET_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "GET_SUPPLIERS",
                "GET_SUPPLIER_BY_ID",
                "CREATE_SUPPLIER",
                "UPDATE_SUPPLIER",
                "GET_CART",
                "GET_IMPORT_RECEIPTS",
                "GET_IMPORT_RECEIPT_BY_ID",
                "GET_IMPORT_RECEIPT_DETAIL",
                "CREATE_IMPORT_RECEIPT",
                "UPDATE_IMPORT_RECEIPT_STATUS",
                "GET_NOTIFICATIONS",
                "MARK_NOTIFICATION_READ",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_INVENTORY",
                "GET_PERMISSION_BY_ROLE"
            ]

            const listPermissionSupplier = [
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "GET_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "GET_SUPPLIERS",
                "GET_SUPPLIER_BY_ID",
                "CREATE_SUPPLIER",
                "GET_SUPPLIER_DETAIL",
                "UPDATE_SUPPLIER",
                "DELETE_SUPPLIER_DETAIL",
                "GET_CART",
                "GET_NOTIFICATIONS",
                "MARK_NOTIFICATION_READ",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_PERMISSION_BY_ROLE"
            ]

            const listPermissionSupportUser = [
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "GET_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "CREATE_REVIEW",
                "UPDATE_REVIEW",
                "DELETE_REVIEW",
                "GET_CART",
                "GET_VOUCHER_BY_ID",
                "CREATE_VOUCHER",
                "UPDATE_VOUCHER",
                "GET_NOTIFICATIONS",
                "CREATE_NOTIFICATION",
                "MARK_NOTIFICATION_READ",
                "UPDATE_NOTIFICATION",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_PERMISSION_BY_ROLE"
            ]

            const listPermissionUser = [
                "REGISTER",
                "LOGIN",
                "VERIFY_OTP",
                "SEND_OTP",
                "CHANGE_PASSWORD",
                "FORGOT_PASSWORD",
                "GET_PRODUCTS",
                "VIEW_PRODUCT",
                "VIEW_PRODUCT_DETAILS",
                "GET_ATTRIBUTES",
                "VIEW_ATTRIBUTE",
                "GET_DISCOUNTS",
                "VIEW_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "CREATE_REVIEW",
                "UPDATE_REVIEW",
                "DELETE_REVIEW",
                "GET_CART",
                "CREATE_CART",
                "UPDATE_CART_PRODUCT",
                "INCREASE_CART_PRODUCT",
                "DECREASE_CART_PRODUCT",
                "DELETE_CART_PRODUCT",
                "CREATE_BILL",
                "GET_BILLS_BY_ACCOUNT",
                "GET_BILL_BY_ID",
                "UPDATE_BILL",
                "GET_VOUCHERS",
                "GET_VOUCHER_BY_ID",
                "USE_VOUCHER",
                "GET_NOTIFICATIONS",
                "GET_USER_NOTIFICATIONS",
                "MARK_NOTIFICATION_READ",
                "DELETE_USER_NOTIFICATION",
                "GET_USER_INFORMATION",
                "CREATE_FAVORITE_LIST",
                "DELETE_FAVORITE_BY_ID",
                "UPDATE_USER_INFORMATION",
                "GET_FAVORITES",
                "CREATE_FAVORITE",
                "DELETE_FAVORITE_BY_ID",
                "GET_FAVORITES_BY_USER",
                "GET_TRANSACTION_HISTORY",
                "GET_PERMISSION_BYnpm_ROLE"
            ]

            // init permissions for admin
            for(const permission of listPermissionAdmin) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "ADMIN"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }
            // init permissions for manager product
            for(const permission of listPermissionsManageProduct) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "MANAGE_PRODUCT"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }
            // init permissions for staff sales
            for(const permission of listPermissionStaffSales) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "STAFF_SALES"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }
            // init permissions for manage warehouse
            for(const permission of listPermissionManageWarehouse) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "MANAGE_WAREHOUSE"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }
            // init permissions for supplier
            for(const permission of listPermissionSupplier) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "SUPPLIER"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }
            // init permissions for support user
            for(const permission of listPermissionSupportUser) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "SUPPORT_CLIENT"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }
            // init permissions for user
            for(const permission of listPermissionUser) {
                const newPermissions = this.roleHasFunctionsRepository.create({
                    isActive: true,
                    roles: await this.rolesRepository.findOne({where: {codeName: "USER"}}),
                    functions: await this.functionsRepository.findOne({ where: { codeName: permission } })
                })
                await queryRunner.manager.save(newPermissions)
            }

            await queryRunner.commitTransaction()
            return {
                message: 'Permissions initialized successfully',
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            CommonException.handle(error)
        } finally {
            await queryRunner.release();
        }
    }


    async initData() : Promise<any> {
        const queryRunner =  this.dataSource.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            // check data source
            const categories = await this.categoriesRepository.find()
            const attribute = await this.attributesRepository.find()
            const voucher = await this.vouchersRepository.find()
            const payment = await this.paymentsRepository.find()
            const supplier = await this.supplierRepository.find()

          
            if (categories.length > 0 || attribute.length > 0 || voucher.length > 0 || payment.length > 0 || supplier.length > 0) {
                return {message: "Xoá tất cả dữ liệu cũ trong database trước khi khởi tạo dữ liệu mới!"}
            }


            //  init cateogries
            const listCategories = [
                {
                    name: 'Starbucks',
                    description: 'Starbucks'
                },
                {
                    name: 'LavAzza',
                    description: 'LavAzza'
                },
                {
                    name: 'Costa Coffee',
                    description: 'Costa Coffee'
                },
                {
                    name: 'Nescafe',
                    description: 'Nescafe'
                },
            ]
            for (const category of listCategories) {
                const newRole =  this.categoriesRepository.create(category);
                await queryRunner.manager.save(newRole);
            }

            // init voucher
            const listVouchers = [
                {
                    code: 'VOUCHER10k',
                    name: '10k Off',
                    value: 10000,
                    quantity: 100,
                    description: '10% off for all products',
                    startDate: new Date(),
                    endDate: new Date(new Date().getDate() + 30),
                    status: 'active',
                },
                {
                    code: 'VOUCHER15k',
                    name: '15k Off',
                    value: 15000,
                    quantity: 100,
                    description: '10% off for all products',
                    startDate: new Date(),
                    endDate: new Date(new Date().getDate() + 30),
                    status: 'active',
                },
                {
                    code: 'VOUCHER25k',
                    name: '25k Off New Year',
                    value: 25000,
                    quantity: 100,
                    description: '25% off for all products during New Year',
                    startDate: new Date(),
                    endDate: new Date(new Date().getDate() + 30),
                    status: 'active',
                },
                {
                    code: 'VOUCHER20k',
                    name: '20k Off Summer Sale',
                    value: 20000,
                    quantity: 100,
                    description: '20% off for all products during Summer Sale',
                    startDate: new Date(),
                    endDate: new Date(new Date().getDate() + 30),
                    status: 'active',
                }
            ]
             for (const voucher of listVouchers) {
                const newVoucher =  this.vouchersRepository.create(voucher);
                await queryRunner.manager.save(newVoucher);
            }

            // init attribute
            const listAttributes = [
                {
                    name: '200g',
                    description: '200 gram',                    
                },
                {
                    name: '300g',
                    description: '300 gram',                    
                },
                {
                    name: '500g',
                    description: '500 gram',                    
                },
                {
                    name: '1kg',
                    description: '1kg',                    
                }    
            ]
            for (const attribute of listAttributes) {
                const newAttribute =  this.attributesRepository.create(attribute);
                await queryRunner.manager.save(newAttribute);
            }

            // init payment methods
            const listPaymentMethods = [
                {
                    name: 'VNPAY',
                    description: 'thanh toán qua cổng vnpay',                    
                },
                {
                    name: 'Thanh toán khi nhận hàng',
                    description: 'Thanh toán khi nhận hàng',                    
                },
                
            ]
            for (const paymentMethod of listPaymentMethods) {
                const newPaymentMethod =  this.paymentsRepository.create(paymentMethod);
                await queryRunner.manager.save(newPaymentMethod);
            }

            // init supplier
            const listSuppliers = [
                {
                    name: "Nhà cung cấp 1",
                    email: "ncc1@gmail.com",
                    phone: "+84945986611",
                    address: "Số 123, Đường Lê Lợi, Quận 1, TP.HCM",
                    description: "Chuyên cung cấp thực phẩm sạch đạt chuẩn VietGAP.",
                    logo: "https://example.com/logos/abc_logo.png",
                    website: "https://abcfoods.vn",
                    bankAccountNumber: "123456789",
                    bankName: "Ngân hàng Ngoại thương Việt Nam (Vietcombank)",
                    bankAddress: "Chi nhánh TP.HCM",                 
                },
                {
                    name: "Nhà cung cấp 2",
                    email: "support@digitalsuppliers.com",
                    phone: "+84901234567",
                    address: "Tòa nhà Kỹ thuật Số, Quận Cầu Giấy, Hà Nội",
                    description: "Nhà phân phối thiết bị công nghệ hàng đầu tại Việt Nam.",
                    logo: "https://example.com/logos/digitalsuppliers_logo.png",
                    website: "https://digitalsuppliers.com",
                    bankAccountNumber: "234567890",
                    bankName: "Ngân hàng Á Châu (ACB)",
                    bankAddress: "Chi nhánh Hà Nội",
                },
                {
                    name: "Nhà cung cấp 3",
                    email: "sales@southernsteel.vn",
                    phone: "+84876543210",
                    address: "KCN Long Thành, Đồng Nai",
                    description: "Cung cấp vật liệu xây dựng chất lượng cao, đặc biệt là thép.",
                    logo: "https://example.com/logos/southernsteel_logo.png",
                    website: "https://southernsteel.vn",
                    bankAccountNumber: "345678901",
                    bankName: "Ngân hàng Đầu tư và Phát triển Việt Nam (BIDV)",
                    bankAddress: "Chi nhánh Đồng Nai",
                },
                {
                    name: "Nhà cung cấp 4",
                    email: "info@homedecor.vn",
                    phone: "+84765432109",
                    address: "Số 45, Đường Hoa Mai, Quận Phú Nhuận, TP.HCM",
                    description: "Nhà cung cấp các sản phẩm nội thất hiện đại và tiện nghi.",
                    logo: "https://example.com/logos/homedecor_logo.png",
                    website: "https://homedecor.vn",
                    bankAccountNumber: "456789012",
                    bankName: "Ngân hàng Công Thương Việt Nam (VietinBank)",
                    bankAddress: "Chi nhánh TP.HCM",
                },
                {
                    name: "Nhà cung cấp 5",
                    email: "sales@minhlongpackaging.com",
                    phone: "+84654321098",
                    address: "Lô 12, KCN Bình Dương, Bình Dương",
                    description: "Chuyên sản xuất bao bì chất lượng cao cho ngành thực phẩm và dược phẩm.",
                    logo: "https://example.com/logos/minhlong_logo.png",
                    website: "https://minhlongpackaging.com",
                    bankAccountNumber: "567890123",
                    bankName: "Ngân hàng Kỹ Thương Việt Nam (Techcombank)",
                    bankAddress: "Chi nhánh Bình Dương",
                },
               
                
            ]
            for (const supplier of listSuppliers) {
                const newSupplier =  this.supplierRepository.create(supplier);
                await queryRunner.manager.save(newSupplier);
            }


            
        } catch (error) {
           await queryRunner.rollbackTransaction();
            CommonException.handle(error)
        } finally {
            await queryRunner.release();
        }
    }

  

}
