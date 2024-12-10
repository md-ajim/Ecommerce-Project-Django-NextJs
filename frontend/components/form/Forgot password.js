import React, { useState } from "react";
import axios from "axios";
import ModelFormSignIn2 from "./ModelFormSignIn2";
const  ForgotPassword =  ({ handleSubmit, email, setEmail, submitted}) => {
  return (
    <div className="">
      <div className=" dark:bg-black dark:text-white  rounded-lg  ">
        <h2 className="text-2xl font-bold dark:text-slate-200  text-gray-800 text-center  mb-6">Forgot Password</h2>
        {submitted ? (
          <div className="text-center">
            <p className="text-lg dark:text-slate-200  text-gray-700">
              If an account with that email exists, a password reset link has
              been sent.
            </p>
          </div>
        ) : (
          <form method="post" >
            {/* Email Input */}
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium dark:text-slate-200  text-gray-700"
              >
                Enter your email
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full p-3 pl-4 border dark:text-slate-200  text-gray-700 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-full bg-black  dark:bg-gray-800 text-white py-3 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send Reset Link
            </button>
          </form>
        )}

        {/* Back to Sign In */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Remembered your password?{" "}
            <a href="#" className="text-blue-500 hover:underline">
              <ModelFormSignIn2 />
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}


export default ForgotPassword;