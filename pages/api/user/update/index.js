import dbCli from "../../../../lib/database";

export default async (req, res) => {
  const body = JSON.parse(req.body);
  const userId = body.userId;
  const todos = body.todos;

  try {
    dbCli.connect();
    const db = dbCli.db("todo-app");
    const users = db.collection("users");

    await users.updateOne(
      { user_id: userId },
      {
        $set: { todoList: todos },
      }
    );

    res.status(200).json({
      success: true,
      message: "updated user todolist",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: `failed to update todos of user with id '${userId}'`,
    });
  } finally {
    dbCli.close();
  }
};
