import React, {memo, useEffect, useMemo, useState} from "react";
import _ from "lodash";
import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input";
import moment from "moment";
import {commonManage} from "@/utils/commonManage";
import {OCInfo, orderInfo} from "@/utils/column/ProjectInfo";
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

export const Header = () => <>
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
        <div style={{width: 100, alignItems: 'center'}}><Input defaultValue={moment().format('YYYY-MM-DD')}
                                                               id={'writtenDate'}/></div>
    </div>
</>

function TransactionStatementHeader({data, isModalOpen, setIsModalOpen, infoRef}: any) {


    const [domesticInfo, setDomesticInfo] = useState<any>(orderInfo['defaultInfo'])

    useEffect(() => {
        let infoData = commonManage.getInfo(infoRef, orderInfo['defaultInfo']);
        const {customerName} = infoData;

        getDomesticInfo(customerName).then((v: any) => {
            if (v.data.length) {
                setDomesticInfo(v.data[0])
            }
        })
    }, []);


    async function getDomesticInfo(name) {

        return await searchDomesticCustomer({
            data: {
                "searchType": 2,      // 1: 코드, 2: 상호명, 3: Maker
                "searchText": name,
                "page": 1,
                "limit": -1
            }
        }).then(v => {
            return v
        })
    }

    console.log(domesticInfo, '::')
    return <>
        <Modal width={1000} open={isModalOpen?.event1}
               onCancel={() => setIsModalOpen({event1: false, event2: false})}

               onOk={() => setIsModalOpen({event1: false, event2: false})}
        >

            <Header/>

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
                            <th style={cellStyle} colSpan={3}>{domesticInfo.businessRegistrationNumber}</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>상호</th>
                            <th style={cellStyle}>{domesticInfo.customerName}</th>
                            <th style={headerStyle}>대표자</th>
                            <th style={cellStyle}>{domesticInfo.representative}</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>주소</th>
                            <th style={cellStyle} colSpan={3}>
                                <div>{domesticInfo.address}</div>

                            </th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>업태</th>
                            <th style={cellStyle}>{domesticInfo.businessType}</th>
                            <th style={headerStyle}>종목</th>
                            <th style={cellStyle}>{domesticInfo.businessItem}</th>
                        </tr>
                        </thead>
                        <thead>
                        <tr>
                            <th style={headerStyle}>담당자</th>
                            <th style={cellStyle}></th>
                            <th style={headerStyle}>연락처</th>
                            <th style={cellStyle}>{domesticInfo.customerTel}</th>
                        </tr>
                        </thead>
                    </table>
                </div>
            </div>
        </Modal>
    </>
}

export default memo(TransactionStatementHeader, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});