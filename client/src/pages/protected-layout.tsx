import { Outlet } from "react-router-dom";

import LeftSidebar from "./_components/sidebar/left/left-sidebar";

export default function ProtectedLayout() {
  return (
    <main className="w-full antialiased">
      <div className="flex w-full">
        <LeftSidebar />
        <div className="flex items-start justify-center w-full">
          <div className="w-[340px]" />
          <Outlet />
          <div id="modal-root" />
        </div>
      </div>
    </main>
  );
}
