import {Spinner} from "@nextui-org/react";

export default function Loading() {
  return (
    <>
    
    <div className="flex justify-center items-center h-screen" >
    <Spinner className="mt-10  text-center " size="lg" label="Loading..." color="warning" />
    </div>
    
    </>
  );
}