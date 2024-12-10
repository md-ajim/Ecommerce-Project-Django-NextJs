import InputPage from "./input";
import { Select, SelectItem, Avatar, Input, Link } from "@nextui-org/react";
import CountryList from "./CountryList";
import { Button } from "@nextui-org/react";
import { UserIcon } from "./UserIcon";
import { CameraIcon } from "./CameraIcon";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Loading from "../loading";

export default function EditProfile() {
  const { data: session, status, update } = useSession();
  const [user, setUser] = useState(null);
  const [Username, setUsername] = useState("");
  const [Email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [Country, setCountry] = useState("");
  const [City, setCity] = useState("");
  const [Address, setAddress] = useState("");
  const [PostalCode, setPostalCode] = useState("");
  const [Address2, setAddress2] = useState("");
  const [State, setState] = useState("");
  const [PhoneNumber, setPhoneNumber] = useState("");
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [errorMassage, setErrorMassage] = useState(false);
  const [success, setSuccess] = useState(null);
  const [phone, setPhone] = useState("us");
  const [edit, setEdit] = useState(false);
  const [putUser, setPutUser] = useState(null);
  const [preview, setPreview] = useState(null);
  const [addressEdits, setAddressEdits] = useState(false);
  const [address_data, setAddress_data] = useState(null);
  const [address_loading, setAddress_loading] = useState(false);
  const [address_message, setAddress_message] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const getUser = async () => {
      setLoading(true);

      try {
        const response = await axios.get(
          `http://127.0.0.1:8000/api/get_user/${session?.user?.user_id}/`,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        // Update state with user data
        const userData = response.data;
        setPutUser(userData);
        setUsername(userData?.username);
        setEmail(userData?.email);
        setFirstName(userData?.first_name);
        setLastName(userData?.last_name);
        setPhone(userData?.phone);
        setPreview(userData?.profile_image);

        // Fetch the image as a Blob
        const imageUrl = userData?.profile_image;
        const imageName = imageUrl.split("/").pop();

        const fetchImageAsFile = async () => {
          const imageResponse = await fetch(imageUrl);
          const blob = await imageResponse.blob();
          const file = new File([blob], imageName, { type: blob.type });
          setProfilePic(file); // Update the state with the File object
        };

        await fetchImageAsFile();
      } catch (err) {
        console.error(err, "Error fetching user data");
      } finally {
        setLoading(false);
      }
    };

    const getAddress = async () => {
      setAddress_loading(true);
      try {
        await axios
          .get(`http://127.0.0.1:8000/api/addresses/`, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((response) => {
            const currentUserAddress = response?.data?.results?.filter(
              (address) => address.user === session.user.user_id
            );
            setCountry(currentUserAddress[0]?.country);
            setCity(currentUserAddress[0]?.city);
            setAddress(currentUserAddress[0]?.address);
            setPostalCode(currentUserAddress[0]?.postal_code);
            setAddress2(currentUserAddress[0]?.address_line1);
            setState(currentUserAddress[0]?.state);
            setAddress_data(currentUserAddress[0]);
          });
      } catch (err) {
        console.log(err, "err");
      } finally {
        setAddress_loading(false);
      }
    };

    if (!edit) {
      getUser();
    }
    if (!addressEdits) {
      getAddress();
    }
  }, [session]);

  const createUser = async (e) => {
    e.preventDefault();
    if (preview !== null) {
      setLoading(true);
      try {
        const formData = new FormData();
        formData.append("username", Username);
        formData.append("email", Email);
        formData.append("phone", phone);
        formData.append("first_name", FirstName);
        formData.append("last_name", LastName);
        formData.append("profile_image", profilePic);

        const response = await axios.put(
          `http://127.0.0.1:8000/api/get_user/${session?.user?.user_id}/`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );
        setSuccess(true);
        window.location.reload();
      } catch (error) {
        setError(error);
        console.log(error, "error");
        setErrorMassage(true);
        setSuccess(false);
        console.error("Error updating user:", error);
      } finally {
        setLoading(false);
      }
    }

    if (preview === null) {

      return alert("Please select an image to upload.");
    }
  };

  const updateAddress = async (e) => {
    e.preventDefault();
    setAddressEdits(false);
    setAddress_loading(true);

    try {
      const address = {
        country: Country,
        city: City,
        address: Address,
        postal_code: PostalCode,
        address_line1: Address2,
        state: State,
        user: session?.user?.user_id,
      };

      if (address_data?.user !== session?.user?.user_id) {
        const response = await axios
          .post(`http://127.0.0.1:8000/api/addresses/`, address, {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          })
          .then((response) => {
            console.log(response, "post_data");
            setAddress_message(true);

            window.location.reload();
          })
          .catch((err) => {
            setAddress_message(false);
            console.log(err, "error");
          });
      }

      if (address_data?.user === session?.user?.user_id) {
        const address = {
          country: Country,
          city: City,
          address: Address,
          postal_code: PostalCode,
          address_line1: Address2,
          state: State,
          user: session?.user?.user_id,
        };

        const response = await axios.put(
          `http://127.0.0.1:8000/api/addresses/${address_data?.id}/`,
          address,
          {
            headers: {
              Authorization: `Bearer ${session?.accessToken}`,
            },
          }
        );

        setAddress_message(true);
        console.log(response, "res");
        window.location.reload(); // Avoid using this if possible; consider re-fetching data instead.
      }
    } catch (error) {
      setError(error);
      setErrorMassage(true);
      setAddress_message(false);
      console.error("Error updating user:", error);
    } finally {
      setAddress_loading(true);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePic(file);
      setPreview(URL.createObjectURL(file)); // Display a preview of the image
    }
  };

  const DeleteUser = async () => {
    try {
      const response = await axios.delete(
        `http://127.0.0.1:8000/api/users/${session?.user?.user_id}/`,
        {
          headers: {
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );
      signOut("signOut");
      router.push("/");
    } catch (error) {
      setError(error);
      console.error("Error updating user:", error);
    }
  };

  useEffect(() => {
    if (status === 'unauthenticated') {

      router.push('/');

    }
  }, [status]);

  if (status === "loading") {
    return <Loading />;
  }

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };



  if (status === "authenticated") {
    return (
      <section className="dark:bg-black bg-white dark:text-white" >
        <div className="container mb-6 py-5 px-4 dark:bg-black text-black">
          <div className="px-4 sm:px-8 lg:px-20 max-w-7xl  rounded-lg gap-4">
            <h1 className="text-2xl font-bold text-start dark:text-white py-8">
              Account Settings
            </h1>

            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="flex justify-center items-center">
                <img
                  className="rounded-full w-28 h-28 object-cover"
                  alt="Profile"
                  src={putUser?.profile_image}
                />
              </div>

              <div className="flex justify-center items-center mt-4 sm:mt-0">
                <div className="flex space-x-4">
                  <div className="flex gap-4 items-center">
                    <Input
                      className=" max-w-xs text-sm font-medium leading-relaxed dark:text-white text-gray-600"
                      color="success"
                      type="file"
                      // accept="image/*"
                      onChange={handleFileChange}
                      endContent={<CameraIcon />}
                    >
                      Take a photo
                    </Input>
                    <Button

                      onClick={DeleteUser}

                      color="danger"
                      variant="bordered"
                      startContent={<UserIcon />}
                    >
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 py-8   gap-4">
              <form>
                <div className="flex flex-col gap-6 ">
                  <h4 className="text-gray-900  dark:text-white text-xl font-semibold">
                    Account Information
                  </h4>
                  <div className="flex flex-col gap-8">
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor=""
                        className="flex gap-1 items-center dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                      >
                        Email
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={7}
                          height={7}
                          viewBox="0 0 7 7"
                          fill="none"
                        >
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <input
                        type="text"
                        value={Email}
                        disabled
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full text-gray-900 placeholder-gray-400 dark:text-slate-200 text-lg px-5 py-3 rounded-lg border border-gray-200"
                        placeholder="john@example.com"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-gray-600 text-base font-medium">
                        <label
                          htmlFor=""
                          className="flex gap-1 items-center dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                        >
                          Username
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={7}
                            height={7}
                            viewBox="0 0 7 7"
                            fill="none"
                          >
                            <path
                              d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                              fill="#EF4444"
                            />
                          </svg>
                        </label>
                      </label>
                      <input
                        type="text"
                        value={Username}
                        disabled
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full text-gray-900  dark:text-slate-200 placeholder-gray-400 text-lg px-5 py-3 rounded-lg border border-gray-200"
                        placeholder="John"
                      />
                    </div>
                    <div className="flex sm:flex-row flex-col gap-7">
                      <div className="flex flex-col gap-1.5 sm:w-1/2">
                        <label
                          htmlFor=""
                          className="flex gap-1 items-center dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                        >
                          First Name
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={7}
                            height={7}
                            viewBox="0 0 7 7"
                            fill="none"
                          >
                            <path
                              d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                              fill="#EF4444"
                            />
                          </svg>
                        </label>
                        <input
                          value={FirstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          type="text"
                          className="w-full text-gray-900 dark:text-slate-200 placeholder-gray-400 text-lg px-5 py-3 rounded-lg border border-gray-200"
                          placeholder="John"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5 sm:w-1/2">
                        <label
                          htmlFor=""
                          className="flex gap-1 items-center  dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                        >
                          Last Name
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width={7}
                            height={7}
                            viewBox="0 0 7 7"
                            fill="none"
                          >
                            <path
                              d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                              fill="#EF4444"
                            />
                          </svg>
                        </label>
                        <input
                          type="text"
                          value={LastName}
                          onChange={(e) => setLastName(e.target.value)}
                          className="w-full text-gray-900 placeholder-gray-400 dark:text-slate-200 text-lg px-5 py-3 rounded-lg border border-gray-200"
                          placeholder="Smith"
                        />
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label
                        htmlFor=""
                        className="flex gap-1 items-center  dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                      >
                        Phone number
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={7}
                          height={7}
                          viewBox="0 0 7 7"
                          fill="none"
                        >
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <InputPage
                        phone={phone}
                        onChange={(value) => setPhone(value)}
                      />
                    </div>
                  </div>

                  <div className="  flex gap-4 ">
                    <Button
                      type="submit"
                      onClick={createUser}
                      isLoading={loading}
                      color="success"
                      size="md"
                      spinner={
                        <svg
                          className="animate-spin h-5 w-5 text-current"
                          fill="none"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                          />
                        </svg>
                      }
                    >
                      {loading ? "Loading..." : "Update Profile"}
                    </Button>
                  </div>
                </div>
              </form>

              <div className="flex flex-col gap-6  ">
                <h4 className="text-gray-900 text-xl font-semibold dark:text-white">
                  Address Information
                </h4>
                <div className="flex flex-col gap-8">
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor=""
                      className="flex gap-1 items-center  dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                    >
                      Address
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={7}
                        height={7}
                        viewBox="0 0 7 7"
                        fill="none"
                      >
                        <path
                          d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                          fill="#EF4444"
                        />
                      </svg>
                    </label>
                    <input
                      type="text"
                      value={Address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-gray-900 dark:text-slate-200  placeholder-gray-400 text-lg px-5 py-3 rounded-lg border border-gray-200"
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label
                      htmlFor=""
                      className="flex gap-1 items-center text-gray-600 text-base font-medium leading-relaxed"
                    >
                      Address 2
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={7}
                        height={7}
                        viewBox="0 0 7 7"
                        fill="none"
                      >
                        <path
                          d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                          fill="#EF4444"
                        />
                      </svg>
                    </label>
                    <input
                      type="text"
                      value={Address2}
                      onChange={(e) => setAddress2(e.target.value)}
                      className="w-full text-gray-900 placeholder-gray-400 dark:text-slate-200 text-lg px-5 py-3 rounded-lg border border-gray-200"
                      placeholder="Apt 4B"
                    />
                  </div>
                  <div className="flex sm:flex-row flex-col gap-7">
                    <div className="flex flex-col gap-1.5 sm:w-1/2">
                      <label
                        htmlFor=""
                        className="flex gap-1 items-center  dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                      >
                        City
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={7}
                          height={7}
                          viewBox="0 0 7 7"
                          fill="none"
                        >
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <input
                        value={City}
                        onChange={(e) => setCity(e.target.value)}
                        type="text"
                        className="w-full text-gray-900 placeholder-gray-400 dark:text-slate-200 text-lg px-5 py-3 rounded-lg border border-gray-200"
                        placeholder="New York"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:w-1/2">
                      <label className="text-gray-600 text-base font-medium">
                        State
                      </label>
                      <input
                        value={State}
                        onChange={(e) => setState(e.target.value)}
                        type="text"
                        className="w-full text-gray-900  dark:text-white placeholder-gray-400 text-lg dark:text-slate-200 px-5 py-3 rounded-lg border border-gray-200"
                        placeholder="NY"
                      />
                    </div>
                  </div>

                  <div className="flex sm:flex-row flex-col gap-7">
                    <div className="flex flex-col gap-1.5 sm:w-1/2">
                      <label
                        htmlFor=""
                        className="flex gap-1 items-center  dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                      >
                        Zip Code
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={7}
                          height={7}
                          viewBox="0 0 7 7"
                          fill="none"
                        >
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <input
                        value={PostalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        type="text"
                        className="w-full text-gray-900 placeholder-gray-400 dark:text-slate-200 text-lg px-5 py-3 rounded-lg border border-gray-200"
                        placeholder="New York"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5 sm:w-1/2">
                      <label
                        htmlFor=""
                        className="flex gap-1 items-center  dark:text-white text-gray-600 text-base font-medium leading-relaxed"
                      >
                        County
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={7}
                          height={7}
                          viewBox="0 0 7 7"
                          fill="none"
                        >
                          <path
                            d="M3.11222 6.04545L3.20668 3.94744L1.43679 5.08594L0.894886 4.14134L2.77415 3.18182L0.894886 2.2223L1.43679 1.2777L3.20668 2.41619L3.11222 0.318182H4.19105L4.09659 2.41619L5.86648 1.2777L6.40838 2.2223L4.52912 3.18182L6.40838 4.14134L5.86648 5.08594L4.09659 3.94744L4.19105 6.04545H3.11222Z"
                            fill="#EF4444"
                          />
                        </svg>
                      </label>
                      <CountryList
                        handleCountryChange={handleCountryChange}
                        Country={Country}
                      />
                    </div>
                  </div>
                </div>

                <div className=" flex gap-4">
                  <Button
                    onClick={updateAddress}
                    spinner={
                      <svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          fill="currentColor"
                        />
                      </svg>
                    }
                    isLoading={address_loading}
                    color="danger"
                  >
                    Update Address
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }



}
