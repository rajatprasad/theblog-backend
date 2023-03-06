const express = require("express");
const app = express();
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/users");
const postRoute = require("./routes/posts");
const categoryRoute = require("./routes/categories");
const multer = require("multer");
const path = require("path");

const port = process.env.PORT || 5000;

dotenv.config();
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/images")));

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("connected to mongoDB.");
  } catch (error) {
    throw error;
  }
};

connect();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json("File has been uploaded");
});

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/categories", categoryRoute);

app.use(express.static(path.join(__dirname, "./client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

// const __dirname1 = path.resolve();
// if (PROCESS.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname1, "/client/build")));

//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname1, "client", "build", "index.html"));
//   });
// } else {
app.listen(port, () => {
  // connect();
  console.log("Backend is runing.");
});
