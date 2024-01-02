import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Edit from "./pages/Edit";
import Junk from "./pages/Junk";


export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/search" element={<Search />} />
        <Route path="/edit" element={<Edit />} />
        <Route path="/junk" element={<Junk />} />
      </Routes>
    </BrowserRouter>
  );
}
