import "./App.css";
import Navbar from "./Navbar";
import ChatScreen from "./ChatScreen";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { useState } from "react";

function App() {
  const [nav, setNav] = useState("none");
  return (
    <>
      <Router>
        <Navbar nav={nav} />
        <Routes>
          <Route path="/" element={<Login setNav={setNav} />} />
          <Route path="/main" element={<ChatScreen setNav={setNav} />} />
          <Route></Route>
        </Routes>
      </Router>
    </>
  );
}

export default App;
