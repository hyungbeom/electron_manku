import React, {useEffect, useRef, useState} from "react";
import Modal from "antd/lib/modal/Modal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PrintIntegratedEstimate({ data, isModalOpen, userInfo, setIsModalOpen }) {

    const pdfRef = useRef();

    // 초기값은 빈배열, acc : 누적배열, curr: data 배열의 현재요소
    const refinedData = data.reduce((acc, curr) => {
        const { estimateId, documentNumberFull, customerName, managerName, phoneNumber, faxNumber, paymentTerms, delivery, shippingTerms,
            maker, model, quantity, amount, unit } = curr;

        // 누적배열에서 find 매소드로 기존 누적 배열의 요소 중 estimateId가 있는지 찾아서 그 요소를 existingGroup에 저장함
        const existingGroup = acc.find(group => group.estimateId === estimateId);

        // existingGroup가 있으면 existingGroup.modelList에 push하여 삽입
        if (existingGroup) {
            existingGroup.modelList.push({ maker, model, quantity, amount, unit });
        } else {
            acc.push({
                estimateId, documentNumberFull, unit, customerName, managerName, phoneNumber, faxNumber, paymentTerms, delivery, shippingTerms,
                modelList: [{ maker, model, quantity, amount, unit }]
            });
        }

        return acc;
    }, []);


    // console.log(refinedData[0].documentNumberFull, 'reducedData');

    let totalAmount = 0;
    let totalQuantity = 0;

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    function formattedNumber(number) {
        return number.toLocaleString();
    }

    const handleDownloadPDF = async () => {
        const element = pdfRef.current;
        const canvas = await html2canvas(element, { scale: 1.5, useCORS: true });
        const imgData = canvas.toDataURL("image/jpeg", 0.7);

        const pdf = new jsPDF({
            orientation: "portrait",
            unit: "px",
            format: "a4",
            compress: true, // 압축 활성화
        });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${refinedData[0].documentNumberFull}_견적서.pdf`);
    };

    return (
        <Modal
            title={<div style={{width:'100%', display:"flex", justifyContent:'space-between', alignItems:'center'}}>
                <div>견적서 출력(수정중)</div>
            <button onClick={handleDownloadPDF} style={{
                padding: "5px 10px",
                backgroundColor: "#1890ff",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize:11,
                marginRight:20
            }}>
                PDF 다운로드
            </button></div>}
            onCancel={() => setIsModalOpen(false)}
            open={isModalOpen}
            width={'640px'}
            footer={null}
            onOk={() => setIsModalOpen(false)}
        >
                {/* Header */}
            <div ref={pdfRef} style={{width: "595px", minHeight: "842px", height:'auto', padding: "40px 24px"}}>
                {/* Header */}
                <div style={{display: "flex", width: "100%", alignItems: "center"}}>
                    <div style={{display: "flex", float: "left", alignItems: "center", gap: "20px"}}>
                        <img
                            src="/manku_ci_black_text.png"
                            width="44px"
                            height="30px"
                            alt="manku logo"
                        />
                        <div style={{fontSize: "6px"}}>
                            (주) 만쿠무역
                            <br/>
                            Manku Trading Co., Ltd
                            <br/>
                            <br/>
                            서울시 송파구 법원로 114 엠스테이트 B동 804호
                            <br/>
                            Tel: 02-465-7838, Fax: 02-465-7839
                        </div>
                    </div>
                    <div style={{fontSize: "24px", fontWeight: 550, margin: "0 auto 0 54px"}}>
                        견적서(수정중)
                    </div>
                    <div style={{width: "120px", height: "60px", float: "right",}}>
                        <img src='/manku_stamp_ko.png' width={120} alt='stamp'/>
                    </div>
                </div>

                <div style={{width: "100%", height: "1px", backgroundColor: "#11AFC2", marginTop: "10px"}}></div>

                {/* 상단 부모 정보 */}
                <div style={{textAlign: "center", fontSize: "11px", margin: "20px 0"}}>
                    (주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렴하게 공급합니다.
                </div>
                <div style={{borderTop: "1px solid #121212"}}></div>
                <div
                    style={{
                        fontSize: "9px",
                        display: "grid",
                        gridTemplateColumns: "90px 1fr 90px 1fr",
                        gridAutoFlow: "row",
                    }}
                >
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        견적일자
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{formattedDate}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        담당자
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{userInfo.name}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        견적서No.
                    </div>
                    <div style={{padding: "6px 0 6px 10px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>{refinedData[0].documentNumberFull}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        연락처
                    </div>
                    <div style={{
                        padding: "6px 0 6px 10px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>{refinedData[0].managerPhoneNumber}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        업체명
                    </div>
                    <div
                        style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{refinedData[0].customerName}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        E-mail
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{userInfo.email}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        담당자
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{refinedData[0].managerName}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        유효기간
                    </div>
                    <div style={{
                        padding: "6px 0 6px 10px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>{refinedData[0].validityPeriod}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        연락처
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{refinedData[0].phoneNumber}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        결제조건
                    </div>
                    <div
                        style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{refinedData[0].paymentTerms}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        FAX/E-mail
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{refinedData[0].faxNumber}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        납기
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}>{refinedData[0].delivery} 주</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        국내운송비
                    </div>
                    <div style={{
                        padding: "6px 0 6px 10px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>{refinedData[0].shippingTerms}</div>
                    <div style={{
                        backgroundColor: "#EBF6F7",
                        padding: "6px 0 6px 20px",
                        borderBottom: "1px solid #A3A3A3"
                    }}>
                        {" "}
                    </div>
                    <div style={{padding: "6px 0 6px 10px", borderBottom: "1px solid #A3A3A3"}}></div>
                </div>


                <div
                    style={{
                        fontSize: "9px",
                        textAlign: "center",
                        display: "grid",
                        gridTemplateColumns: "1fr 80px 80px 80px",
                        borderBottom: "1px solid #A3A3A3",
                        backgroundColor: "#EBF6F7",
                        borderTop: "1px solid #121212",
                        marginTop: "36px",
                    }}
                >
                    <div
                        style={{
                            borderRight: "1px solid #121212",
                            padding: "6px 0",
                            boxSizing: "border-box",
                        }}
                    >
                        Specification
                    </div>
                    <div
                        style={{
                            borderRight: "1px solid #121212",
                            padding: "6px 0",
                            boxSizing: "border-box",
                        }}
                    >
                        Q`ty
                    </div>
                    <div
                        style={{
                            borderRight: "1px solid #121212",
                            padding: "6px 0",
                            boxSizing: "border-box",
                        }}
                    >
                        Unit Price
                    </div>
                    <div
                        style={{
                            padding: "6px 0",
                            boxSizing: "border-box",
                        }}
                    >
                        Amount
                    </div>
                </div>

                {/* 하단 자식 정보 내용 */}
                {refinedData.map((maker,i)=>{
                    return (
                        <div key={i} style={{display: "flex", flexDirection: "column"}}>
                            <div
                                style={{
                                    fontSize: "9px",
                                    display: "grid",
                                    gridTemplateColumns: "1fr 2fr 80px 80px 80px",
                                    gridAutoFlow: "row",
                                }}
                            >
                                <div
                                    style={{
                                        textAlign: "center",
                                        backgroundColor: "#EBF6F7",
                                        height: "auto",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #A3A3A3",
                                        padding: "6px 0 6px 10px",
                                        boxSizing: "border-box",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                    Maker
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "auto",
                                        padding: "6px 10px 6px 10px",
                                        boxSizing: "border-box",
                                        whiteSpace: "pre-line",
                                        borderRight: "1px solid #121212",
                                        borderBottom: "1px solid #A3A3A3",
                                    }}
                                >
                                    {maker.maker}
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "auto",
                                        justifyContent: "end",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #121212",
                                        padding: "6px 10px 6px 0",
                                        boxSizing: "border-box",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "auto",
                                        justifyContent: "end",
                                        borderBottom: "1px solid #A3A3A3",
                                        borderRight: "1px solid #121212",
                                        padding: "6px 10px 6px 0",
                                        boxSizing: "border-box",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                </div>
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        height: "auto",
                                        justifyContent: "end",
                                        borderBottom: "1px solid #A3A3A3",
                                        padding: "6px 10px 6px 0",
                                        boxSizing: "border-box",
                                        whiteSpace: "pre-line",
                                    }}
                                >
                                </div>
                            </div>
                            {maker.modelList.map((model, i) => {
                                totalQuantity += model.quantity;
                                totalAmount += model.amount;
                                return (
                                    <div key={i}
                                         style={{
                                             fontSize: "9px",
                                             display: "grid",
                                             gridTemplateColumns: "1fr 9fr 80px 80px 80px",
                                             gridAutoFlow: "row",
                                         }}
                                    >
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: 'center',
                                                height: "auto",
                                                borderBottom: "1px solid #A3A3A3",
                                                borderRight: "1px solid #A3A3A3",
                                                padding: "6px 0",
                                                boxSizing: "border-box",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {i + 1}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                height: "auto",
                                                borderBottom: "1px solid #A3A3A3",
                                                borderRight: "1px solid #121212",
                                                padding: "6px 0 6px 10px",
                                                boxSizing: "border-box",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {model.model}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                height: "auto",
                                                justifyContent: "end",
                                                borderBottom: "1px solid #A3A3A3",
                                                borderRight: "1px solid #121212",
                                                padding: "6px 10px 6px 0",
                                                boxSizing: "border-box",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {model.quantity} {model.unit}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                height: "auto",
                                                justifyContent: "end",
                                                borderBottom: "1px solid #A3A3A3",
                                                borderRight: "1px solid #121212",
                                                padding: "6px 10px 6px 0",
                                                boxSizing: "border-box",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {model.unitPrice}
                                        </div>
                                        <div
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                height: "auto",
                                                justifyContent: "end",
                                                borderBottom: "1px solid #A3A3A3",
                                                padding: "6px 10px 6px 0",
                                                boxSizing: "border-box",
                                                whiteSpace: "pre-line",
                                            }}
                                        >
                                            {model.amount}
                                        </div>
                                    </div>
                                )

                            })}

                        </div>
                    )
                })}

                {/* 하단 자식 요소 합계 */}
                <div
                    style={{
                        fontSize: "9px",
                        display: "grid",
                        gridTemplateColumns: "1fr 80px 80px 80px",
                        gridAutoFlow: "row",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                            backgroundColor: "#EBF6F7",
                            height: "auto",
                            borderBottom: "1px solid #A3A3A3",
                            borderRight: "1px solid #121212",
                            padding: "6px 0 6px 10px",
                            boxSizing: "border-box",
                            whiteSpace: "pre-line",
                        }}
                    >
                        합계
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "auto",
                            justifyContent: "end",
                            borderBottom: "1px solid #A3A3A3",
                            borderRight: "1px solid #121212",
                            padding: "6px 10px 6px 0",
                            boxSizing: "border-box",
                            whiteSpace: "pre-line",
                        }}
                    >
                        {formattedNumber(totalQuantity)} {refinedData[0].unit}
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "auto",
                            justifyContent: "end",
                            borderBottom: "1px solid #A3A3A3",
                            borderRight: "1px solid #121212",
                            padding: "6px 10px 6px 0",
                            boxSizing: "border-box",
                            whiteSpace: "pre-line",
                        }}
                    >
                        (V.A.T 별도)
                    </div>
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            height: "auto",
                            justifyContent: "end",
                            borderBottom: "1px solid #A3A3A3",
                            padding: "6px 10px 6px 0",
                            boxSizing: "border-box",
                            whiteSpace: "pre-line",
                        }}
                    >
                        ￦ {formattedNumber(totalAmount)}
                    </div>
                </div>

                {/* 하단 추가 정보 */}
                <div
                    style={{
                        fontSize: "8px",
                        lineHeight: "1.6",
                        padding: "6px 0 6px 18px",
                        borderBottom: "1px solid #121212",
                    }}
                >
                    · 금일 환율 기준으로 2%이상 인상될 시, 단가가 인상될 수 있습니다.
                    <br/>
                    · 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁 드립니다.
                    <br/>
                    · 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)
                    <br/>
                    · 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.
                    <br/>
                    · 성적서 및 품질보증서는 별도입니다.
                </div>
            </div>
        </Modal>
    );
}
