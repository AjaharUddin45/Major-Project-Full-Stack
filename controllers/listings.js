const Listing = require("../models/listing");
const axios = require('axios');
const mapToken = process.env.MAP_TOKEN;
const geocodingToken = process.env.GEO_CODING_API_KEY;
const { forwardGeocode } = require("../public/js/geocode");



module.exports.index = async (req,res)=>{
    let allListings = await Listing.find({});
    //console.log(allListing);
    res.render("listings/index.ejs",{ allListings });

};

module.exports.search = async (req, res) => {
  const { q } = req.query;
  let allListings;

  if (q && q.trim() !== '') {
    allListings = await Listing.find({
      $or: [
        { title: { $regex: q, $options: 'i' } },
        { location: { $regex: q, $options: 'i' } }
      ]
    });
  } else {
    // Optionally redirect back or show all
    req.flash("error", "Please enter a search term.");
    return res.redirect("/listings");
  }

  res.render("listings/index", { allListings, searchQuery: q });
};


module.exports.renderNewForm = (req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({path:"reviews",populate:{path: "author"},})
    .populate("owner");

    if(!listing){
         req.flash("error"," Listing you requested for does not exist!");
         res.redirect("/listings");

    }
    //console.log(listing);
    res.render("listings/show.ejs",{listing});

};

module.exports.createListing = async (req,res,next)=>{
            //const { listing } = req.body;
            const location = req.body.listing.location;
            let url = req.file.path;
            let filename = req.file.filename;
             // 🔍 Forward geocode the location
                const geoData = await forwardGeocode(location);

                if (!geoData) {
                req.flash("error", "Invalid location. Could not geocode address.");
                return res.redirect("/listings/new");
                }
            //console.log(url, ".." , filename);    
            const newListing = new Listing(req.body.listing);
            newListing.owner = req.user._id;
            newListing.image = {url,filename};

             newListing.coordinates = {
                    lat: geoData.lat,
                    lng: geoData.lng,
                    };
             newListing.location = geoData.formatted;

              let savedListing = await newListing.save();
              console.log(savedListing);
        

            req.flash("success","New Listing created!");

            res.redirect("/listings");
   

};

module.exports.renderEditForm = async (req,res)=>{
                    let {id} = req.params;
                    let listing = await Listing.findById(id);

                    if(!listing){
                        req.flash("error"," Listing you requested for does not exist!");
                        res.redirect("/listings");
                        
                    }
                    let originalImageUrl = listing.image.url;
                   
                    originalImageUrl = originalImageUrl.replace("/upload","/upload/ar_1:1,c_auto,g_auto,w_250/r_max/");

                    res.render("listings/edit.ejs",{listing,originalImageUrl});
};

module.exports.updateListing = async (req,res)=>{
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{...req.body.listing});

    if(typeof req.file !== "undefined"){
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = {url,filename};
        await listing.save();
    }

    req.flash("success"," Listing Updated");
    res.redirect(`/listings/${id}`);//id for redirecting it to show Route instead of Index Route

};

module.exports.destroyListing = async (req,res)=>{
    let {id} = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);

     req.flash("success","Listing Deleted!");

    res.redirect("/listings");
};