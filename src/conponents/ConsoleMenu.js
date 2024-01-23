import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import projectsData from "../projects.json"; // Import your JSON data

const ConsoleMenu = (props) => {
  useEffect(() => {
    props.setNav("flex");
    props.setNavText("Bots Menu");
  }, []);

  return (
    <>
      <div>
        <div className="menucontainer">
          <div className="consoleMenu">
            {projectsData.botdetails.map((project, index) => (
              <Link
                to={project.link}
                key={index}
                className="card menucards"
                id="cards"
                style={{ width: "18rem" }}
              >
                <img
                  src={project.icon}
                  className="card-img-top"
                  alt={project.title}
                />
                <div className="card-body ">
                  <h5 className="card-title ">{project.title}</h5>
                  <p className="card-text ">{project.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ConsoleMenu;
