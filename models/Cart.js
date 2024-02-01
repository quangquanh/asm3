const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        productId: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

cartSchema.pre("save", (next) => {
  this.updatedAt = new Date();
  next();
});

module.exports = mongoose.model("Cart", cartSchema);
