import React, {useEffect, useState} from 'react';
import EstimateList from "@/component/견적서/EstimateList";


const EstimatePaper = ({data, pdfRef, gridRef}:any) => {


    const [info, setInfo] = useState<any>();

    useEffect(()=>{
        setInfo([
            {label: '견적일자', value: data.writtenDate, label2: '담당자', value2: data.managerAdminName},
            {label: '견적서 No.', value: data.documentNumberFull, label2: '연락처', value2: data.managerPhoneNumber},
            {label: '업체명', value: data.agencyName, label2: 'E-mail', value2: data.email},
            {label: '담당자', value: data.agencyManagerName, label2: '유효기간', value2: data.validityPeriod},
            {label: '연락처', value: data.agencyManagerPhoneNumber, label2: '결제조건', value2: data.paymentTerms},
            {label: 'faxNumber', value: data.faxNumber, label2: 'email', value2: data.email},
            {label: '국내운송비', value: data.shippingTerms,label2: '납기', value2: `${data.delivery ? data.delivery : '-'} 주`}
        ])
    },[data])

    return (
        // <div ref={pdfRef} style={{padding : '0px 50px', position : 'absolute', zIndex : -100, top :-1000}}>
        <div ref={pdfRef} style={{padding : '100px 50px', width : 900, margin : '0px auto'}}>


            <div style={{display: 'flex', justifyContent: 'space-between', alignItems : 'center'}}>
                <div style={{width : '40%'}}>
                    <img src={'/manku_ci_black_text.png'} width={60} style={{paddingTop : 25, float : 'left'}} alt=""/>
                    <div style={{float : 'left', fontSize : 11, paddingLeft : 20}}>
                        <div>(주) 만쿠무역</div>
                        <div>Manku Trading Co., Ltd</div>
                        <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                        <div> B동 2층 211호, 212호</div>
                        <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                    </div>
                </div>

                <div style={{fontSize: 40, fontWeight: 700}}>견적서</div>
                <div style={{width: '40%'}}>
                    <img src={'/manku_stamp_ko.png'} style={{float : 'right'}} width={220} alt=""/>
                </div>
            </div>

            <div style={{padding: 20, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop : 20}}>
                (주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렵하게 공급합니다.
            </div>
            <div style={{fontFamily: 'Arial, sans-serif'}}>
                <table
                    style={{width: '100%', borderCollapse: 'collapse'}}>
                    <tbody>
                    {info?.map((row:any, index) => (
                        <tr key={index} style={{
                            borderTop: '0.5px solid lightGray',
                            borderBottom: index === info.length - 1 ? '0.5px solid lightGray' : 'none',
                        }}>
                            <td style={headerStyle}>{row.label}</td>

                            {/*@ts-ignored*/}
                            <td colSpan={row.colSpan ? "3" : "1"} style={{fontSize: 13, wordWrap: 'break-word', wordBreak: 'break-word', width: '300px', whiteSpace: 'pre-wrap', padding : 12}}>{row.value}</td>
                            {!row.colSpan && (
                                <>
                                    <td style={headerStyle}>{row.label2}</td>
                                    <td style={{fontSize: 13, wordWrap: 'break-word', wordBreak: 'break-word', width: '300px', whiteSpace: 'pre-wrap', padding : 12}}>{row.value2}</td>
                                </>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <EstimateList data={data} gridRef={gridRef}/>

            <div style={{padding : '0px 20px 30px 20px', fontSize : 12, lineHeight : 1.7, borderBottom : '1px solid black'}}>
                <div>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</div>
                <div>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</div>
                <div>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</div>
                <div>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</div>
                <div>· 성적서 및 품질보증서는 별도입니다.</div>
            </div>
        </div>
    );
};

const headerStyle:any = {
    backgroundColor: '#ebf6f7',
    fontWeight: 'bold',
    fontSize: 11,
    padding: 12,
    textAlign: 'left',
    width: 100
};

export default EstimatePaper;