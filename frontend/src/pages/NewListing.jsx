import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { createListing } from "../services/api";

export default function  NewListing() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
        price: "",
        country: "",
        location: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("listing[title]", formData.title);
        data.append("listing[description]", formData.description);
        data.append("listing[image]", formData.image);
        data.append("listing[price]", formData.price);
        data.append("listing[country]", formData.country);
        data.append("listing[location]", formData.location);
  try {
        setLoading(true);

        await createListing(data);

        navigate("/listings");

    } catch (error) {
        console.log("Error creating listing:", error);
        console.log("API ERROR:", error.response?.data);

    } finally {
        setLoading(false);
    }
};

    return (
        <div className="container">
            <div className="row mt-3">
                <div className="col-8 offset-2">

                    <h2>List Your Property</h2>

                    <form
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        
                        <div className="mb-3">
                            <label
                                htmlFor="title"
                                className="form-label"
                            >
                                Title
                            </label>

                            <input
                                id="title"
                                name="title"
                                placeholder="Add a catchy title"
                                type="text"
                                className="form-control"
                                value={formData.title}
                                onChange={handleChange}
                                required
                            />

                            <div className="valid-feedback">
                                Title Looks good!
                            </div>
                        </div>


                       
                        <div className="mb-3">
                            <label
                                htmlFor="description"
                                className="form-label"
                            >
                                Description
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                className="form-control"
                                value={formData.description}
                                onChange={handleChange}
                                required
                            />

                            <div className="invalid-feedback">
                                Please enter a short description!
                            </div>
                        </div>


                        
                        <div className="mb-3">
                            <label
                                htmlFor="image"
                                className="form-label"
                            >
                                Upload Listing Image
                            </label>

                            <input
                                id="image"
                                name="image"
                                type="file"
                                className="form-control"
                                accept="image/*"
                                onChange={handleChange}
                                required
                            />
                        </div>


                        
                        <div className="row">

                            <div className="mb-3 col-md-4">
                                <label
                                    htmlFor="price"
                                    className="form-label"
                                >
                                    Price
                                </label>

                                <input
                                    id="price"
                                    name="price"
                                    placeholder="1200"
                                    type="number"
                                    className="form-control"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="invalid-feedback">
                                    Price should be valid.
                                </div>
                            </div>


                            <div className="mb-3 col-md-8">
                                <label
                                    htmlFor="country"
                                    className="form-label"
                                >
                                    Country
                                </label>

                                <input
                                    id="country"
                                    name="country"
                                    placeholder="India"
                                    type="text"
                                    className="form-control"
                                    value={formData.country}
                                    onChange={handleChange}
                                    required
                                />

                                <div className="invalid-feedback">
                                    Country name should be valid.
                                </div>
                            </div>

                        </div>


                        
                        <div className="mb-3">
                            <label
                                htmlFor="location"
                                className="form-label"
                            >
                                Location
                            </label>

                            <input
                                id="location"
                                name="location"
                                placeholder="Jaipur, Rajasthan"
                                type="text"
                                className="form-control"
                                value={formData.location}
                                onChange={handleChange}
                                required
                            />

                            <div className="invalid-feedback">
                                Location should be valid.
                            </div>
                        </div>


                       
                        <button
                            type="submit"
                            className="btn btn-outline-success mt-3"
                            disabled={loading}
                        >
                            {loading ? "Adding..." : "Add"}
                        </button>

                        <br />
                        <br />

                    </form>

                </div>
            </div>
        </div>
    );
};
