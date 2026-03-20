const Product = require('../models/productSchema');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Upload image to Cloudinary
const uploadToCloudinary = async (imageData) => {
  try {
    // If imageData is a base64 string
    if (imageData.startsWith('data:image')) {
      const result = await cloudinary.uploader.upload(imageData, {
        folder: 'mshop/products',
        crop: 'scale',
        quality: 'auto',
        resource_type: 'image'
      });
      return result;
    }
    // If imageData is a URL (already uploaded)
    else if (imageData.startsWith('http')) {
      // You can validate the URL or just return it
      return {
        secure_url: imageData,
        public_id: `external_${Date.now()}`
      };
    }
    throw new Error('Invalid image format');
  } catch (error) {
    throw new Error('Failed to upload image to Cloudinary: ' + error.message);
  }
};

// Get all products
exports.getProducts = async (req, res) => {
  try {
    const { category, featured, search, page = 1, limit = 10 } = req.query;
    
    let query = {};
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Filter by featured
    if (featured === 'true') {
      query.featured = true;
    }
    
    // Search by name or description
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments(query);
    
    res.json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json({ data: product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create product with Cloudinary image
exports.createProduct = async (req, res) => {
  try {
    const { name, price, description, category, image, inStock, stock, featured, tags } = req.body;
    
    // Check if image is provided
    if (!image) {
      return res.status(400).json({ message: 'Product image is required' });
    }
    
    let cloudinaryResult;
    
    // If image is a base64 string, upload to Cloudinary
    if (image.startsWith('data:image')) {
      try {
        cloudinaryResult = await cloudinary.uploader.upload(image, {
          folder: 'mshop/products',
          crop: 'scale',
          quality: 'auto',
          resource_type: 'image'
        });
      } catch (uploadError) {
        return res.status(500).json({ message: 'Failed to upload image to Cloudinary: ' + uploadError.message });
      }
    }
    // If image is already a URL (external or previously uploaded), use it directly
    else if (image.startsWith('http')) {
      cloudinaryResult = {
        secure_url: image,
        public_id: `external_${Date.now()}`
      };
    }
    // If no valid image format
    else {
      return res.status(400).json({ message: 'Invalid image format. Please provide a valid image URL or base64 data' });
    }
    
    // Create product with Cloudinary image info
    const product = await Product.create({
      name,
      price,
      description,
      category,
      image: cloudinaryResult.secure_url,
      imagePublicId: cloudinaryResult.public_id,
      inStock: inStock !== undefined ? inStock : true,
      stock: stock || 0,
      featured: featured || false,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : []
    });
    
    res.status(201).json({ 
      message: 'Product created successfully',
      data: product 
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Update product (with optional image update)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const { name, price, description, category, image, inStock, stock, featured, tags } = req.body;
    
    // Handle image update if new image is provided
    if (image && image !== product.image) {
      // Delete old image from Cloudinary
      try {
        await cloudinary.uploader.destroy(product.imagePublicId);
      } catch (error) {
        console.error('Error deleting old image:', error);
      }
      
      // Upload new image to Cloudinary
      const cloudinaryResult = await uploadToCloudinary(image);
      
      product.image = cloudinaryResult.secure_url;
      product.imagePublicId = cloudinaryResult.public_id;
    }
    
    // Update other fields
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (category) product.category = category;
    if (inStock !== undefined) product.inStock = inStock;
    if (stock !== undefined) product.stock = stock;
    if (featured !== undefined) product.featured = featured;
    if (tags) product.tags = tags.split(',').map(tag => tag.trim());
    
    await product.save();
    
    res.json({ 
      message: 'Product updated successfully',
      data: product 
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Delete product (and remove image from Cloudinary)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    // Delete image from Cloudinary
    try {
      await cloudinary.uploader.destroy(product.imagePublicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
    
    // Delete product from database
    await Product.findByIdAndDelete(req.params.id);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get featured products
exports.getFeaturedProducts = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    
    const products = await Product.find({ featured: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(parseInt(limit));
    
    res.json({ data: products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get products by category
exports.getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const products = await Product.find({ category })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);
    
    const total = await Product.countDocuments({ category });
    
    res.json({
      data: products,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search products
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.json({ foods: [], restaurants: [] });
    }
    
    const searchQuery = q.trim();
    const regex = new RegExp(searchQuery, 'i');
    
    // Search for products
    const foods = await Product.find({
      $or: [
        { name: regex },
        { description: regex },
        { category: regex },
        { tags: { $in: [regex] } }
      ]
    }).sort({ rating: -1, createdAt: -1 }).limit(20);
    
    // For now, return empty restaurants array
    // In a real app, you would have a separate restaurants collection
    const restaurants = [];
    
    res.json({ foods, restaurants });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: error.message });
  }
};
