import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import OrderList from "./OrderList";
export default function OrderSummary() {
  const [payments, setPayments] = useState([]);
  const [order, setOrder] = useState([]);
  const { data: session } = useSession();
  const [get_order, set_get_order] = useState([]);
  const [get_product, set_get_product] = useState([]);
  const [get_itemId, set_get_itemId] = useState([]);
  const [get_items, set_get_items] = useState([]);
  const [get_order_success, set_get_order_success] = useState([]);

  useEffect(() => {
    const getPaymentStatus = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/payments_get/",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        const filterOrder = response?.data?.results.filter(
          (item) => item.user === session?.user?.user_id
        );

        setPayments(filterOrder);

        const data_display = [];

        filterOrder?.forEach((payment) => {
          payment?.order?.forEach((orderItem) => {
            orderItem?.items?.forEach((item) => {
              item?.cart_item?.forEach((cartItem) => {
                cartItem?.product?.product_details?.forEach((details) => {
                  data_display.push({
                    payment_date: payment.payment_date,
                    payment_method: payment.payment_method,
                    payment_status: payment.status,
                    total_amount: cartItem.cart_total_item_price,
                    tracking_number: payment.shipment?.tracking_number,
                    shipped_at: payment.shipment?.shipped_at,
                    delivered_at: payment.shipment?.delivered_at,
                    estimated_delivery: payment.shipment?.estimated_delivery,
                    Snaply: payment.shipment?.Snaply,
                    Standard: payment.shipment?.Standard,
                    shipping_address: orderItem?.items.shipping_address,
                    quantity: cartItem?.quantity,
                    product_id: cartItem?.product.id,
                    product_name: cartItem?.product.product_card_name,
                    product_image: cartItem.product.product_image,
                    color: details.color,
                    size: details.size,
                  });
                });
              });
            });
          });
        });
        set_get_items(data_display);

        console.log(data_display, "data_display");
      } catch (error) {
        console.error(error);
      }
    };

    const get_order_success = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/order-success-get/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        const filter_order = response?.data?.results.filter(
          (item) => item.user === session.user.user_id
        );

        function convertToBangladeshTime(timestamp) {
          const utcTimestamp = new Date(timestamp);
          console.log(utcTimestamp, "utcTimestamp");
          return utcTimestamp.toLocaleString("en-US", {
            timeZone: "Asia/Dhaka",
          });
        }


        function removeLastTwoZeros(number) {
          return Math.floor(number / 100);
      }



        const data_display = [];
        filter_order?.forEach((item) => {
          item?.order?.items?.forEach((orderItem) => {
            data_display.push({
              id: item.id,
              created_at: convertToBangladeshTime(item.created_at),
              amount_subtotal: removeLastTwoZeros(item.payment.amount_subtotal),
              amount_total: removeLastTwoZeros(item.payment.amount_total),
              currency: item.payment.currency,
              customer_email: item.payment.customer_email,
              order_id: item.payment.order_id,
              payment_created: item.payment.id,
              payment_intent: item.payment.payment_intent,
              payment_method_types: item.payment.payment_method_types,
              payment_status: item.payment.payment_status,
              metadata: item.payment.metadata,
              items: {
                items_id: orderItem.id,
                product: {
                  id: orderItem.product.id,
                  name: orderItem.product.name,
                  description: orderItem.product.description,
                  quantity: orderItem.product.quantity,
                  images: orderItem.product.images[0],
                  price: orderItem.product.price,
                  currency: orderItem.product.currency,
                  metadata: orderItem.product.metadata,
                },
              },
            });
          });
        });

      set_get_items(data_display);
      } catch (error) {
        console.log(error, "error");
      }
    };

    get_order_success();
  }, [session?.accessToken, session]);

  console.log(get_items, "get_items");

  return (
    <div div className="dark:bg-black/85 bg-white " >
      <OrderList  get_items={get_items} />
    </div>
  );
}


1200