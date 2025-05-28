const db = require("../models");


// const puppeteer = require('puppeteer');
const Users = db.usersModel;
const Otps = db.otpsModel;
const {Op} = require("sequelize");
const moment = require("moment/moment");
const Sequelize = require("sequelize");
const axios = require("axios");
const { sendSuccessResponse, sendErrorResponse } = require("../routes/response"); // assume you have helpers
const multer = require("multer");

const nodemailer = require("nodemailer");
// configure your SMTP/email transport
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: +process.env.SMTP_PORT,
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
// ---- Multer setup to handle in-memory file uploads ----
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    // allow only png or jpg
    if (!file.mimetype.match(/^image\/(png|jpeg)$/)) {
        return cb(new Error("Only .png and .jpg images are allowed"), false);
    }
    cb(null, true);
};
const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }  // optional: max 5MB
});

// ---- Controller function ----
exports.createUser = [
    // first, run the multer middleware
    upload.single("image"),
    async (req, res) => {
        try {
            const { name, email, password, company, age, dob } = req.body;

            // 1. Validate required fields
            if (!name || !email || !password || !company || !age || !dob) {
                return sendErrorResponse(res, 400, null, null, "All fields except image are required");
            }
            if (!req.file) {
                return sendErrorResponse(res, 400, null, null, "A PNG or JPG image file is required");
            }

            // 2. Prepare values
            const imageBuffer = req.file.buffer; // multer stored it in memory
            const dobFormatted = moment(dob, ["YYYY-MM-DD", "MM/DD/YYYY"]).format("YYYY-MM-DD");
            // const createdAt = moment().toISOString();

            // 3. Insert into DB
            const newUser = await Users.create({
                name,
                email,
                password,      // consider hashing in production!
                company,
                age: parseInt(age, 10),
                dob: dobFormatted,
                image: imageBuffer,
                // created_at: createdAt,
            });

            // 4. Return success
            return sendSuccessResponse(
                res,
                201,
                { id: newUser.id },
                null,
                "User created successfully"
            );
        } catch (err) {
            console.error("createUser error:", err);
            // handle unique constraint error
            if (err.name === "SequelizeUniqueConstraintError") {
                return sendErrorResponse(res, 409, null, err, "Email already in use");
            }
            return sendErrorResponse(res, 500, null, err, "Failed to create user");
        }
    }
];

exports.deleteUserByEmail = async (req, res) => {
    try {
        // if you prefer path parameter: const { email } = req.params;
        const { email } = req.body;
        if (!email) {
            return sendErrorResponse(res, 400, null, null, "Email is required for deletion");
        }

        const deletedCount = await Users.destroy({
            where: { email }
        });

        if (deletedCount === 0) {
            return sendErrorResponse(res, 404, null, null, `No user found with email ${email}`);
        }

        return sendSuccessResponse(res, 200, null, null, `User with email ${email} deleted`);
    } catch (err) {
        console.error("deleteUserByEmail error:", err);
        return sendErrorResponse(res, 500, null, err, "Failed to delete user");
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return sendErrorResponse(res, 400, null, null, "Email and password are required");
        }

        // 1. find user by email
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            // no such email in DB
            return sendErrorResponse(res, 404, null, null, "No account found; please register first");
        }

        // 2. check password
        // in production, you'd do: await bcrypt.compare(password, user.password)
        if (user.password !== password) {
            return sendErrorResponse(res, 401, null, null, "Password is incorrect");
        }

        // 3. generate OTP
        const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = moment().add(10, "minutes").toDate();

        // 4. store OTP in DB
        await Otps.create({
            userId: user.id,
            otp: otpCode,
            expiresAt,
        });

        // 5. send OTP via email
        await transporter.sendMail({
            from: `"No-Reply" <${process.env.SMTP_FROM}>`,
            to: email,
            subject: "Your Login OTP",
            text: `Your OTP is ${otpCode}. It expires in 10 minutes.`,
        });

        // 6. success response
        return sendSuccessResponse(res, 200, null, null, "OTP sent to your email");
    } catch (err) {
        console.error("loginUser error:", err);
        return sendErrorResponse(res, 500, null, err, "Login failed");
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return sendErrorResponse(res, 400, null, null, "Email and OTP are required");
        }

        // find user
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return sendErrorResponse(res, 404, null, null, "User not found");
        }

        // find matching, un‐used OTP that isn’t expired
        const record = await Otps.findOne({
            where: {
                userId: user.id,
                otp,
                used: false,
                expiresAt: { [Op.gt]: new Date() },
            },
            order: [["expiresAt", "DESC"]],
        });

        if (!record) {
            return sendErrorResponse(res, 400, null, null, "Invalid or expired OTP");
        }

        // mark it used
        record.used = true;
        await record.save();

        // success!
        return sendSuccessResponse(res, 200, { userId: user.id }, null, "OTP verified");
    } catch (err) {
        console.error("verifyOtp error:", err);
        return sendErrorResponse(res, 500, null, err, "OTP verification failed");
    }
};

exports.getUserByEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return sendErrorResponse(res, 400, null, null, "Email is required");
        }

        const user = await Users.findOne({
            where: { email },
            attributes: { exclude: ["password"] }, // exclude password for security
        });

        if (!user) {
            return sendErrorResponse(res, 404, null, null, "User not found");
        }

        return sendSuccessResponse(res, 200, user, null, "User retrieved successfully");
    } catch (err) {
        console.error("getUserByEmail error:", err);
        return sendErrorResponse(res, 500, null, err, "Failed to retrieve user");
    }
};
