const { Schema, model } = require("mongoose");

const roleSchema = Schema({
  role: {
    type: String,
    required: true,
  },
});

module.exports = model("Role", roleSchema);
