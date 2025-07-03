// NOTE: this is the only example that doesn't import core.js file

export default {
  async fetch(request, env, ctx) {
    const body = await request.json();
    const records = body.Records || [body];

    const apiProtocol = env.API_PROTOCOL || "https";
    const apiUrl = env.API_URL || "";
    const apiEndpoint = env.API_ENDPOINT || "";
    const apiKey = env.API_KEY || "";

    const results = [];

    for (const record of records) {
      try {
        const response = await fetch(
          `${apiProtocol}://${apiUrl}${apiEndpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Api-Key": apiKey,
            },
            body: JSON.stringify(record),
          }
        );

        const result = await response.json();
        results.push({ success: true, result });
      } catch (err) {
        results.push({ success: false, error: err.message });
      }
    }

    return new Response(JSON.stringify(results), {
      status: 207,
      headers: { "Content-Type": "application/json" },
    });
  },
};
