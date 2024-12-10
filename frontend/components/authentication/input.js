import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useState } from "react";

export default function InputPage(props) {
  return (
    <>
      <PhoneInput
        country="bd"
        inputStyle={{
          width: "100%",
          height: "55px",
          borderRadius: "8px",
          border: "1px solid #cfd8dc",
          paddingLeft: "48px", // Adjust padding for the flag
        
        
            // backgroundColor: "#f8f9fa",
            backgroundColor: 'transparent',
            color: '#1E40AF',
            boxShadow: '0 0 4px rgba(0, 0, 0, 0.1)',
        }}
        containerStyle={{
          backgroundColor: 'transparent',
          borderRadius: "8px",
          border: "1px solid #90caf9",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
          padding: "0",
        }}
        buttonStyle={{
     
          border: "none",
          backgroundColor: "transparent",
          padding: "0 12px",
        }}
        dropdownStyle={{
       
          borderRadius: "8px",
          border: "1px solid #cfd8dc",
        }}
        value={props.phone}
        onChange={props.onChange}
      />
    </>
  );
}
