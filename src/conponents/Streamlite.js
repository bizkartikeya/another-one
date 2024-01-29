import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import projectsData from "../projects.json"; // Import your JSON data

const Streamlite = (props) => {
  let history = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/");
    } else {
      props.setNavText(projectsData.botdetails[1].title);
    }
  }, []);

  return (
    <div>
      <iframe
        title="Streamlite App"
        src="http://localhost:8501"
        className="viewbox"
        style={{ border: "none" }}
      />
    </div>
  );
};

export default Streamlite;
