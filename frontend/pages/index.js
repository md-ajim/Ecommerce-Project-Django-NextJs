
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { HeartIcon } from "../components/product/favorite/heartIcon";
import Carousel from "../components/product/Carousel";
import AlertMassage from "../components/alert/alertMassage";
import { useSession } from "next-auth/react";


export default function Home() {
  // Ref for the scrollable container
  const scrollRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [data, setData] = useState([]);
  const [mainCard, setMainCard] = useState({});
  const [similarCards, setSimilarCards] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [isClicked, setIsClicked] = useState(false);
  const [favoriteId, setFavoriteId] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteAlertAlready, setIsFavoriteAlertAlready] = useState(false);
  const [alerts, setAlerts] = useState(null); // Store the alerts returned by AlertMassage

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
      } catch (error) {
        console.error(error, "error");
      } finally {
        // window.location.reload();
        console.log("reload");
      }
    } else {
      // alert("already added to favorites");
      setIsFavoriteAlertAlready(true);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/products/");
        const similarCardsData = response?.data?.results.slice(0, 2);
        setSimilarCards(similarCardsData);
        const data = response?.data?.results.slice(2, 50);
        setData(data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    const scrollContainer = scrollRef.current;

    // Function to handle the scrolling animation
    const scrollStep = () => {
      if (scrollContainer && !isHovered) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          // Reset scroll to the start (for looping)
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1; // Adjust the step size for speed
        }
      }
    };

    // Create an interval for the scrolling effect
    const scrollInterval = setInterval(scrollStep, 10); // Lower values make it faster

    // Clear the interval when component unmounts
    return () => {
      clearInterval(scrollInterval);
    };
  }, [isHovered]);


  useEffect(() => {
    const loadAlerts = async () => {
      const alertMessages = await AlertMassage({ setIsFavorite, setIsFavoriteAlertAlready });
      setAlerts(alertMessages);
    };

    loadAlerts();
  }, [setIsFavorite, setIsFavoriteAlertAlready]);




  const interval = setInterval(() => {

    if (isFavorite) {
      // setIsFavorite(false);
      // window.location.reload();
    }
    if (isFavoriteAlertAlready) {
      // setIsFavoriteAlertAlready(false);
      // window.location.reload();
    }
    clearInterval(interval);

  }, 3000);


  console.log(similarCards, "similarCards");



  return (
    <>

      {alerts && isFavorite && alerts.favoritesAlertAdd}
      {alerts && isFavoriteAlertAlready && alerts.favoritesAlertAlready}
      {/* Main section content */}
      <section className="dark:bg-black/85  " >
        <div className="container px-4 md:px-0 lg:px-0 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Main Large Card */}
            <div className="md:col-span-2 w-full hover:border scale-100 border-green-600 bg-white dark:bg-black rounded-2xl">
              <div className="flex-col    w-full mx-auto justify-center items-center rounded-2xl hover:box-border">
                <div className="w-full h-full  flex justify-center items-center justify-items-center relative mx-auto hover:box-border align-middle rounded-2xl">

                  <Carousel />

                  <div className="flex justify-between backdrop-blur-md  text-black bg-white/10 text-wrap border-white/20 border-1 overflow-hidden absolute rounded-full text-center items-center p-2 left-3 bottom-3 md:w-[calc(135px_-_10px)] shadow-small z-10  ">

                    <a href="#">
                      <Button
                        onClick={() => router.push('/search?product=all')}
                        className="rounded-full text-xs md:text-base"
                        color="success"
                        bordered
                      >
                        Shop Now
                      </Button>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Smaller Cards */}
            <div className="flex-col w-full h-auto mx-auto justify-center space-y-4 items-center relative">
              {similarCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() =>
                    router.push(
                      `/product_id?q=${card.product_id}&name=${card.name}&price=${card.price}&id=${card.id}`
                    )
                  }
                  className="relative scale-100 flex  w-full hover:border rounded-2xl border-green-600 p-6  bg-white dark:bg-black"
                >
                  <img
                    className="w-full h-[200px] md:h-[275px] transition-transform  rounded-2xl duration-300 hover:scale-110"
                    src={card?.product_image}
                  />

                  <div className="absolute top-2 right-5">
                    <Button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevents parent click event
                        session ? handleClickFavorite({
                          Product: card?.id,
                          Product_Name: card?.product_card_name,
                          Product_Image: card?.product_image,
                          Product_url: card?.product_url,
                          Stock_Status: card?.stock_quantity,
                          Discount_Price: card?.discount_price,
                          Product_Price: card?.price,
                        }) : router.push("form/signIn");
                      }}

                      isIconOnly
                      color="danger"
                      aria-label="Like"
                    >
                      <HeartIcon />
                    </Button>
                  </div>

                  <div className="flex justify-between backdrop-blur-md text-black bg-white/10  border-white/20 border-1 overflow-hidden absolute rounded-full text-center items-center right-10   bottom-6 p-1 w-[calc(250px_-_6px)] md:w-[calc(350px_-_8px)] shadow-small z-10">
                    <a href="#">
                      <p className=" text-xs text-wrap md:text-xs">
                        {card?.product_card_name}
                      </p>
                    </a>
                    <a href="#">
                      <Button
                        className="rounded-full  text-xs md:text-xs"
                        color="success"
                        bordered
                      >
                        {card?.price}
                      </Button>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Scroll Section */}
      <section className="dark:bg-black/85">
        <div
          ref={scrollRef}
          className="w-auto h-auto mx-auto overflow-x-scroll whitespace-nowrap py-4"
          onMouseEnter={() => setIsHovered(true)} // Pause scrolling on hover
          onMouseLeave={() => setIsHovered(false)} // Resume scrolling on mouse leave
        >
          {data?.map((i, index) => (
            <div
              key={index}
              onClick={() =>
                router.push(
                  `/product_id?q=${i.product_id}&name=${i.name}&price=${i.price}&id=${i.id}`
                )
              }
              id={`card-${index}`}
              style={{ display: "inline-block" }}
              className="relative inline-block mx-2 hover:border rounded-2xl border-green-600 p-4 bg-white dark:bg-black"
            >
              <Link
                href={`/product_id?q=${i.product_id}&name=${i.name}&price=${i.price}&id=${i.id}`}
              >
                <img
                  className="w-[250px] h-[150px] md:w-[275px] md:h-[275px] rounded-2xl transition-transform duration-300 hover:scale-110"
                  src={i?.product_image}
                  alt="T-shirt"
                />
              </Link>

              <div className="absolute top-5 right-5">
                <Button
                  onClick={(e) => {
                    e.stopPropagation(); // Prevents parent click event

                    session ? handleClickFavorite({
                      Product: i?.id,
                      Product_Name: i?.product_card_name,
                      Product_Image: i?.product_image,
                      Product_url: i?.product_url,
                      Stock_Status: i?.stock_quantity,
                      Discount_Price: i?.discount_price,
                      Product_Price: i?.price,
                    }) : router.push("form/signIn");

                  }}
                  isIconOnly
                  color="danger"
                  aria-label="Like"
                >
                  <HeartIcon />
                </Button>
              </div>

              <div className="flex justify-between backdrop-blur-md text-black bg-white/10  border-white/20 border-1 overflow-hidden absolute rounded-full text-center items-center right-6   bottom-2 p-1 w-[calc(250px_-_6px)] md:w-[calc(270px_-_6px)] shadow-small z-10">
                <a href="#">
                  <p className="text-xs md:text-xs text-wrap">
                    {i?.product_card_name}
                  </p>
                </a>
                <a href="#">
                  <Button
                    className="rounded-full text-xs md:text-base"
                    color="success"
                    bordered
                  >
                    {i?.price}
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
