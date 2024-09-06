import Image from "next/image"
import SidebarRoutes from "./sidebar-routes"

const Sidebar = () => {
  return (
    <div className="h-full border-r flex-col overflow-y-auto bg-white">
      <div className="logo p-6">
        <Image src={'/images/logo.png'} width={60} height={60} alt="Logo"/>
      </div>
      <div className="flex flex-col w-full">
        <SidebarRoutes/>
      </div>
    </div>
  )
}

export default Sidebar
