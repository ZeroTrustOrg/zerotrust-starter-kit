// Layout.tsx
import React from "react";
import { Outlet } from "react-router-dom";
import { Suspense } from "react";

const Layout: React.FC = () => {
  return (
    <div>
      {/* Other layout components like header, sidebar, etc. can be here */}
      <Suspense fallback={<p> loading </p>}>
        <Outlet /> {/* This is where the nested routes will be rendered */}
      </Suspense>
      <footer>Auth Footer</footer>
    </div>
  );
};

export default Layout;
