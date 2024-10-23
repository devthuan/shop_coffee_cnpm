import { Home } from "~/page/Home/Home";
import { Register } from "~/page/Register/Register";
import { Profile } from "~/page/Profile/Profile";
import { Product } from "~/page/Product/Product";
import { Cart } from "~/page/Cart/Cart";
import { Login } from "~/page/Login/Login"
import ProfileLayout from "~/Layouts/ProfileLayout/ProfileLayout";
import CartLayout from "~/Layouts/CartLayout/CartLayout";
import ProductLayout from "~/Layouts/ProductLayout/ProductLayout";
import { RecoveryPass } from "~/page/RecoveryPass/RecoveryPass";
// routes for public
export const publicRoutes = [
  { path: "/", component: Home },
  { path: "/register", component: Register, layout: null },
  { path: "/login", component: Login, layout: null },
  { path: "/recoverypass", component: RecoveryPass, layout: null },
  { path: "/profile", component: Profile, layout: ProfileLayout },
  { path: "/product", component: Product, layout: ProductLayout },
  { path: "/cart", component: Cart, layout: CartLayout },
];
