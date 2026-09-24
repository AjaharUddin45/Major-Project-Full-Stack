
import {Route,Routes,Navigate } from "react-router-dom";
import toast, {Toaster} from "react-hot-toast";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import Home from "./pages/Home.jsx";
import Listings from "./pages/Listings.jsx";
import ListingDetails from "./pages/ListingDetails.jsx";
import NewListing from "./pages/NewListing.jsx";
import EditListing from "./pages/EditListing.jsx";
import Login from "./pages/Login.jsx";
import Signup from "./pages/Signup.jsx";
import ProtectedRoutes from "./components/ProtectedRoutes.jsx";

import AuthContextProvider from "./context/AuthContext.jsx";

 
function App() {
  // //
    //  <> 
    // //  <h1>Wanderlust</h1>

  return (
   

      <AuthContextProvider>
      <Navbar/>
      <Toaster position='top-right' toastOptions={{duration:2000}}/>
       {/* <div className="container mt-5"> */}
          <Routes>
                  
                    {/* <Route path="/" element={<Home />} /> */}
                    <Route path="/" element={<Navigate to="/listings" replace />} />
                    <Route path="/listings" element={<Listings />} />
                    <Route path="/listings/:id" element={<ListingDetails />} />
                    <Route path="/listings/new" element={<ProtectedRoutes><NewListing /></ProtectedRoutes>} />
                    <Route path="/listings/:id/edit" element={<ProtectedRoutes><EditListing/></ProtectedRoutes>} />
                    <Route path="/login"  element={<Login />}  />
                    <Route  path="/signup"  element={<Signup />} />
                     
            </Routes>
            <Footer/>
         {/* </div> */}
  </AuthContextProvider>
  );
}

export default App
