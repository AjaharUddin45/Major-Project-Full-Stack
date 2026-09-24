const Listing = require("../models/listing");
const axios = require('axios');
const mapToken = process.env.MAP_TOKEN;
const geocodingToken = process.env.GEO_CODING_API_KEY;
const { forwardGeocode } = require("../public/js/geocode");



const index = async (req,res)=>{
    let allListings = await Listing.find({});
    //console.log(allListing);
   res.json(allListings);
   //res.send("hello");

};

const search = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Please enter a search term.",
                allListings: [],
            });
        }

        const allListings = await Listing.find({
            $or: [
                {
                    title: {
                        $regex: q,
                        $options: "i",
                    },
                },
                {
                    location: {
                        $regex: q,
                        $options: "i",
                    },
                },
            ],
        });

        return res.status(200).json({
            success: true,
            searchQuery: q,
            allListings,
        });

    } catch (error) {
        console.log("SEARCH ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// const renderNewForm = (req,res)=>{
//     res.render("listings/new.ejs");
// };

const showListing = async (req,res)=>{
     try {
         let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path: "author"},})
    .populate("owner");

   if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing you requested for does not exist!",
            });
        }

        res.json(listing);
     } catch (error) {
        console.log(error);
     }
    
};

const createListing = async (req, res) => {
    try {
        const location = req.body.listing.location;

        const url = req.file.path;
        const filename = req.file.filename;

        
        const geoData = await forwardGeocode(location);

        if (!geoData) {
            return res.status(400).json({
                success: false,
                message: "Invalid location. Could not geocode address.",
            });
        }

        
        const newListing = new Listing(req.body.listing);

        
        newListing.owner = req.user.id;

        newListing.image = {
            url,
            filename,
        };

       
        newListing.coordinates = {
            lat: geoData.lat,
            lng: geoData.lng,
        };

        
        newListing.location = geoData.formatted;

        
        const savedListing = await newListing.save();

        console.log(savedListing);

        return res.status(201).json({
            success: true,
            message: "New Listing created!",
            listing: savedListing,
        });

    } catch (error) {
        console.log("CREATE LISTING ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const renderEditForm = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findById(id);

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing you requested for does not exist!",
            });
        }

        let originalImageUrl = listing.image.url;

        originalImageUrl = originalImageUrl.replace(
            "/upload",
            "/upload/ar_1:1,c_auto,g_auto,w_250/r_max/"
        );

        return res.status(200).json({
            success: true,
            listing,
            originalImageUrl,
        });

    } catch (error) {
        console.log("EDIT FORM ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const updateListing = async (req, res) => {
    try {
        const { id } = req.params;

        const listing = await Listing.findByIdAndUpdate(
            id,
            { ...req.body.listing },
            { new: true, runValidators: true }
        );

        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing you requested for does not exist!",
            });
        }

        
        if (typeof req.file !== "undefined") {//if user uploaded a new image
            const url = req.file.path;
            const filename = req.file.filename;

            listing.image = {
                url,
                filename,
            };

            await listing.save();
        }

        return res.status(200).json({
            success: true,
            message: "Listing Updated",
            listing,
        });

    } catch (error) {
        console.log("UPDATE LISTING ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

const destroyListing = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedListing = await Listing.findByIdAndDelete(id);

        if (!deletedListing) {
            return res.status(404).json({
                success: false,
                message: "Listing you requested for does not exist!",
            });
        }

        console.log(deletedListing);

        return res.status(200).json({
            success: true,
            message: "Listing Deleted!",
            listing: deletedListing,
        });

    } catch (error) {
        console.log("DELETE LISTING ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
        index,
        search,
        // renderNewForm,
        showListing,
        createListing,
        renderEditForm,
        updateListing,
        destroyListing
};
