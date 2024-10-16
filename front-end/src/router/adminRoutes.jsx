import DashboardLayout from "~/Layouts/DashboardLayout/DashboardLayout";
import { Home } from "~/page/admin/Home/Home";

//  routes for admin
export const adminRoutes = [
      { path: "/admin", component: Home, layout: DashboardLayout },

];
