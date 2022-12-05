import React from 'react';
import './App.css';
import Login from "./components/login/Login";
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import Brokers from "./components/brokers/Brokers";
import Stocks from "./components/stocks/Stocks";
import Start from "./components/start/Start";

function App() {
  return (
      <BrowserRouter>
          <div className="App">
          <Routes>
              <Route path="/login" element={<Login/>}/>
              <Route path="/brokers" element={<Brokers/>}/>
              <Route path="/stocks" element={<Stocks/>}/>
              <Route path="/start" element={<Start/>}/>
              <Route path="/" element={<Navigate to="/brokers"/>}/>
              <Route path="*" element={<div className="flex justify-center w-full h-full items-center"><h1 className="text-3xl">Page Not Found</h1></div>}/>
          </Routes>


          </div>
      </BrowserRouter>
  );
}

export default App;
