const mongoose = require('mongoose');
const db = mongoose.connect('mongodb://27.120.93.212:27017/fem');
const ItemsSchema = new mongoose.Schema({
  name: {
    type: String
  },
  type: {
    type: String
  },
  expirationDate: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  }
});

exports.Items = db.model('Items', ItemsSchema);
