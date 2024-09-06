import MobileSideBar from "./MobileSideBar";
import NavbarRoutes from "./navbar-routes";

const Navbar = () => {
  return (
    <>
      <div className="p-4 border-b shadow-sm flex items-center bg-white h-full">
        Navbar
        {/* mobile routes */}
        <MobileSideBar/>
        {/* navbar routes */}
        <NavbarRoutes/>
      </div>
    </>
  );
};

export default Navbar;
