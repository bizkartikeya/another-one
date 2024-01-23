import React, { useEffect } from "react";

const Streamlite = (props) => {
  useEffect(() => {
    props.setNav("flex");
    props.setNavText("Streamlit Bot");
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
