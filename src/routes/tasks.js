const express = require("express");
const router = new express.Router();
const Task = require("../models/task");
const auth = require("../middleware/auth");

router.post("/tasks", auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({
    ...req.body,
    owner: req.user._id
  });
  // task
  //   .save()
  //   .then(data => {
  //     res.status(201).send(data);
  //   })
  //   .catch(error => {
  //     res.status(400).send(error);
  //   });

  try {
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(500).send(e);
  }
});
router.get("/tasks", auth, async (req, res) => {
  // Task.find({})
  //   .then(data => {
  //     res.send(data);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   });

  try {
    // const task = await Task.find({ owner: req.user._id });
    const match = {};
    if (req.query.completed) {
      match.completed = req.query.completed === "true";
    }
    const sort = {};
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(":");
      sort[parts[0]] = parts[1] == "desc" ? -1 : 1;
    }
    await req.user
      .populate({
        path: "tasks",
        match,
        options: {
          limit: parseInt(req.query.limit),
          skip: parseInt(req.query.skip),
          sort
        }
      })
      .execPopulate();
    res.send(req.user.tasks);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.get("/tasks/:id", auth, async (req, res) => {
  const _id = req.params.id;
  // Task.findById(_id)
  //   .then(data => {
  //     if (!data) {
  //       return res.status(404).send();
  //     }
  //     res.send(data);
  //     console.log(data);
  //   })
  //   .catch(error => {
  //     res.status(500).send(error);
  //   });
  try {
    const task = await Task.findOne({ _id, owner: req.user._id });
    // const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
    console.log(task);
  } catch (e) {
    res.status(500).send(e);
  }
});

router.patch("/tasks/:id", auth, async (req, res) => {
  const allowedProperties = ["completed", "description"];
  const insertedProperties = Object.keys(req.body);
  const valid = insertedProperties.every(item => {
    return allowedProperties.includes(item);
  });
  console.log(valid);

  if (!valid) {
    return res.status(400).send();
  }

  try {
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // });

    const task = await Task.findOne({
      owner: req.user._id,
      _id: req.params.id
    });

    if (!task) {
      return res.status(404).send();
    }

    insertedProperties.forEach(item => {
      task[item] = req.body[item];
    });
    await task.save();
    res.send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/tasks/:id", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      owner: req.user._id,
      _id: req.params.id
    });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (e) {
    res.status(500).send(task);
  }
});

module.exports = router;
