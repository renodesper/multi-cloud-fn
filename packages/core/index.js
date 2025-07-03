exports.postRequest = async (data, env = process.env) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);

  const response = await fetch(
    `${env.API_PROTOCOL}://${env.API_URL}${env.API_ENDPOINT}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Api-Key": env.API_KEY,
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    }
  );

  clearTimeout(timeout);

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP ${response.status}: ${text}`);
  }

  return response.json();
};
