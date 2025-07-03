const { postRequest } = require("core");

module.exports = async function (context, req) {
  const records = req.body?.Records || [req.body];
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

  context.res = {
    status: 207,
    headers: { "Content-Type": "application/json" },
    body: results,
  };
};
