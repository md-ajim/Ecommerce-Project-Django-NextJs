import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";
import UserDropdown from "./UserDropdown";
import { useSession, signOut } from "next-auth/react";

import ModelFormSignIn from "./form/ModelFormSignIn";
import { Button, user } from "@nextui-org/react";

import { useEffect } from "react";

import axios from "axios";
import ModelFormSignIn2 from "./form/ModelFormSignIn2";
export default function Navbar() {
  const router = useRouter();

  const [sidebarOpen, setSidebarOpen] = useState(false); // state for mobile sidebar
  const [cartOpen, setCartOpen] = useState(false); // state for cart sidebar
  const [isHovering, setIsHovering] = useState(false);
  const [search, setSearch] = useState("");
  const [modelFormShow, setModelFormShow] = useState(false);
  const [data, setData] = useState(null);
  const [cutItem, setCutItem] = useState(null);
  const [cutItemLength, setCutItemLength] = useState(null);
  const [totalItemPrice, setTotalItemPrice] = useState(0);
  const [quantityItem, setQuantityItem] = useState(0);
  const [itemQuantities, setItemQuantities] = useState({});
  const [ids, setIds] = useState([]);
  const [totalCutItemPrice, setTotalCutItemPrice] = useState(0);
  const { data: session } = useSession();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const calculatedTotalPrice = Object.values(itemQuantities).reduce(
      (sum, item) => {
        return sum + parseFloat(item.totalPrice || 0);
      },
      0
    );





    setTotalItemPrice(calculatedTotalPrice.toFixed(2));

    fetchData();
  }, [session, session?.accessToken, totalCutItemPrice, itemQuantities]);

  const fetchData = async () => {
    try {
      const response = axios.get("http://127.0.0.1:8000/api/cart-item-get/", {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });
      const data = await response;

      const filteredData = data?.data?.results.filter(
        (item) => item.user === session?.user?.user_id
      );
      setCutItem(filteredData);

      if (filteredData.length > 0) {
        setCutItemLength(filteredData.length);

        const dataFilterQuantity = filteredData.map((item) => {
          return item?.quantity;
        });
        const quantityItem = dataFilterQuantity.reduce((a, b) => a + b, 0);
        setQuantityItem(quantityItem);
        const dataFilterPrice = filteredData.map((item) => {
          return parseFloat(
            item?.cart_total_item_price === null
              ? item.product?.discount_price
              : item?.cart_total_item_price
          );
        });
        const arr = dataFilterPrice;
        console.log(arr, "arr");
        const totalCutItemPrice = arr.reduce((a, b) => a + b, 0);
        setTotalCutItemPrice(totalCutItemPrice.toFixed(2));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen); // toggle for cart sidebar
  };

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    const timeOut = setTimeout(() => {
      setIsHovering(false);
    }, 8000);
  };

  const handleSearch = () => {
    event.preventDefault();
    router.push(`/search?q=${search}`);
  };

  const addQueryParam = () => {
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, signIn: "true" },
      },
      undefined,
      { shallow: true }
    );
  };

  const handleCartItemDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/cart-items/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      const data = response;
      console.log(data);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };
  const handleCounterQuantityIncrement = async (
    id,
    product_id,
    cart,
    quantity,
    discount_price
  ) => {
    setItemQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id]?.quantity || quantity;
      const newQuantity = currentQuantity + 1;
      const newTotalPrice = (newQuantity * discount_price).toFixed(2);

      const updatedQuantities = {
        ...prevQuantities,
        [id]: { quantity: newQuantity, totalPrice: newTotalPrice },
      };

      console.log(updatedQuantities, 'updatedQuantities')

      // Make API call
      axios
        .put(
          `http://127.0.0.1:8000/api/cart-items/${id}/`,
          {
            cart,
            quantity: newQuantity,
            user: session?.user?.user_id,
            product: product_id,
            cart_total_item_price: newTotalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        )
        .catch((error) => console.error(error));

      return fetchData();
    });
  };

  const handleCounterQuantityDecrement = async (
    id,
    product_id,
    cart,
    quantity,
    discount_price
  ) => {
    setItemQuantities((prevQuantities) => {
      const currentQuantity = prevQuantities[id]?.quantity || quantity;
      if (currentQuantity <= 1) return prevQuantities; // Prevent going below 1

      const newQuantity = currentQuantity - 1;
      const newTotalPrice = (newQuantity * discount_price).toFixed(2);

      const updatedQuantities = {
        ...prevQuantities,
        [id]: { quantity: newQuantity, totalPrice: newTotalPrice },
      };

      // Make API call
      axios
        .put(
          `http://127.0.0.1:8000/api/cart-items/${id}/`,
          {
            cart,
            quantity: newQuantity,
            user: session?.user?.user_id,
            product: product_id,
            cart_total_item_price: newTotalPrice,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        )
        .catch((error) => console.error(error));
      // updatedQuantities;

      return fetchData();
    });
  };

  const handleCheckout = async () => {


    const ItemId = cutItem?.map((item) => {
      return item.id;
    });

    console.log(ItemId, 'ItemId')

    const quantityFilter = cutItem?.map((item) => {
      return item.quantity;
    });

    const data = {
      products: cutItem?.map((item) => {
        return item.product.id
      }),
      cart_item: ItemId,
      quantity: quantityItem,
      price_at_order: totalCutItemPrice,
    };

    try {
      const response = await axios.post(
        `http://127.0.0.1:8000/api/order-items/`,
        data,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      router.push(
        `/checkout?cart_id=${response?.data?.id}&TotalCutPrice=${totalCutItemPrice}&quantity=${quantityItem}`
      );

      console.log(response.data, 'response data')
    } catch (error) {
      console.error(error);
    }
  };

  const span = <span className="text-blue-600 ">{totalCutItemPrice}</span>;


  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  // Effect to handle theme change and save preference
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Load saved theme preference from local storage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);


  return (
    <>
      {/* Navbar */}

      <nav className="w-full top-0  relative z-10   backdrop-blur dark:bg-black/85   rounded-none  text-black    dark:text-white">
        <div className="mx-auto px-4 md:px-0 lg:px-0 container">
          <div className="flex h-16 items-center justify-between ">


            {/* Mobile Menu Button */}
            <button
              onClick={toggleSidebar}
              className="mr-4 md:hidden    dark:text-white    dark:bg-black border border-gray-500 rounded-lg p-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 5.25h16.5m-16.5 6h16.5m-16.5 6h16.5"
                />
              </svg>
            </button>

            {/* Logo */}
            <div className="flex items-center md:gap-4 ">
              <Link href="http://localhost:3000/">
                <div className="flex-shrink-0 flex gap-4 dark:bg-black border   border-gray-500 rounded-lg  p-2">
                  <img
                    className="h-9 w-9 rounded-lg"
                    src="/logo.png"
                    alt="Your Company"
                  />
                </div>
              </Link>

              {/* Desktop Links */}

              <div className="hidden md:flex gap-4 justify-center items-center text-balance   text-black">
                <Link
                  href="/search/?product=all"
                  className=" dark:text-white   hover:text-indigo-600"
                >
                  All
                </Link>
                <Link
                  href="/search/?category=Hoodies"
                  className="dark:text-white  hover:text-indigo-600"
                >
                  Hoodies
                </Link>
                <Link
                  href="/search/?category=Accessories"
                  className="dark:text-white  hover:text-indigo-600"
                >
                  Accessories
                </Link>
                <Link
                  href="/search/?category=Shoes"
                  className="dark:text-white  hover:text-indigo-600"
                >
                  Shoes
                </Link>
              </div>
            </div>







            {/*  desktop Search Bar */}

            <div className="p-4 hidden md:flex items-center relative">
              <form className=" " onSubmit={handleSearch}>
                <label className="input bg-white input-bordered dark:bg-black flex items-center gap-2">
                  <input
                    onChange={(e) => setSearch(e.target.value)}
                    type="text"
                    value={search}
                    className="grow"
                    placeholder="Search For Products..."
                  />
                  <kbd className=" kbd-sm">
                    {" "}
                    <svg
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                      width="19.9"
                      height="19.7"
                      viewBox="0 0 19.9 19.7"
                    >
                      <g className="search-path" fill="none" stroke="#848F91">
                        <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                        <circle cx="8" cy="8" r="7" />
                      </g>
                    </svg>
                  </kbd>
                  <kbd className="kbd kbd-sm">K</kbd>
                </label>
              </form>
            </div>


            {/* Cart Icon */}
            <div className="flex gap-4  items-center ">
              {session ? (
                <UserDropdown />
              ) : (
                <ModelFormSignIn className=" p-2  text-black dark:text-white  relative rounded-lg  border border-gray-500"></ModelFormSignIn>
              )}

              <button
                onClick={toggleCart}
                className=" dark:bg-black p-2 text-black  dark:text-white    relative rounded-lg  border border-gray-500"
              >
                {cutItem ? (
                  <div class="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white">
                    {cutItem?.length}
                  </div>
                ) : (
                  ""
                )}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
              </button>


              <div
                onClick={toggleDarkMode}
                className="hidden md:block   items-center  relative"
              >
                {darkMode ? (
                  <button className="dark:bg-black p-2 px-2  relative rounded-lg  border border-gray-500">
                    <svg
                      className="swap-on h-6 w-6 fill-current inline  "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
                    </svg>
                  </button>
                ) : (
                  <button className="dark:bg-black p-2 px-2  relative rounded-lg  border border-gray-500">
                    <svg
                      className="swap-off h-6 w-6 fill-current inline  "
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
                    </svg>
                  </button>
                )}
              </div>


            </div>


          </div>
        </div>
      </nav>

      {/* Sidebar for Mobile Menu */}
      <div
        className={`fixed top-0 left-0 h-full w-full dark:bg-black   bg-gray-200  dark:text-black  transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-20 md:hidden`}
      >
        {/* Close Button */}
        <div className="flex justify-between  p-4">
          <button
            onClick={toggleSidebar}
            className="dark:text-white   text-black border border-gray-500 p-2 rounded-lg "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>


        {/* Search Bar (Mobile View) */}
        <div className="p-4 relative">
          <form onSubmit={handleSearch}>
            <label className="absolute inset-y-0  dark:text-white    right-0 flex items-center pr-6">

              <svg
                className="w-5 h-5  dark:text-white  "
                xmlns="http://www.w3.org/2000/svg"
                width="19.9"
                height="19.7"
                viewBox="0 0 19.9 19.7"
              >
                <g className="search-path dark:text-white" fill="none" stroke="#848F91">
                  <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                  <circle cx="8" cy="8" r="7" />
                </g>
              </svg>

            </label>
            <input
              onChange={(e) => setSearch(e.target.value)}
              type="text"
              value={search}
              placeholder="Search for products..."
              className="w-full p-2 pr-10    input bg-white input-bordered dark:bg-black dark:text-white dark:border-gray-600  rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none "
            />

          </form>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 p-4 dark:text-white ">
          <Link href="/search/?product=all" className="hover:text-blue-700">
            All
          </Link>
          <Link href="/search/?category=Shoes" className="hover:text-blue-700">
            Shoes
          </Link>
          <Link
            href="/search/?category=Accessories"
            className="hover:text-blue-700"
          >
            Accessories
          </Link>
          <Link
            href="/search/?category=Clothing"
            className="hover:text-blue-700"
          >
            Clothing
          </Link>

          {!session && (
            <div className="">
              <ModelFormSignIn2 />
            </div>
          )}
        </nav>
      </div>


      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[500px]   bg-gray-200 border-gray-500  rounded-lg  dark:bg-black transform ${cartOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out z-30`}
      >
        <div className="flex justify-between p-4">
          <h2 className="text-lg dark:text-white font-semibold text-gray-700">My Cart</h2>
          <button
            className=" border  dark:bg-black dark:text-white text-black  border-gray-500   rounded-lg p-2"
            onClick={toggleCart}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Cart Content */}
        <div className="md:p-4 px-4  md:space-y-4 backdrop-blur       dark:bg-black/85 ">
          {/* Product List */}
          <div className="flex flex-col w-full  space-y-4 overflow-y-auto h-[60vh] backdrop-blur  dark:bg-black/30  rounded-lg">
            {/* Product Items */}
            {cutItem?.length > 0 ? (
              cutItem?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center gap-4  dark:text-white dark:bg-gray-900 bg-white/50 backdrop-blur-md py-2 px-4 rounded-md"
                >
                  <div className="relative  ">
                    <div className="w-20 h-20  border bg-white/5  border-white/10  rounded-md">
                      <img
                        src={item?.product?.product_image}
                        alt="product"
                        className="w-full h-full object-cover   "
                      />
                    </div>
                    <button
                      onClick={() => handleCartItemDelete(item?.id)}
                      className=" dark:hover:text-white focus:outline-none bg-white/50  backdrop-blur-md    rounded-full absolute  -top-2 -left-2 "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-grow w-full">
                    <h3 className="text-sm font-medium">
                      {item?.product?.product_card_name}
                    </h3>
                    <p className="text-sm text-gray-400">
                      {itemQuantities[item.id]?.totalPrice ||
                        item?.product?.discount_price}{" "}
                      USD
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        handleCounterQuantityDecrement(
                          item?.id,
                          item?.product?.id,
                          item?.cart,
                          item?.quantity,
                          item?.product?.discount_price
                        )
                      }
                      type="button"
                      className="text-gray-400 hover:text-gray-300   focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 12h14"
                        />
                      </svg>
                    </button>
                    <span className="text-sm font-medium">
                      {itemQuantities[item.id]?.quantity || item.quantity}
                    </span>
                    <button
                      onClick={() =>
                        handleCounterQuantityIncrement(
                          item?.id,
                          item?.product?.id,
                          item?.cart,
                          item?.quantity,
                          item?.product?.discount_price
                        )
                      }
                      type="button"
                      className="text-gray-400 hover:text-gray-300 focus:outline-none"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-5 h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center h-full">
                <p className="text-gray-400">No items in the cart</p>
              </div>
            )}
          </div>

          {/* Footer Section */}
          <div className="pt-4 border-t dark:text-white border-gray-700">
            <div className="flex justify-between text-sm  text-gray-400 mb-4">
              <span className="text-gray-700 dark:text-white ">Taxes</span>
              <span className="text-blue-600  font-bold" >5.00 USD</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400 mb-4">
              <span className="text-gray-700 dark:text-white" >Shipping</span>
              <span className="text-gray-700 dark:text-white font-bold" >Calculated at checkout</span>
            </div>
            <div className="flex justify-between font-bold text-lg mb-4 ">
              <span className="text-gray-700 dark:text-white ">Total</span>
              <h2 className="text-blue-600  "> {span} USD</h2>
            </div>
            <button
              onClick={handleCheckout}
              className="mt-4 w-full bg-blue-600  py-2 rounded-lg"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}


