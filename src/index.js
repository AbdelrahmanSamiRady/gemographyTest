const express = require("express");
const app = express();
const axios = require("axios");

app.disable("x-powered-by");

app.use(express.json());

app.get("/api/ping", async (req, res) => {
  try {
    res.json({ success: true });
  } catch (e) {
    res.json({ success: false });
  }
});

app.get("/api", async (req, res) => {
  if (!req.query.language) {
    return res.status(400).send({ error: "language parameter is required" });
  }

  var date2 = new Date(new Date().setDate(new Date().getDate() - 30));
  const date = date2.toISOString().split("T")[0] || req.query.date;
  const sortBy = req.query.sortBy || "stars";
  const order = req.query.order || "desc";
  const language = req.query.language;
  var count = 0;
  var listObj = [];

  try {
    const data = await axios.get(
      `https://api.github.com/search/repositories?q=created:>${date}&sort=${sortBy}&order=${order}`
    );

    const resultedData = await data.data.items;

    await resultedData.map(dataIndex => {
      if ((dataIndex.language = language)) {
        count += 1;
      }
      if (count <= 99) {
        listObj.push(dataIndex.html_url);
      }
    });

    res.status(200).send({ count, repos: listObj });
  } catch (e) {
    res.status(500).send("Error !!!");
  }
});
const port = 7575;

app.listen(port, () => {
  console.log("Server is up on port " + port);
});
