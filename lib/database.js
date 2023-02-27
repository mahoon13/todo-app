import { MongoClient } from "mongodb";

const DB_URL = "mongodb://127.0.0.1:27017";

const DataBaseClient = new MongoClient(DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export default DataBaseClient;
