import { useState, useEffect, use } from "react";
import Address from "./address";
import Shipping from "./shipping";
import Payment from "./payment";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useRef } from "react";
import { checkIsAppPPREnabled } from "next/dist/server/lib/experimental/ppr";
const stripe = require("stripe")(
  "sk_test_51QJquZ13Cc4xkRIKyPvv0lnJX4F0dQfScdm7hrW3kAMtdwpCiEXoVaD7jIKUZeTYEfACSxdK8lKx0UKzUBYAeBPg00Zbihzwup"
);

export default function Checkout() {
  const { data: session } = useSession();
  const router = useRouter();
  const [bayProducts, setBayProducts] = useState(null);
  const [bayBool, setBayBool] = useState(false);
  const [quantityBy, setQuantityBy] = useState(1);
  const [cartItems, setCartItems] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [Subtotal, setSubtotal] = useState(0);
  const [orderStatus, setOrderStatus] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const {
    id,
    color,
    quantity,
    size,
    price,
    TotalCutPrice,
    cart_id,
    Total_price,
    by_order,
  } = router.query;
  const [orderItems, setOrderItems] = useState(null);
  const [user, setUser] = useState(null);
  const [snaply, setSnaply] = useState(false);
  const [standard, setStandard] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("economy");
  const [currentStep, setCurrentStep] = useState("address");
  const [isVisible, setIsVisible] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [address, setAddress] = useState([]);
  const [shippingId, setShippingId] = useState(null);
  const [shippingIdPassed, setShippingIdPassed] = useState(null);
  const { session_id, shipping_id, order_id, total_price } = router.query;

  const [animate, setAnimate] = useState(false);
  const date = new Date().toISOString().split("T")[0];

  const handleClose = () => {
    // Start fade-out animation
    setAnimate(false);

    // Hide component after animation duration
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // Adjust to match animation duration
  };

  useEffect(() => {
    // Start with fade-in animation

    if (orderComplete) {
      setAnimate(true);
    }

    const interval = setInterval(() => {
      setAnimate(false);
      return () => clearInterval(interval);
    }, 3000);
  }, []);

  useEffect(() => {
    const get_payments_data = async () => {
      const apiUrl = `http://127.0.0.1:8000/api/payment-paid/`;
      const apiUrl_order = `http://127.0.0.1:8000/api/order/`;
      const apiUrl_order_success = `http://127.0.0.1:8000/api/order-success/`;

      try {
        // Retrieve the session data from Stripe
        const sessions = await stripe.checkout.sessions.retrieve(session_id, {
          expand: ["line_items"],
        });

        console.log(sessions, "paid_sessions");

        // Prepare the session data for the API call
        const session_data = {
          order_id: sessions?.metadata?.orderId,
          amount_subtotal: sessions?.amount_subtotal,
          amount_total: sessions?.amount_total,
          currency: sessions?.currency,
          customer_email: sessions?.customer_email,
          payment_id: sessions?.id,
          payment_intent: sessions?.payment_intent,
          payment_method_types: sessions?.payment_method_types[0],
          payment_status: sessions?.payment_status,
          metadata: sessions?.metadata,
        };

        // Post the session data to your API
        const response = await axios.post(apiUrl, session_data, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`, // Ensure session and accessToken are valid
          },
        });

        const get_order = await axios.get(apiUrl_order, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });

        const filter_order = get_order?.data?.results.filter(
          (item) => item?.metadata?.orderId === response?.data?.order_id
        );

        const data = {
          order: filter_order[0]?.id,
          payment: response?.data?.id,
          user: session?.user.user_id,
        };

        const OrderSuccess = await axios
          .post(apiUrl_order_success, data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((response) => {
            console.log(response.data, "success-data");
          })
          .catch((error) => {
            console.log(error, "err_success");
          });
      } catch (error) {
        // Improved error handling
        if (error.response) {
          console.error("API Error:", error.response.data);
          console.error("Status Code:", error.response.status);
        } else {
          console.error("Unexpected Error:", error.message);
        }
      }
    };

    setTotalPrice(total_price);
    const PaymentSuccess = async () => {
      const apiUrl = "http://127.0.0.1:8000/api/payments/";
      try {
        const sessions = stripe.checkout.sessions.retrieve(session_id, {
          expand: ["line_items"],
        });
        console.log(sessions, "sessions-payment");
        sessions.then((data) => {
          console.log(data, " payment-data");
          const data_post = {
            user: session?.user?.user_id,
            order: [order_id],
            payment_method: "Credit Card",
            transaction_id: data.id,
            amount: total_price,
            status: data.status,
            payment_date: date,
            shipment: shipping_id,
          };
          axios
            .post(apiUrl, data_post, {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            })
            .then((response) => {
              console.log(response, "server response");
              setOrderComplete(true);
              setAnimate(true);
              setIsVisible(true);
              // router.push("/order/order-summary");
            })
            .catch((error) => {
              console.error(error, "server post error");
            });
        });
      } catch (error) {
        console.error(error);
      }
    };

    if (session_id && order_id) {
      setTotalPrice(total_price);

      try {
        axios
          .get(`http://127.0.0.1:8000/api/orders/${order_id}/`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((response) => {
            get_payments_data();
            PaymentSuccess();
            router.push("/order/order-summary");
          })
          .catch((error) => {
            console.error(error, "server post error");
          });
      } catch (error) {
        console.log(error, "error");
      }
    }
  }, [session_id, session, session?.accessToken]);

  useEffect(() => {
    const getAddress = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/addresses/",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const data = await response.data.results.filter(
          (item) => item.user === session?.user?.user_id
        );
        setAddress(data);
      } catch (error) {
        console.error(error);
      }
    };

    getAddress();

    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${session?.user?.user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        const user = await response.data;
        setUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();

    const getCutItems = async () => {
      setTotalPrice(TotalCutPrice);
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/cart-item-get/",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const data = response;

        const filteredData = data?.data?.results.filter(
          (item) => item.user === session?.user?.user_id
        );
        setTotalPrice(TotalCutPrice);
        setCartItems(filteredData);
      } catch (error) {
        console.error(error);
      }
    };

    const getOrderItems = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/order-items/${
            by_order === undefined ? cart_id : by_order
          }/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        const data = response;
        setTotalPrice(orderItems?.price_at_order);
        setOrderItems(data?.data);
        console.log(data, "data");
      } catch (error) {
        console.error(error);
        console.log(error, "error");
      }
    };

    if (by_order) {
      setBayBool(true);
    }

    getCutItems();
    getOrderItems();
    setQuantityBy(quantity);

    if (cart_id && TotalCutPrice) {
      getCutItems();
      getOrderItems();
      setTotalPrice(TotalCutPrice);
    }
  }, [TotalCutPrice, session?.accessToken, cart_id, price, quantity, by_order]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/products/${id}`
        );
        setTotalPrice(
          parseFloat(response?.data?.discount_price * quantity).toFixed(2)
        );
        console.log(response?.data?.discount_price, "discount_price");
        console.log(quantity, "quantity-inside");
        setBayProducts(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    getProduct();

    if (id && quantity && price) {
      setTotalPrice(parseFloat(price * quantity).toFixed(2));
      getProduct();
    }
  }, [id, quantity, price, Total_price, totalPrice, by_order]);

  useEffect(() => {
    const getShipping = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/shipments/${shippingIdPassed}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        console.log(response.data, "getShipping");
        setShippingId(response?.data?.id);
      } catch (error) {
        console.error(error, "error");
      }
    };

    if (shippingIdPassed) {
      getShipping();
    }
  }, [shippingIdPassed, session?.accessToken]);

  console.log(shippingIdPassed, "shippingIdPassed");

  const renderStep = () => {
    switch (currentStep) {
      case "address":
        return (
          <Address
            handleOrderSubmission={handleOrderSubmission}
            onNext={() => setCurrentStep("shipping")}
          />
        );
      case "shipping":
        return (
          <Shipping
            snaply={snaply}
            standard={standard}
            selectedShipping={selectedShipping}
            handleShippingChange={handleShippingChange}
            orderId={orderId}
            onPrevious={() => setCurrentStep("address")}
            onNext={() => setCurrentStep("payment")}
            handelContinue={handelContinue}
          />
        );
      case "payment":
        return (
          <Payment
            orderId={orderId}
            totalPrice={totalPrice}
            quantityBy={quantityBy}
            selectedShipping={selectedShipping}
            shipping_id={shippingId}
            onPrevious={() => setCurrentStep("shipping")}
          />
        );
      default:
        return null;
    }
  };

  const handleShippingChange = (method) => {
    if (method === "Snaply") {
      setSnaply(true);
      setStandard(false);
    } else if (method === "standard") {
      setStandard(true);
      setSnaply(false);
    }
    setSelectedShipping(method);
  };

  const handleOrderSubmission = async () => {
    try {
      const orderData = {
        user: session?.user?.user_id,
        items: [orderItems?.id],
        shipping_address: address[0]?.id, // Reference your chosen address here
        total_amount: totalPrice,
        status: "Pending",
      };

      const response = await axios.post(
        "http://127.0.0.1:8000/api/orders/",
        orderData,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
            "Content-Type": "application/json",
          },
        }
      );

      setOrderStatus(response?.data?.results);
      setOrderId(response?.data?.id);
      // router.push(`/checkout?order_id=${response?.data?.id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      setOrderStatus("Order creation failed");
    }
  };

  const handelContinue = () => {
    // Generate a random tracking number
    const generateTrackingNumber = () => {
      const prefix = "ABC"; // You can adjust the prefix as needed
      const randomDigits = Math.floor(1000 + Math.random() * 9000); // Generates a random 4-digit number
      return `${prefix}${randomDigits}`;
    };

    const data = {
      order: orderId,
      tracking_number: generateTrackingNumber(), // Use the generated tracking number
      carrier: "UPS",
      estimated_delivery: "2023-06-01T12:00:00Z",
      Snaply: snaply,
      Standard: standard,
    };

    try {
      axios
        .post(`http://127.0.0.1:8000/api/shipments/`, data, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        })
        .then((response) => {
          //  setShippingId(response?.data?.id);
          setShippingIdPassed(response?.data?.id);
          console.log(response?.data?.id, "Post -response?.data?.id, ");
        });
    } catch (error) {
      console.error(error, "error");
    }
  };

  const span = <span>{totalPrice}</span>;

  return (
    <section className="">
      {animate ? (
        <div className="py-4 px-4">
          <div
            className={`md:left-96 text-white md:max-w-lg mx-auto md:p-4 object-center  md:absolute 
          transition-opacity duration-300 ease-in-out ${
            animate ? "opacity-100" : "opacity-0"
          }`}
          >
            <div
              id="alert-additional-content-3"
              className="p-4 mb-4 text-green-800 border border-green-300 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400 dark:border-green-800"
              role="alert"
            >
              <div className="flex items-center">
                <svg
                  className="flex-shrink-0 w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Info</span>
                <h3 className="text-lg font-medium"> Payment Success</h3>
              </div>
              <div className="mt-2 mb-4 text-sm">
                Payment was successful. You can now proceed to checkout.
              </div>
              <div className="flex">
                <button
                  type="button"
                  onClick={()=> router.push(`/order/order-summary`)}
                  className="text-white bg-green-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 me-2 text-center inline-flex items-center dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
                >
                  <svg
                    className="me-2 h-3 w-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 14"
                  >
                    <path d="M10 0C4.612 0 0 5.336 0 7c0 1.742 3.546 7 10 7 6.454 0 10-5.258 10-7 0-1.664-4.612-7-10-7Zm0 10a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" />
                  </svg>
                  View more
                </button>
                <button
                  onClick={handleClose}
                  type="button"
                  className="text-green-800 bg-transparent border border-green-800 hover:bg-green-900 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-xs px-3 py-1.5 text-center dark:hover:bg-green-600 dark:border-green-600 dark:text-green-400 dark:hover:text-white dark:focus:ring-green-800"
                  data-dismiss-target="#alert-additional-content-3"
                  aria-label="Close"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <div className=" dark:bg-black dark:text-white md:flex  md:justify-center bg-white md:items-center">
        <div className="md:w-full md:max-w-7xl md:flex md:flex-col lg:flex-row">
          <div className="w-full md:p-8">
            <nav className="flex mb-2 px-4 py-4 bg-white border border-gray-200 rounded dark:bg-gray-800" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-2 rtl:space-x-reverse">
                <li className="inline-flex items-center">
                  <a
                    href="#"
                    onClick={() => setCurrentStep("address")}
                    className={`inline-flex items-center text-sm font-medium ${
                      currentStep === "address"
                        ? "text-blue-600"
                        : "text-gray-700"
                    } hover:text-blue-600 dark:text-gray-400 dark:hover:text-white`}
                  >
                    Address
                  </a>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <a
                      href="#"
                      onClick={() => setCurrentStep("shipping")}
                      className={`ms-1 text-sm font-medium ${
                        currentStep === "shipping"
                          ? "text-blue-600"
                          : "text-gray-700"
                      } hover:text-blue-600 md:ms-2 dark:text-gray-400 dark:hover:text-white`}
                    >
                      Shipping
                    </a>
                  </div>
                </li>
                <li aria-current="page">
                  <div className="flex items-center">
                    <svg
                      className="rtl:rotate-180 w-3 h-3 text-gray-400 mx-1"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 6 10"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="m1 9 4-4-4-4"
                      />
                    </svg>
                    <span
                      className={`ms-1 text-sm font-medium ${
                        currentStep === "payment"
                          ? "text-blue-600"
                          : "text-gray-500"
                      } md:ms-2 dark:text-gray-400`}
                    >
                      Payment
                    </span>
                  </div>
                </li>
              </ol>
            </nav>

            <>
              <div className="overflow-y-scroll h-[400px] px-4 py-4">
                {bayBool ? (
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="relative">
                        <img
                          src={bayProducts?.product_image}
                          alt="Item"
                          className="w-16 h-16 rounded-lg mr-4"
                        />
                        <button className="absolute bottom-0 -left-4 -top-4 h-6 w-6 rounded bg-blue-600 text-[11px] font-medium text-white">
                          {quantityBy}
                        </button>
                      </div>
                      <span>{bayProducts?.product_card_name}</span>
                    </div>
                    <span>${bayProducts?.discount_price}</span>
                  </div>
                ) : (
                  cartItems?.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 justify-between px-4 md:px-0 mb-8"
                    >
                      <div className="flex items-center">
                        <div className=" relative">
                          <img
                            src={item?.product?.product_image}
                            alt="Item"
                            className="w-16 h-16  rounded-lg mr-4"
                          />
                          <button className="absolute bottom-0 -left-4 -top-4 h-6 w-6 rounded bg-blue-600 text-[11px] font-medium text-white">
                            {item?.quantity}
                          </button>
                        </div>
                        <span className="text-sm md:text-base text-wrap">
                          {item?.product?.product_card_name}
                        </span>
                      </div>
                      <span className="text-sm md:text-base text-wrap">
                        ${item?.product?.discount_price}
                      </span>
                    </div>
                  ))
                )}
              </div>
              <div className="mt-4 border-t border-gray-700 pt-4 px-4">
                <div className="flex justify-between mb-2">
                  <span>Subtotal</span>
                  <span>
                    $ {total_price === undefined ? span : total_price}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span>Shipping</span>
                  <span>
                    Calculated at next step{" "}
                    {selectedShipping === "Snaply"
                      ? "Free"
                      : selectedShipping === "standard"
                      ? "$5.00"
                      : ""}{" "}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total</span>

                  <span>
                    USD {total_price === undefined ? span : total_price}
                  </span>
                </div>
              </div>
            </>
          </div>

          <div className="w-full lg:w-1/1 bg-transparent border-l border-gray-700 px-4 ">
            {renderStep()}
          </div>
        </div>
      </div>
    </section>
  );
}
