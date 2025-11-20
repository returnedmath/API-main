// functions/set.js

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json();
    const { product, code } = body;

    if (!product || !code) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing 'product' or 'code' in body."
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Write code to KV using the product name as the key
    await env.PRODUCT_CODES.put(product, code);

    return new Response(
      JSON.stringify({
        success: true,
        message: `Stored code for product '${product}'.`
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON or server error.",
        details: err.message
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
