import React, {useEffect, useMemo} from "react";
import {commonManage} from "@/utils/commonManage";
import {estimateInfo, projectInfo} from "@/utils/column/ProjectInfo";
import Input from "antd/lib/input";

export default function TopInfo({count, infoRef, type, memberList}) {




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

        <div style={{
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

                        {(v.id === 'documentNumberFull' || v.id === 'writtenDate') ?
                            <div style={{paddingLeft: 15}}>{v.value}</div>

                            :
                            <Input defaultValue={v.value} id={v.id}
                                   suffix={<>{v.id === 'delivery' ? '주' : ''}</>}
                                   style={{
                                       border: 'none',
                                       paddingLeft: 15,
                                       alignItems: 'center',
                                       fontSize: 15,
                                       width: v.id === 'delivery' ? 70 : '100%'
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