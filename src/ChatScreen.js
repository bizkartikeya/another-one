import React, { useEffect, useState, useRef } from "react";
import LoadingBar from "react-top-loading-bar";

function ChatScreen() {
  const inputRef = useRef(null);

  const [progress, setProgress] = useState(0);
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
      inputRef.current.focus();
    } else {
      showBotMessage(data.result, getCurrentTimestamp());
      inputRef.current.focus();
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
    inputRef.current.focus();
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
    setInputValue(e.target.value);
  };

  const handleSendButtonClick = () => {
    console.log("m to click ho gya bhai");
    const endpoint = "query/";
    const message = { query: inputValue };
    showUserMessage(endpoint, message);
    setInputValue("");
    console.log("Send button clicked", getCurrentTimestamp());
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
          <div>
            <div>
              <div className="chat_window">
                <div className="window">
                  <div className="top_menu">
                    <div class="title">Hi, Ask your queries</div>
                  </div>
                  <LoadingBar
                    color="#9bb5a9"
                    progress={progress}
                    onLoaderFinished={() => setProgress(0)}
                  />
                  {/* dynamically rendered */}
                  <ul className="messages"></ul>

                  {/* input */}
                  <div className="bottom_wrapper fixed-bottom">
                    <input
                      ref={inputRef}
                      id="msg_input"
                      placeholder="Say Hi to begin chat..."
                      value={inputValue}
                      onChange={handleInputChange}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSendButtonClick();
                        }
                      }}
                    />

                    <button
                      id="send_button"
                      // disabled={inputValue ? true : false}
                      className="app_button_1"
                      style={{
                        backgroundColor: inputValue ? "#00aa89" : "grey",
                      }}
                      onClick={handleSendButtonClick}
                    >
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* left side content */}
          </div>
        </div>
      </div>
    </>
  );
}

export default ChatScreen;
