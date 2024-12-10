
import EditProfile from "../components/authentication/account-settings"
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { Spinner } from "@nextui-org/react";

export default function Account_SettingsPage(){
    const { data: session, status, update } = useSession();
    const router = useRouter();

 
  
    // if (status === "loading") {
    //   return (
    //     <div className="flex justify-center items-center h-screen">
    //       <Spinner
    //         className="mt-10  text-center "
    //         size="lg"
    //         label="Loading..."
    //         color="warning"
    //       />
    //     </div>
    //   );
    // }
  
    return (
      <>
        <EditProfile />
      </>
    );
}