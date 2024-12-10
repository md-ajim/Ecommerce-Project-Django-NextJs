import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";

// Ensure Stripe is initialized once
const asyncStripe = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const CheckoutButton = ({ amount, orderId, shipping_id }) => {
  const router = useRouter();
  const [order_data, setOrder_data] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      order();
    }
  }, [session]);
  const order = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/api/get_order/", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      const currentUserOrder = response?.data?.results?.filter(
        (item) => item.user === session?.user?.user_id
      );

      const filter_orderId = currentUserOrder?.filter(
        (item) => item.id === orderId
      );

      const data_display = [];


      if (filter_orderId.length > 1) {
        
      filter_orderId?.forEach((orderItem) => {
        orderItem?.items?.forEach((item) => {
          item?.cart_item?.forEach((cartItem) => {
            cartItem?.product?.product_details?.forEach((details) => {
              data_display.push({
                items: [
                  {
                    product: {
                      name: cartItem.product.product_card_name,
                      description: details.description || cartItem.product.name,
                      quantity: cartItem.quantity,
                      images: [cartItem.product.product_image],
                      price: cartItem.product.discount_price,
                      currency: "usd",
                      metadata: { size: details.size, color: cartItem.color },
                    },
                    quantity: cartItem.quantity,
                  },
                ],
              });
            });
          });
        });
      });
      }
      else{
      filter_orderId?.forEach((orderItem) => {
        orderItem?.items?.forEach((item) => {
          item?.products?.forEach((product) => {
            product?.product_details?.forEach((details) => {
              data_display.push({
                items: [
                  {
                    product: {
                      name: product.product_card_name,
                      description: details.description || product.name,
                      quantity: product.quantity,
                      images: [product.product_image],
                      price: product.discount_price,
                      currency: "usd",
                      metadata: { size: details.size, color: details.color },
                    },
                    quantity: product.stock_quantity,
                  },
                ],
              });
            });
          });
        });
      });

      }






      setOrder_data(data_display);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handler = async () => {
    const generateTrackingNumber = () => {
      const prefix = "ABC"; // You can adjust the prefix as needed
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
      return `${prefix}${randomDigits}`;
    };

    const data = {
      customer_email: "customer@example.com",
      tax_rate_id: "txr_1EY6v2IyNTgGDV5uXyR9GVzF",
      metadata: {
        orderId: generateTrackingNumber(),
        promoCode: "DISCOUNT10",
      },

      items: order_data.map((item) => ({
        product: {
          name: item.items[0].product.name,
          description: item.items[0].product.description,
          quantity: item.items[0].quantity,
          images: item.items[0].product.images,
          price: item.items[0].product.price,
          currency: "usd",
          metadata: item.items[0].product.metadata,
        },
        quantity: item.items[0].quantity,
      })),
    };
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/order/",
        data,

        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      if (response.data) {
        function decimalToInteger(decimalNumber) {
          return Math.floor(decimalNumber);
        }

        function convertOutputToInput(outputData) {
          return {
            products: outputData.items.map((item) => ({
              name: item.product.name,
              description: item.product.description,
              images: item.product.images,
              price: decimalToInteger(item.product.price),
              quantity: item.quantity,
              currency: item.product.currency,
              metadata: item.product.metadata || {}, // Default to empty object if metadata is missing
            })),
            customerEmail: outputData.customer_email,
            taxRateId: outputData.tax_rate_id,
            metadata: outputData.metadata,
          };
        }

        const input = convertOutputToInput(response.data);
        const { products, customerEmail, taxRateId, metadata } = input;

        console.log("input", input);
        console.log("products", products);
        console.log("customerEmail", customerEmail);
        console.log("taxRateId", taxRateId);
        console.log("metadata", metadata);

        const stripe = await asyncStripe;

        const res = await fetch("/api/stripe/session", {
          method: "POST",
          body: JSON.stringify({
            products,
            customerEmail,
            orderId,
            shipping_id,
            amount,
            metadata,
          }),
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(
            errorData.error || "Failed to create Stripe session."
          );
        }
        const { sessionId } = await res.json();

        if (!sessionId) {
          throw new Error("Session ID is missing.");
        }
        const { error } = await stripe.redirectToCheckout({ sessionId });

        if (error) {
          throw new Error(error.message);
        }

        console.log("Redirecting to Stripe checkout...");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  console.log(order_data, "order_data");

  return (
    <button
      onClick={handler}
      className="bg-blue-700 hover:bg-blue-800 duration-200 px-8 py-4 rounded-lg text-white"
    >
      Checkout
    </button>
  );
};

export default CheckoutButton;
