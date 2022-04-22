import React from "react";
import Routes from "./Routes";
import Menu from "./Menu";

/**
 * Defines the main layout of the application.
 * You will not need to make changes to this file.
 * @returns {JSX.Element}
 */
function Layout() {
  return (
    <div
      className="container-fluid bg-dark"
      style={{
        fontFamily: "Courier",
        color: "#d4fcfa",
        height: "200vh",
      }}
    >
      <div className="row">
        <div className="col-2 p-0">
          <Menu />
        </div>
        <div className="col-10">
          <Routes />
        </div>
      </div>
    </div>
  );
}

export default Layout;