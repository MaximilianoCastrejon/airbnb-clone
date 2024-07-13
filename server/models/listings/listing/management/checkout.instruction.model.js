import mongoose from "mongoose";

const CheckOutInstructionSchema = new mongoose.Schema({
  checkout_instructions_option: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "CheckOutInstructionOption",
  },
  details: {
    type: String,
    validate: {
      validator: function (value) {
        return value.length > 140;
      },
    },
    message: "details description is over 140 characters",
  },
});
const CheckOutInstruction = mongoose.model(
  "CheckOutInstruction",
  CheckOutInstructionSchema
);
export default CheckOutInstruction;
