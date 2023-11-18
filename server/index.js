import app from "./app.js";
import { connectDB } from "./db/db.connection.js";

const PORT = 3000;

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await connectDB();

    app.listen(PORT, () => {
      console.log("listening in port", PORT, "...");
      console.log(
        `DB Conection established. Server is listening in port: ${PORT}`
      );
    });
  } catch {
    console.log("Error connecting to the database ---->", err);
    console.log("Error ---->", err);

    // Ensures that the client will close when you finish/error
  }
}
run();
