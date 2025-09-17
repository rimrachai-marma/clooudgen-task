import mongoose from "mongoose";

import User from "./src/models/user.model.js";
import Product from "./src/models/product.model.js";
import { users } from "./data/users.js";
import { products } from "./data/products_data.js";

//DB connect
mongoose
  .connect(process.env.MONGO_URL)
  .then((conn) => {
    console.log(
      `Mongodb Connected to: ${conn.connection.host}, ${conn.connection.name} on PORT ${conn.connection.port} `
    );
  })
  .catch((err) => {
    console.log("Failed to connect to MongoDB,\nError: ", err);
  });

const importData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();

    // const createdUsers = await User.insertMany(users);

    // const adminUser = createdUsers[0]._id;
    const sampleProducts = products.map((product) => {
      return { ...product, user: "68c9cd620a6405f1332986fe" };
    });

    await Product.insertMany(sampleProducts);

    console.log("Data Imported!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
