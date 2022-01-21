const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  richDescription: {
    type: String,
    default: "",
  },
  image: {
    type: String,
    default: "",
  },
  images: [String],
  brand: {
    type: String,
    default: "",
  },
  price: {
    type: Number,
    default: 0,
  },
  category: {
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required: true
  },
  countInStock: {
    type: Number,
    required: true,
    min:0,
    max:255
  },
  rating: {
    type: Number,
    default: 0,
  },
  numReviews: {
    type: Number,
    default: 0,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  }
});

///// ----- Virtuals ----- /////
// 1.) A virtual is a property that is not stored in MongoDB. Virtuals are typically used for computed properties on documents.
// 2.) To include virtuals in res.json(), you need to set the toJSON schema option to { virtuals: true }
// 3.) here we will create id as virtual from _id to work our server with every application.

productSchema.virtual('id').get(()=> this._id)
productSchema.set('toJSON',{virtuals:true})


const Product = mongoose.model("Product", productSchema);

module.exports = Product;
