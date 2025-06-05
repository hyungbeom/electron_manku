import React, {useEffect, useMemo, useRef, useState} from "react";
import {commonManage} from "@/utils/commonManage";
import {estimateInfo, orderInfo, projectInfo} from "@/utils/column/ProjectInfo";
import Input from "antd/lib/input";
import moment from "moment";
import {paperTopInfo} from "@/utils/common";
import _ from "lodash";
import TextArea from "antd/lib/input/TextArea";

export default function TopInfo({count, info, type, memberList, getTopInfoData}) {

    const topInfoRef = useRef<any>(null);

    const [infoData, maker] = useMemo(() => {
        let infoData: any = _.cloneDeep(info)
        if (type === 'estimate') {


        } else {
            infoData['managerName'] = infoData['customerManagerName']
            infoData['phoneNumber'] = infoData['customerManagerPhone']
        }

        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];

        getTopInfoData({
            writtenDate: infoData.writtenDate,
            name: findMember?.name ? findMember?.name + ' ' + findMember?.position : '',
            documentNumberFull: infoData.documentNumberFull,
            contactNumber: findMember?.contactNumber,
            customerName: infoData?.customerName,
            email: findMember?.email,
            customerManagerName: infoData?.managerName,
            validityPeriod: infoData.validityPeriod,
            customerManagerPhone: infoData.phoneNumber,
            paymentTerms: infoData.paymentTerms,
            customerManagerEmail: infoData.customerManagerEmail,
            delivery: infoData.delivery,
            faxNumber: infoData.faxNumber,
            shippingTerms: infoData.shippingTerms,
            maker: infoData['maker']
        })

        return [[
            {title: '견적일자', value: infoData.writtenDate, id: 'writtenDate'},
            {title: '담당자', value: findMember?.name ? findMember?.name + ' ' + findMember?.position : '', id: 'name'},
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
            {infoData?.map((v: any, index) => {

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


export const TopPoInfo = ({info, hsCode, getTopInfoData, type}) => {
    const topInfoRef = useRef<any>(null);
    const [infoData, setInfoData] = useState({})
    const [title, setTitle] = useState<any>(paperTopInfo[type])

    console.log(title,'title:')
    useEffect(() => {



        let copyData =_.cloneDeep(info)

        copyData['totalDate'] = moment().format('YYYY-MM-DD');
        setInfoData({...copyData, hscode: hsCode});
        copyData['incoterms'] = 'EXW'
        // EXW, FOB, CIF, DDU

        getTopInfoData(copyData)
    }, [hsCode]);


    function onChange(e) {

        commonManage.onChange(e, setInfoData)
    }


    useEffect(() => {
        getTopInfoData(infoData)
    }, [infoData]);


    const SelectForms = ({id, list, title}: any) => {

        const inputRef = useRef<any>(null)
        const ref = useRef<any>(null)
        const listRef = useRef<any>(null)

        useEffect(() => {
            const input = ref.current.getElementsByClassName('customInput')[0];

            const handleInputFocus = () => {
                listRef.current.style.display = 'block';
            };

            const handleOptionClick = (e: any) => {
                if (e.target.tagName === 'DIV') {
                    input.value = e.target.textContent;
                    listRef.current.style.display = 'none';
                }
            };

            const handleFocusIn = (e: any) => {
                if (!ref.current.contains(e.target)) {
                    listRef.current.style.display = 'none';
                }
            };

            const handleClickOutside = (e: any) => {
                if (!ref?.current?.contains(e.target)) {
                    if (listRef.current) {
                        listRef.current.style.display = 'none';
                    }
                }
            };

            input.addEventListener('focus', handleInputFocus);
            listRef.current.addEventListener('click', handleOptionClick);
            document.addEventListener('focusin', handleFocusIn);
            document.addEventListener('click', handleClickOutside);

            return () => {
                input.removeEventListener('focus', handleInputFocus);
                listRef.current?.removeEventListener('click', handleOptionClick);
                document.removeEventListener('focusin', handleFocusIn);
                document.removeEventListener('click', handleClickOutside);
            };

        }, []);

        function onChanges(e) {

            setInfoData(v => {
                let bowl = {};
                bowl[id] = e.target.value;
                return {...v, ...bowl}
            })
        }

        return <div ref={ref} className="dropdown-wrapper" id="dropdownWrapper" style={{fontSize: 12, width: '100%'}}>
            <input onBlur={onChanges} defaultValue={infoData['incoterms']} ref={inputRef} type="text" id={id}
                   className="customInput" name={'customInput'}
                   autoComplete="off" style={{height: 23, border: 'none', fontSize: 15, paddingLeft: 14}}/>
            <div className="dropdown-list" ref={listRef} id={`${id}s`}>
                {list.map(v => <div onPointerDown={(e: any) => {
                    if (e.target.tagName === 'DIV') {
                        inputRef.current.value = e.target.textContent;
                        listRef.current.style.display = 'none';
                    }
                }}>{v}</div>)}
            </div>
        </div>
    }


    return <>
        <div ref={topInfoRef} style={{
            fontFamily: 'Arial, sans-serif',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '35px 35px 35px 35px 35px 35px 35px 35px',
            alignItems: 'center',
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

                        {v === 'incoterms' ?
                            <>
                                <SelectForms id={'incoterms'} list={['EXW', 'FOB', 'CIF', 'DDU']}/>
                            </>

                            :
                            <Input value={infoData[v]} id={v}
                                   style={{
                                       border: 'none',
                                       paddingLeft: 15,
                                       alignItems: 'center',
                                       fontSize: 15,
                                       width: '100%'
                                   }}
                                   onChange={onChange}
                                // onBlur={() => {
                                //     getTopInfoData(info)
                                // }}
                            />

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
        <div>· 계좌번호 : (기업은행)069-118428-04-010/만쿠솔루션</div>
        <div>· 긴급 납기시 담당자와 협의가능합니다.</div>
    </div>
}


export const BottomPoInfo = ({bottomInfo, setBottomInfo}) => {

    return <div
        style={{
            paddingTop: 10,
            fontSize: 12,
            lineHeight: 1.7,
            borderTop: '1px solid black',
        }}>
        <TextArea value={bottomInfo}
                  onChange={e=> {
                      setBottomInfo(e.target.value);
                  }}
                  autoSize={true} style={{border: 'none'}}
        />
    </div>

    // return <div
    //     style={{
    //         padding: '30px 20px',
    //         fontSize: 12,
    //         lineHeight: 1.7,
    //         borderTop: '1px solid black',
    //     }}>
    //     {
    //         info?.agencyCode?.startsWith('K') ? <>
    //             <div>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</div>
    //             <div>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</div>
    //             <div>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</div>
    //             <div>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</div>
    //             <div>· 성적서 및 품질보증서는 별도입니다.</div>
    //         </> : <>
    //             <div> * For the invoice* Please indicate few things as below:</div>
    //             <div>1. HS Code 6 Digit</div>
    //             <div>2. Indication of Country of Origin</div>
    //             <div>It has to be written into the remark of every Invoice every time.</div>
    //             <div>And your name, your signature and date of signature have to be put in under the
    //                 sentence as well.
    //             </div>
    //             <div>* Please give us Order confirmation. (Advise us if we should pay your bank charge as
    //                 well.)
    //             </div>
    //         </>
    //     }
    // </div>
}