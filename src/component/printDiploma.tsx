import React, {useRef} from "react";
import Modal from "antd/lib/modal/Modal";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

export default function PrintDiploma({ data, isModalOpen, setIsModalOpen }) {
    const pdfRef = useRef();

    const today = new Date();
    const formattedDate = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, "0")}. ${String(today.getDate()).padStart(2, "0")}.`;


    const handleDownloadPDF = async () => {
        const element = pdfRef.current;
        const canvas = await html2canvas(element, { scale: 1.5, useCORS: true});
        const imgData = canvas.toDataURL("image/jpeg", 0.7);

        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${data.documentNumber}_${data.documentTitle}_공문서.pdf`);
    };

    return (
        <Modal
            title={<div style={{width:'100%', display:"flex", justifyContent:'space-between', alignItems:'center'}}><div>공문서 출력</div>
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
            <div ref={pdfRef} style={{width: "595px", height: "auto", minHeight:'842px', position:'relative',}}>
                {/* Header */}
                <div style={{borderBottom: '1px solid #11AFC2', backgroundColor: '#EBF6F7', display: "flex", width: "100%", alignItems: "center",  padding: "30px 24px"}}>
                    <div style={{width:'auto', display: "flex", position:'absolute', alignItems: "center", gap: "15px"}}>
                        <img src='/kor.png' width={100} alt='manku_logo' />
                        <div style={{fontSize: "6px", width:'auto'}}>
                            (주) 만쿠솔루션
                            <br/>
                            Manku Solution Co., Ltd
                            <br/>
                            <br/>
                            서울시 송파구 법원로 114 엠스테이트 B동 804호
                            <br/>
                            Tel: 02-465-7838, Fax: 02-465-7839
                        </div>
                    </div>
                    <div style={{fontSize: "24px", width: '100%', textAlign:'center', fontWeight: 550, margin: "0 auto"}}>
                        {data.documentTitle}
                    </div>
                    <div style={{width: "120px", height: "60px", position:'absolute', right:50,}}>
                        {/*<img src='/manku_stamp_ko.png' width={120} alt='stamp'/>*/}
                    </div>
                </div>


                <div style={{fontSize: 12, padding: '25px 65px'}}>

                    {/*워터마크*/}
                    <img
                        src='/eng.png'
                        width="146px"
                        alt="manku logo"
                        style={{opacity:0.1, position:'absolute', top: '50%', left:'39%'}}
                    />

                    {/* 수신 발신 제목*/}
                    <div style={{width: '100%', borderBottom: '1px solid #D9D9D9', paddingBottom: 5}}>
                        <span style={{fontWeight: 500}}>수  신 : </span>{data.recipient}
                    </div>
                    <div style={{width: '100%', borderBottom: '1px solid #D9D9D9', padding: '5px 0'}}>
                        <span style={{fontWeight: 500}}>참  조 : </span>{data.reference}
                    </div>
                    <div style={{width: '100%', borderBottom: '1px solid #D9D9D9', padding: '5px 0'}}>
                        <span style={{fontWeight: 500}}>제  목 : </span>{data.subTitle}
                    </div>

                    {/* 본문 */}
                    <div style={{padding:'20px 0 50px 0', whiteSpace:'pre-line', lineHeight: 1.8}}>
                        {data.content}
                    </div>

                    {/*날짜*/}
                    <div style={{marginTop:30, textAlign:'center'}}>
                        {formattedDate}
                    </div>


                </div>
            </div>
        </Modal>
    )
        ;
}
