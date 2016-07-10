const mongoose = require('mongoose');
var db = mongoose.connect('MONGODB_URI' + '/' + 'fem');
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
