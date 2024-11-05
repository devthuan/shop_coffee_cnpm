import Page404 from "~/components/Page404/Page404";
import DashboardLayout from "~/Layouts/DashboardLayout/DashboardLayout";
import { Account } from "~/page/admin/Account/Account";
import { Attribute } from "~/page/admin/Attribute/Attribute";
import { Bill } from "~/page/admin/Bill/Bill";
import { Category } from "~/page/admin/Category/Category";
import { Dashboard } from "~/page/admin/Dashboard/Dashboard";
import { Discount } from "~/page/admin/Discount/Discount";
import { Notification } from "~/page/admin/Notification/Notification";
import { Order } from "~/page/admin/Order/Order";
import { Permission } from "~/page/admin/Permission/Permission";
import { Product } from "~/page/admin/Product/Product";
import { Receipt } from "~/page/admin/Receipt/Receipt";
import { Review } from "~/page/admin/Review/Review";
import { Supplier } from "~/page/admin/Supplier/Supplier";
import { Voucher } from "~/page/admin/Voucher/Voucher";
import { Warehouse } from "~/page/admin/Warehouse/Warehouse";



//  routes for admin
export const adminRoutes = [
  { path: "/admin", component: Dashboard, layout: DashboardLayout },
  { path: "/admin/account", component: Account, layout: DashboardLayout },
  { path: "/admin/permission", component: Permission, layout: DashboardLayout },
  {
    path: "/admin/notification",
    component: Notification,
    layout: DashboardLayout,
  },
  { path: "/admin/voucher", component: Voucher, layout: DashboardLayout },
  { path: "/admin/bill", component: Bill, layout: DashboardLayout },
  { path: "/admin/receipt", component: Receipt, layout: DashboardLayout },
  { path: "/admin/warehouse", component: Warehouse, layout: DashboardLayout },
  { path: "/admin/supplier", component: Supplier, layout: DashboardLayout },
  { path: "/admin/order", component: Order, layout: DashboardLayout },
  { path: "/admin/product", component: Product, layout: DashboardLayout },
  { path: "/admin/category", component: Category, layout: DashboardLayout },
  { path: "/admin/attribute", component: Attribute, layout: DashboardLayout },
  { path: "/admin/discount", component: Discount, layout: DashboardLayout },
  { path: "/admin/review", component: Review, layout: DashboardLayout },
  { path: "*", component: Page404, layout: null },
];
