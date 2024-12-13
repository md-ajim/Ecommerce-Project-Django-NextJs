import React, { use, useState } from "react";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import Router, { useRouter } from "next/router";

import axios from "axios";

const ReviewSection = ({ product, product_details, colorAndSize }) => {
  const { data: session } = useSession();
  const [user, setUser] = useState({});
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [reviews_data, setReviews_data] = useState([]);
  const router = useRouter();

  const [form, setForm] = useState({
    review: "",
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${session.user.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        setUser(response.data);
      } catch (err) {
        console.log(err);
      }
    };

    const getUserAndReviews = async () => {
      try {
        // Fetch reviews
        const reviewResponse = await axios.get(
          `http://127.0.0.1:8000/api/product-reviews/`
        );
        console.log(reviewResponse, "reviewResponse");

        // Filter reviews by product
        const filterProduct = reviewResponse?.data?.results?.filter(
          (item) => item.product === product.id
        );

        setReviews_data(filterProduct);
      } catch (error) {
        console.error(error, "error-fetching-data");
      }
    };

    getUserAndReviews();
    if (session) {
      getUser();
    }
  }, [session, product]);

  console.log(reviews_data, "reviews_data");
  console.log(user, "user");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    console.log("Submitted Review:", { ...form, rating });
    if (session) {
      // Handle form submission logic here (e.g., API call)
      const data = {
        rating: rating,
        comment: form.review,
        profile_names: user.username,
        user_profilePic: user.profile_image,
        product: product.id,
        user: session.user.user_id,
      };

      try {
        const response = await axios.post(
          `http://127.0.0.1:8000/api/product-reviews/`,
          data,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        console.log(response.data, "response.data");
      } catch (error) {
        console.error(error, "error");
      } finally {
        setIsLoading(false);
        window.location.reload();
      }
    } else {
      // alert("Please Login First")
      router.push("/form/signIn");
    }
  };

  function convertToBangladeshTime(timestamp) {
    const utcTimestamp = new Date(timestamp);

    return utcTimestamp.toLocaleString("en-US", {
      timeZone: "Asia/Dhaka",
    });
  }

  return (
    <>
      <div className="   container px-4 py-4 md:px-0 lg:px-0 mx-auto relative">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Section */}
          <div className=" dark:bg-black dark:text-white bg-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Average Rating</h2>
            <div className="flex items-center mt-2">
              <span className="text-4xl font-bold">4.5</span>
              <div className="ml-2 flex">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className={`text-yellow-400 ${
                      i < 4.5 ? "fas fa-star" : "fas fa-star-half-alt"
                    }`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {[
                { rating: 5, percent: 90 },
                { rating: 4, percent: 60 },
                { rating: 3, percent: 40 },
                { rating: 2, percent: 30 },
                { rating: 1, percent: 0 },
              ].map(({ rating, percent }) => (
                <div key={rating} className="flex items-center">
                  <span className="text-sm font-medium">{rating}</span>
                  <div className="flex-1 mx-2 dark:bg-gray-600  bg-gray-200  rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Section */}
          <div className="bg-white dark:bg-black dark:text-white shadow-md rounded-lg p-6">
            <h2 className="text-xl font-semibold">Submit Your Review</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Add Your Rating <span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`text-xl ${
                        star <= rating ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Write Your Review <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="review"
                  value={form.review}
                  onChange={handleInputChange}
                  placeholder="Write here..."
                  className="w-full border  border-gray-300  rounded-lg p-2"
                  rows="4"
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-green-700 text-white font-semibold py-2 rounded-lg hover:bg-green-800"
              >
                {isLoading ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="space-y-4   container px-4 py-4 md:px-0 lg:px-0 mx-auto relative ">
        {reviews_data.map((review, index) => (
          <div key={index} className=" rounded-lg p-6 flex flex-col space-y-4">
            <div className="flex items-start space-x-4">
              <img
                src={review.user_profilePic}
                alt="User"
                className="w-20 h-20 rounded-full"
              />
              <div className="flex-1 space-y-2">
                <h3 className="text-lg font-semibold">
                  {review.profile_names}
                </h3>
                <p className="text-sm ">
                  {"Date: " + convertToBangladeshTime(review.created_at)}
                </p>
                <p className="text-sm ">{review.comment}</p>

                <div className="flex mt-2">
                  {[...Array(review.rating)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-yellow-400 ${
                        i < review.rating ? "fas fa-star" : "far fa-star"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ReviewSection;
