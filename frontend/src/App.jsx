import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Navbar from "./Components/Navbar";
import Form from "./Components/Form";

import Home from "./Components/Home"
import AdminPage from "./Components/AdminPage";

function App() {
    const [search, setSearch] = useState("");
  return (
    <>
      <Router>
      <Navbar onSearch={setSearch} />
        <Routes>
          <Route path="/" element={<Home search={search} />} />
          <Route path="/add" element={<Form />} />
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
