const { Schema, model } = require("mongoose");

const keyResetSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = model("keyReset", keyResetSchema);
