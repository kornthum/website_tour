import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import SignIn from "./pages/SignIn";
import Search from "./pages/Search";
import Edit from "./pages/Edit";
import Junk from "./pages/Junk";
import User from "./pages/User";
import PrivateRoute from "./components/PrivateRoute";
import Tour from "./pages/Tour";
import Footer from "./components/Footer";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  return (
<div className="flex flex-col min-h-screen">
    <BrowserRouter>
      <Header />
      <div className="flex-grow">
        <Routes>
          <Route path="/sign-in" element={<SignIn />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Search />} />
            <Route path="/search" element={<Search />} />
            <Route element={<AdminRoute />}>
              <Route path="/edit" element={<Edit />} />
              <Route path="/tour/:tour_id" element={<Tour />} />
            </Route>
            <Route path="/junk" element={<Junk />} />
            <Route path="/user" element={<User />} />
          </Route>
        </Routes>
      </div>
      <Footer />
    </BrowserRouter>
  </div>
    
  );
}
