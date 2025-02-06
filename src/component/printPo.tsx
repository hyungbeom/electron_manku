import React, {useEffect, useRef, useState} from "react";
import Modal from "antd/lib/modal/Modal";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {gridManage} from "@/utils/commonManage";

export default function PrintPo({data, isModalOpen, setIsModalOpen, gridRef}) {
    const {orderDetail, customerInfo} = data;
    const pdfRef = useRef<any>();
    const pdfSubRef = useRef<any>();

    let totalAmount = 0;
    let totalQuantity = 0;
    let unit = '';
    let currency = '';

    const [splitData, setSplitData] = useState([]);

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    function formattedNumber(number) {
        return number?.toLocaleString();
    }

    useEffect(() => {
        const totalList = gridManage.getAllData(gridRef)
        const splitData = splitDataWithSequenceNumber(totalList, 23, 36);
        setSplitData(splitData)
    }, [data])

    function splitDataWithSequenceNumber(data, firstLimit = 20, nextLimit = 30) {
        const result = [];
        let currentGroup = [];
        let currentCount = 0;
        let currentLimit = firstLimit; // 첫 번째 그룹은 20줄 제한
        let sequenceNumber = 1; // ✅ 전체 데이터에서 순서를 추적하는 시퀀스 넘버

        data.forEach(item => {
            const model = item.model || '';
            const lineCount = model.split('\n').length;

            // 현재 그룹에 추가해도 제한을 넘지 않으면 추가
            if (currentCount + lineCount <= currentLimit) {
                currentGroup.push({...item, sequenceNumber}); // ✅ 각 객체에 순서 추가
                currentCount += lineCount;
                sequenceNumber++; // ✅ 순서 증가
            } else {
                // 현재 그룹을 result에 추가하고 새로운 그룹 시작
                result.push(currentGroup);
                currentGroup = [{...item, sequenceNumber}]; // ✅ 새로운 그룹의 첫 번째 아이템
                currentCount = lineCount;
                sequenceNumber++; // ✅ 순서 증가

                // ✅ 첫 번째 그룹 이후부터는 기준을 30으로 변경
                currentLimit = nextLimit;
            }
        });

        // 마지막 그룹이 남아있으면 추가
        if (currentGroup.length > 0) {
            result.push(currentGroup);
        }

        return result;
    }

    const generatePDF = async (printMode = false) => {
        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();

        if (pdfRef.current) {
            const firstCanvas = await html2canvas(pdfRef.current, { scale: 2 });
            const firstImgData = firstCanvas.toDataURL("image/png");
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;
            pdf.addImage(firstImgData, "PNG", 0, 0, pdfWidth, firstImgHeight);
        }

        const elements = pdfSubRef.current.children;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const canvas = await html2canvas(element, { scale: 2 });
            const imgData = canvas.toDataURL("image/png");
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
        }

        if (printMode) {
            const pdfBlob = pdf.output("bloburl");
            window.open(pdfBlob, "_blank");
        } else {
            pdf.save(`${data.documentNumberFull}_견적서.pdf`);
        }
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
            title={<div style={{width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <div>발주서 출력</div>
                <div>
                    <button onClick={() => generatePDF(false)} style={{
                        padding: "5px 10px",
                        backgroundColor: "#1890ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: 11,
                        marginRight: 10
                    }}>
                        PDF
                    </button>
                    {/*@ts-ignore*/}
                    <button  onClick={() => generatePDF(true)} style={{
                        padding: "5px 10px",
                        backgroundColor: "gray",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: 11,
                        marginRight: 20
                    }}>
                        인쇄
                    </button>
                </div>
            </div>}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event2}
            width={'640px'}
            footer={null}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
        >
            <div ref={pdfRef} style={{position: 'relative', width: "595px", height: "842px", padding: "40px 24px"}}>
                {/* Header */}
                <div style={{
                    borderBottom: '1px solid #11AFC2',
                    backgroundColor: '#EBF6F7',
                    display: "flex",
                    width: "100%",
                    alignItems: "center",
                    padding: "20px 24px"
                }}>
                    <div style={{
                        width: 'auto',
                        display: "flex",
                        position: 'absolute',
                        alignItems: "center",
                        gap: "15px"
                    }}>
                        <img src='/manku_ci_black_text.png' width='44px' alt='manku_logo'/>
                    </div>
                    <div style={{
                        fontSize: "24px",
                        width: '100%',
                        textAlign: 'center',
                        fontWeight: 700,
                        margin: "0 auto"
                    }}>
                        Purchase<br/>Order
                    </div>
                    <div style={{width: "auto", height: "auto", position: 'absolute', right: 50,}}>
                        <div style={{fontSize: "8px", width: 'auto'}}>
                            Garden-five works, B-211#, 212#
                            <br/>
                            52, Chungmin-ro, Songpa-gu,
                            <br/>
                            Seoul, Republic of Korea
                            <br/>
                            <br/>
                            Tel: 02-465-7838, Fax: 02-465-7839
                            <br/>
                            sales@manku.co.kr
                        </div>
                    </div>
                </div>

                {/* 상단 부모 정보 */}
                <div style={{
                    fontWeight: 550,
                    fontSize: 9,
                    width: '100%',
                    display: "grid",
                    gridTemplateColumns: '1fr 1fr',
                    gridAutoFlow: 'row',
                    padding: '45px 40px 40px 35px',
                    rowGap: 6,
                }}>

                    <div>
                        <span style={{marginRight: 20}}>
                            - Our REFQ NO.
                        </span>
                        {orderDetail.documentNumberFull}
                    </div>
                    <div>
                        <span style={{marginRight: 20}}>
                            - Payment terms :
                        </span>
                        {orderDetail.paymentTerms}
                    </div>

                    <div>
                        <span style={{marginRight: 20}}>
                            - Your REFQ NO.
                        </span>
                        {orderDetail.yourPoNo}
                    </div>
                    <div>
                        <span style={{marginRight: 20}}>
                            - Delivery terms :
                        </span>
                        {orderDetail.deliveryTerms}
                    </div>

                    <div>
                        <span style={{marginRight: 20}}>
                           - Messrs
                        </span>
                        {orderDetail.agencyCode}
                    </div>
                    <div>
                        <span style={{marginRight: 20}}>
                            - Packing :
                        </span>
                        {orderDetail.packing}
                    </div>

                    <div>
                        <span style={{marginRight: 20}}>
                            - Attn To.
                        </span>
                        {orderDetail.attnTo}
                    </div>
                    <div>
                        <span style={{marginRight: 20}}>
                            - Inspection :
                        </span>
                        {orderDetail.inpection}
                    </div>
                    <div/>
                    <div>
                        <span style={{marginRight: 20}}>
                            - Issue Date:
                        </span>
                        {formattedDate}
                    </div>
                </div>

                <div id={'contentList'}>
                    {/* 자식 요소 헤더 */}
                    <div style={{
                        fontSize: 9,
                        borderTop: '1px solid #121212',
                        fontWeight: 500,
                        width: '100%',
                        backgroundColor: '#EBF6F7',
                        display: 'grid',
                        textAlign: 'center',
                        gridTemplateColumns: '0.7fr 3fr 0.5fr 1fr 1fr',
                        borderBottom: '1px solid #A3A3A3'
                    }}>
                        <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                            Item No.
                        </div>
                        <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                            Specification
                        </div>
                        <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                            Q`ty
                        </div>
                        <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                            Unit Price
                        </div>
                        <div style={{padding: '3px 0'}}>
                            Amount
                        </div>
                    </div>

                    {/* 자식 요소 본문*/}
                    <div style={{
                        fontSize: 9,
                        fontWeight: 500,
                        width: '100%',
                        display: 'grid',
                        gridTemplateColumns: '0.7fr 3fr 0.5fr 1fr 1fr',
                        borderBottom: '1px solid #A3A3A3'
                    }}>
                        <div style={{padding: '3px 0', textAlign: 'center', borderRight: '1px solid #121212',}}>
                            Maker
                        </div>
                        <div style={{padding: '3px 10px'}}>
                            {orderDetail.maker}
                        </div>

                    </div>

                    {splitData[0]?.map((v, i) => {
                        totalQuantity += v.quantity
                        totalAmount += v.quantity * v.unitPrice
                        unit = v.unit
                        currency = v.currency
                        return (
                            <div key={i} style={{
                                fontSize: 9,
                                fontWeight: 500,
                                width: '100%',
                                display: 'grid',
                                textAlign: 'center',
                                gridTemplateColumns: '0.7fr 3fr 0.5fr 1fr 1fr',
                                borderBottom: '1px solid #A3A3A3'
                            }}>
                                <div style={{
                                    padding: '3px 0',
                                    borderRight: '1px solid #121212',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {i + 1}
                                </div>
                                <div style={{
                                    padding: '3px 0',
                                    borderRight: '1px solid #121212',
                                    whiteSpace: "pre-line",
                                    textAlign: 'left',
                                    paddingLeft: 10
                                }}>
                                    {v.model}
                                </div>
                                <div style={{
                                    padding: '3px 0',
                                    borderRight: '1px solid #121212',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {v.quantity} {formattedNumber(v.unit)}
                                </div>
                                <div style={{
                                    padding: '3px 10px',
                                    borderRight: '1px solid #121212',
                                    alignItems: 'center',
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>{v.currency}</div>
                                    <div>{formattedNumber(v.unitPrice)}</div>
                                </div>
                                <div style={{
                                    padding: '3px 10px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <div>{v.currency}</div>
                                    <div>{formattedNumber(v.quantity * v.unitPrice)}</div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>

            <div ref={pdfSubRef}>
                {splitData.map((v, idx) => {
                    console.log(v, 'splitData[idx].length:')
                    if (!!idx) {
                        return <div style={{borderTop: '1px solid lightGray', padding: '50px 20px'}}>
                            {splitData[idx].map((v, i) => {
                                totalQuantity += v.quantity
                                totalAmount += v.quantity * v.unitPrice
                                unit = v.unit
                                currency = v.currency
                                return (
                                    <>
                                    <div key={i} style={{
                                        fontSize: 9,
                                        fontWeight: 500,
                                        width: '100%',
                                        display: 'grid',
                                        textAlign: 'center',
                                        gridTemplateColumns: '0.7fr 3fr 0.5fr 1fr 1fr',
                                        borderBottom: '1px solid #A3A3A3',
                                        borderTop: '1px solid #A3A3A3'
                                    }}>
                                        <div style={{
                                            padding: '3px 0',
                                            borderRight: '1px solid #121212',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {v.sequenceNumber}
                                        </div>
                                        <div style={{
                                            padding: '3px 0',
                                            borderRight: '1px solid #121212',
                                            whiteSpace: "pre-line",
                                            textAlign: 'left',
                                            paddingLeft: 10
                                        }}>
                                            {v.model}
                                        </div>
                                        <div style={{
                                            padding: '3px 0',
                                            borderRight: '1px solid #121212',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            {v.quantity} {formattedNumber(v.unit)}
                                        </div>
                                        <div style={{
                                            padding: '3px 10px',
                                            borderRight: '1px solid #121212',
                                            alignItems: 'center',
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div>{v.currency}</div>
                                            <div>{formattedNumber(v.unitPrice)}</div>
                                        </div>
                                        <div style={{
                                            padding: '3px 10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'space-between'
                                        }}>
                                            <div>{v.currency}</div>
                                            <div>{formattedNumber(v.quantity * v.unitPrice)}</div>
                                        </div>
                                    </div>
                                    </>
                                )
                            })}
                            {/* 합계 */}
                            {(splitData.length - 1) === idx && <div style={{
                                fontSize: 9,
                                fontWeight: 500,
                                width: '100%',
                                backgroundColor: '#EBF6F7',
                                display: 'grid',
                                textAlign: 'center',
                                gridTemplateColumns: '0.7fr 3fr 0.5fr 2fr',
                                borderBottom: '1px solid #121212'
                            }}>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>

                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    Total
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    {formattedNumber(totalQuantity)} {unit}
                                </div>

                                <div style={{padding: '3px 20px', display: 'flex', justifyContent: 'space-between'}}>
                                    <div>{currency}</div>
                                    <div>{formattedNumber(totalAmount)}</div>
                                </div>
                            </div>
                            }
                        </div>
                    }
                })}
            </div>
        </Modal>
    )
        ;
}
