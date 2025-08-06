import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import UserDashBoard from "./Pages/UserDashboard.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userDashBoard" element={<UserDashBoard />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
