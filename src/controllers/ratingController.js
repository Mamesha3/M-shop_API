const Product = require('../models/productSchema');
const Rating = require('../models/ratingSchema');

// Add or update a rating
exports.addRating = async (req, res) => {
  try {
    const { productId, rating, review } = req.body;
    const userId = req.user._id;

    // Validate rating
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Check if user has already rated this product
    const existingRating = await Rating.findOne({ user: userId, product: productId });

    let newRating;
    if (existingRating) {
      // Update existing rating
      existingRating.rating = rating;
      existingRating.review = review || '';
      newRating = await existingRating.save();
    } else {
      // Create new rating
      newRating = await Rating.create({
        user: userId,
        product: productId,
        rating,
        review: review || ''
      });
    }

    // Recalculate product's average rating
    const allRatings = await Rating.find({ product: productId });
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / allRatings.length;

    // Update product with new rating
    await Product.findByIdAndUpdate(productId, {
      rating: averageRating,
      numReviews: allRatings.length
    });

    // Populate user info for response
    const populatedRating = await Rating.findById(newRating._id).populate('user', 'name');

    res.status(201).json({
      success: true,
      message: existingRating ? 'Rating updated successfully' : 'Rating added successfully',
      data: populatedRating
    });
  } catch (error) {
    console.error('Error adding rating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add rating',
      error: error.message
    });
  }
};

// Get product ratings
exports.getProductRatings = async (req, res) => {
  try {
    const { productId } = req.params;

    const ratings = await Rating.find({ product: productId })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: ratings
    });
  } catch (error) {
    console.error('Error getting ratings:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get ratings',
      error: error.message
    });
  }
};

// Get user's rating for a specific product
exports.getUserRating = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findOne({ user: userId, product: productId })
      .populate('user', 'name');

    res.json({
      success: true,
      data: rating
    });
  } catch (error) {
    console.error('Error getting user rating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user rating',
      error: error.message
    });
  }
};

// Delete a rating
exports.deleteRating = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const userId = req.user._id;

    const rating = await Rating.findById(ratingId);
    if (!rating) {
      return res.status(404).json({
        success: false,
        message: 'Rating not found'
      });
    }

    // Check if user owns this rating
    if (rating.user.toString() !== userId.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this rating'
      });
    }

    await Rating.findByIdAndDelete(ratingId);

    // Recalculate product's average rating
    const allRatings = await Rating.find({ product: rating.product });
    const totalRating = allRatings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = allRatings.length > 0 ? totalRating / allRatings.length : 0;

    await Product.findByIdAndUpdate(rating.product, {
      rating: averageRating,
      numReviews: allRatings.length
    });

    res.json({
      success: true,
      message: 'Rating deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting rating:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete rating',
      error: error.message
    });
  }
};
