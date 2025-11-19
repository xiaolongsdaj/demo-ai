import { Inter } from "next/font/google"
import '../../globals.css'

const inter=Inter({subsets:["latin"]})

export const metadata = {
    title:'threads',
    description:'A platform for sharing thoughts and ideas',
}
export default function RootLayout({
    children
}:{
    children:React.ReactNode
}){
    return(
        <>
            <body className={`${inter.className} bg-dark-1`}>
                {children}
            </body>
        </>
    )
}