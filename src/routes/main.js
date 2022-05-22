const express = require("express");
const middleware = require("../middleware/middleware");
const User = require("../models/user");

const router = express.Router();
router.get("/status", (req, res, next) => {
  res.status(200);
  res.json({ status: "ok" });
});

router.post(
  "/signup",
  middleware(async (req, res, next) => {
    const { name, email, password } = req.body;
    await User.create({ email, password, name });
    res.status(200).json({ status: "ok" });
  })
);

router.post(
  "/login",
  middleware(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      res.status(401).json({ message: "unauthenticated" });
      return;
    }

    const validate = await user.isValidPassword(password);
    if (!validate) {
      res.status(401).json({ message: "unauthenticated" });
      return;
    }

    res.status(200).json({ status: "ok" });
  })
);

router.post("/logout", (req, res, next) => {
  res.status(200);
  res.json({ status: "ok" });
});

router.post("/token", (req, res, next) => {
  res.status(200);
  res.json({ status: "ok" });
});

module.exports = router;
