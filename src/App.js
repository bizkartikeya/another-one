import "./App.css";
import Navbar from "./Navbar";
import ChatScreen from "./ChatScreen";

function App() {
  return (
    <div className="App">
      <Navbar />
      <div>
        <ChatScreen />
      </div>
    </div>
  );
}

export default App;
