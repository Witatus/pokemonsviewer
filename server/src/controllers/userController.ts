import { Request, Response } from "express";
import { User, IUser } from "../models/user";
import { BlacklistedToken, IBlacklistedToken } from "../models/auth";
import jwt from "jsonwebtoken";
import emailValidator from "deep-email-validator";
import jwt_decode, { JwtPayload } from "jwt-decode";

export const signUpUser = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const existingUser = await User.findOne({
      name: req.body.name,
    });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const userWithExistingEmail = await User.findOne({
      email: req.body.email,
    });
    if (userWithExistingEmail) {
      return res.status(400).json({ msg: "Email already used" });
    }

    if (!(await emailValidator(req.body.email)).validators.regex) {
      return res.status(400).json({ msg: "Invalid email" });
    }

    const date = new Date();
    const newUser: IUser = new User({
      name: req.body.name,
      password: req.body.password,
      date: date,
      email: req.body.email,
      role: req.body.role || "user",
    });

    await newUser.save();
    res.status(201).json(newUser);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const getUserByName = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).send("User not found");
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).send("User not found");
    }
    await user.deleteOne();
    res.status(200).json({ message: `User ${req.params.name} deleted` });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  console.log("cipa", req);
  console.log("dupa", req.body);
  try {
    const { name, password } = req.body;

    const user = await User.findOne({ name });

    if (!user) {
      return res.status(401).send("Invalid username or password");
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Incorrect password" });
    }

    const payload = {
      id: user._id,
      name: user.name,
      role: user.role,
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "1h" },
      (error, token) => {
        if (error) throw error;
        res.status(200).json({ token });
      }
    );
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const logoutUser = async (req: Request, res: Response) => {
  console.log("logging out");
  try {
    if (req.headers.authorization) {
      const extractedToken = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt_decode<JwtPayload>(extractedToken);

      if (!decodedToken.exp) {
        return res.status(400).send("No token expiration provided");
      }

      const newBlacklistedToken: IBlacklistedToken = new BlacklistedToken({
        token: extractedToken,
        expiresAt: decodedToken.exp * 1000,
      });
      await newBlacklistedToken.save();
      return res.status(200).send("logged out");
    } else {
      return res.status(401).send("No token provided");
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const checkIfTokenIsBlacklisted = async (
  req: Request,
  res: Response
) => {
  try {
    console.log(req.body);
    const blacklistedToken = await BlacklistedToken.findOne({
      token: req.body.token,
    });
    console.log(blacklistedToken);
    if (blacklistedToken) {
      return res.status(401).send("Token is blacklisted");
    } else {
      return res.status(200).send("Token is not blacklisted");
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

export const updateUserPassword = async (req: Request, res: Response) => {
  try {
    const user = await User.findOne({ name: req.params.name });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const oldPassword = user.password;

    if (oldPassword === req.body.newPassword) {
      res
        .status(400)
        .json({ message: "Old password is the same as old password" });
    } else {
      user.password = req.body.newPassword;
      await user.save();
      res.status(200).json(user);
    }
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const protectedRoute = async (req: Request, res: Response) => {
  try {
    res.send(`Hello, user ${req.body.name}!`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
export const adminRoute = async (req: Request, res: Response) => {
  try {
    if (req.body.role !== "admin") {
      return res.status(403).send("Unauthorized");
    }
    res.send(`Hello, user ${req.body.name}!`);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
