import uploadOnCloudinary from "../config/cloudinary.js";
import User from "../models/user.model.js";

export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "Current User Successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const editProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let image;
    if (req.file) {
      image = await uploadOnCloudinary(req.file.path);
    }
    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        name,
        image,
      },
      { new: true }
    );
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    return res
      .status(200)
      .json({ success: true, message: "EditProfile Successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const getOtherUsers = async (req, res) => {
  try {
    const users = await User.find({
      _id: { $ne: req.userId },
    }).select("-password");
    return res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

export const search = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res
        .status(400)
        .json({ success: false, message: "query is required" });
    }
    const users = await User.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { userName: { $regex: query, $options: "i" } },
      ],
    });
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
