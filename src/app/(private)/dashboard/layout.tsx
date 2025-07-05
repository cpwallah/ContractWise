import { ProtectedLayout } from "@/components/dashboard/protected-layout"
import DashboardLayout from "@/components/dashboard/sidebar"

export default function Layout({children}:{children:React.ReactNode}){
    return (
       
        <ProtectedLayout>
             
            <main className="flex-1 overflow-x-hidden bg-white overflow-y-auto ">{children}</main>
            
        </ProtectedLayout>
    )
}