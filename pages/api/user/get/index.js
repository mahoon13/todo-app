import dbCli from "../../../../lib/database";

export default async (req, res) => {
  const userId = req.query.user_id;

  try {
    dbCli.connect();
    const db = dbCli.db("todo-app");
    const users = db.collection("users");

    const user = await users.findOne({ user_id: userId });

    res.status(200).json({
      success: true,
      todos: user.todoList,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `failed to get todos of user with id '${userId}'`,
    });
  } finally {
    dbCli.close();
  }
};
