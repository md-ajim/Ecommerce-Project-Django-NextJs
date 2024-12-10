import { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Shipping({
  onPrevious,
  onNext,
  orderId,
  handleShippingChange,
  selectedShipping,
  handelContinue,
  snaply,
  standard,
}) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: session } = useSession();


  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/users/${session?.user?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        setUser(await response.data);
      } catch (error) {
        console.error(error, "error");
      }
    };


    getUser();
  }, [session, session?.accessToken]);



const handleShippingMethodChange = (event) => {
  onNext()
  handelContinue()

}




  return (
    <>
      <div className="mb-6 dark:text-slate-200  text-gray-700">
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <div className=" bg-transparent border border-gray-700 p-4 rounded mb-2">
          <p> {user?.addresses[0]?.email}</p>
          <a
            onClick={onPrevious}
            href="#"
            className="text-blue-500 underline ml-2"
          >
            Change
          </a>
        </div>
        <h2 className="text-xl font-semibold mb-2">Ship to</h2>
        <div className="bg-transparent border border-gray-700 p-4 rounded">
          <p>
            <span>{user?.addresses[0]?.address}</span>

            <span> {user?.addresses[0]?.city} </span>
            <span> {user?.addresses[0]?.state}</span>
            <span> {user?.addresses[0]?.country}</span>
          </p>
          <a
            onClick={onPrevious}
            href="#"
            className="text-blue-500 underline ml-2"
          >
            Change
          </a>
        </div>
      </div>

      {/* Shipping Method */}
      <h2 className="text-2xl font-bold mb-4">Shipping method</h2>
      <div className="space-y-4  border border-gray-700 rounded-lg ">
        <div
          className={`flex items-center justify-between p-4 rounded ${
            selectedShipping === "Snaply"
              ? "border border-blue-500 bg-transparent"
              : " bg-transparent"
          }`}
          onClick={() => handleShippingChange("Snaply")}
        >
          <div>
            <input
              type="radio"
              name="shipping-method"
              id="Snaply"
              checked={selectedShipping === "Snaply"}
              onChange={() => handleShippingChange("Snaply")}
              className="mr-2"
            />
            <label htmlFor="Snaply" className="dark:text-slate-200  text-gray-700 font-semibold">
              Snaply
            </label>
            <p className="dark:text-slate-200  text-gray-700 text-sm">5 to 8 business days</p>
          </div>
          <span className="text-white font-semibold">FREE</span>
        </div>
        <div
          className={`flex items-center justify-between p-4 rounded ${
            selectedShipping === "standard"
              ? "border border-blue-500 bg-transparent"
              : "bg-transparent"
          }`}
          onClick={() => handleShippingChange("standard")}
        >
          <div>
            <input
              type="radio"
              name="shipping-method"
              id="standard"
              checked={selectedShipping === "standard"}
              onChange={() => handleShippingChange("standard")}
              className="mr-2"
            />
            <label htmlFor="standard" className="dark:text-slate-200  text-gray-700 font-semibold">
              Standard
            </label>
            <p className="dark:text-slate-200  text-gray-700 text-sm">3 to 4 business days</p>
          </div>
          <span className="dark:text-slate-200  text-gray-700 font-semibold">$5.00</span>
        </div>
      </div>

      {/* Continue Button */}
      <div className="mt-8 flex items-center justify-between">
        <a onClick={onPrevious} href="#" className="text-blue-500 text-sm underline">
          Return to information
        </a>
        <button
          onClick={handleShippingMethodChange}

          className="bg-blue-600 p-4 rounded dark:text-slate-200 text-sm text-gray-700 font-semibold"
        >
          Continue to payment
        </button>
      </div>
    </>
  );
}
