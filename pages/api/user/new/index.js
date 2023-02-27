import { v4 } from "uuid";
import dbCli from "../../../../lib/database";

export default async (req, res) => {
  try {
    dbCli.connect();
    let userId = v4();
    const db = dbCli.db("todo-app");
    const users = db.collection("users");
    const insertUser = await users.insertOne({
      user_id: userId,
      todoList: [],
    });

    if (insertUser) {
      res.status(200).json({
        success: true,
        userId,
      });
    } else throw new Error();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "regestration failed",
    });
  } finally {
    dbCli.close();
  }
};
