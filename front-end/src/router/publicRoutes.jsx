import { Home } from "~/page/Home/Home";
import { Register } from "~/page/Register/Register";
import { Product } from "~/page/Product/Product";
import { Login } from "~/page/Login/Login";
import ProductLayout from "~/Layouts/ProductLayout/ProductLayout";
import Page404 from "~/components/Page404/Page404";
import { Authorized } from "~/components/Authorized/Authorized";

// routes for public
export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/register", component: Register, layout: null },
  { path: "/login", component: Login, layout: null },
  
  { path: "/product/:id", component: Product, layout: ProductLayout },
  { path: "/unauthorized", component: Authorized, layout: null },
  { path: "*", component: Page404, layout: null },
];
