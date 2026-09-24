
import "./Navbar.css";
import {Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const navigate = useNavigate();
  const {currUser,setCurrUser} = useAuth();
 
 const handleLogout = async () => {
    try {
        await axios.post("/logout");

        setCurrUser(null);

        toast.success("You are logged out!");

        navigate("/listings");
    } catch (error) {
        console.log("LOGOUT ERROR:", error.response?.data);

        toast.error("Logout failed");
    }
};


  return (
    <>
      <nav className="navbar navbar-expand-md bg-body-light border-bottom sticky-top">
        <div className="container-fluid">

          
          <Link className="navbar-brand" to="/listings">
            <i className="fa-regular fa-compass"></i>
          </Link>

         
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNavAltMarkup"
            aria-controls="navbarNavAltMarkup"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNavAltMarkup">

            <div className="navbar-nav">
              <Link className="nav-hover" to="/listings">
                Explore
              </Link>
            </div>

            
<div className="navbar-nav ms-auto">
    <form
        className="d-flex"
        role="search"
        onSubmit={(e) => {
            e.preventDefault();

            const query = e.target.q.value.trim();

            if (!query) return;

            navigate(`/listings?q=${encodeURIComponent(query)}`);
        }}
    >
        <input
            className="form-control me-2 search-inp"
            type="search"
            name="q"
            placeholder="Search Destination"
            aria-label="Search"
        />

        <button className="btn search-btn" type="submit">
            <i className="fa-solid fa-magnifying-glass"></i>
            Search
        </button>
    </form>
</div>

            
            <div className="navbar-nav ms-auto">

              
              <Link className="nav-link" to="/listings/new">
                <span className="host-btn">
                  <i className="fas fa-home"></i> Airbnb your home
                </span>
              </Link>

              
              {!currUser && (
                <>
                  <Link
                    className="nav-hover"
                    to="/signup"
                    title="Create your account by clicking on it"
                  >
                    <b>Sign up</b>
                  </Link>

                  <Link
                    className="nav-link btn btn-outline-primary rounded-pill px-3 py-2 me-2"
                    to="/login"
                  >
                    <b>Log in</b>
                  </Link>
                </>
              )}

              {currUser && (  //this is actually for my logout logic
                    <button
                        className="nav-link btn btn-outline-danger rounded-pill px-3 py-2 me-2"
                        onClick={handleLogout}
                    >
                        <b>Log out</b>
                    </button>
                )}

            </div>
          </div>
        </div>
      </nav>
    </>
  );
}


