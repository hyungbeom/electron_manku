// import Test from "@/component/Test";
import Test2 from "@/component/Test2";
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

            {ready ? <div style={{padding: 40}}>
                    <h2>견적서 PDF 다운로12드</h2>
                    <PDFDownloadLink
                        document={<Test2/>}
                        fileName="estimate.pdf"
                        style={{
                            textDecoration: 'none',
                            padding: '10px 20px',
                            color: '#fff',
                            backgroundColor: '#007bff',
                            borderRadius: 4
                        }}
                    >
                        {({loading}) => (loading ? 'PDF 생성 중...' : 'PDF 다운로드')}
                    </PDFDownloadLink>
                </div>
                : <></>}
        </div>
    </>

}