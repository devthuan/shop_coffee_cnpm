import CartLayout from "~/Layouts/CartLayout/CartLayout";
import ProductLayout from "~/Layouts/ProductLayout/ProductLayout";
import ProfileLayout from "~/Layouts/ProfileLayout/ProfileLayout";
import { Cart } from "~/page/Cart/Cart";
import PaymentResult from "~/page/Payment-result/PaymentResult";
import Payment from "~/page/Payment/Payment";
import Bougth from "~/page/Profile/Bougth/bougth";
import EditProfile from "~/page/Profile/EditProfile/editProfile";
import FavoriteUser from "~/page/Profile/FavoriteUser/FavoriteUser";
import ChangePassword from "~/page/Profile/ChangePassword/ChangePassword";
import { Profile } from "~/page/Profile/Profile";
// routes for private
export const privateRoutes = [
  { path: "/cart", component: Cart, layout: CartLayout },
  { path: "/cart/payment", component: Payment, layout: CartLayout },
  { path: "/payment-result", component: PaymentResult, layout: null },
  { path: "/profile", component: Profile, layout: ProfileLayout },
  {
    path: "/profile/editProfile",
    component: EditProfile,
    layout: ProfileLayout,
  },
  {
    path: "/profile/changePassword",
    component: ChangePassword,
    layout: ProfileLayout,
  },
  {
    path: "/profile/favoriteUser",
    component: FavoriteUser,
    layout: ProfileLayout,
  },
  {
    path: "/profile/billAccount",
    component: Bougth,
    layout: ProfileLayout,
  },
];
