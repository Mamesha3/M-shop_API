const Order = require('../models/orderSchema');
const Product = require('../models/productSchema');

// Create order
exports.createOrder = async (req, res) => {
  try {
    console.log('Order creation request:', {
      body: req.body,
      user: req.user,
      headers: req.headers
    });

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice = 0,
      shippingPrice = 0
    } = req.body;

    // Validate required fields
    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order items are required'
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        success: false,
        message: 'Shipping address is required'
      });
    }

    // Check if user is authenticated
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Check if products exist and get current prices
    const productIds = orderItems.map(item => item.product);
    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length !== orderItems.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more products not found'
      });
    }

    // Create order items with current product data
    const processedOrderItems = orderItems.map(item => {
      const product = products.find(p => p._id.toString() === item.product);
      return {
        product: item.product,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        image: product.image
      };
    });

    // Calculate items price
    const itemsPrice = processedOrderItems.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    // Calculate total price
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    console.log('Creating order with data:', {
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice
    });

    // Create order (schema will calculate totals automatically)
    const order = await Order.create({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,  // Schema will recalculate this
      taxPrice,    // Schema will recalculate this  
      shippingPrice, // Schema will recalculate this
      totalPrice,   // Schema will recalculate this
      status: 'pending'
    });

    console.log('Order created successfully:', order._id);

    // Populate order with user and product details
    const populatedOrder = await Order.findById(order._id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image');

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: populatedOrder
    });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// Get order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized (only order owner or admin can view)
    if (req.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error getting order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get order',
      error: error.message
    });
  }
};

// Get user orders
exports.getUserOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = { user: req.user._id };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    console.error('Error getting user orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get user orders',
      error: error.message
    });
  }
};

// Get all orders (admin)
exports.getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      data: orders,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalOrders: total
    });
  } catch (error) {
    console.error('Error getting all orders:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get all orders',
      error: error.message
    });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Update status
    if (status) {
      order.status = status;
      
      // Set delivered status and date
      if (status === 'delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
    }

    // Update tracking number
    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    await order.save();

    // Return updated order
    const updatedOrder = await Order.findById(id)
      .populate('user', 'name email')
      .populate('orderItems.product', 'name price image');

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// Update order to paid
exports.updateOrderToPaid = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentResult } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = paymentResult;
    order.status = 'processing';

    await order.save();

    res.json({
      success: true,
      message: 'Order marked as paid',
      data: order
    });
  } catch (error) {
    console.error('Error updating order to paid:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update order to paid',
      error: error.message
    });
  }
};

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    console.log('Cancel order request for ID:', req.params.id);
    console.log('User making request:', req.user._id);
    
    const { id } = req.params;

    const order = await Order.findById(id);
    console.log('Found order:', order ? order._id : 'Not found');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user owns this order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order'
      });
    }

    // Only allow cancellation of pending orders
    if (order.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order that is already being processed'
      });
    }

    order.status = 'cancelled';
    await order.save();

    console.log('Order cancelled successfully, returning order data');

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};
