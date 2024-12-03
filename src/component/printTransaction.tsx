import React, {useRef} from "react";
import Modal from "antd/lib/modal/Modal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PrintTransactionModal({ data, customerData, isModalOpen, setIsModalOpen }) {
    const { orderDetailList } = data;
    const pdfRef = useRef();

    let totalAmount = 0;
    let totalVat = 0;

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    function formattedNumber(number) {
        return number.toLocaleString();
    }

    const handleDownloadPDF = async () => {
        const element = pdfRef.current;

        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const bottomMargin = 20; // 하단 여백 (단위: px)

        const canvas = await html2canvas(element, { scale: 2 });
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
            title={<div style={{width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <div>거래명세표 출력</div>
                <div>
                    <button onClick={handleDownloadPDF} style={{
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
                    <button onClick={handlePrint} style={{
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
                </div>
                }
                onCancel={() => setIsModalOpen({event1: false, event2: false})}
                open={isModalOpen?.event1}
                width={'640px'}
                footer={null}
                onOk={() => setIsModalOpen({event1: false, event2: false})}
                >
                <div ref={pdfRef} style={{width: "595px", height: "auto", padding: "40px 24px"}}>
                    {/* Header */}
                    <div style={{fontSize: "24px", textAlign: "center"}}>
                        거 래 명 세 표
                        <br/>
                        <span
                            style={{
                                fontSize: "14px",
                                textDecoration: "underline",
                                textAlign: "center",
                            }}
                        >
          거 래 일 자 : {formattedDate}
        </span>
                    </div>
                    <div style={{textAlign: "right", marginTop: "15px", fontSize: "11px"}}>
                        (공급받는자 보관용)
                    </div>
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "1fr 1fr",
                            border: "1px solid #121212",
                        }}
                    >
                        {/* 공급자 정보 */}
                        <div style={{display: "grid", gridTemplateColumns: "0.5fr 2.2fr 10fr"}}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRight: "1px solid #A3A3A3",
                                    padding: "0 3px",
                                }}
                            >
                                공 급 자
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    display: "grid",
                                    gridTemplateRows: "repeat(5, 1fr)",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    등록번호
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    상호
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    주소
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    업태
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        lineHeight: "2.2",
                                        borderRight: "1px solid #A3A3A3",
                                    }}
                                >
                                    담당자
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    display: "grid",
                                    gridTemplateRows: "repeat(5, 1fr)",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    714-87-01453
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                        display: "grid",
                                        gridTemplateColumns: "4fr 1.5fr 2.5fr",
                                    }}
                                >
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>
                                        주식회사 만쿠무역
                                    </div>
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>대표자</div>
                                    <div style={{paddingLeft: "3px", textAlign: "left", position: 'relative'}}>
                                        김민국
                                        <img src='/manku_stamp_only.png'
                                             style={{position: 'absolute', width: 35, top: -5}} alt='stamp'/>
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        whiteSpace: "pre-wrap",
                                        display: 'flex',
                                        alignItems: 'center',
                                        lineHeight: 1.1
                                    }}
                                >
                                    서울 송파구 충민로 52, 2층 비211, 비212호
                                    (문정동, 가든파이브웍스)
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                        display: "grid",
                                        gridTemplateColumns: "2.2fr 0.8fr 2.8fr",
                                    }}
                                >
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>도매, 도소매</div>
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>종목</div>
                                    <div>무역, 기계자재</div>
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        lineHeight: "2.2",
                                        display: "grid",
                                        gridTemplateColumns: "2.2fr 1.3fr 2.3fr",
                                    }}
                                >
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>신단비</div>
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>전화번호</div>
                                    <div>02-465-7838</div>
                                </div>
                            </div>
                        </div>

                        {/* 공급받는자 정보 */}
                        <div style={{display: "grid", gridTemplateColumns: "0.5fr 2.2fr 10fr"}}>
                            <div
                                style={{
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    borderRight: "1px solid #A3A3A3",
                                    borderLeft: "1px solid #121212",
                                    padding: "0 3px",
                                }}
                            >
                                공 급 받 는 자
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    display: "grid",
                                    gridTemplateRows: "repeat(5, 1fr)",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    등록번호
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    상호
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    주소
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    업태
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        lineHeight: "2.2",
                                        borderRight: "1px solid #A3A3A3",
                                    }}
                                >
                                    담당자
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: "14px",
                                    display: "grid",
                                    gridTemplateRows: "repeat(5, 1fr)",
                                    textAlign: "center",
                                }}
                            >
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                    }}
                                >
                                    {customerData.businessRegistrationNumber}
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                        display: "grid",
                                        gridTemplateColumns: "4fr 1.5fr 2.5fr",
                                    }}
                                >
                                    <div style={{borderRight: "1px solid #A3A3A3", lineHeight: 1.1,}}>
                                        {customerData.customerName}
                                    </div>
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>대표자</div>
                                    <div style={{paddingLeft: "3px", textAlign: "left"}}>
                                        {customerData.representative}
                                    </div>
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        display: 'flex',
                                        alignItems: 'center',
                                        lineHeight: 1.1,
                                        justifyContent: 'center',
                                        whiteSpace: "pre-wrap",
                                    }}
                                >
                                    {customerData.address}
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        borderBottom: "1px solid #A3A3A3",
                                        lineHeight: "2.2",
                                        display: "grid",
                                        gridTemplateColumns: "2.2fr 0.8fr 2.8fr",
                                    }}
                                >
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>
                                        {customerData.businessType}
                                    </div>
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>종목</div>
                                    <div>{customerData.businessItem}</div>
                                </div>
                                <div
                                    style={{
                                        fontSize: "11px",
                                        lineHeight: "2.2",
                                        display: "grid",
                                        gridTemplateColumns: "2.2fr 1.3fr 2.3fr",
                                    }}
                                >
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>
                                        {customerData.manager}
                                    </div>
                                    <div style={{borderRight: "1px solid #A3A3A3"}}>전화번호</div>
                                    <div>{customerData.customerTel}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 하단 리스트 */}
                    <div
                        style={{
                            borderBottom: "1px solid #121212",
                            borderLeft: "1px solid #121212",
                            borderRight: "1px solid #121212",
                        }}
                    >
                        {/* Header Row */}
                        <div
                            style={{
                                fontSize: "11px",
                                display: "grid",
                                borderBottom: "1px solid #A3A3A3",
                                gridTemplateColumns:
                                    "0.3fr 1fr 3fr 0.6fr 0.5fr 0.9fr 0.9fr 0.9fr 1.2fr",
                            }}
                        >
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                No
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                날짜
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                품목
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                규격
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                수량
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                단가
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                공급가액
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    textAlign: "center",
                                    padding: "3px 0",
                                }}
                            >
                                세액
                            </div>
                            <div style={{textAlign: "center", padding: "3px 0"}}>비고</div>
                        </div>

                        {/* Data Rows (Dynamic content to be inserted here) */}
                        <div style={{display: "flex", flexDirection: "column"}}>
                            {/* 반복되는 데이터 행은 map 함수로 생성 */}

                            {orderDetailList.map((model, i) => {
                                totalAmount += model.amount;
                                totalVat += model.amount * 0.1;
                                return (
                                    <div
                                        key={i}
                                        style={{
                                            fontSize: "11px",
                                            display: "grid",
                                            gridTemplateColumns:
                                                "0.3fr 1fr 3fr 0.6fr 0.5fr 0.9fr 0.9fr 0.9fr 1.2fr",
                                        }}
                                    >
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {i + 1}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 0",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {formattedDate}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 3px",
                                            display: "flex",
                                            alignItems: "center",
                                            whiteSpace: "pre-line"
                                        }}>
                                            {model.model}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {model.unit}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center"
                                        }}>
                                            {formattedNumber(model.quantity)}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}>
                                            {formattedNumber(model.unitPrice)}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}>
                                            {formattedNumber(model.amount)}
                                        </div>
                                        <div style={{
                                            borderRight: "1px solid #A3A3A3",
                                            borderBottom: "1px solid #A3A3A3",
                                            padding: "3px 3px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "flex-end"
                                        }}>
                                            {formattedNumber(model.amount * 0.1)}
                                        </div>
                                        <div style={{
                                            textAlign: "center",
                                            padding: "3px 0",
                                            borderBottom: "1px solid #A3A3A3",
                                            whiteSpace: "pre-wrap",
                                            display: "flex",
                                            alignItems: "center"
                                        }}>
                                            {data.remarks}
                                        </div>

                                    </div>
                                );
                            })}
                        </div>

                        {/* 합계 */}
                        <div
                            style={{
                                fontSize: "11px",
                                display: "grid",
                                gridTemplateColumns: "0.7fr 1fr 0.4fr 1fr 0.4fr 1fr 0.5fr 1fr 0.5fr 1fr",
                            }}
                        >
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                공급가액
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "end",
                                }}
                            >
                                {formattedNumber(totalAmount)}
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                세액
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "end",
                                }}
                            >
                                {formattedNumber(totalVat)}
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                합계
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "end",
                                }}
                            >
                                {formattedNumber(totalAmount + totalVat)}
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                미수금
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "end",
                                }}
                            >
                                {/* 여기에 미수금 값을 삽입할 수 있습니다. */}
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                인수자
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "8px 3px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {data.estimateManager}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
                )
                ;
}
