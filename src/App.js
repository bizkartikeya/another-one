import "./App.css";
import Navbar from "./conponents/Navbar";
import ChatScreen from "./conponents/ChatScreen";
import Login from "./conponents/Login";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";
import { useState } from "react";
import Streamlite from "./conponents/Streamlite";
import ConsoleMenu from "./conponents/ConsoleMenu";
import NotFound from "./conponents/NotFound";

function App() {
  const [nav, setNav] = useState("none");
  const [navText, setNavText] = useState("none");
  return (
    <>
      <Router>
        <Navbar nav={nav} navText={navText} />
        <Routes>
          <Route
            path="/home"
            element={<ConsoleMenu setNav={setNav} setNavText={setNavText} />}
          />
          <Route
            path="/"
            element={<Login setNav={setNav} setNavText={setNavText} />}
          />
          <Route
            path="/DataAnalysisBot"
            element={<ChatScreen setNav={setNav} setNavText={setNavText} />}
          />
          <Route
            path="/StreamliteBot"
            element={<Streamlite setNav={setNav} setNavText={setNavText} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
