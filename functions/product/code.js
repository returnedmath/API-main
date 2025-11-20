// functions/product/code.js

export async function onRequestPost(context) {
  try {
    const body = await context.request.json();
    const { user, game, product } = body;

    if (!user || !game || !product) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Missing required fields."
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // -----------------------------------------
    // TABLE OF PRODUCT CODES
    // -----------------------------------------
    const productCodeTable = {
      PointOfSale: `
        return function(e)
            print("Brewing coffee…")
            -- do coffee logic
        end
      `,

      Tea: `
        return function(e)
            print("Preparing tea…")
            -- do tea logic
        end
      `,

      Smoothie: `
        return function(e)
            print("Blending smoothie…")
            -- do smoothie logic
        end
      `
    };

    // Find the code
    const code = productCodeTable[product];

    if (!code) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Product not found."
        }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        code: code.trim()
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Invalid JSON or server error."
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

