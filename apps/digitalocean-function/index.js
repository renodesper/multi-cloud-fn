const { postRequest } = require("core");

exports.main = async function (params) {
  const records = params.Records || [params];
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
    body: results,
  };
};
