const mongoose = require('mongoose');
const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

// Define the schema
const orderSchema = new mongoose.Schema({
  transactionID: {
    type: String, // Can also be Number, depending on your implementation
    required: true,
    unique: true,
  },
  buyerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  sellerID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the User model
    required: true,
  },
  productID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the Product model
    required: true,
  },
  amount: {
    type: Number, // Use Decimal128 for precision if needed
    required: true,
  },
  hashedOTP: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
  dateCompleted: {
    type: Date,
    default: Date.now, // Automatically set the current date
  },
  status: {
    type: String,
    enum: ['Pending', 'Completed'], // Optional: Add statuses based on your use case
    default: 'Pending',
  },
  messages: [messageSchema],
});

// Create the model
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;