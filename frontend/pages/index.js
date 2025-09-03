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
  const [isHovered, setIsHovered] = useState(false);
  const [data, setData] = useState([]);
  const [mainCard, setMainCard] = useState({});
  const [similarCards, setSimilarCards] = useState([]);
  const router = useRouter();
  const { data: session } = useSession();
  const [isClicked, setIsClicked] = useState(false);
  const [favoriteId, setFavoriteId] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteAlertAlready, setIsFavoriteAlertAlready] = useState(false);
  const [alerts, setAlerts] = useState(null);

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
        console.log("reload");
      }
    } else {
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
        setData(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();

    const scrollContainer = scrollRef.current;

    const scrollStep = () => {
      if (scrollContainer && !isHovered) {
        if (scrollContainer.scrollLeft >= scrollContainer.scrollWidth / 2) {
          scrollContainer.scrollLeft = 0;
        } else {
          scrollContainer.scrollLeft += 1;
        }
      }
    };

    const scrollInterval = setInterval(scrollStep, 10);
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
    }
    if (isFavoriteAlertAlready) {
    }
    clearInterval(interval);
  }, 3000);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {alerts && isFavorite && alerts.favoritesAlertAdd}
      {alerts && isFavoriteAlertAlready && alerts.favoritesAlertAlready}
      
      {/* Main section content */}
      <section className="py-8">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Large Card */}
            <div className="md:col-span-2 w-full bg-white dark:bg-gray-850 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <div className="w-full h-full flex justify-center items-center relative">
                <Carousel />
                <div className="absolute left-6 bottom-6">
                  <Button
                    onClick={() => router.push('/search?product=all')}
                    className="rounded-full px-6 py-4 font-medium bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
                    size="lg"
                  >
                    Shop Now
                  </Button>
                </div>
              </div>
            </div>

            {/* Smaller Cards */}
            <div className="flex flex-col w-full h-auto space-y-6">
              {similarCards.map((card, index) => (
                <div
                  key={index}
                  onClick={() =>
                    router.push(
                      `/product_id?q=${card.product_id}&name=${card.name}&price=${card.price}&id=${card.id}`
                    )
                  }
                  className="relative group flex w-full rounded-2xl overflow-hidden bg-white dark:bg-gray-850 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 dark:border-gray-700"
                >
                  <div className="relative w-2/5 overflow-hidden">
                    <img
                      className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      src={card?.product_image}
                      alt={card?.product_card_name}
                    />
                    <div className="absolute top-3 right-3">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
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
                        className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                        aria-label="Like"
                      >
                        <HeartIcon className={favoriteId.includes(card?.id) ? "fill-red-500" : ""} />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="w-3/5 p-4 flex flex-col justify-between">
                    <h3 className="font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                      {card?.product_card_name}
                    </h3>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {card?.price}
                      </span>
                      <Button
                        className="rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white transition-colors"
                        size="sm"
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Scroll Section */}
      <section className="py-8 bg-white dark:bg-gray-850 border-t border-b border-gray-100 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">Featured Products</h2>
        <div
          ref={scrollRef}
          className="w-full overflow-x-auto whitespace-nowrap py-4 scrollbar-hide"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
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
              className="inline-block mx-3 w-64 rounded-2xl overflow-hidden bg-white dark:bg-gray-800 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group"
            >
              <div className="relative overflow-hidden">
                <img
                  className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                  src={i?.product_image}
                  alt={i?.product_card_name}
                />
                <div className="absolute top-3 right-3">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
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
                    className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                    aria-label="Like"
                  >
                    <HeartIcon className={favoriteId.includes(i?.id) ? "fill-red-500" : ""} />
                  </Button>
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-2 line-clamp-2">
                  {i?.product_card_name}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">
                    {i?.price}
                  </span>
                  <Button
                    className="rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-500 hover:text-white transition-colors"
                    size="sm"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}