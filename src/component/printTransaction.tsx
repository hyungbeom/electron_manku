import React, {useEffect, useRef, useState} from "react";
import Modal from "antd/lib/modal/Modal";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {amountFormat} from "@/utils/columnList";
import Input from "antd/lib/input/Input";
import moment from "moment";
import {getData} from "@/manage/function/api";
import {commonManage, gridManage} from "@/utils/commonManage";
import {orderInfo} from "@/utils/column/ProjectInfo";
import {searchDomesticCustomer} from "@/utils/api/mainApi";

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

export default function PrintTransactionModal({data, isModalOpen, setIsModalOpen, infoRef}) {

    const [info, setInfo] = useState({writtenDate: moment().format('YYYY-MM-DD')});
    const [total, setTotal] = useState({net : 0, total : 0, subTotal : 0});
    const [titleInfo, setTitleInfo] = useState({
        businessRegistrationNumber: '',
        customerName: '',
        representative: '',
        address: '',
        businessItem: '',
        businessType: '',
        customerTel: '',
    });



    const InputUnit = ({id, size = 'middle'}) => {
        const inputRef = useRef<any>()
        const [toggle, setToggle] = useState(false);

        function blur() {
            setToggle(false)
        }

        useEffect(() => {

        }, [toggle]);

        // @ts-ignore
        return <Input ref={inputRef} defaultValue={info[id]} size={size}
                      style={{width: '100%', border: toggle ? '' : 'none', fontWeight: 550, fontSize : 12}} onBlur={blur}/>
    }

    // @ts-ignore
    useEffect( () => {
        loadData()
    }, [isModalOpen]);

    async function loadData(){
        let infoData = commonManage.getInfo(infoRef, orderInfo['defaultInfo']);

        await searchDomesticCustomer({
            data: {
                "searchType": 2,      // 1: 코드, 2: 상호명, 3: Maker
                "searchText": infoData['customerName'],
                "page": 1,
                "limit": -1
            }
        }).then(v => {
            setTitleInfo(v?.data[0])
            // gridManage.resetData(gridRef, v.data);
        })

        let copyTotal = {...total}

        data.forEach(v => {

            copyTotal['net'] += !isNaN(v.net) ? v.net : 0
            copyTotal['total'] += !isNaN(v.net) ? v.net * v.quantity : 0
            copyTotal['subTotal'] += !isNaN(v.net) ? (v.net * v.quantity) * 0.1 : 0
        })
        setTotal(copyTotal)
        setInfo(v => {
            return {...infoData, writtenDate: moment().format('YYYY-MM-DD')}
        })

    }

    return (
        <Modal
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            open={isModalOpen?.event1}
            width={1000}
            footer={null}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
        >

            <div style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>거래명세표</div>
            <div style={{
                textAlign: 'center',
                fontSize: 14,
                fontWeight: 'bold',
                paddingTop: 20,
                display: 'flex',
                justifyContent: 'center'
            }}>
                <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>거래일자 :</div>
                <div style={{width: 100, alignItems: 'center'}}><InputUnit id={'writtenDate'}/></div>
            </div>
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
                            <th style={cellStyle}>김민국 <img src={'/manku_stamp_only.png'} width={30} alt=""
                                                           style={{marginLeft: -10}}/></th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>주소</th>
                            <th style={cellStyle} colSpan={3}>
                                <div>서울 송파구 충민로 52 가든파이브웍스</div>
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
                            <th style={headerStyle}>연락처</th>
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
                            <th style={cellStyle} colSpan={3}>{titleInfo?.businessRegistrationNumber}</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>상호</th>
                            <th style={cellStyle}>{titleInfo?.customerName}</th>
                            <th style={headerStyle}>대표자</th>
                            <th style={cellStyle}>{titleInfo?.representative}</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>주소</th>
                            <th style={cellStyle} colSpan={3}>
                                <div>{titleInfo?.address}</div>

                            </th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>업태</th>
                            <th style={cellStyle}>{titleInfo?.businessType}</th>
                            <th style={headerStyle}>종목</th>
                            <th style={cellStyle}>{titleInfo?.businessItem}</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>담당자</th>
                            <th style={cellStyle}></th>
                            <th style={headerStyle}>연락처</th>
                            <th style={cellStyle}>{titleInfo?.customerTel}</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>

            <table style={{width: 900, fontSize: 11}}>
                <thead>
                <tr>
                    <th style={{...headerStyle, width : 25}}>NO</th>
                    <th style={headerStyle}>날짜</th>
                    <th style={headerStyle}>품목</th>
                    <th style={{...headerStyle, width : 25}}>수량</th>
                    <th style={headerStyle}>단가</th>
                    <th style={headerStyle}>공급가액</th>
                    <th style={headerStyle}>세액</th>
                    <th style={headerStyle}>비고</th>
                </tr>
                </thead>
                <thead>
                {data?.map((v, i) => {
                    return <tr>
                        <th style={{...cellStyle, width : 5}}>{i + 1}</th>
                        <th style={{...cellStyle, width : 60}}><InputUnit id={'writtenDate'}/></th>
                        <th style={{...cellStyle, whiteSpace : 'normal', textAlign : 'left'}}>{v.model}</th>
                        <th style={{...cellStyle, textAlign: 'center'}}>{v.quantity}</th>
                        <th style={{...cellStyle, textAlign: 'right'}}>{amountFormat(v.net)}</th>
                        <th style={{...cellStyle, textAlign: 'right'}}>{!isNaN(v.net * v.quantity) ? amountFormat(v.net * v.quantity) : ''}</th>
                        <th style={{...cellStyle, textAlign: 'right'}}>{!isNaN(v.net * v.quantity) ?  amountFormat((v.net * v.quantity) * 0.1) : ''}</th>
                        <th style={cellStyle}></th>
                    </tr>
                })
                }
                </thead>
            </table>
            <table style={{width: 900, fontSize: 12}}>
                <thead>
                <tr>
                    <th style={headerStyle}>공급가액</th>
                    <th style={cellStyle}>{(total?.total).toLocaleString()}</th>
                    <th style={headerStyle}>세액</th>
                    <th style={cellStyle}>{(total?.subTotal).toLocaleString()}</th>
                    <th style={headerStyle}>합계</th>
                    <th style={cellStyle}>{((total?.total) + (total?.subTotal)).toLocaleString()}</th>
                    <th style={headerStyle}>미수금</th>
                    <th style={cellStyle}></th>
                    <th style={headerStyle}>인수자</th>
                    <th style={cellStyle}></th>
                </tr>
                </thead>
            </table>
        </Modal>
    )
}
