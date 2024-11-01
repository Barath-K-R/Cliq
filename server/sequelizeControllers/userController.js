import UserModel from "../models/UserModel.js";
import RefreshTokenModel from "../models/RefreshTokenModel.js";

import jwt from "jsonwebtoken";

export const addingUserSequelize = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const newUser = await UserModel.create({
      username,
      email,
      password,
    });

    res.status(200).json(newUser);
  } catch (error) {
    console.error("Error inserting user:", error);
    res.status(500).json({
      message: "An error occurred while adding the user.",
      error: error.message,
    });
  }
};

export const loginUserSequelize = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await UserModel.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).send("User not found");
    }

    const isMatch = user.password === password ? true : false;

    if (isMatch) {
      const accessToken = generateAccessToken(user);
      const refreshToken = generateRefreshToken(user);
      return res.status(200).json({ user, accessToken, refreshToken });
    } else {
      return res.status(401).json("Password not matched");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({
      message: "An error occurred while logging in.",
      error: error.message,
    });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    await RefreshTokenModel.destroy({
      where: {
        user_id: userId,
      },
    });
    return res
      .status(200)
      .json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};

export const gettingUserSequelize = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await UserModel.findOne({
      where: { id: id },
    });

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Error fetching user:", err);
    res.status(500).send("An error occurred while fetching the user.");
  }
};
export const getAllOrgUsersSequelize = async (req, res) => {
  const { orgId } = req.params;

  try {
    const users = await UserModel.findAll({
      where: { organization_id: orgId },
    });

    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).send("An error occurred while fetching users.");
  }
};
