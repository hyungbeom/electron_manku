import React, {useRef} from "react";
import Modal from "antd/lib/modal/Modal";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {amountFormat} from "@/utils/columnList";

const cellStyle = {

    border: '1px solid #ddd',
    whiteSpace: 'nowrap',
    padding: 5,

};
const headerStyle = {
    border: '1px solid #ddd',
    width: 60, backgroundColor: '#ebf6f7', fontWeight: 'bold',

    whiteSpace: 'nowrap'
};

export default function PrintTransactionModal({data, customerData, isModalOpen, setIsModalOpen}) {

    const {receiveComp, list} = customerData

    const pdfRef = useRef();

    let totalAmount = 0;
    let totalVat = 0;

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    function formattedNumber(number) {

        return number?.toLocaleString();
    }

    const handleDownloadPDF = async () => {
        const element = pdfRef.current;

        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const bottomMargin = 20; // 하단 여백 (단위: px)

        const canvas = await html2canvas(element, {scale: 2});
        const imgData = canvas.toDataURL("image/png");

        // Calculate image dimensions and split pages
        const imgProps = pdf.getImageProperties(imgData);
        const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add first page
        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
        heightLeft -= (pdfHeight - bottomMargin);

        // Add additional pages if necessary
        while (heightLeft > 0) {
            position -= (pdfHeight - bottomMargin);
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight);
            heightLeft -= (pdfHeight - bottomMargin);
        }

        pdf.save(`${data.documentNumberFull}_견적서.pdf`);
    };


    const handlePrint = () => {
        const printStyles = `
            @media print {
                @page {
                    size: A4;
                    margin: 20mm;
                }
                .page-break {
                    break-before: always;
                }
                .printable-content {
                    page-break-inside: avoid;
                }
            }
        `;

        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = printStyles;
        document.head.appendChild(styleSheet);

        window.print();

        document.head.removeChild(styleSheet);
    };


    return (
        <Modal
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event1}
            width={1000}
            footer={null}
            onOk={() => setIsModalOpen({event1: false, event2: false})}>

            <div style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>거래명세표</div>
            <div style={{textAlign: 'center', fontSize: 14, fontWeight: 'bold', paddingTop: 20}}>거래일자 : 2025-01-26</div>
            <div style={{display: 'flex', gap: 5, justifyContent: 'center', width: 900, paddingTop: 30}}>

                <div style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '25px auto',
                    borderLeft: '1px solid lightGray',
                    fontSize: 12
                }}>
                    <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>
                        공급자
                    </div>
                    <table style={{borderLeft: '1px solid lightGray', width: 423}}>
                        <thead>
                        <tr>
                            <th style={headerStyle}>등록번호</th>
                            <th style={cellStyle} colSpan={3}>714-87-01453</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>상호</th>
                            <th style={cellStyle}>주식회사 만쿠무역</th>
                            <th style={headerStyle}>대표자</th>
                            <th style={cellStyle}>김민국 <img src={'/manku_stamp_only.png'} width={30} alt="" style={{marginLeft : -10}}/></th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>주소</th>
                            <th style={cellStyle} colSpan={3}>
                                <div>서울 송파구 충미로 52 가든파이브웍스</div>
                                <div>B동 2층 211호, 212호</div>
                            </th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>업태</th>
                            <th style={cellStyle}>도매, 도소매</th>
                            <th style={headerStyle}>종목</th>
                            <th style={cellStyle}>무역, 기계자재</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>담당자</th>
                            <th style={cellStyle}>신단비</th>
                            <th style={headerStyle}>전화번호</th>
                            <th style={cellStyle}>02-465-7838</th>
                        </tr>
                        </thead>
                    </table>
                </div>
                <div style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '25px auto',
                    borderLeft: '1px solid lightGray',
                    fontSize: 12
                }}>
                    <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>
                        공급받는자
                    </div>
                    <table style={{borderLeft: '1px solid lightGray', width: 420}}>
                        <thead>
                        <tr>
                            <th style={headerStyle}>등록번호</th>
                            <th style={cellStyle} colSpan={3}>714-87-01453</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>상호</th>
                            <th style={cellStyle}>주식회사 만쿠무역</th>
                            <th style={headerStyle}>대표자</th>
                            <th style={cellStyle}>김민국 </th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>주소</th>
                            <th style={cellStyle} colSpan={3}>
                                <div>서울 송파구 충미로 52 가든파이브웍스</div>
                                <div>B동 2층 211호, 212호</div>
                            </th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>업태</th>
                            <th style={cellStyle}>전기사업, 중기및 난방, 건설업, 도매 및 소매업</th>
                            <th style={headerStyle}>종목</th>
                            <th style={cellStyle}>무역, 기계자재</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>담당자</th>
                            <th style={cellStyle}>신단비</th>
                            <th style={headerStyle}>전화번호</th>
                            <th style={cellStyle}>02-465-7838</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <table style={{width: 900, fontSize : 11}}>
                <thead>
                <tr>
                    <th style={headerStyle}>NO</th>
                    <th style={headerStyle}>날짜</th>
                    <th style={headerStyle}>품목</th>
                    <th style={headerStyle}>수량</th>
                    <th style={headerStyle}>단가</th>
                    <th style={headerStyle}>공급가액</th>
                    <th style={headerStyle}>세액</th>
                    <th style={headerStyle}>비고</th>
                </tr>
                </thead>
                <thead>
                {list?.map((v, i)=> {
                    return <tr>
                        <th style={cellStyle}>{i + 1}</th>
                        <th style={cellStyle}>이거 어디 데이터지? 직접입력인가?</th>
                        <th style={cellStyle}>{v.model}</th>
                        <th style={cellStyle}>{v.quantity}</th>
                        <th style={cellStyle}>{amountFormat(v.unitPrice)}</th>
                        <th style={cellStyle}>{amountFormat(v.unitPrice * v.quantity)}</th>
                        <th style={cellStyle}>{amountFormat((v.unitPrice * v.quantity) * 0.1)}</th>
                        <th style={cellStyle}>비고값 안가져오는거같음?</th>
                    </tr>
                })
                }
                </thead>
            </table>
            <table style={{width: 900, fontSize: 12}}>
                <thead>
                <tr>
                    <th style={headerStyle}>공급가액</th>
                    <th style={cellStyle}>46,500,000</th>
                    <th style={headerStyle}>세액</th>
                    <th style={cellStyle}>46,500,000</th>
                    <th style={headerStyle}>합계</th>
                    <th style={cellStyle}>46,500,000</th>
                    <th style={headerStyle}>미수금</th>
                    <th style={cellStyle}>미수금 정보?</th>
                    <th style={headerStyle}>인수자</th>
                    <th style={cellStyle}>{data.managerAdminName}</th>
                </tr>
                </thead>
            </table>
        </Modal>
    )
}
