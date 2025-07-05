export const  Sidebar=()=>{
    return(
        <aside></aside>
    )
}
interface DashboardLayoutProps{
    children:React.ReactNode;
}
export default function DashboardLayout({children}:DashboardLayoutProps){

    <div className="flex h-screen bg-gray-100">
        <Sidebar/>
        <div className="flex-1 flex  flex-col  overflow-hidden">{children}</div>
    </div>
}