"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.signup = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const auth_schema_1 = require("../schemas/auth.schema");
const logger_1 = __importDefault(require("../logger/logger"));
const signup = async (req, res) => {
    logger_1.default.debug("signup flow started");
    const parsed = auth_schema_1.signupSchema.safeParse(req.body);
    logger_1.default.debug(`Signup payload: ${JSON.stringify(req.body)}`);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    logger_1.default.debug("Signup payload validated successfully");
    const { name, email, role, password } = parsed.data;
    const existingUser = await User_1.default.findOne({ email });
    if (existingUser) {
        logger_1.default.error("Email already exists");
        return res.status(409).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt_1.default.hash(password, 10);
    const user = await User_1.default.create({
        name,
        email,
        role,
        password: hashedPassword,
    });
    logger_1.default.info("User registered succesfully");
    res.status(201).json({ message: "User registered successfully", userId: user._id });
};
exports.signup = signup;
const login = async (req, res) => {
    const parsed = auth_schema_1.loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json(parsed.error.flatten());
    }
    const { email, password } = parsed.data;
    const user = await User_1.default.findOne({ email });
    if (!user) {
        logger_1.default.error("Invalid credentials: Email");
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        logger_1.default.error("Invalid credentials: Password");
        return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
    }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
};
exports.login = login;
