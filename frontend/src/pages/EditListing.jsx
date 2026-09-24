import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getListing, updateListing } from "../services/api.js";

export default function  EditListing () {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        country: "",
        location: "",
        image: null,
    });

    const [originalImage, setOriginalImage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Get existing listing
    useEffect(() => {
        const fetchListing = async () => {
            try {
                const data = await getListing(id);

                setFormData({
                    title: data.title || "",
                    description: data.description || "",
                    price: data.price || "",
                    country: data.country || "",
                    location: data.location || "",
                    image: null,
                });

                setOriginalImage(data.image?.url || "");
            } catch (error) {
                console.log("Error fetching listing:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchListing();
    }, [id]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: files ? files[0] : value,
        }));
    };

    // Submit updated listing
    const handleSubmit = async (e) => {
        e.preventDefault();

        const data = new FormData();

        data.append("listing[title]", formData.title);
        data.append("listing[description]", formData.description);
        data.append("listing[price]", formData.price);
        data.append("listing[country]", formData.country);
        data.append("listing[location]", formData.location);

        // Only send image if user selected a new one
        if (formData.image) {
            data.append("listing[image]", formData.image);
        }

        try {
            setSaving(true);

            await updateListing(id, data);

            navigate(`/listings/${id}`);
        } catch (error) {
            console.log("Error updating listing:", error);
            console.log("API ERROR:", error.response?.data);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p className="text-center mt-5">Loading listing...</p>;
    }

    return (
        <div className="row mt-3">
            <div className="col-8 offset-2">

                <h3>Edit your listing:</h3>

                <form
                    onSubmit={handleSubmit}
                    noValidate
                    encType="multipart/form-data"
                >

                    {/* Title */}
                    <div className="mb-3">
                        <label htmlFor="title" className="form-label">
                            Title
                        </label>

                        <input
                            id="title"
                            name="title"
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

                    {/* Description */}
                    <div className="mb-3">
                        <label htmlFor="description" className="form-label">
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
                    </div>

                    {/* Original Image */}
                    <div className="mb-3">
                        <b>Original Image</b>
                        <br />

                        {originalImage && (
                            <img
                                src={originalImage}
                                alt="Original listing"
                                width="250"
                                height="200"
                                style={{ objectFit: "cover" }}
                            />
                        )}
                    </div>

                    {/* New Image */}
                    <div className="mb-3">
                        <label htmlFor="image" className="form-label">
                            Upload New Image
                        </label>

                        <input
                            id="image"
                            name="image"
                            type="file"
                            className="form-control"
                            accept="image/*"
                            onChange={handleChange}
                        />
                    </div>

                    {/* Price + Country */}
                    <div className="row">

                        <div className="mb-3 col-md-4">
                            <label htmlFor="price" className="form-label">
                                Price
                            </label>

                            <input
                                id="price"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                type="number"
                                className="form-control"
                                required
                            />

                            <div className="invalid-feedback">
                                Price should be valid.
                            </div>
                        </div>

                        <div className="mb-3 col-md-8">
                            <label htmlFor="country" className="form-label">
                                Country
                            </label>

                            <input
                                id="country"
                                name="country"
                                value={formData.country}
                                onChange={handleChange}
                                type="text"
                                className="form-control"
                                required
                            />

                            <div className="invalid-feedback">
                                Country name should be valid.
                            </div>
                        </div>

                    </div>

                    {/* Location */}
                    <div className="mb-3">
                        <label htmlFor="location" className="form-label">
                            Location
                        </label>

                        <input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            type="text"
                            className="form-control"
                            required
                        />

                        <div className="invalid-feedback">
                            Location should be valid.
                        </div>
                    </div>

                    {/* Save */}
                    <button
                        type="submit"
                        className="btn btn-outline-success"
                        disabled={saving}
                    >
                        {saving ? "Saving..." : "Save"}
                    </button>

                    <br />
                    <br />

                </form>
            </div>
        </div>
    );
};

