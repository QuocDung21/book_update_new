const { Schema, model } = require("mongoose");

const voucherSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("voucher", voucherSchema);
