import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router";
import LoadingBar from "react-top-loading-bar";
import DataTable from "./DataTable";
import projectsData from "../projects.json";

function ChatScreen(props) {
  const [devVisible, setDevVisible] = useState(false);
  const [chartExport, setChartExport] = useState(false);
  const [chartExportImage, setChartExportImage] = useState("");
  let history = useNavigate();
  const [progress, setProgress] = useState(0);
  const [referenceDf, setReferenceDf] = useState();
  const [referenceDfFlag, setReferenceDfFlag] = useState(false);
  const [button, setButton] = useState(false);
  const BaseUrl = "http://127.0.0.1:8000/";
  const [inputValue, setInputValue] = useState("");
  const [lastGeneratedCode, setLastGeneratedCode] = useState("none");
  const [resultValue, setResultValue] = useState({
    result: "",
    last_code_generated: "",
  });

  const renderMessageToScreen = (args) => {
    const displayDate = (args.time || getCurrentTimestamp()).toLocaleString(
      "en-IN",
      {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
      }
    );
    const messagesContainer = document.querySelector(".messages");
    const message = document.createElement("li");
    message.className = `message ${args.message_side}`;

    let content;
    if (args.text.includes("png")) {
      setChartExportImage(args.text);
      console.log("Image Path:", chartExportImage);
      handleCheckboxChangeChart();
      content = `<div class="chart">
      
        <img
          src=${args.text}
class="chart_image"
          alt="Chart"
          
        ></img>
      </div>`;
    } else if (args.text.includes("\n")) {
      const rows = args.text.split("\n").map((row) => row.trim().split(/\s+/));
      setChartExport(false);
      content = `<div class = "tabledata">
      
      <table class="borderedtable" border="1">
        <thead>
          <tr>
            ${rows[0].map((header, index) => `<th key=${index}>${header}</th>`)}
          </tr>
        </thead>
        <tbody>
          ${rows.slice(1).map(
            (row, rowIndex) =>
              `<tr key=${rowIndex}>
              ${row.map(
                (cell, cellIndex) => `<td key=${cellIndex}>${cell}</td>`
              )}
            </tr>`
          )}
        </tbody>
      </table>
    </div>`;
    } else {
      setChartExport(false);
      content = `<div class="text">${args.text}</div>`;
    }

    message.innerHTML = `
    <div class="avatar"></div>
    <div class="text_wrapper">
      ${content}
      <div class="timestamp">${displayDate}</div>
    </div>
  `;

    messagesContainer.appendChild(message);

    setTimeout(() => {
      message.classList.add("appeared");
      messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
    }, 0);

    messagesContainer.animate(
      { scrollTop: messagesContainer.scrollHeight },
      300
    );
  };

  const sendtoAPI = async (endpoint, message) => {
    setProgress(10);
    console.log("ye pucha hai miyan:", message);
    const params = JSON.stringify(message);
    const url = BaseUrl + endpoint;
    console.log("yha se aayega maamala bhai", url);
    setProgress(50);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
    setProgress(70);
    const data = await response.json();
    console.log(data);
    setProgress(100);
    if (data.base64_image) {
      const chart = "data:image/png;base64," + data.base64_image;
      setReferenceDfFlag(true);
      const tabledf = Object.entries(data.image_path.dataframe);
      console.log("ye hai tableDF", tabledf);
      setReferenceDf(tabledf);
      console.log("Refence Df m ye aya hai yrr::", referenceDf);
      console.log("wfdkw:  ", Object.entries(data.image_path.dataframe));
      setLastGeneratedCode(data.image_path.last_code_generated);
      setResultValue({
        result: data.image_path.result,
        last_code_generated: data.image_path.last_code_generated,
      });
      setLastGeneratedCode("block");
      showBotMessage(chart, getCurrentTimestamp());
    } else {
      showBotMessage(data.result, getCurrentTimestamp());
      setLastGeneratedCode(data.last_code_generated);
      setLastGeneratedCode("block");
      setResultValue(data);
      setReferenceDfFlag(true);
      const tabledf = Object.entries(data.dataframe);
      console.log("ye hai tableDF", tabledf);
      setReferenceDf(tabledf);
      console.log("Refence Df m ye aya hai yrr::", referenceDf);
      console.log("wfdkw:  ", Object.entries(data.dataframe));
    }
  };

  const handleClearChat = async () => {
    const endpoint = "clear-cache/";
    const url = BaseUrl + endpoint;
    console.log(url);
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("clear chat::", response);
    setInputValue("");
    setButton("none");
    const message = document.querySelector(".messages");
    message.innerHTML = "";
    showBotMessage("Hi, Ask your queries", getCurrentTimestamp());
    console.log("Send button clicked", getCurrentTimestamp());
    setLastGeneratedCode("none");
    setResultValue({
      result: "",
      last_code_generated: "",
    });
    setReferenceDfFlag(false);
    setReferenceDf();
    console.log("Clear Chat button clicked", getCurrentTimestamp());
  };

  const showUserMessage = (endpoint, message, datetime) => {
    sendtoAPI(endpoint, message);
    console.log(
      "endpoint and message sent to azure function",
      getCurrentTimestamp()
    );
    const messageText = getMessageText(message);
    renderMessageToScreen({
      text: messageText,
      time: datetime,
      message_side: "right",
    });
    console.log("message rendered to screen", getCurrentTimestamp());
  };
  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/");
    } else {
      props.setNavText(projectsData.botdetails[0].title);
      console.log("useEffect in ChatScreen is running");
      showBotMessage("Hi, Ask your queries", getCurrentTimestamp());
    }
  }, []);

  const getMessageText = (message) => {
    if (typeof message === "object") {
      for (const prop in message) {
        if (message.hasOwnProperty(prop)) {
          return message[prop].toString();
        }
      }
    }
    return message.toString();
  };

  const showBotMessage = (message, datetime) => {
    renderMessageToScreen({
      text: message,
      time: datetime,
      message_side: "left",
    });
    console.log("bot message rendered to screen", getCurrentTimestamp());
  };

  const handleInputChange = (e) => {
    if (e.target.value.length > 0) {
      setButton(true);
    } else {
      setButton(false);
    }
    setLastGeneratedCode("none");
    setInputValue(e.target.value);
  };

  const handleSendButtonClick = () => {
    console.log("m to click ho gya bhai");
    const endpoint = "query/";
    const message = { query: inputValue };
    showUserMessage(endpoint, message);
    setInputValue("");
    setButton("none");
    console.log("Send button clicked", getCurrentTimestamp());
  };

  const handleCheckboxChange = () => {
    setDevVisible(!devVisible);
  };
  const handleCheckboxChangeChart = () => {
    setChartExport(!chartExport);
  };

  const getCurrentTimestamp = () => new Date();

  return (
    <>
      <div>
        <div
          className="chatWindow"
          id="mainChatWindow"
          style={{ display: "block", marginTop: "10px" }}
        >
          <div className="row padded_row">
            <div className="col-md-6">
              <div className="chat_window">
                <div className="window">
                  <div className="top_menu">
                    <div className="title">Hi, Ask your queries</div>
                    <button
                      className="btn btn-outline-primary mx-2"
                      onClick={handleClearChat}
                    >
                      clear chat
                    </button>
                  </div>
                  <LoadingBar
                    color="#14212b"
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                  />
                  {/* dynamically rendered */}
                  <ul className="messages"></ul>

                  {/* input */}
                  <div className="bottom_wrapper ">
                    <div className="inputholders">
                      <input
                        type="text"
                        className={`form-control ${
                          inputValue ? "text_border" : ""
                        }`}
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendButtonClick();
                          }
                        }}
                      />
                      <button
                        className={`btn btn-outline-warning ${
                          button ? "fade-in" : "fade-out"
                        }`}
                        type="button"
                        onClick={handleSendButtonClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          className="bi bi-send-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* left side content */}
            <div className="col-md-6">
              <div className="chat_window">
                <div className="top_menu">
                  <div className="title">Help</div>
                  <div className="radios">
                    <div className="form-check form-switch  form-check-reverse ">
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault"
                        style={{ color: "white" }}
                      >
                        Developer Options
                      </label>
                      <input
                        className="form-check-input mx-1"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        onChange={handleCheckboxChange}
                      />
                    </div>
                    <div className="form-check form-switch  form-check-reverse ">
                      <label
                        className="form-check-label"
                        htmlFor="flexSwitchCheckDefault"
                        style={{ color: "white" }}
                      >
                        Display Chart
                      </label>
                      <input
                        className="form-check-input mx-1"
                        type="checkbox"
                        role="switch"
                        id="flexSwitchCheckDefault"
                        checked={chartExport}
                        onChange={handleCheckboxChangeChart}
                      />
                    </div>
                  </div>
                </div>

                <div className="accordion" id="accordionPanelsStayOpenExample">
                  {devVisible && (
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseOne"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          <strong>Last Code Generated: </strong>
                          <div className="end">Developer_Options</div>
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseOne"
                        className="accordion-collapse collapse show no-wrap-div"
                        data-bs-parent="#accordionExample"
                        style={{ maxWidth: "auto" }}
                      >
                        <div
                          className="accordion-body no-wrap-div"
                          style={{
                            textAlign: "left",
                            display: `${lastGeneratedCode}`,
                            overflow: "auto",
                          }}
                        >
                          {"{"}
                          <br></br>
                          <strong>result:</strong> {resultValue.result}
                        </div>
                        <div
                          className="accordion-body no-wrap-div"
                          style={{
                            textAlign: "left",
                            display: `${lastGeneratedCode}`,
                            overflow: "auto",
                          }}
                        >
                          <strong>last_code_generated: </strong>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: resultValue.last_code_generated.replace(
                                /\n/g,
                                "<br />"
                              ),
                            }}
                          />

                          <br></br>
                          {"}"}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseTwo"
                        aria-expanded="false"
                        aria-controls="panelsStayOpen-collapseTwo"
                      >
                        <strong> Data Frame Refernce:</strong>
                      </button>
                    </h2>
                    {referenceDfFlag && (
                      <div
                        id="panelsStayOpen-collapseTwo"
                        className="accordion-collapse show collapse"
                        data-bs-parent="#accordionExample"
                      >
                        <div className="accordion-body">
                          <div className="dfTable">
                            <DataTable dictionaries={referenceDf} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {chartExport && (
                    <div className="accordion-item">
                      <h2 className="accordion-header">
                        <button
                          className="accordion-button"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseThree"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseThree"
                        >
                          <strong>Chart Image: </strong>
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseThree"
                        className="accordion-collapse collapse show no-wrap-div"
                        data-bs-parent="#accordionExample"
                        style={{ maxWidth: "auto" }}
                      >
                        <div
                          className="accordion-body chartImageDisplay"
                          style={{
                            textAlign: "left",
                            height: "max-content",
                          }}
                        >
                          {console.log("from div", chartExportImage)}
                          {chartExportImage !== "" ? (
                            <img src={chartExportImage} alt="" />
                          ) : (
                            <div>No chart to display</div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatScreen;
