import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";
import { deleteMedia, uploadMedia } from "../utils/cloudinary.js";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User already exists. SignIn instead.",
        });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword });

    return res
      .status(201)
      .json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.error("Error registering user,", error);
    return res
      .status(500)
      .json({ success: false, message: "Error registering user" });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "User does not exist. Please register.",
        });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Invalid credentials. Please try again.",
        });
    }
    generateToken(res, user, `Welcome back ${user.name}`);

    //return res.status(200).json({ success:true, message: "Login successful", user: { name: user.name} });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging in" });
  }
};

export const logout = async (_, res) => {
  try {
    return res
      .status(200)
      .cookie("token", "", { maxAge: 0 })
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error logging out" });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await User.findById(userId)
      .select("-password")
      .populate("enrolledCourses");
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    return res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error fetching user profile" });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { name } = req.body;
    const profilePhoto = req.file;
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    //extract public id from old profilePhoto
    if (user.photoUrl) {
      const publicId = user.photoUrl.split("/").pop().split(".")[0];
      // Here you would typically delete the old photo from cloud storage using the publicId
      await deleteMedia(publicId);
    }
    //upload new profile photo
    const cloudResponse = await uploadMedia(profilePhoto.path);
    const photoUrl = cloudResponse.secure_url;

    const updatedData = { name, photoUrl };
    const updatedUser = await User.findByIdAndUpdate(userId, updatedData, {
      new: true,
    }).select("-password");
    return res
      .status(200)
      .json({
        success: true,
        message: "Profile updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.error("Error updating user profile:", error);
    return res
      .status(500)
      .json({ success: false, message: "Error updating user profile" });
  }
};
