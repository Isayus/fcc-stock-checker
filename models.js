const mongoose = require('mongoose');
const { Schema } = mongoose;

const StockSchema = new Schema({
  symbol: { type: String, required: true },
  likes: { type: [String], default: [] } // Array of hashed IPs
});

const Stock = mongoose.model('Stock', StockSchema);

module.exports = Stock;