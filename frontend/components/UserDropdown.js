import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import axios from "axios";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UserDropdown() {
  const { data: session } = useSession();
  const [currentUser, setCurrentUser] = useState(null);

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
        setCurrentUser(user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, [session, session?.accessToken]);



  return (
    <Menu as="div" className="relative   inline-block text-left">
      <div>
        {/* Dropdown Button */}
        <Menu.Button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700  rounded-full focus:outline-none">


          <div className="flex justify-center items-center justify-self-center">
            <img
              className="rounded-full w-10 object-cover  h-10"
              alt="Tailwind CSS Navbar component "
              src={currentUser?.profile_image}
            />
          </div>

        </Menu.Button>
      </div>

      {/* Dropdown Panel */}
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-64 origin-top-right dark:border-gray-800  bg-white dark:text-white dark:bg-black rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {/* User Info Section */}
          <div className="p-4">
            <div className="flex justify-center items-center justify-self-center">
              <img
                src={currentUser?.profile_image} // Replace with actual avatar
                alt="User avatar"
                className=" h-10 w-10 object-cover  rounded-full"
              />
              <div className="ml-3">
                <p className="text-sm font-medium dark:text-slate-200 text-gray-900">
                  {currentUser?.username}
                </p>
                <p className="text-sm text-gray-500  dark:text-gray-200 truncate">
                  {currentUser?.email}
                </p>
              </div>
            </div>
          </div>

          {/* E-Commerce Menu Items */}
          <div className="py-1 ">
            {/* Orders */}
            <Menu.Item>
              {({ active }) => (
                <Link
                  href="/order/order-summary"
                  className={classNames(
                    active ? "bg-gray-100 dark:bg-gray-800 dark:text-slate-200 text-gray-900" : " dark:text-slate-200 text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                  Orders
                </Link>
              )}
            </Menu.Item>

            {/* Wishlist */}
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/favorites"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-200" : "dark:text-slate-200 text-gray-700",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                    />
                  </svg>
                  Wishlist
                </a>
              )}
            </Menu.Item>

            {/* Account Settings */}
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/account-settings"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-200" : "text-gray-700 dark:text-slate-200" ,
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077 1.41-.513m14.095-5.13 1.41-.513M5.106 17.785l1.15-.964m11.49-9.642 1.149-.964M7.501 19.795l.75-1.3m7.5-12.99.75-1.3m-6.063 16.658.26-1.477m2.605-14.772.26-1.477m0 17.726-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205 12 12m6.894 5.785-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                    />
                  </svg>
                  Account Settings
                </a>
              )}
            </Menu.Item>
          </div>

          {/* Logout Section */}
          <div className="py-1">
            <Menu.Item onClick={() => signOut("signOut")}>
              {({ active }) => (
                <a
                  href="#"
                  className={classNames(
                    active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-slate-200" : "text-gray-700 dark:text-slate-200",
                    "flex items-center px-4 py-2 text-sm"
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 mr-2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                    />
                  </svg>
                  Logout
                </a>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
