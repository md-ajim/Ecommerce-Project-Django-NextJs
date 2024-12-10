import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import React from "react";

import { Spinner } from "@nextui-org/spinner";
import axios from "axios";

function Icon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6"
    >
      <path
        fillRule="evenodd"
        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const Activation = () => {
  const router = useRouter();
  const { uid, token } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [errorMessage, setErrorMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  useEffect(() => {
    const activateUser = async (uid, token) => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/auth/activate/${uid}/${token}/`
        );

        // Optionally handle success response
        setSuccess(response.data);
        setSuccessMessage(true);
      } catch (error) {
        // Optionally handle error response
        setErrorMessage(true);
        setError(error.response.data)
 
      } finally {
        setLoading(false);
      }
    };

    if (uid && token) {
      activateUser(uid, token);
    }
  }, [uid, token]);

  const interVal = setInterval(() => {
    if (successMessage) {
      setSuccessMessage(false);
      router.push("/form/signIn");
    }
    if (errorMessage) {
      setErrorMessage(false);
      // router.push("/form/signIn");
    }

    clearInterval(interVal);
  }, 3000);

  console.log(error, "error");
  console.log(success, "success");

  return (
    <div className="mt-5 w-auto mx-auto ">
      {loading ? (
        <Spinner
          className="h-20 w-20 text-center mx-auto"
          label="Loading..."
          color="success"
          labelColor="success"
        >
          Activating user...
        </Spinner>
      ) : (
        <div>
          <div className="w-2/3 mx-auto">
            {successMessage && (
              <p
                icon={<Icon />}
                className=" p-4 mx-auto rounded-xl border-l-4 border-[#2ec946] bg-[#2ec946]/10 font-medium text-[#2ec946]"
              >
                {success}
              </p>
            )}
          </div>

          {errorMessage && (
            <p className=" text-center mx-auto rounded-lg text-red-500" color="red">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Activation;
