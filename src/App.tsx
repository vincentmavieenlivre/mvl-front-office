

import { Routes, Route } from "react-router-dom";
import RootPage from './pages/root';
function App() {



  return (
    <Routes>
      <Route path="/" element={<RootPage></RootPage>} />
      <Route path="/login" element={<div>/login</div>} />
    </Routes>
  )
}

export default App
