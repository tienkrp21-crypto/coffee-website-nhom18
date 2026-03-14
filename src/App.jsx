import { BrowserRouter, Routes, Route } from "react-router-dom";
import CoffeeShop from "./CoffeeShop";
import Users from "./User";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CoffeeShop />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
