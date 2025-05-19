import {  React, useState } from "react";
import {Navigate,Routes, Route} from "react-router-dom"
import 'react-toastify/ReactToastify.css'
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";

function App() {
  // const [count, setCount] = useState(0);

  return (
    <>
      <Routes>
        <Route path ="/" element={<Navigate to="/login"/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/home" element={<Home/>} />
      </Routes>
    </>
  );
}

export default App;
