import axios from "axios";

export const getAllListings = async ()=>{
    try {
         const response = await axios.get("/listings");
         return  response.data;
    } catch (err) {
        console.log(err);
        return [];
    }
   
};



export const getListing = async (id)=>{
    try {
         const response = await axios.get(`/listings/${id}`);
         return  response.data;
    } catch (err) {
        console.log("API ERROR:", err.response?.data);
        throw err;
    }
   
};

//search 
export const searchListings = async (query) => {
    try {
        const response = await axios.get(
            `/listings/search?q=${encodeURIComponent(query)}`
        );

        return response.data;
    } catch (error) {
        console.log("SEARCH ERROR:", error.response?.data);
        throw error;
    }
};


export const createListing = async (formData) => {
    try {
        const response = await axios.post(
            "/listings",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (err) {
        console.log("CREATE LISTING ERROR:", err.response?.data);
        throw err;
    }
};

export const updateListing = async (id, formData) => {
    try {
        const response = await axios.put(
            `/listings/${id}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );

        return response.data;
    } catch (err) {
        console.log("UPDATE LISTING ERROR:", err.response?.data);
        throw err;
    }
};

export const createReview = async (listingId, reviewData) => {
    try {
        const response = await axios.post(
            `/listings/${listingId}/reviews`,
            {
                review: reviewData,
            }
        );

        return response.data;
    } catch (err) {
        console.log(
            "CREATE REVIEW ERROR:",
            err.response?.data
        );

        throw err;
    }
};

export const deleteReview = async (listingId, reviewId) => {
    try {
        const response = await axios.delete(
            `/listings/${listingId}/reviews/${reviewId}`
        );

        return response.data;
    } catch (err) {
        console.log(
            "DELETE REVIEW ERROR:",
            err.response?.data
        );

        throw err;
    }
};

export const deleteListing = async (listingId) => {
    try {
        const response = await axios.delete(
            `/listings/${listingId}`
        );

        return response.data;
    } catch (err) {
        console.log(
            "DELETE LISTING ERROR:",
            err.response?.data
        );

        throw err;
    }
};
