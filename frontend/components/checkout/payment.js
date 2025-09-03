import { useState, useEffect } from "react";

import axios from "axios";

import { useSession } from "next-auth/react";

import { useRouter } from "next/router";

import CheckoutButton from "../checkout/index";

export default function Payment({
  onPrevious,
  selectedShipping,
  totalPrice,
  shipping_id,
  quantityBy,
  orderId,
}) {
  const [clientSecret, setClientSecret] = useState("");
  const [amount, setAmount] = useState(0);
  const [currency, setCurrency] = useState("usd");
  const router = useRouter();
  const [user, setUser] = useState(null);
  const { data: session } = useSession();

  console.log(shipping_id, "shipping_id");

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

  return (
    <>
      <div className=" bg-transparent border border-gray-700 p-6 rounded-md mb-8">
        <div className="flex justify-between border-gray-700  border-b mb-4">
          <div>
            <p className="font-semibold">Contact</p>
            <p className="text-gray-400">{user?.addresses[0]?.email}</p>
          </div>
          <a href="#" className="text-blue-500">
            Change
          </a>
        </div>
        <div className="flex justify-between mb-4  border-gray-700  border-b ">
          <div>
            <p className="font-semibold">Ship to</p>
            <p className="text-gray-400">
              <span>{user?.addresses[0]?.address}</span>

              <span> {user?.addresses[0]?.city} </span>
              <span> {user?.addresses[0]?.state}</span>
              <span> {user?.addresses[0]?.country}</span>
            </p>
          </div>
          <a onClick={onPrevious} href="#" className="text-blue-500">
            Change
          </a>
        </div>
        <div className="flex justify-between">
          <div>
            <p className="font-semibold">Shipping method</p>
            <p className="text-gray-400">
              {selectedShipping === "Snaply"
                ? "Free"
                : selectedShipping === "standard"
                ? "$5.00"
                : ""}
            </p>
          </div>
          <a onClick={onPrevious} href="#" className="text-blue-500">
            Change
          </a>
        </div>
      </div>
      <h2 className="text-2xl font-bold mb-4">Payment</h2>

      {/* Complete Order Button */}
      <div className="mt-8 flex items-center justify-between">
        <a onClick={onPrevious} href="#" className="text-blue-500 underline">
          Return to shipping
        </a>
        <CheckoutButton
          shipping_id={shipping_id}
          orderId={orderId}
          amount={totalPrice}
        />
      </div>
    </>
  );
}
