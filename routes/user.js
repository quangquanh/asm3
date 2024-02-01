const express = require("express");
const router = express.Router();
const { check } = require("express-validator");

const User = require("../models/User");
const userController = require("../controllers/user");
const middleware = require("../customMiddleware/auth");

// const requiresLogin = (req, res, next) => {
//     // console.log("req.session:", req.session);
//     // console.log("req.headers:", req.headers);
//     const reqCookie = req.headers.cookie;
//     const userId = reqCookie.split(";")[1].split("=")[1];
//     const token = reqCookie.split(";")[0].split("=")[1];

//     if (req.session && userId && token) {
//         return next();
//     } else {
//         var err = new Error("You must be logged in to view this page.");
//         err.status = 401;
//         return next(err);
//     }
// };

router.post(
    "/signup",
    [
        check("email")
            .isEmail()
            .withMessage("Email invaliad")
            .custom(async (value) => {
                // custom async valida with custom err mess
                return await User.findOne({ email: value }).then((user) => {
                    if (user) {
                        return Promise.reject(
                            "This email exist, try another one"
                        );
                    }
                });
            }),
        check("fullname")
            .isLength({ min: 3 })
            .withMessage("Fullname must more than 3 character"),
        check("password")
            .isLength({ min: 8 })
            .withMessage("Password must more than 8 character"),
        check("phone")
            .isLength({ min: 10 })
            .isNumeric()
            .withMessage("Phone number must more than 10 character"),
    ],
    userController.signup
);

router.post(
    "/login",
    [
        check("email")
            .isEmail()
            .withMessage("Email invaliad")
            .custom(async (value) => {
                // custom async valida with custom err mess
                return await User.findOne({ email: value }).then((user) => {
                    if (!user) {
                        return Promise.reject(
                            "This email don't exist, try another one"
                        );
                    }
                });
            }),
    ],
    userController.login
);

router.get("/info", middleware.requiresLogin, userController.getUserInfo);
router.post("/logout", userController.logout);

module.exports = router;
