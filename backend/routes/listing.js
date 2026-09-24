const express = require("express");
const router = express.Router();
const cors = require("cors");
const wrapAsync = require("../utils/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const { index,search,
    renderNewForm,
    showListing,
    createListing,
    renderEditForm,
    updateListing,
    destroyListing} = require("../controllers/listings.js");
const multer  = require('multer');
const {storage } = require("../cloudConfig.js");

const upload = multer({ storage });

//middleware 
router.use(
    cors({
        credentials:true,
        origin:"http://localhost:5173",
}));


//Index Route
router.get("/", wrapAsync(index));

//search route for searching Destination
router.get("/search", search);

// //New Route
// router.get("/new",isLoggedIn,renderNewForm);

//Show Route
router.get("/:id",wrapAsync(showListing));

//Create Route
router.post("/",isLoggedIn,
                 
                 upload.single('listing[image]'),
                 validateListing,//for backend validation
                 wrapAsync(createListing));


//Edit Route
router.get("/:id/edit", isLoggedIn, 
                        isOwner,
                    wrapAsync(renderEditForm));

//Update Route
router.put("/:id",isLoggedIn, isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(updateListing));

//Delete Route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(destroyListing));

module.exports = router;
