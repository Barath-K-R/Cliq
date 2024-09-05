import UserModel from "../models/UserModel.js";

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
    res
      .status(500)
      .json({
        message: "An error occurred while adding the user.",
        error: error.message,
      });
  }
};

export const logingUserSequelize = async (req, res) => {
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
      return res.status(200).json(user);
    } else {
      return res.status(401).send("Password not matched");
    }
  } catch (error) {
    console.error("Error logging in user:", error);
    res
      .status(500)
      .json({
        message: "An error occurred while logging in.",
        error: error.message,
      });
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
