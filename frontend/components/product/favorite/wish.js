import React from "react";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { HeartIcon } from "./heartIcon";
import Link from "next/link";

function Favorites() {
  const [favorite, setFavorite] = useState([]);
  const [cutItem, setCutItem] = useState(null);
  const [cutsAlertMassage, setCutsAlertMassage] = useState(false);
  const [alreadyExisting, setAlreadyExisting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/products/",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        setData(response?.data?.results);
        return response?.data?.results;
      } catch (error) {
        console.error(error);
        return null;
      }
    };

    fetchData();

    const getCartItems = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/cart-items/",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const user_cartItem = response?.data?.results.filter(
          (item) => item.user === session?.user?.user_id
        );
        setCutItem(user_cartItem);
      } catch (error) {
        console.log(error);
      }
    };

    getCartItems();

    const get_favorite = async () => {
      try {
        const response = await axios.get(
          "http://127.0.0.1:8000/api/favorite/",
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        setFavorite(response?.data?.results);
      } catch (error) {
        console.log(error);
      } finally {
      }
    };

    get_favorite();
  }, [session]);

  const handleAddToCart = async ({ id }) => {
    setIsLoading(true);

    const currentProduct = data?.find((items) => items.id === id);
    if (currentProduct) {
      const existingCartItem = cutItem?.find((item) => item.product === id);

      if (existingCartItem?.product !== id) {
        try {
          const cartResponse = await axios.post(
            "http://127.0.0.1:8000/api/carts/",
            {
              quantity: 1,
              products: id,
              user: session?.user?.user_id,
            },
            {
              headers: {
                Authorization: `Bearer ${session?.accessToken}`,
              },
            }
          );
          const data = cartResponse;
          const cartItemResponse = axios
            .post(
              "http://127.0.0.1:8000/api/cart-items/",
              {
                quantity: 1,
                cart: data?.data?.id,
                user: session?.user?.user_id,
                product: id,
                color: currentProduct?.product_details[0]?.color,
                size: currentProduct?.product_details[0]?.size,
              },
              {
                headers: {
                  Authorization: `Bearer ${session?.accessToken}`,
                },
              }
            )
            .then((response) => {
              console.log(response.data, "data");
            });
          const cartItem = await cartItemResponse;
          setCutsAlertMassage(true);
          console.log("Cart and cart item added successfully.");
        } catch (error) {
          setCutsAlertMassage(false);
          console.error("Error adding to cart:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        console.log("Product already exists in the cart.");
        setAlreadyExisting(true);
        setIsLoading(false);
      }
    }
  };

  const interval = setInterval(() => {
    if (cutsAlertMassage) {
      setCutsAlertMassage(false);
      window.location.reload();
    } else if (alreadyExisting) {
      setAlreadyExisting(false);
    }
    clearInterval(interval);
  }, 3000);

  const handleDelete = async ({ id }) => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/favorite/${id}/`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      window.location.reload();
    } catch (error) {
      console.log(error, "error");
    }
  };


  const { status } = useSession();
  const router = useRouter();

  // useEffect(() => {
  //   if (status === 'unauthenticated') {

  //     router.push('/');

  //   }
  // }, [status]);

  // if (status === "loading") {
  //   return <Loading />;
  // }


  return (
    <div className="min-h-screen dark:bg-black/85 bg-white   p-4 ">
      <div className="md:max-w-7xl relative py-4 w-auto md:px-4 mx-auto bg-gray  dark:bg-black dark:text-white rounded-lg ">
        {cutsAlertMassage && (
          <div
            id="alert-3"
            className="flex items-center p-2   justify-center top-12 right-20  md:top-10  md:right-32  absolute max-w-lg mx-auto mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-sm font-medium">
              Item added to cart successfully!
            </div>
          </div>
        )}
        {alreadyExisting && (
          <div
            id="alert-3"
            className="flex items-center p-2  justify-center top-12 right-20  md:top-10  md:right-32  absolute max-w-lg mx-auto mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
            role="alert"
          >
            <svg
              className="flex-shrink-0 w-4 h-4"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
            </svg>
            <span className="sr-only">Info</span>
            <div className="ms-3 text-sm font-medium">
              Product already exists in the cart.
            </div>
          </div>
        )}

        <h1 className="text-xl sm:text-2xl dark:text-white text-black text-center font-bold ">
          Your Favorite Items
        </h1>
        <p className="text-gray-500 dark:text-white mb-4 sm:mb-6 text-center">
          There are {favorite.length} products in this list
        </p>

        {/* Responsive Table Wrapper */}
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse dark:text-white">
            <thead>
              <tr className="border-b dark:border-gray-700">
                <th className=" text-gray-600 text-xs  dark:text-white">Product</th>
                <th className=" text-gray-600 text-xs  dark:text-white ">Price</th>
                <th className=" text-gray-600 text-xs  dark:text-white "> Discount Price </th>
                {/* <th className="py-3 text-gray-600 font-medium">Stock Status</th> */}
                <th className=" text-gray-600 text-xs dark:text-white ">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorite?.map((item) => (
                <tr key={item.id} className="border-b dark:border-gray-700">
                  <td className="">
                    <Link
                      href={`/product_id?q=${item?.Product}&name=${item?.Product_Name}&price=${item?.Product_Price}&id=${item?.Product}`}
                      className="  gap-4 link  link-hover text-blue-600  text-xs md:text-base py-4 flex items-center space-x-4"
                    >
                      <img
                        src={item.Product_Image}
                        alt={item.Product_Name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />

                      {item.Product_Name}
                    </Link>
                  </td>
                  <td className="py-2  text-xs md:text-base">
                    <span className="line-through text-gray-400  md:text-base text-xs">
                      {item.Product_Price}
                    </span>
                  </td>

                  <td className="py-2 text-xs md:text-base">
                    <span className=" text-gray-800  font-semibold dark:text-white ">
                      {item.Discount_Price}
                    </span>
                  </td>

                  <td className="md:py-2 ">
                    <button
                      onClick={() =>
                        handleAddToCart({
                          id: item?.Product,
                        })
                      }
                      className="  text-gray-800  bg-blue-500  text-xs md:text-base hover:bg-blue-600  py-2 md:px-3 rounded-lg"
                      key={item.id}
                    >
                      Add to Cart
                    </button>
                  </td>
                  <td className="py-2">
                    <button
                      key={item.id}
                      onClick={() =>
                        handleDelete({
                          id: item?.id,
                        })
                      }
                      className="px-3 py-1 text-sm rounded  text-black"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Favorites;
