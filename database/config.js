const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_CONN, { useNewUrlParser: true });
    console.log("Db conn");
  } catch (error) {
    console.log(error);
    throw new Error("Error el init la DB");
  }
};

module.exports = { dbConnection };
