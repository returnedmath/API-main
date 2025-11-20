// functions/product/code.js 

export async function onRequestPost(context) {
  try {
    const { env, request } = context;
    const body = await request.json();
    const { user, game, product } = body;

    if (!user || !game || !product) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing required fields." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // -----------------------------------------
    // Fetch the code from KV
    // KV keys are the product names (e.g., "Coffee", "Tea", etc.)
    // -----------------------------------------
    const code = await env.PRODUCT_CODES.get(product);

    if (!code) {
      return new Response(
        JSON.stringify({ success: false, error: "Product not found." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, code: code.trim() }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: "Invalid JSON or server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
