import { Authenticator } from "@aws-amplify/ui-react";
import '@aws-amplify/ui-react/styles.css';
import React, { PropsWithChildren, useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const Layout = (props: PropsWithChildren) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="grid min-h-screen grid-rows-header bg-zinc-100">
      <div>
        <Navbar onMenuButtonClick={() => setSidebarOpen((prev) => !prev)} />
      </div>
      <Authenticator>
        {({ signOut, user }) => (
          <div className="grid md:grid-cols-sidebar">
            <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} user={user} signOut={signOut} />
            {props.children}
          </div>
        )}
      </Authenticator>
    </div>
  );
};

export default Layout;