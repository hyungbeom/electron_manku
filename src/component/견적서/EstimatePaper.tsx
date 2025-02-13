import React, {useEffect, useMemo, useRef, useState} from 'react';
import {commonManage, gridManage} from "@/utils/commonManage";
import {amountFormat} from "@/utils/columnList";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";

const getTextAreaValues = (ref) => {
    if (ref.current) {
        // ✅ ID가 "textarea"인 모든 요소 가져오기
        const elements = ref.current.querySelectorAll("#textarea");

        return Array.from(elements).map((element:any) => ({
            model: element.value || element.textContent, // ✅ { model: value } 형태로 변환
        }));
    }
    return [];
};

const EstimatePaper = ({data, pdfRef, pdfSubRef, gridRef, position = false}: any) => {

    const [info, setInfo] = useState<any>();

    const [splitData, setSplitData] = useState([])

    useEffect(()=>{
        const totalList = gridManage.getAllData(gridRef)
        const result = commonManage.splitDataWithSequenceNumber(totalList, 8, 20);
        setSplitData(result)
    },[data])


    useEffect(() => {
        setInfo([
            {label: '견적일자', value: data.writtenDate, label2: '담당자', value2: data.managerAdminName},
            {label: '견적서 No.', value: data.documentNumberFull, label2: '연락처', value2: data.managerPhoneNumber},
            {label: '업체명', value: data.agencyName, label2: 'E-mail', value2: data.email},
            {label: '담당자', value: data.agencyManagerName, label2: '유효기간', value2: data.validityPeriod},
            {label: '연락처', value: data.agencyManagerPhoneNumber, label2: '결제조건', value2: data.paymentTerms},
            {label: 'faxNumber', value: data.faxNumber, label2: 'email', value2: data.email},
            {
                label: '국내운송비',
                value: data.shippingTerms,
                label2: '납기',
                value2: data.delivery
            }
        ])


    }, [data])

    return (
        // <div ref={pdfRef} style={{padding : '0px 50px', position : 'absolute', zIndex : -100, top :-1000}}>
        <>

            <div ref={pdfRef} style={{
                padding: '100px 50px',
                width: 900,
                margin: '0px auto',
                // @ts-ignored
                position: position ? '' : 'absolute',
                zIndex: -100,
                top: -1000
            }}>


                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{width: '40%'}}>
                        <img src={'/manku_ci_black_text.png'} width={60} style={{paddingTop: 25, float: 'left'}}
                             alt=""/>
                        <div style={{float: 'left', fontSize: 11, paddingLeft: 20}}>
                            <div>(주) 만쿠무역</div>
                            <div>Manku Trading Co., Ltd</div>
                            <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                            <div> B동 2층 211호, 212호</div>
                            <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                        </div>
                    </div>

                    <div style={{fontSize: 40, fontWeight: 700}}>견적서</div>
                    <div style={{width: '40%'}}>
                        <img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={220} alt=""/>
                    </div>
                </div>

                <div style={{padding: 20, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 20}}>
                    (주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렵하게 공급합니다.
                </div>
                <div style={{fontFamily: 'Arial, sans-serif'}}>
                    <table
                        style={{width: '100%', borderCollapse: 'collapse'}}>
                        <tbody>
                        {info?.map((row: any, index) => (
                            <tr key={index} style={{
                                borderTop: '0.5px solid lightGray',
                                borderBottom: index === info.length - 1 ? '0.5px solid lightGray' : 'none',
                            }}>
                                <td style={headerStyle}>{row.label}</td>

                                {/*@ts-ignored*/}
                                <td colSpan={row.colSpan ? "3" : "1"} style={{
                                    fontSize: 13,
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    width: '300px',
                                    whiteSpace: 'pre-wrap',
                                    padding: 12
                                }}>
                                    <Input defaultValue={row.value} style={{border: 'none'}}/>
                                </td>
                                {!row.colSpan && (
                                    <>
                                        <td style={headerStyle}>{row.label2}</td>
                                        <td style={{
                                            fontSize: 13,
                                            wordWrap: 'break-word',
                                            wordBreak: 'break-word',
                                            width: '300px',
                                            whiteSpace: 'pre-wrap',
                                            padding: 12
                                        }}><Input defaultValue={row.value2}
                                                  style={{border: 'none', width: row.label2 === '납기' ? 70 : '100%'}}
                                                  suffix={row.label2 === '납기' ?
                                                      <span style={{fontSize: 12}}>주</span> : ''}/></td>
                                    </>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '20px 0',
                        textAlign: 'center',
                        // border: '1px solid lightGray',
                        // borderLeft: 'none',
                        // borderRight: 'none'
                    }}>
                    <thead>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold'}}>
                        <th colSpan={3} style={{width: '55%'}}>Specification</th>
                        <th style={{textAlign: 'right', borderLeft: '1px solid lightGray', paddingRight: 10}}>Qty</th>
                        <th style={{textAlign: 'left', paddingLeft: 10, borderLeft: '1px solid lightGray'}}>Unit</th>
                        <th style={{borderLeft: '1px solid lightGray'}}>Unit Price</th>
                        <th style={{borderLeft: '1px solid lightGray'}}>Amount</th>
                    </tr>
                    </thead>


                    <thead>
                    <tr style={{fontWeight: 'bold', height: 50}}>
                        <th colSpan={2} style={{
                            width: '7%',
                            border: '1px solid lightGray',
                            borderLeft: 'none',
                            fontSize : 12,
                            backgroundColor: '#ebf6f7'
                        }}>MAKER
                        </th>
                        <th style={{
                            borderTop: '1px solid lightGray', backgroundColor: '#ebf6f7', border: '1px solid lightGray',
                            borderLeft: 'none', borderRight: 'none'
                        }}>{data?.maker ? data?.maker : '-'}</th>
                        <th style={{
                            backgroundColor: '#ebf6f7',
                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            borderRight: 'none'
                        }}></th>
                        <th style={{
                            backgroundColor: '#ebf6f7',
                            borderTop: '1px solid lightGray',
                            border: '1px solid lightGray',
                            borderRight: 'none'
                        }}></th>
                        <th style={{
                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            backgroundColor: '#ebf6f7',
                            borderRight: 'none'
                        }}></th>
                        <th style={{
                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            backgroundColor: '#ebf6f7',
                            borderRight: 'none'
                        }}></th>
                    </tr>
                    </thead>
                    {splitData[0]?.map((v, i) => {
                        return <>

                            <thead>
                            <tr>
                                <th colSpan={2} style={{
                                    width: '7%',
                                    border: 'none',
                                    textAlign: 'left',
                                    paddingLeft: 10,
                                    borderBottom: '1px solid lightGray', fontSize: 12

                                }}>
                                    <div style={{width: 30, borderRight: '1px solid lightGray'}}>{i + 1}</div>
                                </th>
                                <th style={{borderBottom: '1px solid lightGray', textAlign: 'left', fontSize: 12}}>
                                    <Model v={v} refList={[pdfRef, pdfSubRef]} setSplitData={setSplitData}/>
                                </th>
                                <th style={{
                                    ...headerStyle,
                                    textAlign: 'right',
                                    fontWeight: 'lighter',
                                    fontSize: 12,
                                    borderLeft: '1px solid lightGray'
                                }}>
                                    <Input defaultValue={amountFormat(v.quantity)}
                                           style={{
                                               border: 'none',
                                               backgroundColor: '#ebf6f7',
                                               textAlign: 'right',
                                               padding: 0
                                           }}/>
                                </th>
                                <th style={{
                                    borderBottom: '1px solid lightGray',
                                    fontSize: 12,
                                    borderLeft: '1px solid lightGray'
                                }}>
                                    <Select defaultValue={amountFormat(v.unit)}
                                            style={{border: 'none'}}
                                            bordered={false} suffixIcon={null}>
                                        {['EA', 'SET', 'M', 'FEET', 'ROLL', 'BOX', 'G', 'KG', 'PACK', 'INCH', 'MOQ'].map(v => {
                                            // @ts-ignored
                                            return <Option style={{fontSize: 11}} value={v}>{v}</Option>
                                        })}
                                    </Select>
                                </th>
                                <th style={{
                                    borderBottom: '1px solid lightGray',
                                    textAlign: 'right',
                                    fontWeight: 'lighter',
                                    fontSize: 12,
                                    borderLeft: '1px solid lightGray'
                                }}>
                                    <Input defaultValue={amountFormat(v.unitPrice)} style={{border: 'none'}}
                                           suffix={'₩'}/>
                                </th>

                                <th style={{
                                    borderTop: '1px solid lightGray',
                                    textAlign: 'right', fontWeight: 'lighter', fontSize: 12,
                                    borderLeft: '1px solid lightGray'
                                }}>
                                    <Input defaultValue={amountFormat(v.quantity * v.unitPrice)}
                                           style={{border: 'none'}} suffix={'₩'}/>
                                </th>
                            </tr>
                            </thead>
                        </>
                    })}
                </table>
            </div>

            <div style={{height: 2, borderBottom: '1px solid lightGray'}}/>

            <div ref={pdfSubRef} style={{
                padding: '0px 50px',
                width: 900,
                margin: '0px auto',
                // @ts-ignored
                position: position ? '' : 'absolute',
                zIndex: -100,
                top: -1000
            }}>


                {splitData?.map((src, i) => {
                    if (!i) {
                        return null;
                    }

                    return <DataTable src={src} i={i}  refList={[pdfRef, pdfSubRef]} setSplitData={setSplitData} />
                })}

            </div>


            {/*<div*/}
            {/*    style={{*/}
            {/*        padding: '0px 20px 30px 20px',*/}
            {/*        fontSize: 12,*/}
            {/*        lineHeight: 1.7,*/}
            {/*        borderBottom: '1px solid black'*/}
            {/*    }}>*/}
            {/*    <div>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</div>*/}
            {/*    <div>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</div>*/}
            {/*    <div>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</div>*/}
            {/*    <div>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</div>*/}
            {/*    <div>· 성적서 및 품질보증서는 별도입니다.</div>*/}
            {/*</div>*/}
        </>
    );
};
const Model = ({ v, refList, setSplitData }) => {
    const [toggle, setToggle] = useState(false);
    const [textValue, setTextValue] = useState(v.model); // ✅ useState로 값 저장
    const inputRef = useRef(null);

    // 바깥 클릭 감지
    useEffect(() => {
        function handleClickOutside(event) {
            const textAreaElement = inputRef.current?.resizableTextArea?.textArea;
            if (textAreaElement && !textAreaElement.contains(event.target)) {
                reRowDataList();
                setToggle(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    function reRowDataList() {
        const result1 = getTextAreaValues(refList[0]); // pdfRef에서 ID가 textarea인 값만 가져오기
        const result2 = getTextAreaValues(refList[1]); // pdfRef에서 ID가 textarea인 값만 가져오기
        const splitData = commonManage.splitDataWithSequenceNumber([...result1, ...result2], 8, 20);
        setSplitData(splitData)
    }

    return (
        <th
            style={{
                width: 480,
                textAlign: "left",
                fontSize: 12,
                whiteSpace: "normal",
                wordBreak: "break-word",
                overflowWrap: "break-word",
            }}
        >
            <>
                {toggle ? (
                    <TextArea
                        id="textarea" // ✅ ID 추가
                        ref={inputRef}
                        autoSize={{ minRows: 1 }}
                        bordered={false}
                        value={textValue} // ✅ 상태 관리 값으로 설정
                        onChange={(e) => setTextValue(e.target.value)} // ✅ 값 변경 시 즉시 상태 업데이트
                        style={{
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                            whiteSpace: "pre-line",
                            fontWeight: "lighter",
                            resize: "none",
                        }}
                        onBlur={() => {
                            setToggle(false);
                        }}
                    />
                ) : (
                    <div
                        id="textarea" // ✅ ID 추가 (div에서도 동일 ID 유지)
                        onClick={() => setToggle(true)}
                        style={{
                            cursor: "pointer",
                            wordWrap: "break-word",
                            wordBreak: "break-word",
                            whiteSpace: "pre-wrap",
                            fontWeight: "lighter",
                            minHeight: "20px",
                        }}
                    >
                        {textValue} {/* 값이 없을 때 가이드 텍스트 표시 */}
                    </div>
                )}
            </>
        </th>
    );
};
const DataTable = ({src,i, refList, setSplitData}) => {


    return <div style={{borderTop: '1px solid lightGry',}}>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '150px 0px 20px 0px',
            borderBottom: '2px solid #71d1df'
        }}>
            <div style={{width: '40%'}}>
                <img src={'/manku_ci_black_text.png'} width={60} style={{paddingTop: 25, float: 'left'}}
                     alt=""/>
                <div style={{float: 'left', fontSize: 11, paddingLeft: 20}}>
                    <div>(주) 만쿠무역</div>
                    <div>Manku Trading Co., Ltd</div>
                    <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                    <div> B동 2층 211호, 212호</div>
                    <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                </div>
            </div>


            <div style={{fontSize: 40, fontWeight: 700}}>견적서</div>
            <div style={{width: '40%'}}>
                <img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={220} alt=""/>
            </div>
        </div>

        <div style={{paddingBottom: 25}}/>
        <thead>
        <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold'}}>
            <th colSpan={3} style={{width: '55%', borderBottom: '1px solid lightGray'}}>Specification
            </th>
            <th style={{
                textAlign: 'right',
                borderLeft: '1px solid lightGray',
                borderBottom: '1px solid lightGray',
                paddingRight : 10
            }}>Qty
            </th>
            <th style={{
                textAlign: 'left',
                paddingLeft: 10,
                borderLeft: '1px solid lightGray',
                borderBottom: '1px solid lightGray'
            }}>Unit
            </th>
            <th style={{borderLeft: '1px solid lightGray', borderBottom: '1px solid lightGray'}}>Unit
                Price
            </th>
            <th style={{
                borderLeft: '1px solid lightGray',
                borderBottom: '1px solid lightGray'
            }}>Amount
            </th>
        </tr>
        </thead>
        {src.map(v => {
            return <thead>
            <tr>
                <th colSpan={2} style={{
                    width: '7%',
                    border: 'none',
                    textAlign: 'left',
                    paddingLeft: 10,
                    borderBottom: '1px solid lightGray', fontSize: 12

                }}>

                    <div
                        style={{width: 30, borderRight: '1px solid lightGray'}}>{v.sequenceNumber}</div>
                </th>
                <th style={{
                    borderBottom: '1px solid lightGray',
                    textAlign: 'left',
                    fontSize: 12,
                    whiteSpace: 'normal',
                    wordBreak: 'break-word',
                    overflowWrap: 'break-word'
                }}>
                    <>
                        <Model v={v}  refList={refList} setSplitData={setSplitData}/>
                    </>
                </th>
                <th style={{
                    ...headerStyle,
                    textAlign: 'right',
                    fontWeight: 'lighter',
                    fontSize: 12,
                    borderLeft: '1px solid lightGray'
                }}>
                    <Input defaultValue={amountFormat(v.quantity)}
                           style={{
                               border: 'none',
                               backgroundColor: '#ebf6f7',
                               textAlign: 'right',
                               padding: 0
                           }}/>
                </th>
                <th style={{
                    borderBottom: '1px solid lightGray',
                    fontSize: 12,
                    borderLeft: '1px solid lightGray'
                }}>
                    <Select defaultValue={amountFormat(v.unit)}
                            style={{border: 'none'}}
                            bordered={false} suffixIcon={null}>
                        {['EA', 'SET', 'M', 'FEET', 'ROLL', 'BOX', 'G', 'KG', 'PACK', 'INCH', 'MOQ'].map(v => {
                            // @ts-ignored
                            return <Option style={{fontSize: 11}} value={v}>{v}</Option>
                        })}
                    </Select>
                </th>
                <th style={{
                    borderBottom: '1px solid lightGray',
                    textAlign: 'right',
                    fontWeight: 'lighter',
                    fontSize: 12,
                    borderLeft: '1px solid lightGray'
                }}>
                    <Input defaultValue={amountFormat(v.unitPrice)} style={{border: 'none'}}
                           suffix={'₩'}/>
                </th>

                <th style={{
                    borderBottom: '1px solid lightGray',
                    textAlign: 'right', fontWeight: 'lighter', fontSize: 12,
                    borderLeft: '1px solid lightGray'
                }}>
                    <Input defaultValue={amountFormat(v.quantity * v.unitPrice)}
                           style={{border: 'none'}} suffix={'₩'}/>
                </th>
            </tr>
            </thead>

        })
        }</div>
}


const headerStyle: any = {
    backgroundColor: '#ebf6f7',
    borderBottom: '1px solid lightGray',
    fontWeight: 'bold',
    fontSize: 11,
    padding: 12,
    textAlign: 'left',
    width: 100
};

export default EstimatePaper;