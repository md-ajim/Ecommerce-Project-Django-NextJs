import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@nextui-org/react";

import ModelFormSignIn2 from "./ModelFormSignIn2";

import Link from "next/link";
import React, { useState, useEffect } from "react"; // Import useState
import { Spinner } from "@nextui-org/spinner";
import axios from "axios";
import { useSession } from "next-auth/react";

export default function ModelFormSignUp() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [size, setSize] = React.useState("sm");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState([]);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const { data: session, status } = useSession();


  const sizes = ["sm"];

  const handleOpen = (size) => {
    setSize(size);
    onOpen();
  };

  useEffect(() => { }, [showPassword]);

  // Function to toggle password visibility
  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = {
      username: username,
      email: email,
      password: password,
    };

    try {
      const res = axios
        .post("http://127.0.0.1:8000/auth/register/", data)
        .then((response) => {
          setSuccessMessage(true);
        })
        .catch((error) => {
          if (error?.response?.data["username"]) {
            setError(error?.response?.data);
            setUsernameError(true);
          }

          if (error?.response?.data["email"]) {
            setError(error?.response?.data);
            setEmailError(true);
          }
          if (error?.response?.data["password"]) {
            setError(error?.response?.data);
            setPasswordError(true);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    } catch (error) {
      console.log(error);
    }
  };

  const interVal = setInterval(() => {
    if (successMessage) {
      setSuccessMessage(false);
    }
    if (errorMessage) {
      setErrorMessage(false);
    }
    if (emailError) {
      setEmailError(false);
    }
    if (usernameError) {
      setUsernameError(false);
    }
    if (passwordError) {
      setPasswordError(false);
    }
    clearInterval(interVal);
  }, 4000);


  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner
          size="xl"
          aria-label="Center-aligned spinner example"
          color="primary"
        />
      </div>
    );
  }


  return (
    <>
      <div className=" ">
        {sizes.map((size) => (
          <Button className="text-blue-500 hover:underline  bg-transparent text-center p-0" key={size} onPress={() => handleOpen(size)}>
            {" "}
            Sign Up{" "}
          </Button>
        ))}
      </div>
      <Modal className='bg-gray-200 border border-gray-500  flex-none dark:bg-black ' size={size} isOpen={isOpen} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Sign Up
              </ModalHeader>
              <ModalBody>
                <div className="dark:bg-black  backdrop-blur-md  dark:text-white   dark:bg-black/15 ">
                  <div className=" rounded-lg shadow-lg">
                    <p className="text-center alert-success rounded-lg   font-bold  text-green-700   ">
                      {" "}
                      {successMessage
                        ? " Account created successfully. Please Active your account"
                        : ""}{" "}
                    </p>

                    <h2 className="text-2xl  text-gray-800 dark:text-white  font-bold text-center mb-6">
                      Sign Up
                    </h2>
                    <form className="md:mb-4" onSubmit={handleSubmit}>
                      {/* username Input */}
                      <div className="md:mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium dark:text-slate-200 text-gray-700"
                        >
                          Username
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm ">
                          <input
                            type="text"
                            onChange={(e) => setUsername(e.target.value)}
                            id="name"
                            value={username}
                            className="block w-full p-3 pl-10 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your username"
                            required
                          />

                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            {/* Replace this with your username icon */}
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
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                              />
                            </svg>
                          </div>
                        </div>
                        <span className="textarea-xs text-red-700 font-bold text-center">
                          {usernameError && error.username[0]}
                        </span>
                      </div>

                      {/* Email Input */}
                      <div className="md:mb-4">
                        <label
                          htmlFor="email"
                          className="block text-sm font-medium dark:text-slate-200 text-gray-700"
                        >
                          Email
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            type="email"
                            value={email}
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
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
                          {emailError ? error?.email[0] : null}
                        </span>
                      </div>

                      {/* Password Input */}
                      <div className="md:mb-4">
                        <label
                          htmlFor="password"
                          className="block text-sm font-medium dark:text-slate-200 text-gray-700"
                        >
                          Password
                        </label>
                        <div className="mt-1 relative rounded-md shadow-sm">
                          <input
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            type={showPassword ? "text" : "password"} // Conditional type
                            id="password"
                            className="block w-full p-3 pl-10 pr-10 border text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter your password"
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
                          {passwordError ? error?.password[0] : null}
                        </span>

                        <div className="flex justify-between items-center mt-2"></div>
                      </div>

                      {/* Sign In Button */}
                      {isLoading ? (
                        <Spinner className="w-full align-center text-center items-center">
                          Loading...
                        </Spinner>
                      ) : (
                        <button
                          type="submit"
                          className="w-full bg-black flex items-center justify-center text-white py-3 rounded-lg hover:bg-gray-950  dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Sign Up
                        </button>
                      )}
                    </form>

                    {/* Sign Up and Social Login */}
                    <div className=" md:mb-4 mt-1 md:mt-0 text-center">
                      <p className="text-sm dark:text-slate-200 text-gray-600">
                        Already have an account?{" "}

                        < ModelFormSignIn2 onClose={onClose} />
                      </p>
                    </div>
                    <div className="relative my-3 md:my-6">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300" />

                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-800 dark:text-slate-200 rounded-md text-gray-500">
                          Or with
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => signIn("google")}
                        className="w-full inline-flex justify-center py-2 px-4 border  dark:bg-gray-900 dark:text-slate-200 border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50"
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
                        className="w-full inline-flex justify-center py-2 px-4 border  dark:bg-gray-900 dark:text-slate-200 border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50"
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
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
