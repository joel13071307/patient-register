const express = require("express");
const router = express.Router();
const { registerPatient } = require("../database/database.js");
const { body, validationResult } = require("express-validator");

// post request to register a patient
router.post(
  "/register",
  body("name", "Name is required").notEmpty(),
  body("address", "Address should be atleast 10 characters long").isLength({
    min: 10,
  }),
  body("email", "Invalid Email Id").isEmail(),
  body("phone").custom((value) => {
    if (value.length !== 13) {
      throw new Error("Phone number should be 10 digits long + country code");
    }
    if (value.substring(0, 3) !== "+91") {
      throw new Error("Invalid Country Code");
    }
    return true;
  }),
  body(
    "password",
    "Password must contain one upper character, one lower character and a number. Max length 15 and min length 8"
  )
    .isStrongPassword({
      minSymbols: 0,
    })
    .isLength({ min: 8, max: 15 }),
  body("photo", "URL Invalid").isURL(),
  body("psychiatrist_id", "psychiatrist_id should not be empty").notEmpty(),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { name, email, password, phone, address, photo, psychiatrist_id } =
      req.body;
    try {
      const rows = await registerPatient(
        name,
        email,
        password,
        phone,
        address,
        photo,
        psychiatrist_id
      );
      return res.status(200).json({
        status: "success",
        message: "Patient Registered",
      });
    } catch (error) {
      return res.status(500).send(error);
    }
  }
);

module.exports = router;
