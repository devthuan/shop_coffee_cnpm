import { Home } from "~/page/Home/Home";
import { Register } from "~/page/Register/Register";
import { Profile } from "~/page/Profile/Profile";
import { Product } from "~/page/Product/Product";
import { Cart } from "~/page/Cart/Cart";
import { Login } from "~/page/Login/Login";
import ProfileLayout from "~/Layouts/ProfileLayout/ProfileLayout";
import CartLayout from "~/Layouts/CartLayout/CartLayout";
import ProductLayout from "~/Layouts/ProductLayout/ProductLayout";
import Page404 from "~/components/Page404/Page404";
import EditProfile from "~/page/Profile/EditProfile/editProfile";
import FavoriteUser from "~/page/Profile/FavoriteUser/FavoriteUser";
import Payment from "~/page/Payment/Payment";
import { Authorized } from "~/components/Authorized/Authorized";
import Bougth from "~/page/Profile/Bougth/bougth";

// routes for public
export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/register", component: Register, layout: null },
  { path: "/login", component: Login, layout: null },
  
  { path: "/product/:id", component: Product, layout: ProductLayout },
  { path: "/unauthorized", component: Authorized, layout: null },
  { path: "*", component: Page404, layout: null },
];
