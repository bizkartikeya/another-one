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
import ApiBot from "./conponents/ApiBot";

function App() {
  const [nav, setNav] = useState(true);
  const [navText, setNavText] = useState("none");
  return (
    <>
      <Router>
        <Navbar nav={nav} navText={navText} />
        <Routes>
          <Route
            path="/home"
            element={<ConsoleMenu setNavText={setNavText} />}
          />
          <Route
            path="/"
            element={<Login setNav={setNav} setNavText={setNavText} />}
          />
          <Route
            path="/DataAnalysisBot"
            element={<ChatScreen setNavText={setNavText} />}
          />
          <Route
            path="/StreamliteBot"
            element={<Streamlite setNavText={setNavText} />}
          />
          <Route path="/ApiBot" element={<ApiBot setNavText={setNavText} />} />
          <Route path="*" element={<NotFound setNav={setNav} />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
