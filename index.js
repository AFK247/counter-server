const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// middle wares
app.use(cors());
app.use(express.json());

const user = process.env.db_user;
const password = process.env.db_password;

//The user and password were taken from env
const uri = `mongodb+srv://${user}:${password}@cluster0.bs7nnrw.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

//Two collection is used
async function run() {
  try {
    const counterCollection = client.db("Counter").collection("CounterValue");

    app.get("/counterApi", async (req, res) => {
      const query = { key: "hello" };
      const countValue = await counterCollection.find(query).toArray();
      res.send(countValue);
    });

    app.put("/updateCounter/:val", async (req, res) => {
      const newVal = req.params.val;
      const query = { key: "hello" };

      const options = { upsert: false };
      const updatedItem = {
        $set: {
          value: newVal,
        },
      };
      const result = await counterCollection.updateOne(
        query,
        updatedItem,
        options
      );
      res.send(result);
    });
  } finally {
  }
}

run().catch((err) => console.error(err));

app.get("/", (req, res) => {
  res.send("Counter Server is running");
});

app.listen(port, () => {
  console.log(`Counter Server running on ${port}`);
});
