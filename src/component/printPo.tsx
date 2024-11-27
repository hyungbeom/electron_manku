import React, {useRef} from "react";
import Modal from "antd/lib/modal/Modal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PrintPo({ data, isModalOpen, setIsModalOpen }) {
    const {orderDetail, customerInfo} = data;
    const pdfRef = useRef();

    console.log(orderDetail, 'orderDetail')

    let totalAmount = 0;
    let totalQuantity = 0;

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    function formattedNumber(number) {
        return number.toLocaleString();
    }

    const handleDownloadPDF = async () => {
        const element = pdfRef.current;
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL("image/png");

        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${orderDetail.documentNumberFull}_PO.pdf`);
    };

    return (
        <Modal
            title={<div style={{width:'100%', display:"flex", justifyContent:'space-between', alignItems:'center'}}>
                <div>발주서 출력</div>
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
            onCancel={() => setIsModalOpen({event1:false, event2:false})}
            open={isModalOpen?.event2}
            width={'640px'}
            footer={null}
            onOk={() => setIsModalOpen({event1:false, event2:false})}
        >
            <div ref={pdfRef} style={{position:'relative', width: "595px", height: "842px", padding: "40px 24px"}}>
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
                    fontWeight:550,
                    fontSize: 9,
                    width: '100%',
                    display: "grid",
                    gridTemplateColumns: '1fr 1fr',
                    gridAutoFlow: 'row',
                    padding:'45px 40px 40px 35px',
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
                        {orderDetail.messrs}
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
                </div>

                {/* 본문 자식 요소 */}
                <div>
                    <div style={{width: '100%', display: 'grid', gridTemplateColumns: '0.7fr 5fr 0.5fr 1fr 1fr'}}>
                        <div style={{}}>

                        </div>

                    </div>
                </div>


            </div>
        </Modal>
    )
        ;
}
