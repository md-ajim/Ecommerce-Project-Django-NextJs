import { useEffect, useState, useRef, use } from "react";
import { useRouter } from "next/router";
import { Image } from "@nextui-org/react";
import axios from "axios";
import Link from "next/link";
import CartForm from "../form/CartFrom";
import { HeartIcon } from "./favorite/heartIcon";
import { useSession } from "next-auth/react";
import ReviewSection from "../reviews/reviews";

import AlertMassage from "../alert/alertMassage";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import ModelFormSignIn from "../form/ModelFormSignIn";
import { color } from "framer-motion";

const AcmeGeometricCirclesTShirtPage = ({
  product,
  productsDetails,
  colorAndSize,
}) => {
  const [color_selected, setColor_selected] = useState("White");
  const [size_selected, setSize_selected] = useState("S");
  const [countImage, setCountImage] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // Track the index of the image
  const [data, setData] = useState([]);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [cuts, setCuts] = useState(null);
  const [cuts_id, setCuts_id] = useState(null);
  const [cutsAlertMassage, setCutsAlertMassage] = useState(false);
  const [massageClose, setMassageClose] = useState(false);
  const [cutItem, setCutItem] = useState(null);
  const [curtMassage, setCurtMassage] = useState(false);
  const [dataId, setDataId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [orderItems, setOrderItems] = useState(null);
  const [orderItemsId, setOrderItemsId] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteAlertAlready, setIsFavoriteAlertAlready] = useState(false);
  const [alerts, setAlerts] = useState(null); // Store the alerts returned by AlertMassage
  const [isClicked, setIsClicked] = useState(false);
  const [favoriteId, setFavoriteId] = useState([]);
  const [unauthorized, setUnauthorized] = useState(false);
  const {q} = router.query
  const [ reloadPage , setReloadPage] = useState(false)


  const arr = Array.isArray(product?.reviews) ? product.reviews.map(Number) : [];
// Find the maximum number
const maxNumber = arr.length > 0 ? Math.max(...arr) : null;
console.log(maxNumber, "maxNumber");


  const { data: session } = useSession();
  console.log(product?.reviews, "product");

  useEffect(() => {

// Safely handle undefined or null reviews


    const fetchDataProduct = async () => {
      try {
        axios.get("http://127.0.0.1:8000/api/products/").then((response) => {
          console.log(response.data.results, "response.data.results");
          const datafiltered = response.data.results.filter(
            (item) => item.category_name === product.category_name
          );
          setData(datafiltered);
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDataCutItem = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/cart-items/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        const datafiltered = await response.data.results.filter(
          (item) => item.user === session?.user?.user_id
        );

        const cutItem = datafiltered?.find(
          (item) => item.product === product.id
        );

        setCutItem(cutItem);
      } catch (error) {
        console.error(error);
        console.log(error, "error");
      }
    };

    fetchDataCutItem();



    fetchDataProduct();
  }, [session, session?.accessToken, product, session?.user?.user_id]);

  const toggleSample_images = () => {
    if (color_selected === "Black") {
      setColor_selected("Black");
    } else if (color_selected === "White") {
      setColor_selected("White");
    }
  };

  const toggleColor = () => {
    if (color_selected === "Black") {
      setColor_selected("Black");
    } else if (color_selected === "White") {
      setColor_selected("White");
    }
  };

  const toggleSize = () => {
    if (size_selected === "SX") {
      setSize_selected("SX");
    } else if (size_selected === "S") {
      setSize_selected("S");
    } else if (size_selected === "M") {
      setSize_selected("M");
    } else if (size_selected === "L") {
      setSize_selected("L");
    } else if (size_selected === "XL") {
      setSize_selected("XL");
    } else if (size_selected === "XXL") {
      setSize_selected("XXL");
    } else if (size_selected === "XXXL") {
      setSize_selected("XXXL");
    }
  };

  const {
    product_details,
    id,

    price,
    product_image,
    discount_price,
    reviews,
    stock_quantity,
    // product_id,
  } = product;

  const { name, description, main_image, sample_images, colors, size } =
    productsDetails;

  useEffect(() => {
    const total_amount = parseFloat(quantity * discount_price).toFixed(2);
    setTotalPrice(total_amount);
  }, );

  // Function to increment image index
  const toggleImageCountIncrement = () => {
    setCurrentImageIndex((prevIndex) => {
      setColor_selected(colorAndSize[prevIndex]?.color);
      console.log(prevIndex, "prevIndex");
      const newIndex = prevIndex + 1;
      console.log(newIndex, "newIndex");
      return newIndex >= colorAndSize.length ? 0 : newIndex; // Loop to the first image if at the last
    });
  };

  // Function to decrement image index
  const toggleImageCountDecrement = () => {
    setCurrentImageIndex((prevIndex) => {
      setColor_selected(colorAndSize[prevIndex]?.color);
      const newIndex = prevIndex - 1;
      return newIndex < 0 ? colorAndSize.length - 1 : newIndex; // Loop to the last image if at the first
    });
  };

  const currentImage = colorAndSize[currentImageIndex]?.image || main_image;
  const toggleCountImage = (image, color, index) => () => {
    if (currentImageIndex === index) {
      setColor_selected(color);
    }

    setColor_selected(color);

    // setCountImage(image)
    setCountImage(image);
  };



  const handleAddToCart = async () => {
    if (!cutItem) {
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

        setCuts(cartResponse?.data);

        const cartItemResponse = await axios.post(
          "http://127.0.0.1:8000/api/cart-items/",
          {
            quantity: 1,
            cart: cartResponse?.data?.id,
            user: session?.user?.user_id,
            product: id,
            color: color_selected,
            size: size_selected,
          },
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        setCutsAlertMassage(true);
        setCuts_id(cartItemResponse.data);
        window.location.reload();

        console.log("Cart and cart item added successfully.");
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      setCutsAlertMassage(false);
      setCurtMassage(true);
    }
  };

  const interval = setInterval(() => {
    if (cutsAlertMassage) {
      setCutsAlertMassage(false);
    }

    if (curtMassage) {
      setCurtMassage(false);
    }

    clearInterval(interval);
  }, 3000);

  const handleCheckout = async () => {
    const data = {
      products: [id],
      cart_item: [],
      quantity: quantity,
      price_at_order: totalPrice,
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
      setOrderItems(response?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getOrderItems = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/order-items/${orderItems?.id}/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        const data = await response.data;
        if (data?.id) {
          router.push(
            `/checkout?id=${id}&by_order=${data?.id}&color=${color_selected}&quantity=${quantity}&Total_price=${totalPrice}&size=${size_selected}`
          );
        }
        setOrderItemsId(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (orderItems?.id) {
      getOrderItems();
    }
  }, [session, orderItems]);

  const handleBayNow = () => {
    
    handleCheckout();
  };

  const handleIncrement = () => {
    setQuantity(quantity + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  useEffect(() => {
    const get_favorite = async () => {
      try {
        const response = await axios
          .get("http://127.0.0.1:8000/api/favorite/", {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((res) => {
            const data = res.data.results.map((item) => {
              return item.Product;
            });

            setFavoriteId(data);
          })
          .catch((err) => {
            console.log(err, "err");
          });

        console.log(response.data, "response.data");
      } catch (error) {
        console.error(error, "error");
      }
    };
    get_favorite();
  }, [session]);

  const handleClickFavorite = async ({
    Product,
    Product_Name,
    Product_Image,
    Product_url,
    Stock_Status,
    Discount_Price,
    Product_Price,
  }) => {
    const data = {
      Product,
      Product_Name,
      Product_Image,
      Product_url,
      Stock_Status,
      Discount_Price,
      Product_Price,
    };

    if (!favoriteId.includes(Product)) {
      // alert("Added to favorites");
      console.log(data, "data");
      try {
        const response = await axios
          .post("http://127.0.0.1:8000/api/favorite/", data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((res) => {
            console.log(res, "res");
          })
          
          .catch((err) => {
            console.log(err, "err");
          });

          setIsFavorite(true);

        console.log(response.data, "response.data");
      } catch (error) {
        console.error(error, "error");
      } finally {
        // window.location.reload();
        console.log("reload");
      }
    } else {
      // alert("already added to favorites");
      setIsFavoriteAlertAlready(true)
      // window.location.reload();

    }
  };



  

  useEffect(() => {
    const loadAlerts = async () => {
      const alertMessages = await AlertMassage({ setIsFavorite , setIsFavoriteAlertAlready });
      setAlerts(alertMessages);
    };

    loadAlerts();
  }, [setIsFavorite , setIsFavoriteAlertAlready]);
  
  const intervals = setInterval(() => {
     
    if (isFavorite){
      setIsFavorite(false);
      window.location.reload();
    }
    if (isFavoriteAlertAlready){
      setIsFavoriteAlertAlready(false);
      window.location.reload();
    }
    clearInterval(intervals);

  }, 3000);


  const handleClickId = async ( { product_id , name , price , id,  })=>{
  
      router.push(
        `/product_id?q=${product_id}&name=${name}&price=${price}&id=${id}`
      )

  }



useEffect (()=>{

  if (product.product_id){
    setReloadPage(false)
    window.location.reload()
  }



},[q])
  
console.log(q, 'q')

  return (
    <>
      <section className="dark:bg-black/85 dark:text-white" >


        <div className="container px-4 py-4 md:px-0 lg:px-0 mx-auto relative">
          {cutsAlertMassage ? (
            <div
              id="alert-3"
              className="flex items-center p-2  justify-center md:mt-4 md:left-96 lg:left-96 md:absolute max-w-lg mx-auto mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
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
                {cutsAlertMassage && " Item added to cart successfully!"}
              </div>
            </div>
          ) : null}

          {curtMassage ? (
            <div
              id="alert-3"
              className="flex items-center p-2  justify-center md:mt-4 md:left-96 lg:left-96 md:absolute max-w-lg mx-auto mb-4 text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400"
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
                {curtMassage &&
                  "Item already added to cart please check your cart refresh page!"}
              </div>
            </div>
          ) : null}


          
             {alerts && isFavorite && alerts.favoritesAlertAdd}
             {alerts && isFavoriteAlertAlready && alerts.favoritesAlertAlready}
      

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 w-full flex justify-center items-center  border-green-600 md:bg-white dark:text-white dark:bg-black rounded-2xl">
              <div className="grid  md:grid-cols-5  grid-cols-1 w-full mx-auto justify-center justify-items-center items-center rounded-2xl hover:box-border">
                <div className="overflow-y-scroll hidden w-full md:flex items-stretch justify-center py-4 h-[500px]   mx-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-300 dark:scrollbar-thumb-gray-700 dark:scrollbar-track-gray-900">
                  <div className="  ">
                    {/* () => setCountImage(color?.image) */}
                    {colorAndSize?.map((color, index) => (
                      <div
                        onMouseEnter={toggleCountImage(
                          color?.image,
                          color?.color,
                          index
                        )}
                        onMouseLeave={() => setCountImage("")}
                        key={color.color}
                        onClick={() => setCurrentImageIndex(index)} // Update currentImageIndex on click
                        className=" "
                      >
                        {/* currentImageIndex === index ? */}
                        <Image
                          
                          className={`w-24 h-24 md:w-32 md:h-32 mb-4 ${
                            color_selected === color?.color
                              ? "border border-indigo-600"
                              : ""
                          } hover:scale-110 transition-all duration-300 cursor-pointer rounded-lg`}
                          src={  color.image }
                          alt={color?.color}
                        />
                        { 
                        
                                     
                        
                        }
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative col-start-2 col-span-4 w-full mb-4 flex h-auto mx-auto justify-center justify-items-center items-center rounded-2xl">
                  <img
                    className="rounded-2xl md:h-[500px] transition-all object-cover duration-300 w-auto"
                    src={countImage === "" ? currentImage : countImage} // Display the current image
                    alt="Current product"
                  />

                  <div className="flex justify-between items-center absolute bottom-20 left-1/2 transform -translate-x-1/2 w-36 h-10 rounded-full  border border-white shadow-lg z-10">
                    {/* Decrement Image */}
                    <button
                      onClick={toggleImageCountDecrement}
                      className="flex justify-center items-center w-12 scale-100 h-full rounded-full hover:bg-white/10 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white hover:scale-110 transition"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6.75 15.75 3 12m0 0 3.75-3.75M3 12h18"
                        />
                      </svg>
                    </button>

                    {/* Empty space between buttons */}
                    <button className="border border-white h-10"></button>

                    {/* Increment Image */}
                    <button
                      onClick={toggleImageCountIncrement}
                      className="flex justify-center items-center w-12 h-full scale-100 rounded-full hover:bg-white/10 transition"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-6 h-6 text-white hover:scale-110 transition"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-col w-full h-auto mx-auto justify-center items-center  relative">
        
                <div>
                  <h2 class="mb-2 font-manrope font-bold text-3xl leading-10 dark:text-white  text-gray-700   ">
                    {name}
                  </h2>
                  <h6 className="font-manrope   dark:text-white  text-muted   font-semibold text-2xl leading-9  pr-5 sm:border-r md:border-none border-gray-200 mr-5">
                    $ {discount_price}{" "}
                    <span className="text-blue-800"> 30% off </span>{" "}
                    <span className="text-gray-300 text-lg line-through">
                      {" "}
                      $ {price}{" "}
                    </span>
                  </h6>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center mb-6  dark:text-white  text-gray-700">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {

                        [...Array(maxNumber)].map((_, index) => (

                          <button  key={index} >

                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 20 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clipPath="url(#clip0_12029_1640)">
                              <path
                                d="M9.10326 2.31699C9.47008 1.57374 10.5299 1.57374 10.8967 2.31699L12.7063 5.98347C12.8519 6.27862 13.1335 6.48319 13.4592 6.53051L17.5054 7.11846C18.3256 7.23765 18.6531 8.24562 18.0596 8.82416L15.1318 11.6781C14.8961 11.9079 14.7885 12.2389 14.8442 12.5632L15.5353 16.5931C15.6754 17.41 14.818 18.033 14.0844 17.6473L10.4653 15.7446C10.174 15.5915 9.82598 15.5915 9.53466 15.7446L5.91562 17.6473C5.18199 18.033 4.32456 17.41 4.46467 16.5931L5.15585 12.5632C5.21148 12.2389 5.10393 11.9079 4.86825 11.6781L1.94038 8.82416C1.34687 8.24562 1.67438 7.23765 2.4946 7.11846L6.54081 6.53051C6.86652 6.48319 7.14808 6.27862 7.29374 5.98347L9.10326 2.31699Z"
                                fill="#FBBF24"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_12029_1640">
                                <rect width={20} height={20} fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
  
                          
                        </button>



                        ))
                   
                      }

                   
                   
                    </div>

                    <span className="pl-2 font-normal leading-7   dark:text-white  text-gray-700 text-sm ">
                      {arr.length} review (s) <span className="text-gray-500"></span>{" "}
                      {/* <span className="text-gray-500  dark:text-white "> 4 sold </span> */}
                    </span>
                  </div>
                </div>
                {/* <p className="text-gray-500 text-base font-normal mb-8 ">
                  {description}
                </p> */}

                <div className="block w-full">
                  <p className="font-medium text-lg    text-gray-700   dark:text-white leading-8  mb-4">
                    Bag Color
                  </p>
                  <div className="text">
                    <div className="flex items-center justify-start gap-3 md:gap-6 relative mb-6 ">
                      {colorAndSize?.map((color, index) => (
                        <button
                          key={index}
                          onMouseEnter={() => setColor_selected(color.color)}
                          onMouseLeave={toggleColor}
                          className={`p-2.5 ${
                            color_selected === color.color
                              ? "border border-gray-200 rounded-lg transition-all duration-300 hover:border-emerald-500 :border-emerald-500"
                              : ""
                          }`}
                        >
                          <svg
                            width={20}
                            height={20}
                            viewBox="0 0 40 40"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle
                              cx={20}
                              cy={20}
                              r={20}
                              fill={color.color_code}
                            />
                          </svg>
                        </button>
                      ))}
                    </div>

                    <div className=" gap-4 flex w-full mb-6">
                      <h5> Quantity </h5>

                      <div className="flex gap-4">
                        <button
                          onClick={handleDecrement}
                          className=" px-5 rounded-lg dark:text-white "
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
                              d="M5 12h14"
                            />
                          </svg>
                        </button>

                        <span>{quantity} </span>
                        <button
                          onClick={handleIncrement}
                          className=" px-5 rounded-lg dark:text-white "
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
                              d="M12 4.5v15m7.5-7.5h-15"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="block w-full mb-6">
                      <p className="font-medium text-lg leading-8  text-gray-700 dark:text-white mb-4">
                        Bag size
                      </p>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <button
                          onMouseEnter={() => setSize_selected("SX")}
                          onMouseLeave={toggleSize}
                          className={`   text-lg py-2 ${
                            size_selected === "SX"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          {/* {size} */}SX
                        </button>
                        <button
                          onMouseEnter={() => setSize_selected("S")}
                          onMouseLeave={toggleSize}
                          className={`  text-lg py-2 ${
                            size_selected === "S"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          {/* {size} */}S
                        </button>
                        <button
                          onMouseEnter={() => setSize_selected("M")}
                          onMouseLeave={toggleSize}
                          className={`   text-lg py-2 ${
                            size_selected === "M"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          M
                        </button>

                        <button
                          onMouseEnter={() => setSize_selected("L")}
                          onMouseLeave={toggleSize}
                          className={`   text-lg py-2 ${
                            size_selected === "L"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          L
                        </button>
                        <button
                          onMouseEnter={() => setSize_selected("XL")}
                          onMouseLeave={toggleSize}
                          className={`   text-lg py-2 ${
                            size_selected === "XL"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          XL
                        </button>
                        <button
                          onMouseEnter={() => setSize_selected("XXL")}
                          onMouseLeave={toggleSize}
                          className={`   text-lg py-2 ${
                            size_selected === "XXL"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          XXL
                        </button>
                        <button
                          onMouseEnter={() => setSize_selected("XXXL")}
                          onMouseLeave={toggleSize}
                          className={`   text-lg py-2 ${
                            size_selected === "XXXL"
                              ? "border border-gray-200  transition-all  rounded-full duration-300 hover:border-emerald-500:border-emerald-500"
                              : ""
                          } rounded-full px-1.5 sm:px-6 w-full font-semibold whitespace-nowrap shadow-sm shadow-transparent transition-all duration-300  hover:scale-105 scale-100 hover:border-gray-300`}
                        >
                          XXXL
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-1 gap-3 mb-8">
                      {session ? (
                        <button
                          className="w-full bg-black   text-white py-3 rounded-lg hover:bg-gray-900 focus:outline-none "
                          onClick={handleAddToCart}
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <CartForm />
                      )}
                    </div>

                    <div className="flex-col items-center gap-3">
                      <button
                        // onClick={handleBayNow}

                        onClick={()=>{
                          session ? handleBayNow() : router.push("/form/signIn")
                        }}

                        className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 focus:outline-none "
                      >
                        Buy Now
                      </button>
                    </div>
                  </div>
                </div>
          
            </div>
          </div>
        </div>
      </section>
      <section className=" py-4  dark:bg-black/85 dark:text-white ">
        <div>
          <div className=" container mx-auto px-4 md:px-0">
            <h1 className="text-3xl font-bold pb-6 ">Related Products</h1>
          </div>

          <div className="w-full h-auto mx-auto overflow-x-scroll hide-scroll-bar  whitespace-nowrap ">
            {/* Product Cards */}
            {data?.map((i) => (
              <div
                key={i}
                onClick={() =>
                  handleClickId({
                   product_id:  i.product_id,
                   name : i.name,
                   price : i.price,
                   id : i.id,
                  })
                }
                className="relative inline-block mx-2
     rounded-2xl  hover:border border-indigo-600  bg-black  "
              >
                <img
                  className="rounded-2xl w-[276px] h-[276px] scale-100  hover:scale-110 transition-all  duration-500  transform ease-in-out object-cover"
                  src={i.product_image}
                  alt="Product"
                />

                <div className="absolute top-2 right-2">
                  <Button

                    onClick={(e) => {
                      e.stopPropagation(); // Prevents parent click event
                      session
                        ? handleClickFavorite({
                            Product: i?.id,
                            Product_Name: i?.product_card_name,
                            Product_Image: i?.product_image,
                            Product_url: i?.product_url,
                            Stock_Status: i?.stock_quantity,
                            Discount_Price: i?.discount_price,
                            Product_Price: i?.price,
                          })
                        : router.push("form/signIn");
                    }}
                    isIconOnly
                    color="danger"
                    aria-label="Like"
                 
                 >
                    <HeartIcon />
                  </Button>
                </div>

                <div className="flex justify-between border-white/20 border-1 overflow-hidden absolute rounded-full text-center items-center right-6   bottom-2 p-1 w-[calc(250px_-_6px)] md:w-[calc(225px_-_6px)] shadow-small z-10">
                  <a href="#">
                    <p className="text-xs text-wrap md:text-xs">
                      {i?.product_card_name}
                    </p>
                  </a>
                  <a href="#">
                    <Button
                      className="rounded-full   text-xs"
                      color="success"
                      size="sm"
                    >
                      {i?.price}
                    </Button>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <ReviewSection   product={product}  product_details={product_details}   colorAndSize = { colorAndSize}    />
      </section>



 


    
    </>
  );
};

export default AcmeGeometricCirclesTShirtPage;
