import React, {useEffect, useState} from "react";
import {SearchOutlined} from "@ant-design/icons";
import Script from "next/script";

const AddressSearch = ({onComplete}) => {
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);

    useEffect(() => {
        // @ts-ignore
        if (typeof window !== "undefined" && window.daum && window.daum.Postcode) {
            setIsScriptLoaded(true);
        }
    }, []);


    const handleOpenPostcode = () => {
        if (!isScriptLoaded) {
            console.error("Daum Postcode API is not loaded");
            return;
        }

        // @ts-ignore
        new window.daum.Postcode({
            oncomplete: (data: any) => {
                const fullAddress = data.address;
                const extraAddress = data.bname || data.buildingName
                    ? ` (${data.bname || ""}${data.bname && data.buildingName ? ", " : ""}${data.buildingName || ""})`
                    : "";

                onComplete(fullAddress + extraAddress, data.zonecode);
            },
        }).open();
    };


    return <>
        <Script
            src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
            strategy="lazyOnload"
            onLoad={() => setIsScriptLoaded(true)}
        />
        <SearchOutlined onClick={handleOpenPostcode}/>
    </>

};

export default AddressSearch;