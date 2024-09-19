import Home from "~/page/Home"
import Register from "~/page/Register"
import Profile from "~/page/Profile"
import Product from "~/page/Product"
import Cart from "~/page/Cart"
import { ProductLayout, CartLayout } from "~/components/Layout"


// public pages
const publicRoutes = [
    { path: '/', component: Home },
    {path: '/register', component: Register, layout: null},
    {path: '/profile', component: Profile, layout: null},
    {path: '/product', component: Product, layout: ProductLayout},
    {path: '/cart', component: Cart, layout: CartLayout}
]
// pravite pages
const privateRoutes = [

]
export {publicRoutes,privateRoutes}