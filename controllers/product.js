const Product = require("../models/Product");

exports.getAllProduct = async (req, res, next) => {
    console.log("all");
    try {
        console.log("all 111111111");
        const products = await Product.find();
        console.log("all 22222222222");
        res.status(200).send(products);
    } catch (error) {
        return next(new Error(error));
    }
};

exports.getProductDetail = async (req, res, next) => {
    try {
        const id = req.query.id;
        // console.log("id:", id);
        const detail = await Product.findById(id);
        // console.log("detail:", detail);
        if (detail != null) {
            res.json(detail);
        } else {
            res.send({ msg: "product not found" });
        }
    } catch (error) {
        return next(new Error(error));
    }
};
