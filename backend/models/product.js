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


/*
{
        "name": "realme narzo 50i",
        "description": "realme narzo 50i with 4GB RAM and 64GB Storage,8MP Primary and 5MP Front Camera",
        "richDescription": "The large display of realme narzo 50i comes with a screen ratio that reaches 88.7%, making it more immersive for games and movies.realme narzo 50i comes with a massive battery that supports up to 43 days in standby. Whether gaming, calling or entertainment, realme narzo 50i is built to last. Its Super Power Saving Mode lets you go on even at 5% power.Multi-task, play games and enjoy content on the realme narzo 50i seamlessly, thanks to its powerful Octa-core processor.",
        "image": "",
        "images": [],
        "brand": "Realme",
        "price": 8999,
        "category":"61ea88665a5b1a79135b946d",
        "countInStock": 26,
        "rating": 4,
        "numReviews": 21,
        "isFeatured": true
}
*/