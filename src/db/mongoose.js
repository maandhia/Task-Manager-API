const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
});

//
//
//
//
//
//
//
//
//
//
//
// const maan = new User({
//   name: "Maan",
//   age: 24,
//   email: "MAANDHIA2015@gmail.com",
//   password: "          v"
// });
// maan
//   .save()
//   .then(success => {
//     console.log(success);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// const User = mongoose.model("User", {
//   name: { type: String },
//   age: { type: Number }
// });
// const me = new User({ name: "Maan", age: 25 });
// me.save()
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.log(error);
//   });

// const chapter10 = new Task({
//   description: "gfgkodfkovdkv bla "
//   completed: true
// });
// chapter10
//   .save()
//   .then(data => {
//     console.log(data);
//   })
//   .catch(error => {
//     console.log(error);
//   });
