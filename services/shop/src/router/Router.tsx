import {App} from "@/components/App";
import {Suspense} from "react";
import {LazyShop} from "@/pages/Shop/Shop.lazy";
import {createBrowserRouter} from 'react-router-dom'

const routes = [
    {
        path: '/shop',
        element: <App />,
        children: [
            {
                path: '/shop/main',
                element: <Suspense><LazyShop /></Suspense>
            },
            {
                path: '/shop/second',
                element: <Suspense><div style={{color: 'red'}}>second</div></Suspense>
            }
        ]
    }
]

export const router = createBrowserRouter(routes)

export default routes