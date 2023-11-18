import mongoose from "mongoose";

export const connectDB = async () => {
  mongoose.set("strictQuery", false);
  return await mongoose
    .connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then()
    .catch((err) => console.log({ err: err }));
};
