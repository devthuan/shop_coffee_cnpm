import Home from "~/page/Home"
import LogIn from "~/page/LogIn"

// public pages
const publicRoutes = [
    { path: '/', component: Home },
    {path: '/login', component: LogIn}
]
// pravite pages
const privateRoutes = [

]
export {publicRoutes,privateRoutes}