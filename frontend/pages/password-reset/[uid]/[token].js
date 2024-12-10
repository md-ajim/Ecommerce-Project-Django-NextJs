import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function PasswordResetView() {
  const [new_password, setNew_Password] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { uid, token } = router.query;

  const handelSubmit = async (e) => {
    const url = `http://127.0.0.1:8000/auth/password-reset/${uid}/${token}/`;
    e.preventDefault();
    setIsLoading(true);

    try {
      axios
        .post(url, {
          new_password: new_password,
          confirm_password: confirmPassword,
        })
        .then((res) => {
          console.log(res.data, "res.data");
          setSuccess(true);
          setError(false);
        })
        .catch((err) => {
          setError(true);
          setSuccess(false);
        });
    } catch (error) {
      console.log(error);
      setError(true);
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (success) {
        setSuccess(false);
      }
      if (error) {
        setError(false);
      }
    }, 3000);

    return () => clearInterval(interval);
  });

  console.log(new_password, "new_password");
  console.log(confirmPassword, "confirmPassword");

  return (
    <div className="min-h-screen flex items-center justify-center  bg-black">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {success && (
          <div className="text-center">
            <p className="text-lg text-gray-700">Password reset successful!</p>
          </div>
        )}

        { 
          error && (
            <div className="text-center">
              <p className="text-lg text-red-500">Password reset failed!</p>
            </div>
          )
        }
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Reset Your Password
        </h2>

        <form onSubmit={handelSubmit} className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              New Password
            </label>
            <input
              type="password"
              name="password"
              placeholder="Enter new password"
              id="password"
              value={new_password}
              onChange={(e) => setNew_Password(e.target.value)}
              className="w-full mt-1 p-2  text-black border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="confirm-password"
            >
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirm-password"
              placeholder="Confirm new password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300  text-black  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
