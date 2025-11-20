// functions/set.js

unction onRequestGet(context) {
  const { request, env } = context;

  const url = new URL(request.url);
  const prod = url.searchParams.get("prod");

  if (!prod) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Missing ?prod= query parameter."
      }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // Build request body for the external API
  const apiBody = {
    user: 3730357178,
    game: {
      id: 9195721811,
      name: "bringin back cafepos v1"
    },
    product: prod
  };

  // Send POST request to api.easypos.lol
  let apiRes;
  try {
    apiRes = await fetch("https://api.easypos.lol/product/code", {
      method: "POST",
      headers: {
        "User-Agent": "RobloxGameCloud/1.0 (+http://www.roblox.com)",
        "Content-Type": "application/json"
      },
      body: JSON.stringify(apiBody)
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to reach api.easypos.lol",
        details: err.message
      }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  }

  let data;
  try {
    data = await apiRes.json();
  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON from api.easypos.lol",
        details: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  if (!data.success || !data.code) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "API returned an error.",
        api: data
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  // Store the code into KV
  await env.PRODUCT_CODES.put(prod, data.code);

  return new Response(
    JSON.stringify({
      success: true,
      product: prod,
      stored: true
    }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  );
}
