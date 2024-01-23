import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

const NotFound = () => {
  const history = useNavigate();
  const [timer, setTimer] = useState(10);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Redirect to /home after 10 seconds
    setTimeout(() => {
      clearInterval(interval);
      history("/home");
    }, 10000);

    // Cleanup the interval on component unmount
    return () => clearInterval(interval);
  }, [history]);

  const goToHome = () => {
    history("/home");
  };

  return (
    <div className="notfound">
      <div className="container">
        <div className="headingtext">
          <h1 style={{ fontWeight: "800" }}>Uhh! Ohh! There's Been an Error</h1>
        </div>
        <div className="containeritem">
          <div className="details">
            <h4 style={{ fontWeight: "100" }}>
              The URL you entered does not exists.
              <br /> You will be redirected...
            </h4>

            <h5
              style={{
                margin: "50px 0px 0px 50px",
                fontFamily: "monospace",
                textDecoration: "underline",
              }}
            >
              back to Home in {timer}
            </h5>
            <div
              className="homebutton"
              style={{
                cursor: "pointer",
                marginTop: "50px",
              }}
              onClick={goToHome}
            >
              <h4
                style={{
                  textDecoration: "underline",
                  fontWeight: "100",
                  fontFamily: "monospace",
                  fontSize: "12px",
                }}
              >
                Home Page
              </h4>
            </div>
          </div>
          <div className="imagenotfound">
            <img src="404.png" className="imagenotfound" />
            <div className="nottext">404</div>
          </div>

          {/* <img src="404.png" alt="" /> */}
        </div>
      </div>
    </div>
  );
};

export default NotFound;
