import axios from "axios";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import ModelFormSignIn from "../form/ModelFormSignIn";
import ModelAddressForm from "../form/ModelAddressForm";
import { useRouter } from "next/router";
import Loading from "../loading";
import { IMAGES_MANIFEST } from "next/dist/shared/lib/constants";
import Unauthenticated from "../unauthenticated";

export default function Address({ onNext, handleOrderSubmission }) {
  const { data: session, status } = useSession();
  const [userCreated, setUserCreated] = useState(false);
  const [alreadyCreated, setAlreadyCreated] = useState(false);

  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
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
  }, [status, session?.accessToken]);

  async function handleSubmit(e) {
    e.preventDefault();

    const url = "http://127.0.0.1:8000/api/addresses/";

    const formData = new FormData(e.target);

    const email = formData.get("email");
    const address = formData.get("address");
    const city = formData.get("city");
    const state = formData.get("state");
    const country = formData.get("country");
    const postal_code = formData.get("postal_code");
    const first_name = formData.get("first_name");
    const last_name = formData.get("last name");
    const apartment = formData.get("Apartment");
    const data = {
      email: email,
      address: address,
      phone: null,
      city: city,
      state: state,
      country: country,
      postal_code: postal_code,
      first_name: first_name,
      last_name: last_name,
      apartment: apartment,
      user: session?.user?.user_id,
    };

    if (session?.user?.user_id !== user?.addresses[0]?.user) {
      try {
        const response = await axios
          .post(url, data, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((res) => {
            console.log(res.data, "response-post");
            onNext();
            handleOrderSubmission();
          });
      } catch (error) {
        console.error(error, "error-post");
      }
    } else if (session?.user?.user_id === user?.addresses[0]?.user) {
      setUserCreated(false);
      const url_put = `http://127.0.0.1:8000/api/addresses/${user?.addresses[0]?.id}/`;
      try {
        const response = await axios.put(url_put, data, {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        });
        console.log(response.data, "response-put");
        onNext();
        handleOrderSubmission();
      } catch (error) {
        console.error(error, "error-put");
      }
    }
  }

  // if (!session) {
  //   return <ModelAddressForm />;
  // }

  const interval = setInterval(() => {
    console.log(session?.user?.user_id, "session?.user?.user_id", user?.addresses[0]?.user , "user?.addresses[0]?.user");
    if (session?.user?.user_id !== user?.addresses[0]?.user) {
      // setUserCreated(false);
      // setAlreadyCreated(false);
    } else if (session?.user?.user_id === user?.addresses[0]?.user) {
      setUserCreated(false);
      setAlreadyCreated(true);
    }
    clearInterval(interval);
  }, 1000);

  if (status === "loading") {
    return <Loading />;
  }

  // if (status === "authenticated") {
    return (
      <div class="max-w-lg mx-auto md:p-4 lg:p-4 rounded-lg  dark:bg-black  overflow-y-scroll  h-screen ">
        <form className="  h-screen" onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <input
            type="text"
            name="email"
            isRequired
            placeholder="Email or mobile phone number"
            className="w-full  bg-transparent border dark:border-gray-700 border-gray-300 input mb-4  outline-none bg-white  dark:bg-black   rounded  "
          />
          <div className="flex items-center mb-8">
            <input
              type="checkbox"
              id="news-offers"
              className="mr-2   bg-transparent border border-gray-700 "
            />
            <label htmlFor="news-offers">Email me with news and offers</label>
          </div>

          <h2 className="text-2xl font-bold mb-4">Shipping address</h2>
          <select
            isRequired
            name="country"
            className="w-full  input bg-transparent border dark:border-gray-700 border-gray-300 dark:bg-black bg-white  mb-4 rounded  "
          >
            <option
              name="United States"
              value="United States"
              className="dark:bg-black bg-white"
            >
              United States
            </option>
            <option name="Bangladesh" value="Bangladesh" className="dark:bg-black bg-white">
              {" "}
              Bangladesh{" "}
            </option>
            <option name="Canada" value="Canada" className="dark:bg-black bg-white">
              {" "}
              Canada{" "}
            </option>
            <option name="China" value="China" className="dark:bg-black bg-white">
              {" "}
              China{" "}
            </option>
            <option name="France" value="France" className="dark:bg-black bg-white">
              {" "}
              France{" "}
            </option>
            <option name="Germany" value="Germany" className="dark:bg-black bg-white">
              {" "}
              Germany{" "}
            </option>
            <option name="India" value="India" className="dark:bg-black bg-white">
              {" "}
              India{" "}
            </option>
            <option name="Italy" value="Italy" className="dark:bg-black bg-white">
              {" "}
              Italy{" "}
            </option>
            <option name="Japan" value="Japan" className="dark:bg-black bg-white">
              {" "}
              Japan{" "}
            </option>
            <option name="Mexico" value="Mexico" className="dark:bg-black bg-white">
              {" "}
              Mexico{" "}
            </option>
            <option name="Poland" value="Poland" className="dark:bg-black bg-white">
              {" "}
              Poland{" "}
            </option>
            <option name="Russia" value="Russia" className="dark:bg-black bg-white">
              {" "}
              Russia{" "}
            </option>
            <option name="Spain" value="Spain" className="dark:bg-black bg-white">
              {" "}
              Spain{" "}
            </option>
            <option
              name="United Kingdom"
              value="United Kingdom"
              className="dark:bg-black bg-white"
            >
              {" "}
              United Kingdom{" "}
            </option>
          </select>

          <div className="flex gap-4">
            <input
              isRequired
              type="text"
              name="first_name"
              placeholder="First name (optional)"
              className="w-1/2  bg-transparent dark:bg-black bg-white border input dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
            />
            <input
              isRequired
              name="last_name"
              type="text"
              placeholder="Last name"
              className="w-1/2  bg-transparent dark:bg-black bg-white border input dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
            />
          </div>

          <input
            isRequired
            name="address"
            type="text"
            placeholder="Address"
            className="w-full  bg-transparent border input dark:bg-black bg-white dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
          />
          <input
            name="Apartment"
            type="text"
            placeholder="Apartment, suite, etc. (optional)"
            className="w-full  bg-transparent border input dark:bg-black bg-white dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
          />

          <div className="flex gap-4">
            <input
              isRequired
              name="city"
              type="text"
              placeholder="City"
              className="w-1/2 bg-transparent border input dark:bg-black bg-white dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
            />
            <input
              type="text"
              isRequired
              name="state"
              placeholder="State"
              className="w-1/4   bg-transparent border input dark:bg-black bg-white dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
            />
            <input
              name="postal_code"
              isRequired
              type="text"
              placeholder="ZIP code"
              className="w-1/4  bg-transparent border input dark:bg-black bg-white dark:border-gray-700  border-gray-300 p-4 mb-4 rounded dark:text-white"
            />
          </div>

          {/* <div className="flex items-center mb-8">
          <input type="checkbox" id="save-info" className="mr-2" />
          <label htmlFor="save-info">Save this information for next time</label>
        </div> */}

          <button
            type="submit"
            // onClick={onNext}
            className="bg-blue-600 w-full p-4 rounded text-white font-semibold"
          >
            Continue to shipping
          </button>
        </form>
      </div>
    );
  // }

  // if (status === "unauthenticated") {
  //   return <Unauthenticated />;
  // }
}
