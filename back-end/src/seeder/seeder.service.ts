import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Accounts } from 'src/auth/entities/accounts.entity';
import { CommonException } from 'src/common/exception';
import { Functions } from 'src/function/entities/functions.entity';
import { RoleHasFunctions } from 'src/role-permission/entities/roles_has_functions.entity';
import { Roles } from 'src/role/entities/roles.entity';
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

        private readonly dataSource: DataSource
    ){}


    async createRoleAndPermission(): Promise<any>{
        const queryRunner =  this.dataSource.createQueryRunner()
        try {
            await queryRunner.connect()
            await queryRunner.startTransaction()

            const checkDataRole = await this.rolesRepository.find()
            if (checkDataRole.length > 0) {
                return {
                    message: 'Role already created',
                }
            }

            const checkDataFunction = await this.functionsRepository.find()
            if (checkDataFunction.length > 0) {
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
                {name: 'Đăng ký tài khoản', codeName: 'REGISTER', method: "POST", endpoint:"auth/register", isActive: true},
                {name: 'Đăng nhập', codeName: 'LOGIN', method: "POST", endpoint:"auth/login", isActive: true},
                {name: 'Xác thực mã OTP', codeName: 'VERIFY_OTP', method: "POST", endpoint:"auth/verify-otp", isActive: true},
                {name: 'Gửi mã OTP đến email', codeName: 'SEND_OTP', method: "POST", endpoint:"auth/send-otp", isActive: true},
                {name: 'Đổi mật khẩu', codeName: 'CHANGE_PASSWORD', method: "POST", endpoint:"auth/change-password", isActive: true},
                {name: 'Khôi phục mật khẩu qua email', codeName: 'FORGOT_PASSWORD', method: "POST", endpoint:"auth/forgot-password", isActive: true},
                // account
                {name: 'Tạo tài khoản mới', codeName: 'CREATE_ACCOUNT', method: "POST", endpoint:"account", isActive: true},
                {name: 'Xem thông tin tài khoản', codeName: 'VIEW_ACCOUNT', method: "GET", endpoint:"account", isActive: true},
                {name: 'Khóa tài khoản theo ID', codeName: 'LOCK_ACCOUNT', method: "PATCH", endpoint:"account/lock/:id", isActive: true},
                {name: 'Cập nhật thông tin tài khoản', codeName: 'UPDATE_ACCOUNT', method: "PATCH", endpoint:"account/:id", isActive: true},
                {name: 'Đặt lại mật khẩu tài khoản', codeName: 'RESET_PASSWORD', method: "PATCH", endpoint:"account/reset-password/:id", isActive: true},
                // role
                {name: 'Lấy danh sách vai trò', codeName: 'GET_ROLES', method: "GET", endpoint:"role-permission/roles", isActive: true},
                {name: 'Tạo vai trò mới', codeName: 'CREATE_ROLE', method: "POST", endpoint:"role-permission/roles", isActive: true},
                {name: 'Khôi phục vai trò bị xóa', codeName: 'RECOVER_ROLE', method: "PATCH", endpoint:"role-permission/roles/recover/:id", isActive: true},
                {name: 'Xóa vai trò theo ID', codeName: 'DELETE_ROLE', method: "DELETE", endpoint:"role-permission/roles/:id", isActive: true},
                // function
                {name: 'Lấy danh sách chức năng', codeName: 'GET_FUNCTIONS', method: "GET", endpoint:"role-permission/functions", isActive: true},
                {name: 'Tạo chức năng mới', codeName: 'CREATE_FUNCTION', method: "POST", endpoint:"role-permission/functions", isActive: true},
                {name: 'Khôi phục chức năng bị xóa', codeName: 'RECOVER_FUNCTION', method: "PATCH", endpoint:"role-permission/functions/recover/:id", isActive: true},
                {name: 'Xóa chức năng theo ID', codeName: 'DELETE_FUNCTION', method: "DELETE", endpoint:"role-permission/functions/:id", isActive: true},
                // role-permission
                {name: 'Gán quyền cho vai trò', codeName: 'ASSIGN_PERMISSIONS', method: "GET", endpoint:"role-permission", isActive: true},
                {name: 'Cập nhật quyền cho vai trò', codeName: 'UPDATE_PERMISSIONS', method: "POST", endpoint:"role-permission", isActive: true},
                // product
                {name: 'Lấy danh sách sản phẩm', codeName: 'GET_PRODUCTS', method: "GET", endpoint:"products", isActive: true},
                {name: 'Xem chi tiết thông tin sản phẩm', codeName: 'VIEW_PRODUCT', method: "GET", endpoint:"products/:id", isActive: true},
                {name: 'Xem thông tin chi tiết sản phẩm', codeName: 'VIEW_PRODUCT_DETAILS', method: "GET", endpoint:"products/detail/:id", isActive: true},
                {name: 'Tạo sản phẩm mới', codeName: 'CREATE_PRODUCT', method: "POST", endpoint:"product", isActive: true},
                {name: 'Cập nhật thông tin sản phẩm theo ID', codeName: 'UPDATE_PRODUCT', method: "PATCH", endpoint:"product/:id", isActive: true},
                {name: 'Xóa sản phẩm theo ID', codeName: 'DELETE_PRODUCT', method: "DELETE", endpoint:"product/:id", isActive: true},
                {name: 'Khôi phục sản phẩm bị xóa', codeName: 'RECOVER_PRODUCT', method: "PATCH", endpoint:"product/recover/:id", isActive: true},
                {name: 'Tải lên hình ảnh sản phẩm', codeName: 'UPLOAD_PRODUCT_IMAGE', method: "POST", endpoint:"upload", isActive: true},
                // attribute product
                {name: 'Lấy danh sách thuộc tính sản phẩm', codeName: 'GET_ATTRIBUTES', method: "GET", endpoint:"attribute", isActive: true},
                {name: 'Xem thuộc tính đã bị xóa', codeName: 'VIEW_DELETED_ATTRIBUTES', method: "GET", endpoint:"attribute/deleted", isActive: true},
                {name: 'Xem thông tin thuộc tính theo ID', codeName: 'VIEW_ATTRIBUTE', method: "GET", endpoint:"attribute/:id", isActive: true},
                {name: 'Tạo thuộc tính mới cho sản phẩm', codeName: 'CREATE_ATTRIBUTE', method: "POST", endpoint:"attribute", isActive: true},
                {name: 'Cập nhật thông tin thuộc tính', codeName: 'UPDATE_ATTRIBUTE', method: "PATCH", endpoint:"attribute", isActive: true},
                {name: 'Khôi phục thuộc tính bị xóa', codeName: 'RECOVER_ATTRIBUTE', method: "PATCH", endpoint:"attribute/recover/:id", isActive: true},
                {name: 'Xóa thuộc tính theo ID', codeName: 'DELETE_ATTRIBUTE', method: "DELETE", endpoint:"attribute/:id", isActive: true},
                // discount product
                {name: 'Lấy danh sách chương trình giảm giá', codeName: 'GET_DISCOUNTS', method: "GET", endpoint:"discount", isActive: true},
                {name: 'Xem chi tiết chương trình giảm giá', codeName: 'VIEW_DISCOUNT', method: "GET", endpoint:"discount/:id", isActive: true},
                {name: 'Tạo chương trình giảm giá', codeName: 'CREATE_DISCOUNT', method: "POST", endpoint:"discount", isActive: true},
                {name: 'Khôi phục chương trình giảm giá', codeName: 'RECOVER_DISCOUNT', method: "PATCH", endpoint:"discount/recover/:id", isActive: true},
                {name: 'Xóa chương trình giảm giá', codeName: 'DELETE_DISCOUNT', method: "DELETE", endpoint:"discount/:id", isActive: true},
                // categories
                {name: 'Lấy danh sách danh mục sản phẩm', codeName: 'GET_CATEGORIES', method: "GET", endpoint:"categories", isActive: true},
                {name: 'Xem danh mục sản phẩm đã bị xóa', codeName: 'VIEW_DELETED_CATEGORIES', method: "GET", endpoint:"categories/deleted", isActive: true},
                {name: 'Xem thông tin danh mục theo ID', codeName: 'VIEW_CATEGORY', method: "GET", endpoint:"categories/:id", isActive: true},
                {name: 'Tạo danh mục sản phẩm mới', codeName: 'CREATE_CATEGORY', method: "POST", endpoint:"categories", isActive: true},
                {name: 'Cập nhật thông tin danh mục', codeName: 'UPDATE_CATEGORY', method: "PATCH", endpoint:"categories/:id", isActive: true},
                {name: 'Khôi phục danh mục bị xóa', codeName: 'RECOVER_CATEGORY', method: "PATCH", endpoint:"categories/recover/:id", isActive: true},
                {name: 'Xóa danh mục sản phẩm', codeName: 'DELETE_CATEGORY', method: "DELETE", endpoint:"categories/:id", isActive: true},
                // reviews
                {name: 'Xem đánh giá theo sản phẩm', codeName: 'GET_REVIEWS_BY_PRODUCT', method: "GET", endpoint:"reviews/by-product/:id", isActive: true},
                {name: 'Lấy danh sách đánh giá', codeName: 'GET_REVIEWS', method: "GET", endpoint:"reviews", isActive: true},
                {name: 'Tạo đánh giá mới', codeName: 'CREATE_REVIEW', method: "POST", endpoint:"reviews", isActive: true},
                // supplier
                { name: "Lấy danh sách nhà cung cấp", codeName: 'GET_SUPPLIERS', method: "GET", endpoint: "supplier", isActive: true },
                { name: "Xem nhà cung cấp đã bị xóa", codeName: 'GET_DELETED_SUPPLIERS', method: "GET", endpoint: "supplier/deleted", isActive: true },
                { name: "Xem thông tin nhà cung cấp theo ID", codeName: 'GET_SUPPLIER_BY_ID', method: "GET", endpoint: "supplier/:id", isActive: true },
                { name: "Tạo nhà cung cấp mới", codeName: 'CREATE_SUPPLIER', method: "POST", endpoint: "supplier", isActive: true },
                { name: "Xem chi tiết nhà cung cấp", codeName: 'GET_SUPPLIER_DETAIL', method: "POST", endpoint: "supplier/detail-supplier", isActive: true },
                { name: "Cập nhật thông tin nhà cung cấp", codeName: 'UPDATE_SUPPLIER', method: "PATCH", endpoint: "supplier/:id", isActive: true },
                { name: "Khôi phục nhà cung cấp bị xóa", codeName: 'RECOVER_SUPPLIER', method: "PATCH", endpoint: "supplier/recover/:id", isActive: true },
                { name: "Xóa nhà cung cấp theo ID", codeName: 'DELETE_SUPPLIER', method: "DELETE", endpoint: "supplier/:id", isActive: true },
                { name: "Xóa thông tin chi tiết nhà cung cấp", codeName: 'DELETE_SUPPLIER_DETAIL', method: "DELETE", endpoint: "supplier/detail/:id", isActive: true },
                // cart
                { name: "Xem giỏ hàng", codeName: 'GET_CART', method: "GET", endpoint: "cart", isActive: true },
                { name: "Tạo mới giỏ hàng", codeName: 'CREATE_CART', method: "POST", endpoint: "cart", isActive: true },
                { name: "Cập nhật sản phẩm trong giỏ hàng", codeName: 'UPDATE_CART_PRODUCT', method: "PATCH", endpoint: "cart/:id", isActive: true },
                { name: "Tăng số lượng sản phẩm trong giỏ hàng", codeName: 'INCREASE_CART_PRODUCT', method: "PATCH", endpoint: "cart/increase/:id", isActive: true },
                { name: "Giảm số lượng sản phẩm trong giỏ hàng", codeName: 'DECREASE_CART_PRODUCT', method: "PATCH", endpoint: "cart/decrease/:id", isActive: true },
                { name: "Xóa sản phẩm trong giỏ hàng", codeName: 'DELETE_CART_PRODUCT', method: "DELETE", endpoint: "cart/:id", isActive: true },
                // order
                { name: "Tạo hóa đơn mới", codeName: 'CREATE_BILL', method: "POST", endpoint: "bills", isActive: true },
                { name: "Lấy danh sách hóa đơn", codeName: 'GET_BILLS', method: "GET", endpoint: "bills", isActive: true },
                { name: "Xem hóa đơn theo tài khoản", codeName: 'GET_BILLS_BY_ACCOUNT', method: "GET", endpoint: "bills/account", isActive: true },
                { name: "Xem thông tin hóa đơn theo ID", codeName: 'GET_BILL_BY_ID', method: "GET", endpoint: "bills/:id", isActive: true },
                { name: "Cập nhật hóa đơn theo ID", codeName: 'UPDATE_BILL', method: "PATCH", endpoint: "bills/:id", isActive: true },
                // voucher
                { name: "Lấy danh sách voucher", codeName: 'GET_VOUCHERS', method: "GET", endpoint: "vouchers", isActive: true },
                { name: "Xem thông tin voucher theo ID", codeName: 'GET_VOUCHER_BY_ID', method: "GET", endpoint: "vouchers/:id", isActive: true },
                { name: "Tạo voucher mới", codeName: 'CREATE_VOUCHER', method: "POST", endpoint: "vouchers", isActive: true },
                { name: "Sử dụng voucher theo ID", codeName: 'USE_VOUCHER', method: "PATCH", endpoint: "vouchers/use-voucher/:id", isActive: true },
                { name: "Khôi phục voucher bị xóa", codeName: 'RECOVER_VOUCHER', method: "PATCH", endpoint: "vouchers/recover/:id", isActive: true },
                { name: "Xóa voucher theo ID", codeName: 'DELETE_VOUCHER', method: "DELETE", endpoint: "vouchers/:id", isActive: true },
                // import receipt
                { name: "Lấy danh sách phiếu nhập hàng", codeName: 'GET_IMPORT_RECEIPTS', method: "GET", endpoint: "import-receipt", isActive: true },
                { name: "Xem thông tin phiếu nhập hàng theo ID", codeName: 'GET_IMPORT_RECEIPT_BY_ID', method: "GET", endpoint: "import-receipt/:id", isActive: true },
                { name: "Xem chi tiết phiếu nhập hàng", codeName: 'GET_IMPORT_RECEIPT_DETAIL', method: "GET", endpoint: "import-receipt/detail/:id", isActive: true },
                { name: "Tạo phiếu nhập hàng mới", codeName: 'CREATE_IMPORT_RECEIPT', method: "POST", endpoint: "import-receipt", isActive: true },
                { name: "Cập nhật trạng thái phiếu nhập hàng", codeName: 'UPDATE_IMPORT_RECEIPT_STATUS', method: "PATCH", endpoint: "import-receipt/status/:id", isActive: true },
                // notifications
                { name: "Lấy danh sách thông báo", codeName: 'GET_NOTIFICATIONS', method: "GET", endpoint: "notification", isActive: true },
                { name: "Xem thông báo của người dùng", codeName: 'GET_USER_NOTIFICATIONS', method: "GET", endpoint: "notification/user", isActive: true },
                { name: "Tạo thông báo mới", codeName: 'CREATE_NOTIFICATION', method: "POST", endpoint: "notification", isActive: true },
                { name: "Đánh dấu thông báo đã đọc", codeName: 'MARK_NOTIFICATION_READ', method: "PATCH", endpoint: "notification/read/:id", isActive: true },
                { name: "Cập nhật thông báo", codeName: 'UPDATE_NOTIFICATION', method: "PATCH", endpoint: "notification/:id", isActive: true },
                { name: "Xóa thông báo theo ID", codeName: 'DELETE_NOTIFICATION', method: "DELETE", endpoint: "notification/:id", isActive: true },
                { name: "Xóa thông báo của người dùng theo ID", codeName: 'DELETE_USER_NOTIFICATION', method: "DELETE", endpoint: "notification/user/:id", isActive: true },
                // user information
                { name: "Xem thông tin người dùng", codeName: 'GET_USER_INFORMATION', method: "GET", endpoint: "user-information/user", isActive: true },
                { name: "Tạo mới danh sách yêu thích", codeName: 'CREATE_FAVORITE_LIST', method: "POST", endpoint: "user-information/favorite", isActive: true },
                // { name: "Xóa yêu thích theo ID", codeName: 'DELETE_FAVORITE_BY_ID', method: "POST", endpoint: "user-information/favorite/:id", isActive: true },
                { name: "Cập nhật thông tin người dùng", codeName: 'UPDATE_USER_INFORMATION', method: "PATCH", endpoint: "user-information", isActive: true },
                // list favorite
                { name: "Lấy danh sách yêu thích", codeName: 'GET_FAVORITES', method: "GET", endpoint: "favorite", isActive: true },
                { name: "Tạo mới yêu thích", codeName: 'CREATE_FAVORITE', method: "POST", endpoint: "favorite", isActive: true },
                { name: "Xóa yêu thích theo ID", codeName: 'DELETE_FAVORITE_BY_ID', method: "DELETE", endpoint: "favorite/:id", isActive: true },
                { name: "Lấy danh sách yêu thích theo người dùng", codeName: 'GET_FAVORITES_BY_USER', method: "GET", endpoint: "favorite/user", isActive: true },
                // transactions
                { name: "Xem lịch sử giao dịch", codeName: 'GET_TRANSACTION_HISTORY', method: "GET", endpoint: "transaction-history", isActive: true }

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
                "ASSIGN_PERMISSIONS",
                "UPDATE_PERMISSIONS",
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
                "CREATE_DISCOUNT",
                "GET_CATEGORIES",
                "VIEW_DELETED_CATEGORIES",
                "VIEW_CATEGORY",
                "CREATE_CATEGORY",
                "UPDATE_CATEGORY",
                "GET_REVIEWS_BY_PRODUCT",
                "GET_REVIEWS",
                "CREATE_REVIEW",
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
                "GET_CART",
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

}
