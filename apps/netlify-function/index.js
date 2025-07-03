const { postRequest } = require("core");

exports.handler = async (event, ctx) => {
  const input = JSON.parse(event.body || "{}");
  const records = input.Records || [input];
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

  return {
    statusCode: 207,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(results),
  };
};
