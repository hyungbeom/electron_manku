import React, {useEffect, useRef, useState} from 'react';
import {commonManage, gridManage} from "@/utils/commonManage";
import {amountFormat} from "@/utils/columnList";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import {useAppSelector} from "@/utils/common/function/reduxHooks";
import {getData} from "@/manage/function/api";
import InputNumber from "antd/lib/input-number";
import {estimateInfo} from "@/utils/column/ProjectInfo";
import message from "antd/lib/message";

const getTextAreaValues = (ref) => {
    if (ref?.current) {
        // ✅ ID가 "textarea"인 모든 요소 가져오기
        const elements = ref.current.querySelectorAll("#textarea");

        return Array.from(elements).map((element: any) => ({
            model: element.value || element.textContent, // ✅ { model: value } 형태로 변환
        }));
    }
    return [];
};

const EstimatePaper = ({infoRef, pdfRef, pdfSubRef, tableRef, memberList = [], count=0, position = true}: any) => {

    const [info, setInfo] = useState<any>([]);
    const [originInfo, setOriginInfo] = useState<any>({maker: ''});

    const [splitData, setSplitData] = useState([])

    useEffect(() => {
        let infoData = commonManage.getInfo(infoRef, estimateInfo['defaultInfo']);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];
        setOriginInfo(v => {
            return {...v, maker: infoData['maker']}
        })
        setInfo([
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
        ])
        const tableList = tableRef.current?.getSourceData();

        const filterTotalList = tableList.filter(v => !!v.model)
        console.log(filterTotalList, 'infoData:')
        const result = commonManage.splitDataWithSequenceNumber(filterTotalList, 10, 30);
        setSplitData(result)
    }, [count])


    const RowTotal = ({defaultValue, id}) => {


        return <div style={{display: 'flex', justifyContent: 'space-between', padding : '0px 5px'}}><span style={{fontSize : 14, padding : 5}}>₩</span>
            <Input value={amountFormat(defaultValue)}
            style={{border: 'none', width : '100%', textAlign: 'right'}} id={id} name={id}/></div>
    }

    const NumberInputForm = ({defaultValue, id, setInfo}) => {

        const inputRef = useRef<any>();
        const [toggle, setToggle] = useState(false);

        const handleChange = (e) => {
            setInfo(v => {
                return {...v, net: e}
            })
        };

        function blur() {
            console.log('!!')
            setToggle(false)
        }

        useEffect(() => {
            if (toggle) {
                inputRef.current.focus();
            }
        }, [toggle]);

        return <>{toggle ? <InputNumber ref={inputRef} onBlur={blur} value={defaultValue} onChange={handleChange}
                                        formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        parser={(value) => value.replace(/[^0-9]/g, '')}
                                        style={{border: 'none', textAlign: 'right', direction: 'rtl', width: '90%'}}
                                        name={id}
                                        prefix={<span style={{paddingLeft: 10}}>₩</span>}/> :
            <div style={{fontSize: 14, display: 'flex', justifyContent: 'space-between', padding: '0px 10px'}}
                 onClick={() => {
                     setToggle(true);
                 }}>
                <span>₩</span>
                {amountFormat(defaultValue)}
            </div>}</>
    }

    const TotalCalc = () => {


        return <thead>
        <tr style={{fontWeight: 'bold', height: 30}}>
            <th colSpan={3} style={{
                width: '6%',
                border: '1px solid lightGray',
                // borderLeft: 'none',
                fontSize: 12,
            }}>
            </th>

            <th style={{
                borderTop: '1px solid lightGray', border: '1px solid lightGray',
                borderRight: 'none'
            }}>
                <div id={'total_quantity'} style={{textAlign: 'right', paddingRight: 5, fontSize: 13.5}}></div>
            </th>
            <th style={{
                borderTop: '1px solid lightGray',
                border: '1px solid lightGray',
                // borderRight: 'none'
            }}>
                <div id={'total_unit'} style={{textAlign: 'left', fontSize: 13.5, paddingLeft: 12}}></div>
            </th>
            <th style={{
                borderTop: '1px solid lightGray', border: '1px solid lightGray',
                borderRight: 'none'
            }}>
                <div style={{textAlign: 'center', fontSize: 13.5}}>
                    <div id={'total_unit_price'}></div>
                </div>
            </th>
            <th style={{
                borderTop: '1px solid lightGray', border: '1px solid lightGray',
                // borderRight: 'none'
            }}>
                <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '0px 10px'}}>
                    <div style={{textAlign: 'left'}}>₩</div>
                    <div style={{paddingRight: 5}} id={'total_amount'}></div>


                </div>
            </th>
        </tr>
        </thead>
    }

    const RowContent = ({v, i}) => {
        const [info, setInfo] = useState({quantity: v.quantity, unit: v.unit, net: v.net})

        useEffect(() => {
            const totalQuantity = Array.from(document.getElementsByName("quantity"))
                .reduce((sum, input: any) => sum + (parseFloat(input.value) || 0), 0);

            const totalPrice = Array.from(document.getElementsByName("net"))
                .reduce((sum, input: any) => sum + (Number(input.value.replace(/,/g, "")) || 0), 0);

            const totalAmount = Array.from(document.getElementsByName("amount"))
                .reduce((sum, input: any) => sum + (Number(input.value.replace(/,/g, "")) || 0), 0);


            const resultNum = Number(info?.net ? info?.net : '');

            if (document.getElementById("total_amount")) {
                document.getElementById("total_amount").textContent = amountFormat(totalAmount);
                document.getElementById("total_unit_price").textContent = '(V.A.T)별도';
                document.getElementById("total_unit").textContent = info.unit;
                document.getElementById("total_quantity").textContent = totalQuantity.toString()
            }

        }, [info]);


        return <thead>
        <tr style={{fontWeight: 'bold', height: 10}}>
            <th colSpan={2} style={{
                border: 'none',
                textAlign: 'center',
                borderRight: '1px solid lightGray',
                borderBottom: '1px solid lightGray', fontSize: 12,

            }}>
                <div>{i + 1}</div>
            </th>

            <th style={{borderBottom: '1px solid lightGray', textAlign: 'left', fontSize: 12}}>
                <Model v={v} refList={[pdfRef, pdfSubRef]} setSplitData={setSplitData}/>
            </th>
            <th style={{
                ...headerStyle,
                width: 60,
                textAlign: 'right',
                fontWeight: 'lighter',
                fontSize: 12,
                borderLeft: '1px solid lightGray',
                paddingRight: 6

            }}>
                <Input value={info['quantity']}
                       name={'quantity'}
                       onChange={e => setInfo(v => {
                           return {...v, quantity: e.target.value}
                       })}
                       style={{
                           border: 'none',
                           textAlign: 'right',
                           padding: 0
                       }}/>
            </th>
            <th style={{
                borderBottom: '1px solid lightGray',
                fontSize: 12,
                borderLeft: '1px solid lightGray',
                textAlign: 'left',
                paddingRight: 0
            }}>
                <Select value={info?.unit}
                        style={{border: 'none', height: 30, paddingRight: 0}}
                        bordered={false} suffixIcon={null}
                        onChange={v => {
                            setInfo(src => {
                                return {...src, unit: v}
                            })
                        }}
                >
                    {['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz'].map(v => {
                        // @ts-ignored
                        return <Option style={{fontSize: 11}} value={v}>{v}</Option>
                    })}
                </Select>
            </th>
            <th style={{
                width: 150,
                borderBottom: '1px solid lightGray',
                textAlign: 'right',
                fontWeight: 'lighter',
                fontSize: 12,
                borderLeft: '1px solid lightGray',
            }}>
                <NumberInputForm defaultValue={info?.net} id={'net'} setInfo={setInfo}/>
            </th>

            <th style={{
                borderTop: '1px solid lightGray',
                 fontWeight: 'lighter', fontSize: 12,
                borderLeft: '1px solid lightGray',
                borderBottom: '1px solid lightGray'
            }}>
                <RowTotal
                    defaultValue={info.quantity * Number(info?.net ? info?.net : '')}
                    id={'amount'}/>
            </th>
        </tr>
        </thead>
    }

    return (
        <div
            style={!position ? {position : 'absolute', top : 0, zIndex : -100} : {}}
        >

            <div ref={pdfRef} style={{
                width: '1000px',  // A4 가로
                height: '1354px',  // A4 세로
                // aspectRatio: '1 / 1.414',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0px 20px'
            }}>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{width: '40%'}}>
                        <img src={'/manku_ci_black_text.png'} width={50} style={{paddingTop: 5, float: 'left'}}
                             alt=""/>
                        <div style={{float: 'left', fontSize: 11, paddingLeft: 20}}>
                            <div>(주) 만쿠무역</div>
                            <div>Manku Trading Co., Ltd</div>
                            <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                            <div> B동 2층 211호, 212호</div>
                            <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                        </div>
                    </div>

                    <div style={{fontSize: 38, fontWeight: 700}}>견&nbsp;&nbsp;&nbsp;&nbsp;적&nbsp;&nbsp;&nbsp;&nbsp;서
                    </div>
                    <div style={{width: '40%'}}>
                        <img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={180} alt=""/>
                    </div>
                </div>

                <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}>
                    (주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렴하게 공급합니다.
                </div>
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
                                    <Input value={v.value} id={v.id}
                                           onChange={e => {
                                               let copyData = [...info]
                                               let getParam = copyData.find(src => src.id === v.id)
                                               getParam['value'] = e.target.value;
                                               let index = copyData.findIndex(item => item.id === getParam.id);
                                               if (index !== -1) {
                                                   copyData[index] = getParam;
                                               }
                                               setInfo(copyData)
                                           }}
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

                <table
                    style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '20px 0',
                        textAlign: 'center',
                        border: '1px solid lightGray',
                        // borderLeft: 'none',
                        // borderRight: 'none'
                    }}>
                    <thead>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                        <th colSpan={3} style={{width: '48%'}}>Specification</th>
                        <th colSpan={2}
                            style={{
                                width: '9%',
                                textAlign: 'center',
                                borderLeft: '1px solid lightGray',
                                paddingRight: 10
                            }}>Q`ty
                        </th>
                        {/*<th style={{textAlign: 'left', paddingLeft: 10, borderLeft: '1px solid lightGray'}}>Unit</th>*/}
                        <th style={{width: '20%', borderLeft: '1px solid lightGray'}}>Unit Price</th>
                        <th style={{width: '20%', borderLeft: '1px solid lightGray'}}>Amount</th>
                    </tr>
                    </thead>

                    <thead>
                    <tr style={{fontWeight: 'bold', height: 30}}>
                        <th colSpan={7} style={{
                            width: '7%',
                            border: '1px solid lightGray',
                            borderLeft: 'none',
                            borderRight: 'none',
                            fontSize: 12,
                        }}/>
                    </tr>
                    </thead>
                    <thead>
                    <tr style={{fontWeight: 'bold', height: 35}}>
                        <th colSpan={2} style={{
                            width: '6%',
                            border: '1px solid lightGray',
                            borderLeft: 'none',
                        }}>Maker
                        </th>
                        <th style={{
                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            borderLeft: 'none', borderRight: 'none',
                            textAlign: 'left', paddingLeft: 10
                        }}>{originInfo?.maker ? originInfo?.maker : '-'}</th>
                        <th style={{
                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            borderRight: 'none'
                        }}></th>
                        <th style={{
                            borderTop: '1px solid lightGray',
                            border: '1px solid lightGray',
                            borderRight: 'none'
                        }}></th>
                        <th style={{

                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            borderRight: 'none'
                        }}></th>
                        <th style={{
                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            borderRight: 'none'
                        }}></th>
                    </tr>
                    </thead>
                    {splitData[0]?.map((v, i) => {
                        return <>
                            <RowContent v={v} i={i}/>
                        </>
                    })}

                    {/*{splitData.length === 1 ? <TotalCalc/> : <></>}*/}
                </table>
                <div style={{flexGrow: 1}}/>
                {/* 여백 자동 확장하여 아래로 밀어줌 */}

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
                    <thead style={{   visibility : 'hidden'}}>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                        <th colSpan={3} style={{width: '48%'}}>Specification</th>
                        <th colSpan={2}
                            style={{
                                width: '9%',
                                textAlign: 'center',
                                // borderLeft: '1px solid lightGray',
                                paddingRight: 10
                            }}>Q`ty
                        </th>
                        {/*<th style={{textAlign: 'left', paddingLeft: 10, borderLeft: '1px solid lightGray'}}>Unit</th>*/}
                        <th style={{width: '20%'}}>Unit Price</th>
                        <th style={{width: '20%'}}>Amount</th>
                    </tr>
                    </thead>

                    {splitData.length === 1 ? <TotalCalc/> : <></>}
                </table>
                <div
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

                <div style={{textAlign: 'center'}}>- 1 -</div>
            </div>


            <div ref={pdfSubRef} style={{paddingTop: 1.5}}>

                {splitData?.map((src, i) => {
                    if (!i) {
                        return null;
                    }

                    return <>
                        <div style={{
                            width: '1000px',
                            height: '1414px',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            padding: 30,
                            border: '1px solid lightGray'
                        }}><DataTable src={src} indexNumber={i} refList={[pdfRef, pdfSubRef]} splitData={splitData}
                                      setSplitData={setSplitData}/>

                            <div style={{flexGrow: 1}}/>
                            <div
                                style={{
                                    padding: '30px 20px',
                                    fontSize: 12,
                                    lineHeight: 1.7,
                                    borderTop: '1px solid black',
                                    marginTop: 'auto', // ✅ div가 항상 하단으로 이동
                                }}>
                                <div>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</div>
                                <div>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</div>
                                <div>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</div>
                                <div>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</div>
                                <div>· 성적서 및 품질보증서는 별도입니다.</div>
                            </div>

                            <div style={{textAlign: 'center'}}>- {i + 1} -</div>
                        </div>
                        <div style={{height: 2, borderBottom: '1px solid white'}}/>
                    </>
                })}
            </div>
        </div>
    );
};
const Model = ({v, refList, setSplitData}) => {
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
        const splitData = commonManage.splitDataWithSequenceNumber([...result1, ...result2], 8, 17);
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

                <div
                    id="textarea" // ✅ ID 추가 (div에서도 동일 ID 유지)
                    style={{
                        paddingLeft: 8,
                        wordWrap: "break-word",
                        wordBreak: "break-word",
                        whiteSpace: "pre-wrap",
                        fontWeight: "lighter",
                        minHeight: "20px",
                    }}
                >
                    {v.model} {/* 값이 없을 때 가이드 텍스트 표시 */}
                </div>

            </>
        </th>
    );
};
const DataTable = ({src, indexNumber, refList, splitData, setSplitData}) => {


    return <div>
        <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '0px 0px 20px 0px',
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
                paddingRight: 10
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

        {src.map((v, idx) => {
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
                        <Model v={v} refList={refList} setSplitData={setSplitData}/>
                    </>
                </th>
                <th style={{
                    ...headerStyle,
                    textAlign: 'right',
                    fontWeight: 'lighter',
                    fontSize: 12,
                    borderLeft: '1px solid lightGray'
                }}>
                    <Input value={amountFormat(v.quantity)}
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
                    <Select value={amountFormat(v.unit)}
                            style={{border: 'none'}}
                            bordered={false} suffixIcon={null}>
                        {['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz'].map(v => {
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
                    <Input value={amountFormat(v.net)} style={{border: 'none'}}
                           suffix={'₩'}/>
                </th>

                <th style={{
                    borderBottom: '1px solid lightGray',
                    textAlign: 'right', fontWeight: 'lighter', fontSize: 12,
                    borderLeft: '1px solid lightGray'
                }}>
                    <Input value={amountFormat(v.quantity * v.net)}
                           style={{border: 'none'}} suffix={'₩'}/>
                </th>
            </tr>
            </thead>

        })
        }

        {splitData.length === indexNumber + 1 && <thead style={{width: '100%'}}>
        <tr style={{fontWeight: 'bold', height: 50, width: '100%'}}>
            <th colSpan={2} style={{
                width: '7%',
                border: '1px solid lightGray',
                borderLeft: 'none',
                fontSize: 12,
                backgroundColor: '#ebf6f7'
            }}>총합
            </th>
            <th style={{
                borderTop: '1px solid lightGray',
                backgroundColor: '#ebf6f7',
                border: '1px solid lightGray',
                borderLeft: 'none',
                borderRight: 'none'
            }}></th>
            <th style={{
                backgroundColor: '#ebf6f7',
                borderTop: '1px solid lightGray', border: '1px solid lightGray',
                borderRight: 'none'
            }}>
                <div id={'total_quantity'}
                     style={{textAlign: 'right', paddingRight: 10, fontSize: 13.5}}></div>
            </th>
            <th style={{
                backgroundColor: '#ebf6f7',

                borderTop: '1px solid lightGray',
                border: '1px solid lightGray',
                borderRight: 'none'
            }}>
                <div id={'total_unit'}
                     style={{textAlign: 'left', fontSize: 13.5, paddingLeft: 12}}></div>
            </th>
            <th style={{
                borderTop: '1px solid lightGray', border: '1px solid lightGray',
                backgroundColor: '#ebf6f7',
                borderRight: 'none'
            }}>
                <div style={{
                    display: 'flex',
                    textAlign: 'right',
                    direction: 'rtl',
                    paddingRight: 13,
                    fontSize: 13.5
                }}>
                    <div style={{textAlign: 'right'}}>₩</div>
                    <div style={{paddingRight: 10}} id={'total_unit_price'}></div>
                </div>
            </th>
            <th style={{
                borderTop: '1px solid lightGray', border: '1px solid lightGray',
                backgroundColor: '#ebf6f7',
                borderRight: 'none'
            }}>
                <div style={{
                    display: 'flex',
                    textAlign: 'right',
                    direction: 'rtl',
                    paddingRight: 13,
                    fontSize: 13.5
                }}>
                    <div style={{textAlign: 'right'}}>₩</div>
                    <div style={{paddingRight: 10}} id={'total_amount'}></div>
                </div>
            </th>
        </tr>
        </thead>}
    </div>
}


const headerStyle: any = {
    // backgroundColor: '#ebf6f7',
    borderBottom: '1px solid lightGray',
    fontWeight: 'bold',
    fontSize: 11,
    // padding: 12,
    textAlign: 'left',
    width: 100
};

export default EstimatePaper;