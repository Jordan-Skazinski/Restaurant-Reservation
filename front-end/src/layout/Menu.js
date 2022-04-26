import React from "react";
import { Link } from "react-router-dom";

/**
 * Defines the menu for this application.
 * @returns {JSX.Element}
 */

function Menu() {
  return (
    <div>
      <nav
        className="nav navbar-nav mt-3"
        style={{ position: "fixed", zIndex: "2" }}
      >
        <ul className="nav navbar-nav bg-dark" style={{ backgroundColor: "#FFB93A", fontFamily: "Courier" }}>
          <li className="nav-item p-1 ">
            <button
              type="button"
              className="btn text-white"
              data-toggle="tooltip" 
              data-placement="bottom"
              title="Home"
            >
              
              <Link className="nav-link " to="/">
                <span className="material-icons" style={{ color: "#FF5733" }}>
                  Home
                </span>
              </Link>
            </button>
          </li>

          <li className="nav-item p-1">
            <button
              type="button"
              className="btn text-white"
              data-toggle="tooltip"
              data-placement="bottom"
              title="Search"
            >
              
              <Link className="nav-link " to="/search">
                <span className="material-icons" style={{ color: "#FF5733" }}>
                  Search
                </span>
              </Link>
            </button>
          </li>
          <li className="nav-item p-1">
            <button
              type="button"
              className="btn text-white"
              data-toggle="tooltip"
              data-placement="bottom"
              title="New Reservation"
            >
              
              <Link className="nav-link " to="/reservations/new">
                <span className="material-icons mr-2" style={{ color: "#FF5733" }}>
                Reserve
                </span>
              </Link>
            </button>
          </li>
          <li className="nav-item p-1">
            <button
              type="button"
              className="btn text-white"
              data-toggle="tooltip"
              data-placement="bottom"
              title="New Table"
            >
              
              <Link className="nav-link " to="/tables/new">
                <span className="material-icons" style={{ color: "#FF5733" }}>
                  Table
                </span>
              </Link>
            </button>
          </li>
        </ul>
        {/* <div className="text-center d-none d-md-inline">
          <button
            className="btn rounded-circle border-0"
            id="sidebarToggle"
            type="button"
          />
        </div> */}
      </nav>
    </div>
  );
}

export default Menu;