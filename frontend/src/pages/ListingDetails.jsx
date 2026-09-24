import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import toast from "react-hot-toast";

import {
    getListing,
    createReview,
    deleteReview,
    deleteListing,
} from "../services/api.js";

import "./Listings.css";

export default function ListingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {currUser} = useAuth();

    const [listing, setListing] = useState(null);
    const [loading, setLoading] = useState(true);

    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");

    
    

    
    useEffect(() => {
        const fetchListing = async () => {
            if (!id) {
                console.log("Listing ID is missing");
                setLoading(false);
                return;
            }

            try {
                console.log("Fetching listing ID:", id);

                const data = await getListing(id);

                console.log("Listing received:", data);

                setListing(data);
            } catch (error) {
                console.log("Error fetching listing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

   //i m doing this for leaflet map
    useEffect(() => {
        if (!listing) return;

        // Check whether Leaflet is loaded
        if (!window.L) {
            console.log("Leaflet is not loaded");
            return;
        }

        
        if (
            !listing.coordinates ||
            listing.coordinates.lat == null ||
            listing.coordinates.lng == null
        ) {
            console.log("Listing coordinates are missing");
            return;
        }

        const mapContainer = document.getElementById("map");

        if (!mapContainer) return;

        const lat = listing.coordinates.lat;
        const lng = listing.coordinates.lng;

        // Prevent duplicate map initialization
        if (mapContainer._leaflet_id) {
            return;
        }

        const map = window.L.map(mapContainer).setView(
            [lat, lng],
            10
        );

        window.L.tileLayer(
            "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: "&copy; OpenStreetMap contributors",
            }
        ).addTo(map);

        window.L.marker([lat, lng])
            .addTo(map)
            .bindPopup(`<b>${listing.title}</b>`)
            .openPopup();

        // Cleanup when component unmounts
        return () => {
            map.remove();
        };
    }, [listing]);

    
    if (loading) {
        return (
            <div className="container mt-5">
                <p>Loading listing...</p>
            </div>
        );
    }

    
    if (!listing) {
        return (
            <div className="container mt-5">
                <p className="text-danger">
                    Listing not found.
                </p>
            </div>
        );
    }

    
    const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
        const response = await createReview(id, {
            rating: Number(rating),
            comment,
        });

        console.log("Review added:", response);

        setRating(1);
        setComment("");

        const updatedListing = await getListing(id);
        setListing(updatedListing);

        toast.success("Review added successfully!");
    } catch (error) {
        console.log(
            "Error submitting review:",
            error.response?.data || error
        );

        toast.error(
            error.response?.data?.message || "Failed to add review"
        );
    }
};


const handleDeleteListing = async () => {
    try {
        await deleteListing(id);

        toast.success("Listing deleted successfully!");

        navigate("/listings");
    } catch (error) {
        console.log(
            "Error deleting listing:",
            error.response?.data || error
        );

        toast.error(
            error.response?.data?.message || "Failed to delete listing"
        );
    }
};

   
    const handleDeleteReview = async (reviewId) => {
    try {
        await deleteReview(id, reviewId);

        setListing((prev) => ({
            ...prev,
            reviews: prev.reviews.filter(
                (review) => review._id !== reviewId
            ),
        }));

        toast.success("Review deleted successfully!");
    } catch (error) {
        console.log(
            "Error deleting review:",
            error.response?.data || error
        );

        toast.error(
            error.response?.data?.message || "Failed to delete review"
        );
    }
};
    
    return (
        <div className="container mt-3">

            
            <div className="row">
                <div className="col-8 offset-3">
                    <h2>
                        <b>{listing.title}</b>
                    </h2>
                </div>
            </div>

            
            <div className="card col-6 offset-3 show-card listing-card">

            
                <img
                    src={listing.image?.url}
                    className="card-img-top show-img"
                    alt={listing.title}
                />

                <div className="card-body">

                    
                    <p className="card-text mt-3">
                        <b>Owned By </b>{" "}
                        {listing.owner?.username || "Unknown"}
                    </p>

                   
                    <p className="card-text">
                        {listing.description}
                    </p>

                  
                    <p className="card-text">
                        <b>
                            ₹{" "}
                            {Number(listing.price).toLocaleString(
                                "en-IN"
                            )}
                            {" / night"}
                        </b>
                    </p>

                   
                    <p className="card-text">
                        <b>{listing.location}</b>
                    </p>

                    
                    <p className="card-text">
                        <b>{listing.country}</b>
                    </p>
                </div>
           

            
            {currUser &&
                listing.owner &&
                currUser._id === listing.owner._id && (
                    <div className="btns">

                        <Link
                            to={`/listings/${listing._id}/edit`}
                            className="btn btn-outline-success"
                        >
                            Edit
                        </Link> &nbsp;&nbsp;&nbsp;

                        <button
                            className="btn btn-outline-dark"
                            onClick={handleDeleteListing}
                        >
                            Delete
                        </button>

                    </div>
                    
                )}
                </div>


         {/* Review */}
            <div className="col-8 offset-3">

                
                {currUser && (
                    <>
                        <hr />

                        <h4>Leave a Review</h4>

                        <form
                            onSubmit={handleReviewSubmit}
                            className="needs-validation"
                        >

                            
                            <div className="mb-3 mt-3">
    <label className="form-label d-block">
        Rating
    </label>

    <div className="d-flex gap-1">
        {[1, 2, 3, 4, 5].map((value) => (
            <i
                key={value}
                className={`bi ${
                    value <= rating
                        ? "bi-star-fill"
                        : "bi-star"
                }`}
                style={{
                    fontSize: "2rem",
                    cursor: "pointer",
                }}
                onClick={() => setRating(value)}
            ></i>
        ))}
    </div>
</div>
                           
                            <div className="mb-3 mt-3">

                                <label
                                    htmlFor="comment"
                                    className="form-label"
                                >
                                    Comment
                                </label>

                                <textarea
                                    id="comment"
                                    cols="30"
                                    rows="5"
                                    className="form-control"
                                    value={comment}
                                    onChange={(e) =>
                                        setComment(e.target.value)
                                    }
                                    required
                                ></textarea>

                                <div className="invalid-feedback">
                                    Please add some comments for reviews!
                                </div>
                            </div>

                            
                            <button className="btn btn-outline-secondary mb-3">
                                Submit
                            </button>
                        </form>
                    </>
                )}

               
                {listing.reviews &&
                    listing.reviews.length > 0 && (
                        <div className="row">

                            <p>
                                <b>All Reviews</b>
                            </p>

                            {listing.reviews.map((review) => (
                                <div
                                    className="card col-5 mb-3 ms-3"
                                    key={review._id}
                                >
                                    <div className="card-body">

                                        
                                        <h5 className="card-title">
                                            @
                                            {review.author?.username ||
                                                "User"}
                                        </h5>

                                        
                                        <p
                                            className="starability-result card-text"
                                            data-rating={
                                                review.rating
                                            }>
                                           </p>

                                        
                                        <p className="card-text">
                                            {review.comment}
                                        </p>

                                        
                                        {currUser &&
                                            review.author &&
                                            currUser._id === review.author._id && (
                                                <button
                                                    className="btn btn-outline-dark"
                                                    onClick={() =>
                                                        handleDeleteReview(
                                                            review._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
            </div>

            <div className="col-6 offset-3">

                <h3>Where you'll be</h3>

                <div id="map"></div>

            </div>
        </div>
    );
}