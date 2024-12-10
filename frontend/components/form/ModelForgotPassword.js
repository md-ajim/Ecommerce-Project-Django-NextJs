import {Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, useDisclosure} from "@nextui-org/react";
import { useState , useEffect } from "react";
import ForgotPassword from "./Forgot password";
import axios from "axios";

export default function ModalForgotPassword() {
  
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Handle form submission
  const handleSubmit = async (e) => {
    setSubmitted(true);
    console.log(email, 'email');

    console.log('called is function');
    e.preventDefault();

    try {

      const res = await axios
        .post("http://127.0.0.1:8000/auth/password-reset/", {email })
        .then((response) => {
          console.log(response.data, "response.data");
        })
        .catch((error) => {
          console.log(error);
         
        });
      // Here you would handle the password reset request, e.g., send a request to the server
      console.log("Password reset email sent to:", email);

    }
    catch (error) {
      console.log(error);
    }
  };

  const {isOpen, onOpen, onOpenChange} = useDisclosure();


  useEffect(()=>{

  },[setEmail])

  

  return (
    <>
      <Button className="bg-transparent p-0 text-sm text-blue-500 hover:underline" onPress={onOpen}>forgot password</Button>
      <Modal className="dark:bg-black dark:text-white" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1"></ModalHeader>
              <ModalBody>
               <ForgotPassword handleSubmit={handleSubmit} setEmail={setEmail} email={email} submitted={submitted} />
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