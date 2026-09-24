import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getAllListings,searchListings } from "../services/api.js";
import "./Listings.css";

export default function Listings() {
  const [listings, setListings] = useState([]);
  const [showTax, setShowTax] = useState(false);
  const [loading, setLoading] = useState(true);
  
  //for serach option
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("q");

 useEffect(() => {
    const fetchListings = async () => {
        try {
            setLoading(true);

            if (searchQuery) {
                const data = await searchListings(searchQuery);

                setListings(data.allListings);
            } else {
                const data = await getAllListings();

                setListings(data);
            }

        } catch (error) {
            console.log("Error fetching listings:", error);
        } finally {
            setLoading(false);
        }
    };

    fetchListings();
}, [searchQuery]);
  return (
    <>
      {/* Mobile Browse Filters Button */}
      <div className="container mt-3">
        <button
          className="btn btn-outline-info d-md-none mb-3"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#filterSidebar"
          aria-controls="filterSidebar"
        >
          Browse Filters
        </button>

        {/* Mobile Filter Sidebar */}
        <div
          className="offcanvas offcanvas-start"
          tabIndex="-1"
          id="filterSidebar"
          aria-labelledby="filterSidebarLabel"
        >
          <div className="offcanvas-header">
            <h5 className="offcanvas-title" id="filterSidebarLabel">
              Explore your options
            </h5>

            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>

          <div className="offcanvas-body">
            <div className="d-flex flex-wrap" id="offcanvas-filters">

              <div className="filter">
                <i className="fa-solid fa-fire"></i>
                <p>Trending</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-bed"></i>
                <p>Room</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-mountain-city"></i>
                <p>Iconic cities</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-mountain"></i>
                <p>Mountains</p>
              </div>

              <div className="filter">
                <i className="fa-brands fa-fort-awesome"></i>
                <p>Castles</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-person-swimming"></i>
                <p>Amazing pools</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-campground"></i>
                <p>Camping</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-cow"></i>
                <p>Farms</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-snowflake"></i>
                <p>Arctic</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-igloo"></i>
                <p>Domes</p>
              </div>

              <div className="filter">
                <i className="fa-solid fa-sailboat"></i>
                <p>House Boat</p>
              </div>

              {/* Mobile Tax Toggle */}
              <div className="tax-toggle">
                <div className="form-check form-switch form-check-reverse">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id="switchCheckReverseSidebar"
                    checked={showTax}
                    onChange={() => setShowTax(!showTax)}
                  />

                  <label
                    className="form-check-label"
                    htmlFor="switchCheckReverseSidebar"
                  >
                    Display total after taxes
                  </label>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Desktop Filters */}
        <div id="filters">

          <div className="filter">
            <i className="fa-solid fa-fire"></i>
            <p>Trending</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-bed"></i>
            <p>Room</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-mountain-city"></i>
            <p>Iconic cities</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-mountain"></i>
            <p>Mountains</p>
          </div>

          <div className="filter">
            <i className="fa-brands fa-fort-awesome"></i>
            <p>Castles</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-person-swimming"></i>
            <p>Amazing pools</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-campground"></i>
            <p>Camping</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-cow"></i>
            <p>Farms</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-snowflake"></i>
            <p>Arctic</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-igloo"></i>
            <p>Domes</p>
          </div>

          <div className="filter">
            <i className="fa-solid fa-sailboat"></i>
            <p>House Boat</p>
          </div>

          {/* Desktop Tax Toggle */}
          <div className="tax-toggle">
            <div className="form-check form-switch form-check-reverse">

              <input
                className="form-check-input"
                type="checkbox"
                id="switchCheckReverse"
                checked={showTax}
                onChange={() => setShowTax(!showTax)}
              />

              <label
                className="form-check-label"
                htmlFor="switchCheckReverse"
              >
                Display total after taxes
              </label>

            </div>
          </div>

        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="container mt-4">
          <p>Loading listings...</p>
        </div>
      )}

      {/* No Listings */}
      {!loading && listings.length === 0 && (
        <div className="container mt-4">
          <p className="text-muted">No listings found.</p>
        </div>
      )}

      {/* Listing Cards */}
      {!loading && listings.length > 0 && (
        <div className="container">
          <div className="row row-cols-lg-3 row-cols-md-3 row-cols-sm-1">

            {listings.map((listing) => (
              <div className="col" key={listing._id}>
                <Link to={`/listings/${listing._id}`} className="listing-link" >
                  <div className="card listing-card">

                    {/* Listing Image */}
                    <img
                      src={listing.image.url}
                      className="card-img-top"
                      alt={listing.title}
                      style={{ height: "20rem" }}
                    />

                    {/* Overlay */}
                    <div className="card-img-overlay">
                      Please click
                    </div>

                    {/* Card Body */}
                    <div className="card-body">
                      <p className="card-text">
                        <b>{listing.title}</b>
                        <br />

                        ₹{" "}
                        {Number(listing.price).toLocaleString("en-IN")}
                        {" / night "}

                        {showTax && (
                          <i className="tax-info">
                            &nbsp;&nbsp;+ 18% GST
                          </i>
                        )}
                      </p>
                    </div>

                  </div>
                </Link>
              </div>
            ))}

          </div>
        </div>
      )}
    </>
  );
}

