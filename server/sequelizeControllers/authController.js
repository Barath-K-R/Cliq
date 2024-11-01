import UserModel from "../models/UserModel.js";
import RefreshTokenModel from "../models/RefreshTokenModel.js";
import jwt from "jsonwebtoken";

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, username: user.username }, "mySecretKey", {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    "myRefreshSecretKey",
    {
      expiresIn: "1d",
    }
  );
};

export const createAccessToken = async (req, res) => {
  console.log("recreating accesstoken");
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json("You are not authenticated!");

    const dbRefreshToken = await RefreshTokenModel.findOne({
      where: {
        refresh_token: refreshToken,
      },
    });

    if (!dbRefreshToken)
      return res.status(403).json("Refresh token is not valid!");

    jwt.verify(refreshToken, "myRefreshSecretKey", (err, user) => {
      if (err) console.log(err);
      const newAccessToken = generateAccessToken(user);

      return res.status(200).json({
        accessToken: newAccessToken,
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send("error while logout the user");
  }
};

export const loginUser = async (req, res) => {
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

      await RefreshTokenModel.create({
        user_id: user.id,
        refresh_token: refreshToken,
      });
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
  console.log("LOG OUT");
  try {
    console.log(req.body);
    const user = req.body;
    await RefreshTokenModel.destroy({
      where: {
        user_id: user.id,
      },
    });
    return res.status(200).json({ message: "Successfully logged out" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error." });
  }
};
