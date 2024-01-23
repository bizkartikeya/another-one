import React, { useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

function Navbar(props) {
  const [dataBot, setDataBot] = useState("");
  const [strBot, setStrBot] = useState("");
  let history = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    history("/");
  };
  const handleDataBot = () => {
    setStrBot("");
    setDataBot("activated");
  };
  const handleStrBot = () => {
    setStrBot("activatedstream");
    setDataBot("");
  };

  return (
    <nav
      className="navbar sticky-top"
      style={{
        background: "#9bb5a9",
        backdropFilter: "blur(20px)",
        display: `${props.nav || "none"}`,
        alignItems: "center",
        justifyContent: "center",
        // position: "relative",
      }}
    >
      <div>
        <ul className="navbar-nav me-auto mb-2 mb-lg-0 menulist">
          <li className={`nav-item ${dataBot}`} onClick={handleDataBot}>
            <Link className="nav-link hlink" aria-current="page" to="/home">
              <i class="bx bxs-grid"></i>
            </Link>
          </li>
        </ul>
      </div>
      <div style={{ textAlign: "center" }}>
        <a
          className="navbar-brand"
          href="#"
          style={{
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img
            src="logo.png"
            className=""
            style={{
              height: "50px",
              width: "50px",
              marginRight: "10px",
              borderRight: "3px solid rgb(87, 87, 87)",
            }}
            alt="logo"
          />
          <span>BizMetric - {props.navText}</span>
        </a>
      </div>
      <button className="btn btn-primary" onClick={handleLogout}>
        Logout
      </button>
    </nav>
  );
}

export default Navbar;

{
  /* <ul
            className="navbar-nav me-auto mb-2 mb-lg-0"
            style={{ color: "white" }}
          >
            <li className="nav-item">
              <a className="nav-link active" aria-current="page" href="#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Link
              </a>
            </li> */
}
{
  /* <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Dropdown
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="#">
                    Action
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Another action
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Something else here
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link disabled" aria-disabled="true">
                Disabled
              </a>
            </li> */
}
{
  /* </ul> */
}
{
  /* <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-outline-success" type="submit">
              Search
            </button>
          </form> */
}
