import {useState} from "react";
import {SearchOutlined} from "@ant-design/icons";

const AddressSearch = ({ onComplete }) => {
    const [isOpen, setIsOpen] = useState(false);

    // @ts-ignore
    const windows:any = window?.daum;
    const handleOpenPostcode = () => {
        if (!windows.Postcode) {
            console.error("Daum Postcode API is not loaded");
            return;
        }

        setIsOpen(true);

        new windows.Postcode({
            oncomplete: (data) => {
                console.log(data.zonecode,'data::')
                const fullAddress = data.address;
                const extraAddress = data.bname || data.buildingName
                    ? ` (${data.bname || ""}${data.bname && data.buildingName ? ", " : ""}${data.buildingName || ""})`
                    : "";

                onComplete(fullAddress + extraAddress, data.zonecode);
                setIsOpen(false);
            },
            onclose: () => {
                setIsOpen(false);
            },
        }).open();
    };

    return <SearchOutlined onClick={handleOpenPostcode}/>

};

export default AddressSearch;