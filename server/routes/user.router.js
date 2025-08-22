import express from "express";
import {
  editProfile,
  getCurrentUser,
  getOtherUsers,
  search,
} from "../controllers/user.controller.js";
import isAuth from "../middleware/isAuth.js";
import { upload } from "../middleware/multer.js";
const userRouter = express.Router();

userRouter.get("/current", isAuth, getCurrentUser);
userRouter.put("/profile", isAuth, upload.single("image"), editProfile);
userRouter.get("/others", isAuth, getOtherUsers);
userRouter.get("/search", isAuth, search);

export default userRouter;
