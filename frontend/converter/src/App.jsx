import React from 'react'
import {BrowserRouter as Router, Routes, Route, Navigate} from "react-router-dom";
import Search from "./pages/Search"
import Home from "./pages/Home"
import Opcode from "./pages/Opcode"
import Register from "./pages/Register"
import NotFound from "./pages/NotFound"
import Result from './pages/Result';

const routes = (
  <Router>
    <Routes>
      <Route path="/search" exact element={<Search />}/>
      <Route path="/" element={<Navigate to="/search" />} />
      <Route path="/home" exact element={<Home />}/>
      <Route path="/opcode" exact element={<Opcode />}/>
      <Route path="/register" exact element={<Register />}/>
      <Route path="/result" exact element={<Result />}/>
      <Route path="*" exact element={<NotFound />}/>
    </Routes>
  </Router>
);

const App = () => {
  
  return (
    <div>
      {routes}
    </div>
  )
}

export default App