const Listing = require("./models/listing");
const Review = require("./models/review");
const { listingSchema, reviewSchema } = require("./schema");
const ExpressError = require("./utils/ExpressError.js");
const jwt = require("jsonwebtoken");

// module.exports.isLoggedIn = (req,res,next)=>{
//     if(!req.isAuthenticated()){
//         req.session.redirectUrl = req.originalUrl;
//         req.flash("error", "You must be logged in to create listing!");
//         return res.redirect("/login");
//     }
//     next();
// };

// now i m making it with jwt 
module.exports.isLoggedIn = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "You must be logged in"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token"
        });
    }
};


// module.exports.saveRedirectUrl = (req,res,next)=>{
//     if(req.session.redirectUrl){
//         res.locals.redirectUrl = req.session.redirectUrl;
//     }
//     next();
// };

// module.exports.isOwner = async (req,res,next)=>{
//     let {id} = req.params;
//     let listing = await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error","You are not the owner of this Listings!");
//         return res.redirect(`/listings/${id}`);
//     }
//      next();
// };

// now i am writting for isOwner
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;

    const listing = await Listing.findById(id);

    if (!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found"
        });
    }

    if (!listing.owner.equals(req.user.id)) {
        return res.status(403).json({
            success: false,
            message: "You are not the owner of this listing"
        });
    }

    next();
};

module.exports.validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
};

module.exports.validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
      if(error){
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
      }else{
        next();
      }
};

// module.exports.isReviewAuthor = async (req,res,next)=>{
//     let {id,reviewId} = req.params;
//     let review = await Review.findById(reviewId);
//     if(!review.author.equals(res.locals.currUser._id)){
//         req.flash("error","You are not the Author  of this Review!");
//         return res.redirect(`/listings/${id}`);
//     }
//      next();
// };

module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);

    if (!review) {
        return res.status(404).json({
            success: false,
            message: "Review not found"
        });
    }

    if (!review.author.equals(req.user.id)) {
        return res.status(403).json({
            success: false,
            message: "You are not authorized to delete this review"
        });
    }

    next();
};

