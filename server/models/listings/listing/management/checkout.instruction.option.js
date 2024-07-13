import mongoose from "mongoose";

/*
Gather used towels
Throw trash away
Turn things off
Lock up
Return keys
Additional requests
*/

const CheckOutInstructionOptionSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  icon: {
    type: String,
  },
});

const CheckOutInstructionOption = mongoose.model(
  "CheckOutInstructionOption",
  CheckOutInstructionOptionSchema
);
export default CheckOutInstructionOption;
