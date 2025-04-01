
import React, {useEffect, useState} from "react";
import dynamic from "next/dynamic";
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false }
);

export default function tester() {

    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(true)
    }, []);

    return <>

        <div>


        </div>
    </>

}