import express from "express";
import cors from "cors";
import mongoose from "mongoose";
await mongoose.connect(
  "mongodb+srv://phamtai1708:hanhhanh1505@web82.ywklp.mongodb.net/test2509?retryWrites=true&w=majority&appName=WEB82"
);
import MovieModel from "./model/movie.js";
import UserModel from "./model/user.js";

import multer from "multer";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: "damaqsevw",
  api_key: "253314713859483",
  api_secret: "0INP7qndhyNe87fKdoHHZjdmOxA",
});

import { validateToken } from "./middlewares/token.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SecretKey } from "./middlewares/token.js";

const app = express();
app.use(express.json());
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/register", async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName) throw new Error("userName is required");
    if (!email || !password) throw new Error("Email or password is missing!");
    const crrUser = await UserModel.findOne({ email: email });
    if (crrUser) throw new Error("email đã được sử dụng");
    const hashedPassword = bcrypt.hashSync(password, 10);
    const createdUser = await UserModel.create({
      email,
      password: hashedPassword,
      userName,
    });
    res.status(201).send({
      message: "Register successful!",
      data: createdUser,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: null,
    });
  }
});
//Xây dựng API Login/Logout với token
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new Error("Email or password is missing!");
    const currentUser = await UserModel.findOne({
      email,
    });
    if (!currentUser) throw new Error("Email or password is invalid!");
    const comparedPassword = bcrypt.compareSync(password, currentUser.password);
    if (!comparedPassword) throw new Error("Email or password is invalid!");
    const user = {
      userId: currentUser.userId,
      email: currentUser.email,
    };
    const accessToken = jwt.sign(user, SecretKey, {
      expiresIn: 60 * 5,
    });
    res.status(200).send({
      message: "Login successful!",
      data: currentUser,
      token: accessToken,
    });
  } catch (error) {
    res.status(400).send({
      message: error.message,
      data: null,
    });
  }
});
//Xây dựng API danh sách, thêm, sửa, xóa dữ liệu phim
app.get("/movies", async (req, res) => {
  try {
    const listMovie = await MovieModel.find({});
    res.status(200).send({
      message: "Successful!",
      data: listMovie,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
});
app.post(
  "/movies/create",
  validateToken,
  upload.single("file"),
  async (req, res) => {
    try {
      //Thông tin movie nhập từ body
      const { ID, movieName, time, year, introduce } = req.body;
      if (!ID) throw new Error("please input ID");
      if (!movieName) throw new Error("please input movieName");
      if (!time) throw new Error("please input time");
      if (!year) throw new Error("please input year");
      if (!introduce) throw new Error("please input introduce");
      //Ảnh đại diện cho movie
      const mainImg = req.file;
      let urlImg = "";
      if (!mainImg) throw new Error("chưa nhập ảnh đại diện cho movie");
      const dataUrl = `data:${
        mainImg.mimetype
      };base64,${mainImg.buffer.toString("base64")}`;
      const result = await cloudinary.uploader.upload(dataUrl, {
        resource_type: "auto",
      });
      if (!result || !result.url) {
        return res.status(500).send({
          message: "Failed to upload avatar",
          data: null,
        });
      }
      if (result && result.url) {
        urlImg = result.url;
      }
      //Tạo data
      const newMovie = await MovieModel.create({
        movieId: crypto.randomUUID(),
        ID: ID,
        movieName,
        time,
        year,
        image: urlImg,
        introduce,
      });
      res.status(200).send({
        message: "Successful!",
        data: newMovie,
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        data: null,
      });
    }
  }
);
app.put("/movies/update/:value", async (req, res) => {
  try {
    const { value } = req.params;
    if (!value.includes("="))
      throw new Error("Invalid format for value in params");

    const { movieId } = req.body;
    if (!movieId) throw new Error("movieId is required");

    const existingMovie = await MovieModel.findOne({ movieId });
    if (!existingMovie) throw new Error("Movie not found");

    const listValue = value.split("&&");
    const updateData = {};

    for (let i = 0; i < listValue.length; i++) {
      const [key, xxx] = listValue[i].split("=");
      if (key && xxx) {
        updateData[key] = xxx;
      }
    }
    const updatedMovie = await MovieModel.findOneAndUpdate(
      { movieId },
      updateData,
      { new: true }
    );
    res.status(200).send({
      message: "Successful!",
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
});
app.delete("/movies/delete", async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) throw new Error("movieId is required");
    const deletedMovie = await MovieModel.findOneAndDelete({ movieId });
    if (!deletedMovie) {
      return res.status(404).send({
        message: "Movie not found",
        data: null,
      });
    }
    res.status(200).send({
      message: "Successful!",
      data: deletedMovie,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
});
//Xây dựng API tìm kiếm phim theo tên phim được truyền từ params
app.get("/movies/search/:value", async (req, res) => {
  try {
    const { value } = req.params;
    const listMovie = await MovieModel.find({
      movieName: { $regex: value, $options: "i" },
    });
    if (listMovie.length === 0) throw new Error("No movies found");
    res.status(200).send({
      message: "Successful!",
      data: listMovie,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
});
//Xây dựng API danh sách phim được sắp xếp theo năm.
app.get("/movies/arrange/year/:value", async (req, res) => {
  try {
    const { value } = req.params;
    if (!value) throw new Error("Nhập kiểu sắp xếp phim");
    let listMovie = await MovieModel.find();
    if (value === "increase") {
      listMovie.sort((a, b) => a.year - b.year);
    } else {
      if (value === "reduce") {
        listMovie.sort((a, b) => b.year - a.year);
      } else throw new Error("Bận nhập keyword chưa chính xác");
    }

    res.status(200).send({
      message: "Successful!",
      data: listMovie,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
});

//Upload hình ảnh và thay thế giá trị trong database
app.put("/movies/updateImage", upload.single("file"), async (req, res) => {
  try {
    const { movieId } = req.body;
    if (!movieId) throw new Error("movieId is required");
    const mainImg = req.file;
    if (!mainImg) throw new Error("mainImg is required");

    const existingMovie = await MovieModel.findOne({ movieId });
    if (!existingMovie) throw new Error("Movie not found");

    let urlImg = "";
    const dataUrl = `data:${mainImg.mimetype};base64,${mainImg.buffer.toString(
      "base64"
    )}`;
    const result = await cloudinary.uploader.upload(dataUrl, {
      resource_type: "auto",
    });
    if (!result || !result.url) {
      return res.status(500).send({
        message: "Failed to upload avatar",
        data: null,
      });
    }
    const updatedMovie = await MovieModel.findOneAndUpdate(
      { movieId },
      { image: result.url },
      { new: true }
    );
    res.status(200).send({
      message: "Successful!",
      data: updatedMovie,
    });
  } catch (error) {
    res.status(500).send({
      message: error.message,
      data: null,
    });
  }
});
app.listen(8080, () => {
  console.log("server is running");
});
