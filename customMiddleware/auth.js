exports.requiresLogin = (req, res, next) => {
    const reqCookie = req.headers.cookie;
    console.log("reqCookie111111111111", reqCookie);
    const userId = reqCookie.split(";")[1].split("=")[1];

    const token = reqCookie.split(";")[0].split("=")[1];

    if (req.session && userId && token) {
        return next();
    } else {
        var err = new Error("You must be logged in to view this page.");
        err.status = 401;
        return next(err);
    }
};
