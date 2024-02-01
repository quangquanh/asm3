const Cart = require("../models/Cart");
const Procduct = require("../models/Product");

exports.getByUserId = async (req, res, next) => {
  console.log("=================");
  console.log("GET CART BY USER ID");
  console.log("=================");

  try {
    const reqData = req.query;
    // console.log("reqData:", reqData);
    let foundCart = await Cart.findOne({ userId: reqData.id });
    // console.log("foundCart:", foundCart);

    if (foundCart) {
      let cartItems = foundCart.items;
      // console.log("cartItems:", cartItems);

      const itemsWithDetail = await Promise.all(
        cartItems.map((item) => {
          return Procduct.findById(item.productId).select("img1 name");
        })
      );

      // console.log("itemsWithDetail:", itemsWithDetail);

      // thêm thuộc tính tên, hình ảnh trong mảng trả về FE
      cartItems = cartItems.map((cartItem, i) => {
        let _itemDetail = itemsWithDetail[i];

        if (cartItem.productId === _itemDetail._id.toString()) {
          // return cartItem mới nếu if thỏa điền kiện
          return {
            productId: cartItem.productId,
            quantity: cartItem.quantity,
            price: cartItem.price,
            productName: _itemDetail.name,
            img: _itemDetail.img1,
          };
        }

        // return cartItem cũ nếu if không thỏa điền kiện
        return cartItem;
      });
      foundCart = { ...foundCart._doc, items: cartItems };
      //   console.log("foundCart:", foundCart);
      res.json(foundCart);
    }
  } catch (error) {
    console.log("error:", error);
    res.send({ errorStyle: error.name, errorMessage: error.message });
    // return next(new Error(error));
  }
};

exports.addToCart = async (req, res, next) => {
  try {
    const reqData = req.body;
    // console.log("============================");
    // console.log("reqData:", reqData);
    const userCart = await Cart.findOne({ userId: reqData.userId });
    // console.log("userCart.items:", userCart.items);
    if (userCart) {
      // tìm item user muốn thêm vào giỏ
      // nếu item đã tồn tại, cộng thêm lượng item user muốn thêm
      // nếu không tồn tại thì thêm item mới vào giỏ
      const updateItems = [...userCart.items];
      const userAddItem = reqData.selectedItem;

      const index = updateItems.findIndex(
        (item) => item.productId.toString() === userAddItem.productId
      );

      if (index >= 0) {
        updateItems[index].quantity =
          updateItems[index].quantity + userAddItem.quantity;
      } else {
        updateItems.push(userAddItem);
      }
      // console.log("updateItems:", updateItems);

      await Cart.findByIdAndUpdate(userCart._id, {
        items: updateItems,
      });
    }
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};

exports.updateItemQuantity = async (req, res, next) => {
  try {
    // console.log("===============================");
    const reqData = req.body;
    // console.log("reqData:", reqData);
    const foundCart = await Cart.findOne({ userId: reqData.userId });
    // console.log("foundCart:", foundCart);

    const itemIndex = foundCart.items.findIndex(
      (item) => item.productId.toString() === reqData.productId
    );
    if (itemIndex >= 0) {
      foundCart.items[itemIndex].quantity = reqData.quantity;
    }
    // console.log("foundCart:", foundCart);
    await Cart.findByIdAndUpdate(foundCart._id, { items: foundCart.items });
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};

exports.deleteItem = async (req, res, next) => {
  try {
    const reqData = req.query;
    const foundCart = await Cart.findOne({ userId: reqData.userId });

    const itemIndex = foundCart.items.findIndex(
      (item) => item.productId.toString() === reqData.productId
    );
    if (itemIndex >= 0) {
      foundCart.items.splice(itemIndex, 1);
    }
    // console.log("foundCart:", foundCart);
    await Cart.findByIdAndUpdate(foundCart._id, { items: foundCart.items });
    res.end();
  } catch (error) {
    return next(new Error(error));
  }
};
