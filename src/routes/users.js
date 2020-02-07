const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const multer = require("multer");
const router = new express.Router();
const sharp = require("sharp");
const { sendWelcomeEmail, sendFarewellEmail } = require("../emails/account.js");

router.post("/users", async (req, res) => {
  const user = new User(req.body);
  // user
  //   .save()
  //   .then(data => {
  //     res.status(201).send(data);
  //   })
  //   .catch(error => {
  //     res.status(400);
  //     res.send(error);
  //   });

  try {
    const token = await user.generateAuthToken();
    await sendWelcomeEmail(user.email, user.name);
    await user.save();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400);
    res.send(e);
  }
});

router.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token;
    });
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});
router.post("/users/logoutAll", auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/users/me", auth, async (req, res) => {
  // User.find({})
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   });

  // try {
  //   data = await User.find({});
  //   res.send(data);
  // } catch (e) {
  //   res.status(500).send(e);
  // }

  res.send(req.user);
});

const upload = multer({
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error("Format is not supported"));
    }
    cb(undefined, true);
  }
});
router.post(
  "/users/me/avatar",
  auth,
  upload.single("avatar"),
  async (req, res) => {
    // req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer)
      .resize({ width: 250, height: 250 })
      .png()
      .toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

router.delete("/users/me/avatar", auth, async (req, res) => {
  if (!req.user.avatar) {
    return res.status(404).send("There is no image");
  }
  req.user.avatar = undefined;
  await req.user.save();
  res.send(req.user);
});

router.get("/users/:id/avatar", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set("Content-Type", "image/png");
    res.send(user.avatar);
  } catch (e) {
    res.status(400).send("No user found!");
  }
});

router.get("/users/:id", async (req, res) => {
  const _id = req.params.id;
  // User.findById(_id)
  //   .then(data => {
  //     if (!data) {
  //       return res.status(404).send();
  //     }
  //     res.send(data);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   });

  try {
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.patch("/users/me", auth, async (req, res) => {
  const allowedProperties = ["name", "age", "email", "password"];
  const insertedProperties = Object.keys(req.body);
  const match = insertedProperties.every(item => {
    return allowedProperties.includes(item);
  });
  if (!match) {
    return res.status(400).send();
  }

  try {
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    // const user = await User.findById(req.params.id);
    insertedProperties.forEach(item => {
      req.user[item] = req.body[item];
    });
    await req.user.save();

    // if (!user) {
    //   return res.status(404).send();
    // }
    res.send(req.user);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/users/me", auth, async (req, res) => {
  try {
    // const user = await User.findByIdAndDelete(req.params.id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    // res.send(user);
    await req.user.remove();
    await sendFarewellEmail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (e) {
    res.status(500).send(req.user);
  }
});
module.exports = router;
