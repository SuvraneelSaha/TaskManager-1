import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home.jsx";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import UserDashBoard from "./Pages/UserDashboard.jsx";
import CreateTask from "./Pages/CreateTask.jsx";
import EditUserTask from "./Pages/EditUserTask.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/userDashBoard" element={<UserDashBoard />} />
          <Route path="/userDashBoard/createTask" element={<CreateTask />} />
          <Route
            path="/userDashBoard/editTask/:id"
            element={<EditUserTask />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
