import React, { useEffect } from "react";
import { useNavigate } from "react-router";

const Streamlite = (props) => {
  let history = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/");
    } else {
      props.setNav("flex");
      props.setNavText("Streamlit Bot");
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
