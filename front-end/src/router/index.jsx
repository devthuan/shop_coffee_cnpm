import Home from "~/page/Home"
import Register from "~/page/Register"
import Sign from"~/page/Sign"
import Profile from "~/page/Profile"
import Product from "~/page/Product"
import Cart from "~/page/Cart"

import { ProductLayout, CartLayout, Registerlayout,SignLayout } from "~/components/Layout"

import Profilelayout from "~/components/Layout/Profilelayout"


// public pages
const publicRoutes = [
    { path: '/', component: Home },
    { path: '/register', component: Register, layout: Registerlayout },
    { path: '/sign', component: Sign, layout: SignLayout },
    { path: '/profile', component: Profile, layout: Profilelayout  },
    { path: '/product', component: Product, layout: ProductLayout },
    { path: '/cart', component: Cart, layout: CartLayout }
]
// pravite pages
const privateRoutes = [

]
export { publicRoutes, privateRoutes }