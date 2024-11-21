import React from "react";
import Modal from "antd/lib/modal/Modal";

export default function PrintTransactionModal({ data, customerData, isModalOpen, setIsModalOpen }) {
    const { orderDetailList } = data;

    let totalAmount = 0;
    let totalVat = 0;

    return (
        <Modal
            title={'거래명세표 출력'}
            onCancel={() => setIsModalOpen(false)}
            open={isModalOpen}
            width={'640px'}
            footer={null}
            onOk={() => setIsModalOpen(false)}
        >
            <div style={{width: "595px", height: "842px", padding: "40px 24px"}}>
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
          거 래 일 자 : 2024-11-21
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
                    <div style={{display: "grid", gridTemplateColumns: "0.5fr 2fr 10fr"}}>
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
                                <div style={{paddingLeft: "3px", textAlign: "left"}}>
                                    김민국
                                </div>
                            </div>
                            <div
                                style={{
                                    fontSize: "11px",
                                    borderBottom: "1px solid #A3A3A3",
                                    lineHeight: "1.1",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                서울 송파구 충민로 52, 2층 비211, 비212호
                                <br/>
                                (문정동, 가든파이브웍스)
                            </div>
                            <div
                                style={{
                                    fontSize: "11px",
                                    borderBottom: "1px solid #A3A3A3",
                                    lineHeight: "2.2",
                                    display: "grid",
                                    gridTemplateColumns: "2.2fr 0.7fr 2.8fr",
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
                                    gridTemplateColumns: "2.2fr 1.2fr 2.3fr",
                                }}
                            >
                                <div style={{borderRight: "1px solid #A3A3A3"}}>신단비</div>
                                <div style={{borderRight: "1px solid #A3A3A3"}}>전화번호</div>
                                <div>02-465-7838</div>
                            </div>
                        </div>
                    </div>

                    {/* 공급받는자 정보 */}
                    <div style={{display: "grid", gridTemplateColumns: "0.5fr 2fr 10fr"}}>
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
                                <div style={{borderRight: "1px solid #A3A3A3"}}>
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
                                    lineHeight: "1.1",
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
                                    gridTemplateColumns: "2.2fr 0.7fr 2.8fr",
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
                                    gridTemplateColumns: "2.2fr 1.2fr 2.3fr",
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
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "3px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {i + 1}
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "3px 0",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                {model.model}
                            </div>
                            <div
                                style={{
                                    borderRight: "1px solid #A3A3A3",
                                    borderBottom: "1px solid #A3A3A3",
                                    padding: "3px 3px",
                                    display: "flex",
                                    alignItems: "center",
                                    whiteSpace: "pre-wrap",
                                }}
                            >
                                {model.model}
                            </div>
                            {/* Rest of the columns */}
                        </div>
                    );
                })}
            </div>

            {/* 합계 */}
            <div
                style={{
                    fontSize: "11px",
                    display: "grid",
                    gridTemplateColumns: "0.6fr 1fr 0.4fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr",
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
                    {totalAmount}
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
                    {totalVat}
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
                    {totalAmount + totalVat}
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
                    {/* 여기에 인수자 값을 삽입할 수 있습니다. */}
                </div>
            </div>
                </div>
            </div>
</Modal>
)
    ;
}
