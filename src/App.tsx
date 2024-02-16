
import './App.css'

import { Routes, Route } from "react-router-dom";
function App() {



  return (
    <Routes>
      <Route path="/" element={<div>/</div>} />
      <Route path="/login" element={<div>/login</div>} />
    </Routes>
  )
}

export default App
