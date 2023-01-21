const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fetchuser = require("../middleware/fetchuser");
const jwt_token = "Harry is a good boy";
const crypto = require("crypto");
const NodeRSA=require("node-rsa");

const key=new NodeRSA({b:1024});

// Create a user using POST "/api/auth". Doesn't rquire Auth

router.post(
  "/signup",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail({}),
    body("password", "Enter a valid password").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const {name,mobile,email,password}=req.body;
    let success = false;
    //If there are errors return bad request
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ success, error: "Sorry the user already exists" });
      }

      //password hashing in this step to make sure that noone gets the actual password
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);

      var encryptedName=key.encrypt(req.body.name,'base64');
      var encryptedMobile = key.encrypt(req.body.mobile,'base64');

      user = await User.create({
        name: encryptedName,
        mobile: encryptedMobile,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
          mobile: mobile,
          email:email,
        },
      };
      const jwt_data = jwt.sign(data, jwt_token);
      success = true;
      res.json({ success, jwt_data });
    } catch (error) {
      console.log(error.message);
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email address").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    var success = false;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        success = false;
        return res.status(404).json({ errors: errors.array() });
      }
      const passwordcompare = await bcrypt.compare(password, user.password);
      if (!passwordcompare) {
        success = false;
        return res.status(404).json({ success, errors: errors.array() });
      }

      var decryptedMobile = key.decrypt(user.mobile,'utf8');

      const data = {
        user: {
          id: user.id,
          email:user.email,
          mobile:decryptedMobile
        },
      };
      const authtoken = jwt.sign(data, jwt_token);
      success = true;
      res.json({ success, authtoken });
    } catch (errors) {
      // return res.status(400).json({ errors: errors.array() })
      console.log(errors);
    }
  }
);

router.post("/resetpassword", async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  // Find user in database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }

  // Compare old password with hashed password in database
  const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send({ message: "Old password is incorrect" });
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedNewPassword = await bcrypt.hash(newPassword, salt);

  // Update user password in database
  await User.findOneAndUpdate(
    { email },
    { password: hashedNewPassword },
    { new: true }
  );

  res.status(200).send({ message: `Password reset successfully and new password in hashed forrm is:${hashedNewPassword}` });
});

router.put("/update", async (req, res) => {
  const { name, mobile,email, password } = await req.body;
  // Find user in database
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).send({ message: "User not found" });
  }
  // Compare old password with hashed password in database
  const isPasswordCorrect = bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return res.status(401).send({ message: "Old password is incorrect" });
  }
  if (name) {
    var encryptedName=key.encrypt(name,'base64');
    await User.updateOne(
      { email: req.body.email },
      {
        $set: {
          name:encryptedName,
        },
      },
      { new: true }
    );
  }
  if(mobile){
    var encryptedMobile=key.encrypt(mobile,'base64');
    await User.updateOne(
      { email: req.body.email },
      {
        $set: {
          mobile:encryptedMobile,
        },
      },
      { new: true }
    );
  }

  
  // Update user password in database
  // var decryptedName=key.decrypt(user.name,'utf8');
  // console.log(user);
  // console.log(decryptedName);
  res.status(200).send({ message: "Data update successfully" });
});

module.exports = router;

//The json web token is for the authentication purpose.
