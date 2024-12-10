




// import Stripe from "stripe";

// const stripe = Stripe("sk_test_51QJquZ13Cc4xkRIKyPvv0lnJX4F0dQfScdm7hrW3kAMtdwpCiEXoVaD7jIKUZeTYEfACSxdK8lKx0UKzUBYAeBPg00Zbihzwup");

// const host = process.env.NEXT_PUBLIC_HOST;

// export default async function handler(req, res) {
//   const { method, body } = req;

//   if (method === "POST") {
//     try {
//       const { shipping_id, orderId, amount } = body;
//       const session = await stripe.checkout.sessions.create({
//         payment_method_types: ["card"],
//         line_items: [
          
//           {
//             price_data: {
//               currency: "usd",
//               product_data: {
           
//                 name: `Order ${orderId}`,
//                 images : [

//                   'https://th.bing.com/th/id/R.8fdb5f4623f7cd118e472a7c713b6652?rik=4J4EDPZ6dPiZWw&pid=ImgRaw&r=0'

//                 ]
//               },
//               unit_amount: amount * 100, // Convert to cents
//             },
//             quantity: 1,
//           },
//         ],
//         mode: "payment",
//         success_url: `${host}/checkout?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&total_price=${amount}&shipping_id=${shipping_id}`,
//         cancel_url: `${host}/checkout`,
//       });

//       res.status(200).json({sessionId: session.id});
//     } catch (err) {
//       console.error("Error creating Stripe session:", err);
//       res.status(500).json({ error: "Error creating Stripe session" });
//     }
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// }



import Stripe from "stripe";

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const host = process.env.NEXT_PUBLIC_HOST;

export default async function handler(req, res) {
  const { method, body } = req;

  if (method === "POST") {
    try {
      const {
        products, // Array of products with details
        orderId,
        shipping_id,
        amount,
        customerEmail, // Customer email
        metadata, // Additional metadata for the session
      } = body;

      // Validate inputs
      if (
        !Array.isArray(products) ||
        products.length === 0 ||
        !customerEmail  || 
        !shipping_id  || 
        !orderId || 
        !amount || 
        !metadata

      ) {
        return res.status(400).json({ error: "Invalid request data" });
      }

      // Format line items
      const line_items = products.map((product) => ({
        price_data: {
          currency: product.currency || "usd",
          product_data: {
            name: product.name,
            description: product.description,
            images: product.images?.slice(0, 8) || [],
            metadata: product.metadata || {}, // Product-specific metadata
          },
          unit_amount: Math.round(product.price * 100), // Convert price to cents
        },
        quantity: product.quantity || 1,
      }));

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items, // Pass formatted line items
        mode: "payment", // Specify payment mode
        customer_email: customerEmail, // Optional: Customer email
        shipping_address_collection: {
          allowed_countries: ["US", "CA", "GB",'BD'], // Limit shipping to specific countries
        },
        shipping_options: [
          {
            shipping_rate_data: {
              type: "fixed_amount",
              fixed_amount: {
                amount: 500, // Shipping cost in cents
                currency: "usd",
              },
              display_name: "Standard Shipping",
              delivery_estimate: {
                minimum: { unit: "business_day", value: 3 },
                maximum: { unit: "business_day", value: 5 },
              },
            },
          },
        ],
        // automatic_tax: { enabled: true }, // Automatically calculate tax
        metadata, // Optional metadata
        success_url: `${host}/checkout?session_id={CHECKOUT_SESSION_ID}&order_id=${orderId}&total_price=${amount}&shipping_id=${shipping_id}`,
        cancel_url: `${host}/checkout/cancel`,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err) {
      console.error("Error creating Stripe session:", err.message);
      res.status(500).json({ error: "Error creating Stripe session" });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
}
