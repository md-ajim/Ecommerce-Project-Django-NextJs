import { Select, SelectItem, Avatar } from "@nextui-org/react";

export default function CountryList(props) {

  console.log(props, 'props')

  return (
    <Select
      onChange={props.handleCountryChange}
      value={props.value}
   
      selectedKeys={[props.Country]}

      
      className="  bg-transparent text-black   md:w-2/2 "
      label="Select country"
    >
      <SelectItem
        key="argentina"
        value={"argentina"}
        className="  text-black"
        startContent={
          <Avatar
            alt="Argentina"
            className="w-6 h-6"
            src="https://flagcdn.com/ar.svg"
          />
        }
      >
        Argentina
      </SelectItem>
      <SelectItem
        className="  text-black"
        key="venezuela"
        value={"venezuela"}
        startContent={
          <Avatar
            alt="Venezuela"
            className="w-6 h-6"
            src="https://flagcdn.com/ve.svg"
          /> 
        }
      >
        Venezuela
      </SelectItem>
      <SelectItem
        value={"brazil"}
        className="  text-black"
        key="brazil"
        startContent={
          <Avatar
            alt="Brazil"
            className="w-6 h-6"
            src="https://flagcdn.com/br.svg"
          />
        }
      >
        Brazil
      </SelectItem>
      <SelectItem
        value={"switzerland"}
        className="  text-black"
        key="switzerland"
        startContent={
          <Avatar
            alt="Switzerland"
            className="w-6 h-6"
            src="https://flagcdn.com/ch.svg"
          />
        }
      >
        Switzerland
      </SelectItem>
      <SelectItem
        value={"germany"}
        className="  text-black"
        key="germany"
        startContent={
          <Avatar
            alt="Germany"
            className="w-6 h-6"
            src="https://flagcdn.com/de.svg"
          />
        }
      >
        Germany
      </SelectItem>
      <SelectItem
        value={"spain"}
        className="  text-black"
        key="spain"
        startContent={
          <Avatar
            alt="Spain"
            className="w-6 h-6"
            src="https://flagcdn.com/es.svg"
          />
        }
      >
        Spain
      </SelectItem>
      <SelectItem
        value={"france"}
        className="  text-black"
        key="france"
        startContent={
          <Avatar
            alt="France"
            className="w-6 h-6"
            src="https://flagcdn.com/fr.svg"
          />
        }
      >
        France
      </SelectItem>
      <SelectItem
        value={"italy"}
        className="  text-black"
        key="italy"
        startContent={
          <Avatar
            alt="Italy"
            className="w-6 h-6"
            src="https://flagcdn.com/it.svg"
          />
        }
      >
        Italy
      </SelectItem>
      <SelectItem
        value={"mexico"}
        className="  text-black"
        key="mexico"
        startContent={
          <Avatar
            alt="Mexico"
            className="w-6 h-6"
            src="https://flagcdn.com/mx.svg"
          />
        }
      >
        
        Mexico
      </SelectItem>

      <SelectItem
        value={"colombia"}
        className="  text-black"
        key="colombia"
        startContent={
          <Avatar
            alt="Colombia"
            className="w-6 h-6"
            src="https://flagcdn.com/co.svg"
          />
        }
      >
        Colombia
      </SelectItem>

      <SelectItem
        value={"peru"}
        className="  text-black"
        key="peru"
        startContent={
          <Avatar
            alt="Peru"
            className="w-6 h-6"
            src="https://flagcdn.com/pe.svg"
          />
        }
      >
        Peru
      </SelectItem>

      <SelectItem
        value={"ecuador"}
        className="  text-black"
        key="ecuador"
        startContent={
          <Avatar
            alt="Ecuador"
            className="w-6 h-6"
            src="https://flagcdn.com/ec.svg"
          />
        }
      >
        Ecuador
      </SelectItem>

      <SelectItem
        value={"chile"}
        className="  text-black"
        key="chile"
        startContent={
          <Avatar
            alt="Chile"
            className="w-6 h-6"
            src="https://flagcdn.com/cl.svg"
          />
        }
      >
        Chile
      </SelectItem>

      <SelectItem
        value={"uruguay"}
        className="  text-black"
        key="uruguay"
        startContent={
          <Avatar
            alt="Uruguay"
            className="w-6 h-6"
            src="https://flagcdn.com/uy.svg"
          />
        }
      >
        Uruguay
      </SelectItem>

      <SelectItem
        value={"paraguay"}
        className="  text-black"
        key="paraguay"
        startContent={
          <Avatar
            alt="Paraguay"
            className="w-6 h-6"
            src="https://flagcdn.com/py.svg"
          />
        }
      >
        Paraguay
      </SelectItem>

      <SelectItem
        value={"bolivia"}
        className="  text-black"
        key="bolivia"
        startContent={
          <Avatar
            alt="Bolivia"
            className="w-6 h-6"
            src="https://flagcdn.com/bo.svg"
          />
        }
      >
        Bolivia
      </SelectItem>

      <SelectItem
        value={"venezuela"}
        className="  text-black"
        key="venezuela"
        startContent={
          <Avatar
            alt="Venezuela"
            className="w-6 h-6"
            src="https://flagcdn.com/ve.svg"
          />
        }
      >
        Venezuela
      </SelectItem>

      <SelectItem
        value={"guatemala"}
        className="  text-black"
        key="guatemala"
        startContent={
          <Avatar
            alt="Guatemala"
            className="w-6 h-6"
            src="https://flagcdn.com/gt.svg"
          />
        }
      >
        Guatemala
      </SelectItem>

      <SelectItem
        value={"nicaragua"}
        className="  text-black"
        key="nicaragua"
        startContent={
          <Avatar
            alt="Nicaragua"
            className="w-6 h-6"
            src="https://flagcdn.com/ni.svg"
          />
        }
      >
        Nicaragua
      </SelectItem>

      <SelectItem
        value={"Bangladesh"}
        className="  text-black"
        key="Bangladesh"
        startContent={
          <Avatar
            alt="Bangladesh"
            className="w-6 h-6"
            src="https://flagcdn.com/bd.svg"
          />
        }
      >
        Bangladesh
      </SelectItem>
    </Select>
  );
}
