import React, {useEffect, useMemo, useRef} from "react";
import {commonManage} from "@/utils/commonManage";
import {estimateInfo, orderInfo, projectInfo} from "@/utils/column/ProjectInfo";
import Input from "antd/lib/input";
import moment from "moment";

export default function TopInfo({count, infoRef, type, memberList, getTopInfoData}) {

    const topInfoRef = useRef<any>(null);

    const [info, maker] = useMemo(() => {
        let infoData: any = {}
        if (type === 'estimate') {
            infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);

        } else {
            let copyInfo = commonManage.getInfo(infoRef, projectInfo['defaultInfo']);
            copyInfo['managerName'] = copyInfo['customerManagerName']
            copyInfo['phoneNumber'] = copyInfo['customerManagerPhone']
            infoData = copyInfo
        }

        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];

        getTopInfoData({
            writtenDate: infoData.writtenDate,
            name: findMember?.name,
            documentNumberFull: infoData.documentNumberFull,
            contactNumber: findMember?.contactNumber,
            customerName: infoData.customerName,
            email: findMember?.email,
            customerManagerName: infoData.managerName,
            validityPeriod: infoData.validityPeriod,
            customerManagerPhone: infoData.phoneNumber,
            paymentTerms: infoData.paymentTerms,
            customerManagerEmail: infoData.customerManagerEmail,
            delivery: infoData.delivery,
            faxNumber: infoData.faxNumber,
            shippingTerms: infoData.shippingTerms,
            maker : infoData['maker']
        })

        return [[
            {title: '견적일자', value: infoData.writtenDate, id: 'writtenDate'},
            {title: '담당자', value: findMember?.name, id: 'name'},
            {title: '견적서 No', value: infoData.documentNumberFull, id: 'documentNumberFull'},
            {title: '연락처', value: findMember?.contactNumber, id: 'contactNumber'},
            {title: '고객사', value: infoData.customerName, id: 'customerName'},
            {title: 'E-mail', value: findMember?.email, id: 'email'},
            {title: '담당자', value: infoData.managerName, id: 'customerManagerName'},
            {title: '유효기간', value: infoData.validityPeriod, id: 'validityPeriod'},
            {title: '연락처', value: infoData.phoneNumber, id: 'customerManagerPhone'},
            {title: '결제조건', value: infoData.paymentTerms, id: 'paymentTerms'},
            {title: 'E-mail', value: infoData.customerManagerEmail, id: 'customerManagerEmail'},
            {title: '납기', value: infoData.delivery, id: 'delivery'},
            {title: 'Fax', value: infoData.faxNumber, id: 'faxNumber'},
            {title: '납품조건', value: infoData.shippingTerms, id: 'shippingTerms'},
        ], infoData['maker']]
    }, [count]);


    return <>

        <div ref={topInfoRef} style={{
            fontFamily: 'Arial, sans-serif',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '35px 35px 35px 35px 35px 35px 35px',
            alignItems: 'center',
            paddingTop: 20
        }}>
            {info?.map((v: any, index) => {

                    return <div style={{
                        display: 'grid',
                        gridTemplateColumns: '85px 1fr',
                        alignItems: 'center',
                        fontSize: 15
                    }}>

                        <div style={{alignItems: 'center', fontWeight: 600}}>{v.title} <span
                            style={{float: 'right', fontWeight: 600}}>:</span></div>


                            <Input defaultValue={v.value} id={v.id}
                                   suffix={<>{v.id === 'delivery' ? '주' : ''}</>}
                                   style={{
                                       border: 'none',
                                       paddingLeft: 15,
                                       alignItems: 'center',
                                       fontSize: 15,
                                       width: v.id === 'delivery' ? 70 : '100%'
                                   }}
                                   onBlur={() => {
                                       const list = topInfoRef.current.querySelectorAll('input');
                                       let bowl = {}
                                       list.forEach(v => {
                                           bowl[v.id] = v.value;
                                       });
                                       bowl['maker'] = maker;
                                       getTopInfoData(bowl)
                                   }}
                            />

                    </div>
                }
            )}
        </div>
    </>
}


export const TopPoInfo = ({infoRef, memberList, hscode = ''}) => {


    const [info] = useMemo(() => {

        let infoData = commonManage.getInfo(infoRef, orderInfo['defaultInfo']);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];

        const dom = infoRef.current.querySelector('#agencyCode');
        const lang = dom.value.startsWith("K");

        let totalDate = ''
        let date = moment(infoData['delivery']); // 기준 날짜
        totalDate = infoData['delivery']
        if (!isNaN(infoData['deliveryTerms'])) {
            console.log('숫자')
            let newDate = date.add(infoData['deliveryTerms'], 'weeks'); // 주 단위 추가
            totalDate = newDate.format('YYYY-MM-DD')
        }

        return [lang ? [
                {title: '수신처', value: infoData.agencyName, id: 'ourPoNo'},
                {title: '발주일자', value: totalDate, id: 'name'},
                {title: '담당자', value: infoData.agencyManagerName, id: 'agencyManagerName'},
                {title: '발주번호', value: infoData?.documentNumberFull, id: 'contactNumber'},
                {title: '납품조건', value: '', id: ''},
                {title: '귀사견적', value: infoData?.yourPoNo, id: 'yourPoNo'},
                {title: '결제조건.', value: infoData?.paymentTerms, id: 'attnTo'},
                {title: '담당자', value: findMember?.name, id: ''},
                {title: '납기조건', value: '', id: ''},
                {title: '연락처', value: findMember?.contactNumber, id: 'faxNumber'},
                {title: '', value: '', id: 'deliveryTerms'},
                {title: 'E-Mail', value: findMember?.email, id: 'shippingTerms'},

            ]

            : [
                {title: 'MESSER', value: infoData.agencyName, id: 'ourPoNo'},
                {title: 'DATE', value: infoData.writtenDate, id: 'writtenDate'},
                {title: 'ATTN', value: infoData.agencyManagerName, id: 'attnTo'},
                {title: 'Contact Person', value: infoData.managerAdminName, id: 'ourPoNo'},
                {title: 'YOUR OFFER NO.', value: infoData.attnTo, id: 'ourPoNo'},
                {title: 'TEL', value: infoData.managerPhoneNumber, id: 'ourPoNo'},
                {title: 'MANKU No.', value: infoData.documentNumberFull, id: 'ourPoNo'},
                {title: 'E-mail', value: infoData.managerEmail, id: 'ourPoNo'},
                {title: 'Delivery', value: infoData.deliveryTerms, id: 'ourPoNo'},
                {title: 'HS-code', value: '', id: 'hscode'},
                {title: 'Incoterms', value: '', id: 'incoterms'},
                {title: '', value: '', id: ''},
                {title: 'Payment', value: infoData.paymentTerms, id: 'ourPoNo'},
            ]]


    }, []);


    return <>
        <div style={{
            fontFamily: 'Arial, sans-serif',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '35px 35px 35px 35px 35px 35px 35px 35px',
            alignItems: 'center',
        }}>
            {info?.map((v: any, index) => {

                    return <div style={{
                        display: 'grid',
                        gridTemplateColumns: '135px 1fr',
                        alignItems: 'center',
                        fontSize: 14
                    }}>

                        <div style={{alignItems: 'center', fontWeight: 600}}>{v.title} <span
                            style={{float: 'right', fontWeight: 600}}>{v.title ? ':' : null}</span></div>

                        {(v.id === 'documentNumberFull' || v.id === 'writtenDate') ?
                            <div style={{paddingLeft: 15}}>{v.value}</div>
                            :
                            <Input defaultValue={v.value} id={v.id}
                                   style={{
                                       border: 'none',
                                       paddingLeft: 15,
                                       alignItems: 'center',
                                       fontSize: 15,
                                       width: '100%'
                                   }}/>
                        }
                    </div>
                }
            )}
        </div>
    </>
}


export const BottomInfo = () => {


    return <div
        style={{
            paddingTop: 10,
            // padding: '30px 20px',
            fontSize: 12,
            lineHeight: 1.7,
            borderTop: '1px solid black',
        }}>
        <div>· 의뢰하실 Model로 기준한 견적입니다.</div>
        <div>· 계좌번호 : (기업은행)069-118428-04-010/만쿠무역</div>
        <div>· 긴급 납기시 담당자와 협의가능합니다.</div>
    </div>
}


export const BottomPoInfo = ({infoRef}) => {


    return <div
        style={{
            padding: '30px 20px',
            fontSize: 12,
            lineHeight: 1.7,
            borderTop: '1px solid black',
        }}>
        {
            infoRef.current.querySelector('#agencyCode').value.startsWith('K') ? <>
                <div>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</div>
                <div>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</div>
                <div>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</div>
                <div>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</div>
                <div>· 성적서 및 품질보증서는 별도입니다.</div>
            </> : <>
                <div> * For the invoice* Please indicate few things as below:</div>
                <div>1. HS Code 6 Digit</div>
                <div>2. Indication of Country of Origin</div>
                <div>It has to be written into the remark of every Invoice every time.</div>
                <div>And your name, your signature and date of signature have to be put in under the
                    sentence as well.
                </div>
                <div>* Please give us Order confirmation. (Advise us if we should pay your bank charge as
                    well.)
                </div>
            </>
        }
    </div>
}