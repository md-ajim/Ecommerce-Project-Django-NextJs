
import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import Like from "../favorite/icon";
import { HeartIcon } from "../favorite/heartIcon";
import axios from "axios";
import { useSession } from "next-auth/react";
import Favorites from "../favorite/wish";
import { Pagination, Button } from "@nextui-org/react";
import AlertMassage from "../../alert/alertMassage";
export default function Products(props) {
  const router = useRouter();
  const { data: session } = useSession();
  const [isClicked, setIsClicked] = useState(false);
  const [favoriteId, setFavoriteId] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isFavoriteAlertAlready, setIsFavoriteAlertAlready] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3; // Number of items per page
  const totalPages = Math.ceil(props.products.results.length / itemsPerPage);
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
      setIsFavoriteAlertAlready(true);
      // window.location.reload();
    }
  };

  useEffect(() => {
    const loadAlerts = async () => {
      const alertMessages = await AlertMassage({
        setIsFavorite,
        setIsFavoriteAlertAlready,
      });
      setAlerts(alertMessages);
    };

    loadAlerts();


  }, [setIsFavorite, setIsFavoriteAlertAlready]);

  const interval = setInterval(() => {
    if (isFavorite) {
      setIsFavorite(false);
      window.location.reload();
    }
    if (isFavoriteAlertAlready) {
      setIsFavoriteAlertAlready(false);
      window.location.reload();
    }
    clearInterval(interval);
  }, 3000);

  const onNext = () => {
    setCurrentPage((prev) => (prev < totalPages ? prev + 1 : prev));
  };

  const onPrevious = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : prev));
  };
  // Get the current page's data
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = props?.products?.results.slice(startIndex, endIndex);



  console.log(totalPages, "totalPages");
  console.log(currentPage, "currentPage");
  console.log(startIndex, "startIndex", endIndex , "endIndex");
  console.log(currentData, "currentData");
  console.log(props.products.results, "props.products.results");


  return (
    <>
      {alerts && isFavorite && alerts.favoritesAlertAdd}
      {alerts && isFavoriteAlertAlready && alerts.favoritesAlertAlready}

      <div className=" grid grid-cols-1 md:grid-cols-3 gap-4 md:pt-4">
        {currentData?.map((i) => (
          <div
            key={i}
            onClick={() =>
              router.push(
                `/product_id?q=${i.product_id}&name=${i.name}&price=${i.price}&id=${i.id}`
              )
            }
          >
            <div
              href="#"
              key={i}
              className=" relative inline-block mx-2
     rounded-2xl  hover:border border-indigo-600  bg-white md:bg-black "
            >
              <img
                className="rounded-2xl  md:h-[300px] md:w-[300px] scale-100  hover:scale-110 transition-all  duration-500  transform ease-in-out object-cover"
                src={i.product_image}
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
                      : router.push("form/signIn"); // Pass the correct product ID
                  }}
                  isIconOnly
                  color="danger"
                  aria-label="Like"
                >
                  <HeartIcon />
                </Button>
              </div>

              <div
                href="#"
                className="flex justify-between backdrop-blur-md text-black bg-white/10  border-white/20 border-1 overflow-hidden absolute rounded-full text-center items-center right-6   bottom-2 p-1 w-[calc(250px_-_6px)] md:w-[calc(225px_-_6px)] shadow-small z-10"
              >
                <a href="#">
                  <p className="text-xs  text-wrap md:text-xs">
                    {i.product_card_name}
                  </p>
                </a>
                <a href="#">
                  <Button
                    className="rounded-full   text-xs"
                    color="danger"
                    size="sm"
                  >
                    {i.price}
                  </Button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="container md:flex justify-center items-center mt-10  gap-2 flex-wrap justify-items-center md:space-y-0  space-y-1  ">
        <Button color="secondary" size="sm" variant="flat" onPress={onPrevious}>
          Previous
        </Button>
        <Pagination
          page={currentPage}
          onChange={(page) => setCurrentPage(page)}
          isCompact
          total={totalPages}
        />
        <Button color="secondary" size="sm" variant="flat" onPress={onNext}>
          Next
        </Button>
      </div>
    </>
  );
}
