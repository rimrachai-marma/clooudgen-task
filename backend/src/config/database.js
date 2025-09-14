import mongoose from "mongoose";

const connect_db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    const log = `Mongodb Connected to: \x1b[36m${conn.connection.host}\x1b[0m, \x1b[1m${conn.connection.name}\x1b[0m on PORT \x1b[1m${conn.connection.port}\x1b[0m`;
    console.log(log);

    return conn;
  } catch (err) {
    console.log("Failed to connect to MongoDB,\nError: ", err.message);
    process.exit(1);
  }
};

export default connect_db;
