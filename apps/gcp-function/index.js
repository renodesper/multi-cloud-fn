const { postRequest } = require("core");

exports.handler = async (req, res) => {
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
};
