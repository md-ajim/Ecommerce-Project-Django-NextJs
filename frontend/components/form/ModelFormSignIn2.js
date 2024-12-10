import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    useDisclosure,
  } from "@nextui-org/react";
  import Link from "next/link";
  import React, { useState } from "react"; // Import useState
  import { useRouter } from "next/router";
  import { useSession } from "next-auth/react";
  import { Spinner } from "@nextui-org/spinner";
  import ModelFormSignUp from "./ModelFormSignUp";
  import { signIn, getCsrfToken } from "next-auth/react";
  
  
  import ModalForgotPassword from "./ModelForgotPassword"

  export default function ModelFormSignIn2() {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [size, setSize] = React.useState("sm");
    const [loading, setLoading] = useState(false);
  
    const sizes = ["sm"];
  
    const handleOpen = (size) => {
      setSize(size);
      onOpen();
    };
  
    const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
    const router = useRouter();
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState(false);
  
    const { data: session, status } = useSession();
  
    // Function to toggle password visibility
    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev);
    };
  
    async function onSubmit(event) {
      setLoading(true);
      event.preventDefault();
  
      const formData = new FormData(event.currentTarget);
      const rememberMe = formData.get("remember");
      console.log(rememberMe, "remember");
      console.log(!!rememberMe, "!!remember");
      const response = await signIn("credentials", {
        redirect: false,
        username: formData.get("username"),
        password: formData.get("password"),
        remember_me: !!rememberMe,
        callbackUrl: `${window.location.origin}`,
      });
  
      if (!response.ok) {
        setLoading(false);
        setError(true);
      } else {
        setLoading(false);
        router.push(response.url);
      }
    }
  
    // if (status === "authenticated") {
    //   router.push("http://localhost:3000/");
    // }
  
    const interval = setInterval(() => {
      setError(false);
  
      clearInterval(interval);
    }, 7000);
  
    return (
      <>
        <div className=" ">
          {sizes.map((size) => (
            <Button key={size} className="text-blue-500 hover:underline  text-center bg-transparent p-0" onPress={() => handleOpen(size)}>
            Sign In 
            </Button>
          ))}
        </div>
     
        <Modal
        className="bg-gray-200 border border-gray-500  flex-none dark:bg-black "
        size={size}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"> Shopfinity</ModalHeader>
              <ModalBody>
                <div className=" dark:bg-black  backdrop-blur-md  dark:text-white   dark:bg-black/15 ">
                  <div className="  rounded-lg shadow-lg ">
                    <h2 className="text-2xl  text-gray-800 dark:text-white  font-bold text-center mb-6">
                      Sign In 
                    </h2>
                    <form method="POST" onSubmit={onSubmit}>
                      {/* Email Input */}
                      <div className="mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium dark:text-slate-200 text-gray-700"
                        >
                          Username
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="text"
                            id="email"
                            name="username"
                            className="block w-full p-3 pl-10 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your email"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {/* Replace this with your email icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="w-5 h-5 dark:text-slate-200 text-gray-700"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                        </div>
                        <span className="textarea-xs text-red-700 font-bold text-center">
                          {error && "Invalid username or password"}
                        </span>
                      </div>

                      {/* Password Input */}
                      <div className="mb-4">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium dark:text-slate-200 text-gray-700"
                        >
                          Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type={showPassword ? "text" : "password"} // Conditional type
                            id="password"
                            className="block w-full p-3 pl-10 pr-10 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
                            name="password"
                            required
                          />
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {/* Replace this with your password icon */}
                            <svg
                              className="w-5 h-5 dark:text-slate-200 text-gray-700"
                              xmlns="http://www.w3.org/2000/svg"
                              width="1em"
                              height="1em"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="currentColor"
                                fill-rule="evenodd"
                                d="M6.75 8a5.25 5.25 0 0 1 10.335-1.313a.75.75 0 0 0 1.452-.374A6.75 6.75 0 0 0 5.25 8v2.055c-1.115.083-1.84.293-2.371.824C2 11.757 2 13.172 2 16s0 4.243.879 5.121C3.757 22 5.172 22 8 22h8c2.828 0 4.243 0 5.121-.879C22 20.243 22 18.828 22 16s0-4.243-.879-5.121C20.243 10 18.828 10 16 10H8q-.677-.001-1.25.004zM8 17a1 1 0 1 0 0-2a1 1 0 0 0 0 2m4 0a1 1 0 1 0 0-2a1 1 0 0 0 0 2m5-1a1 1 0 1 1-2 0a1 1 0 0 1 2 0"
                                clip-rule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            <button
                              type="button"
                              onClick={togglePasswordVisibility}
                              className="focus:outline-none"
                            >
                              {showPassword ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 dark:text-slate-200 text-gray-700"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  {/* Eye-off icon when password is visible */}
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13.875 18.825A8.97 8.97 0 0112 19c-4.477 0-8.268-2.943-9.542-7a9.014 9.014 0 015.392-5.723m4.713-.722A8.971 8.971 0 0112 5c4.478 0 8.268 2.943 9.542 7-.482 1.536-1.244 2.931-2.21 4.106m-1.944 2.32A8.963 8.963 0 0112 19a8.963 8.963 0 01-3.111-.59M3 3l18 18"
                                  />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="w-5 h-5 dark:text-slate-200 text-gray-700"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  strokeWidth={2}
                                >
                                  {/* Eye icon when password is hidden */}
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                  />
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                  />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <span className="textarea-xs text-red-700 font-bold text-center">
                          {error && "Invalid username or password"}
                        </span>
                        <div className="flex justify-between items-center mt-2">
                          <label className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="remember"
                              id="remember"
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm dark:text-slate-200 text-gray-600">
                              Remember me
                            </span>
                          </label>
                          <Link
                            href="#"
                            className="text-sm  text-blue-500 hover:underline"
                          >
                            <ModalForgotPassword />
                          </Link>
                        </div>
                      </div>

                      {/* Sign In Button */}
                      <button
                        type="submit"
                        className="w-full bg-black flex items-center justify-center text-white py-3 rounded-lg hover:bg-gray-950  dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        {loading ? (<div className="loader flex gap-3"> <Spinner size="sm" className="flex justify-center" color="danger" />   <span className="text-sm">Loading...</span>   </div>) : "Sign In"}
                      </button>
                    </form>

                    {/* Sign Up and Social Login */}
                    <div className="mt-6 text-center">
                      <p className="text-sm dark:text-slate-200 text-gray-600">
                        Don't have an account?
                        <ModelFormSignUp onClose={onClose} />
                      </p>
                    </div>
                    <div className="relative my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 rounded-md dark:bg-gray-800 dark:text-slate-200 bg-white text-gray-500">
                          Or with
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => signIn("google")}
                        className="w-full inline-flex justify-center py-2 px-4 border  dark:bg-gray-900 dark:text-slate-200  border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50"
                      >
                        <img
                          src="https://img.icons8.com/color/48/000000/google-logo.png"
                          alt="Google"
                          className="w-6 h-6 mr-2"
                        />
                        Google
                      </button>
                      <button
                        onClick={() => signIn("facebook")}
                        className="w-full inline-flex justify-center py-2 px-4 border  dark:bg-gray-900 dark:text-slate-200  border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50"
                      >
                        <img
                          src="https://img.icons8.com/fluency/48/facebook-new.png"
                          alt="Facebook"
                          className="w-6 h-6 mr-2"
                        />
                        Facebook
                      </button>
                    </div>
                  </div>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      </>
    );
  }
  