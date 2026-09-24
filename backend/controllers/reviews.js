const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
        return res.status(404).json({
            success: false,
            message: "Listing not found"
        });
    }

    const newReview = new Review(req.body);

    // JWT contains id
    newReview.author = req.user.id;

    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    return res.status(201).json({
        success: true,
        message: "New Review created!",
        review: newReview
    });
};


module.exports.destroyReview = async (req, res) => {
    const { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(
        id,
        {
            $pull: {
                reviews: reviewId
            }
        }
    );

    await Review.findByIdAndDelete(reviewId);

    return res.status(200).json({
        success: true,
        message: "Review deleted successfully"
    });
};