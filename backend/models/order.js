const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    orderItems: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'OrderItem',
        required:true
    }],
    shippingAddress1: {
        type: String,
        required: true,
    },
    shippingAddress2: {
        type: String,
    },
    city: {
        type: String,
        required: true,
    },
    zip: {
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        default: 'Pending',
    },
    totalPrice: {
        type: Number,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    dateOrdered: {
        type: Date,
        default: Date.now,
    },
})

exports.Order = mongoose.model('Order', orderSchema);


/**
Order Example:

{
    "orderItems" : [
        {
            "quantity": 3,
            "product" : "61eaa3b22cdb45b73379db5f"
        },
        {
            "quantity": 2,
            "product" : "61eabf362cee432c6b77f716"
        }
    ],
    "shippingAddress1" : "Okhla",
    "shippingAddress2" : "73-A",
    "city": "Delhi",
    "zip": "110025",
    "country": "India",
    "phone": "+420702241333",
    "user": "61ef002a9d0d7a94a283ec1f"
}

 */