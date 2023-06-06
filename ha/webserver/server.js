const express = require("express");
const { Pool } = require("pg");
const bodyParser = require("body-parser");
const AWS = require("aws-sdk");

const app = express();

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});
const ec2 = new AWS.EC2({ apiVersion: "2016-11-15" });

const pool = new Pool({
  host: "3.15.100.179",
  user: "postgres",
  password: "s@lami",
  database: "testdb",
  port: 5000,
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//admittedly, terrible security practice
//to have an express endpoint have full ec2 access
//and a public api to reboot any instance
//it's fine bc just for the demo, then deleting access keys and cluster
const instanceMappings = {
  "node-1": "i-07500046b93073c66",
  "node-2": "i-0dd289054e0ad6fd3",
  "node-3": "i-0e1da344b591f45ce",
  "etcd": "i-05671c346e9be6aee",
  "haproxy": "i-0b98a2c01e34765eb",
};
app.post("/api/reboot", async (req, res) => {
  const { instanceId } = req.body;
  const params = {
    InstanceIds: [instanceMappings[instanceId]],
    DryRun: false,
  };

  try {
    await ec2.rebootInstances(params).promise();
    res.status(200).json({
      status: "success",
      message: "Instance rebooted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Instance reboot error" });
  }
});

app.get("/api/status", async (_, res) => {
  const params = {
    InstanceIds: Object.values(instanceMappings),
  };

  try {
    const data = await ec2.describeInstances(params).promise();
    const instances = data.Reservations.flatMap((r) => r.Instances);
    const totalInstances = instances.map((i) => {
      return {
        InstanceId: i.InstanceId,
        State: i.State.Name,
      };
    });
    res.status(200).json({ status: "success", data: totalInstances });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "Could not retrieve instance status",
    });
  }
});

app.post("/api/add", async (req, res) => {
  const { first, last, date } = req.body;

  try {
    const query = {
      text:
        "INSERT INTO names(first_name, last_name, birth_date) VALUES($1, $2, $3)",
      values: [first, last, date],
    };
    await pool.query(query);

    res.status(200).json({
      status: "success",
      message: "Data added successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "Database error" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const query = {
      text: "SELECT * FROM names ORDER BY id DESC LIMIT $1",
      values: [limit],
    };
    const result = await pool.query(query);

    res.status(200).json({ status: "success", data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", data: -1 });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
