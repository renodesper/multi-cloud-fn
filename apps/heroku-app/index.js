const express = require("express");
const { postRequest } = require("core");

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  const records = req.body.Records || [req.body];
  const results = [];

  for (const r of records) {
    try {
      const data = typeof r === "string" ? JSON.parse(r) : r;
      const result = await postRequest(data);
      results.push({ success: true, result });
    } catch (err) {
      results.push({ success: false, error: err.message });
    }
  }

  res.status(207).json(results);
});

app.listen(process.env.PORT || 3000);
