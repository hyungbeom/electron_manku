import React, {useEffect, useState} from "react";
import Input from "antd/lib/input";
import {paperTopInfo} from "@/utils/common";
import {commonManage} from "@/utils/commonManage";

export default function NewEstimatePaper({gridRef}) {

    const [title, setTitle] = useState<any>(paperTopInfo['ko'])
    const [info, setInfo] = useState<any>({})
    useEffect(() => {
        const list = gridRef.current.getSelectedRows();

        const firstRow = list[0];
        const result = commonManage.splitDataWithSequenceNumber(list, 18, 28);



        let documentNumbers = {};  // documentNumberFull을 저장할 객체

        let groupedData = {};

        // 그룹화: 같은 documentNumberFull을 가진 항목들을 묶기
        list.forEach(item => {
            if (!groupedData[item.documentNumberFull]) {
                groupedData[item.documentNumberFull] = {
                    maker: item.maker,
                    item: item.item,
                    models: []
                };
            }
            groupedData[item.documentNumberFull].models.push({
                model: item.model,
                quantity: item.quantity,
                unit: item.unit
            });

        });

        console.log(groupedData,'groupedData:')
        console.log(documentNumbers,'documentNumbers:')

        setInfo(firstRow);
        setTitle(paperTopInfo[firstRow?.agencyCode.startsWith('K') ? 'ko' : 'en'])
    }, []);

    async function download() {
        // const blob = await pdf(<PdfForm data={data} topInfoData={topInfoData} totalData={totalData} bottomInfo={bottomInfo}
        //                                 key={Date.now()}/>).toBlob();
        //
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = `${topInfoData?.documentNumberFull}_견적서.pdf`;
        // link.click();
        //
        // // 메모리 해제
        // URL.revokeObjectURL(url);
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    return <>
        <div style={{marginTop: -10, padding: 15, display: 'flex', justifyContent: 'space-between'}}>
            <div>통합견적서 출력</div>
            <div>
                <button onClick={download} style={{
                    padding: "5px 10px",
                    backgroundColor: "#1890ff",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: 11,
                    marginRight: 10
                }}>
                    다운로드
                </button>
                {/*@ts-ignore*/}
                <button onClick={print} style={{
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


        <div style={{
            fontFamily: "Noto Sans KR, sans-serif",
            width: '1000px',  // A4 가로
            height: '1354px',  // A4 세로
            // aspectRatio: '1 / 1.414',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '0px 20px'
        }}>

            <div style={{
                fontFamily: 'Arial, sans-serif',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gridTemplateRows: '35px 35px 35px 35px 35px 35px 35px',
                alignItems: 'center',
                paddingTop: 20
            }}>
                {Object.keys(title)?.map((v: any, index) => {
                        return <div style={{
                            display: 'grid',
                            gridTemplateColumns: '135px 1fr',
                            alignItems: 'center',
                            fontSize: 14
                        }}>
                            <div style={{alignItems: 'center', fontWeight: 600}}>{title[v]} <span
                                style={{float: 'right', fontWeight: 600}}>{title[v] ? ':' : null}</span></div>
                            <Input value={info[v]} id={v}
                                   style={{
                                       border: 'none',
                                       paddingLeft: 15,
                                       alignItems: 'center',
                                       fontSize: 15,
                                       width: '100%'
                                   }}
                                   onChange={onChange}
                            />
                        </div>
                    }
                )}
            </div>
        </div>

    </>
}