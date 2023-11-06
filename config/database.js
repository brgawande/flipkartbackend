import mongoose from "mongoose";

export const connectdb = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "flipkart",
    })
    .then((c) => console.log(`Databse Connected on host ${c.connection.host}`))
    .catch((e) => console.log("error"));
};
