import React from 'react';
import dynamic from "next/dynamic";
import {PdfForm} from "@/component/견적서/PdfForm";


// PDFViewer를 동적으로 불러오면서 SSR을 비활성화
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    {ssr: false}
);


export default function App() {
    return (
        <div style={{width: '100%', height: '100vh'}}>
            <PDFViewer width="100%" height="100%">

            </PDFViewer>
        </div>
    );
}