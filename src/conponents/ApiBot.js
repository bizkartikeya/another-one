import React, { useEffect, useState } from "react";
import LoadingBar from "react-top-loading-bar";
import projectsData from "../projects.json"; // Import your JSON data
import { useNavigate } from "react-router";

const ApiBot = (props) => {
  let history = useNavigate();
  const BaseUrl = "https://funcappbotbackendbizmetric.azurewebsites.net/";
  const keywords = [
    "loan",
    "amount",
    "account",
    "balance",
    "emi",
    "repayment",
    "foreclosure",
  ];
  const [progress, setProgress] = useState(0);
  const [button, setButton] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const getCurrentTimestamp = () => new Date();

  const handleSendButtonClick = () => {
    console.log("m to click ho gya bhai");
    const endpoint = "ask";
    const message = { question: inputValue };
    showUserMessage(endpoint, message);
    setInputValue("");
    setButton("none");
    console.log("Send button clicked", getCurrentTimestamp());
  };
  function checkKeywords(inputValue) {
    // Convert inputValue to lowercase for case-insensitive comparison
    const lowercaseInput = inputValue.toLowerCase();

    // Check if any keyword is present in the inputValue
    if (lowercaseInput.includes("not logged in")) {
      // Check if user is logged in
      showBotMessage("Please enter your UserId in next response.");
    }
  }

  const data = projectsData.botdetails[2].title;
  console.log("Bottt", data);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      history("/");
    } else {
      props.setNavText(projectsData.botdetails[2].title);
      showBotMessage("Hi, Ask your queries", getCurrentTimestamp());
    }
  }, []);

  const handleInputChange = (e) => {
    if (e.target.value.length > 0) {
      setButton(true);
    } else {
      setButton(false);
    }

    setInputValue(e.target.value);
  };

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

    message.innerHTML = `
    <div class="avatar"></div>
    <div class="text_wrapper">
      <div class="text">${args.text}</div>
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
    showBotMessage(data.response, getCurrentTimestamp());
    checkKeywords(data.response);
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
                    color="#ff671b"
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
                </div>

                <div class="accordion" id="accordionExample">
                  <div class="accordion-item">
                    <h2 class="accordion-header">
                      <button
                        class="accordion-button"
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
                      class="accordion-collapse collapse show"
                      data-bs-parent="#accordionExample"
                    >
                      <div class="accordion-body">
                        Hi my name is
                        <strong> BizMetric Customer Service </strong> chatbot, I
                        am here to answer your queries about your loans and
                        other finanace related questions. Type in your query,
                        and the chatbot will do its best to provide accurate and
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
};

export default ApiBot;
