// IMPORTING MODULES ACC. TO COMMONJS
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const productsRouter = require("./routers/products");
const usersRouter = require("./routers/users");
const ordersRouter = require("./routers/orders");
const categoryRouter = require("./routers/categories");
const authJwt = require('./helpers/jwt');
const errorHandler = require("./helpers/error-handler");

// DEFINING CONSTANTS
dotenv.config();
const PORT = 3005;
const api = process.env.API_URL;
const app = express();

// INITIATING MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(":method - :url - :status - :response-time ms"));
app.use(cors());
app.use(authJwt()) //jwt for routing
app.use(errorHandler)
app.use('/public/uploads',express.static(__dirname+'/public/uploads'))

// USING ROUTER
app.use(`${api}/products`, productsRouter);
app.use(`${api}/users`, usersRouter);
app.use(`${api}/orders`, ordersRouter);
app.use(`${api}/categories`, categoryRouter);

// For Test
app.get('',(req,res)=>{
  res.send(`<h2 style="background:red">WELCOME TO SERVER</h2>`)
})

// ESTABLISHING CONNECTION TO MONGOOSE
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(console.log("MongoAtlas Connected "))
  .catch(() => console.log(err));

// CREATING SERVER
app.listen(PORT, () => {
  console.log(`Server is Running at http://localhost:${PORT}`);
});



