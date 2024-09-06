import React from "react";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/sidebar";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <div className="h-full">
        {/* header */}
        <header className="h-20 md:pl-56 fixed inset-y-0 z-50 w-full">
          <Navbar />
        </header>

        {/* sidebar */}
        <div className="hidden md:flex h-full fixed w-56 flex-col inset-y-0 z-50">
            <Sidebar/>
        </div>

        <main className="pl-56 pt-20 h-full">{children}</main>
      </div>
    </>
  );
};

export default DashboardLayout;
