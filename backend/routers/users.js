const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const usersRouter = express.Router();

/////////// -------- GET -------------- /////////////
usersRouter.get(`/`, async (req, res) => {
  const userList = await User.find({},' -passwordHash -phone -__v');

  if (!userList) {
    res.status(500).json({ success: false });
  }
  res.send(userList);
});

usersRouter.get(`/:id`, async (req, res) =>{
    let id = req.params.id
    const user= await User.findById(id).select('-passwordHash -phone -__v');

    if(!user) {
        res.status(500).json({success: false})
    } 
    res.status(200).send(user);
})

usersRouter.get('/get/count',async (req,res)=>{
  const userCount = await User.countDocuments();

  if (!userCount) {
    res.status(500).json({ success: false });
  }
  res.send({
    userCount: userCount,
  });
})

/////////// --------PUT & POST--------- /////////////
usersRouter.post("/", async (req, res) => {
  let { name, email, password, phone, isAdmin,street, apartment, zip, city, country } =req.body;
  let passwordHash = await bcrypt.hash(password,8);
  let user = new User({
    name,
    email,
    passwordHash,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  });
  user = await user.save();
  if (!user) {
    return res
      .status(404)
      .json({ success: false, message: "The user cannot be created" });
  } else {
    return res.status(200).send(user);
  }
});

usersRouter.post('/register', async (req,res)=>{
  let { name, email, password, phone, isAdmin,street, apartment, zip, city, country } =req.body;
  let passwordHash = await bcrypt.hash(password,8);
  let user = new User({
    name,
    email,
    passwordHash,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
  });
  user = await user.save();

  if(!user)
  return res.status(400).send('the user cannot be created!')

  res.send(user);
})

usersRouter.put('/:id',async (req, res)=> {

  let { name, email, password, phone, isAdmin,street, apartment, zip, city, country } =req.body;
  const userExist = await User.findById(req.params.id);
  let newPassword
  if(password) {
      newPassword = bcrypt.hashSync(password, 8)
  } else {
      newPassword = userExist.passwordHash;
  }
  const user = await User.findByIdAndUpdate(
      req.params.id,
      {
    name,
    email,
    passwordHash:newPassword,
    phone,
    isAdmin,
    street,
    apartment,
    zip,
    city,
    country,
      },
      { new: true}
  )

  if(!user)
  return res.status(400).send('the user cannot be created!')

  res.send(user);
})

//// ------ DELETING USRES ------- ////////
usersRouter.delete("/:id", (req, res) => {
  let id = req.params.id;
  User.findByIdAndRemove(id)
    .then((user) => {
      if (user) {
        return res
          .status(200)
          .json({ success: true, message: "user deleted" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "user not found" });
      }
    })
    .catch((err) => {
      return res.status(400).json({ success: false, error: err });
    });
});

//// ----- CREATING JWT FOR LOGIN & ROUTING ---------////
usersRouter.post("/login", async (req, res) => {
  const secret = process.env.SECRET_KEY;
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("The user not found");
  if (user && bcrypt.compareSync(req.body.password,user.passwordHash)) {
    const token = jwt.sign(
      {
        userId: user.id, // Here as a payload we are passing user id
        isAdmin: user.isAdmin
      },
      secret,
      {
        expiresIn: "1d",
      }
    );
    return res
      .status(200)
      .send({ msg: "User Authenticated", user: user.email, token });
  } else {
    return res.status(400).send("Incorrect Password!");
  }
});



module.exports = usersRouter;
