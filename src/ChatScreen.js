import React, { useEffect, useState, useRef } from "react";
import LoadingBar from "react-top-loading-bar";

function ChatScreen() {
  const [progress, setProgress] = useState(0);
  const [button, setButton] = useState(false);
  const BaseUrl = "http://127.0.0.1:8000/";
  const [inputValue, setInputValue] = useState("");

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
      content = `<div class="chart">
      
        <img
          src=${args.text}
class="chart_image"
          alt="Chart"
          
        ></img>
      </div>`;
    } else {
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
      showBotMessage(chart, getCurrentTimestamp());
    } else {
      showBotMessage(data.result, getCurrentTimestamp());
    }
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
    console.log("useEffect in ChatScreen is running");
    showBotMessage("Hi, Ask your queries", getCurrentTimestamp());
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

  const getCurrentTimestamp = () => new Date();

  return (
    <>
      <div className="container">
        <div
          className="chatWindow"
          id="mainChatWindow"
          style={{ display: "block", marginTop: "10px" }}
        >
          <div className="row padded_row">
            <div className="col-md-7">
              <div className="chat_window">
                <div className="window">
                  <div className="top_menu">
                    <div className="title">Hi, Ask your queries</div>
                  </div>
                  <LoadingBar
                    color="#9bb5a9"
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                  />
                  {/* dynamically rendered */}
                  <ul className="messages"></ul>

                  {/* input */}
                  <div className="bottom_wrapper ">
                    <div
                      className={`input-group ${
                        button ? "inputbox fade-in" : ""
                      }`}
                    >
                      <input
                        type="text"
                        id="messageInput"
                        className="border-0"
                        placeholder="Type a message..."
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleSendButtonClick();
                          }
                        }}
                        style={{
                          outline: "none",
                          width: "92%",
                          boxShadow: "none !important",
                        }}
                      />
                      <div
                        className={`btn btn-outline-warning ${
                          button ? "fade-in" : "fade-out"
                        }`}
                        type="button"
                        id="sendButton"
                        onClick={handleSendButtonClick}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          fill="currentColor"
                          class="bi bi-send-fill"
                          viewBox="0 0 16 16"
                        >
                          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* left side content */}
            <div className="col-md-5">
              <div className="chat_window">
                <div className="top_menu">
                  <div className="title">Help</div>
                </div>

                <div className="accordion" id="accordionExample">
                  <div className="accordion-item">
                    <h2 className="accordion-header">
                      <button
                        className="accordion-button"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseOne"
                        aria-expanded="true"
                        aria-controls="collapseOne"
                        disabled
                      >
                        BizMetric Customer Service chatbot
                      </button>
                    </h2>
                    <div
                      id="collapseOne"
                      className="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div className="accordion-body">
                        Hi my name is
                        <strong>BizMetric Customer Service </strong> chatbot, I
                        am here to answer your queries about your loans and
                        other finanace related stuff. Type in your query, and
                        the chatbot will do its best to provide accurate and
                        helpful information.
                      </div>
                    </div>
                  </div>
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
