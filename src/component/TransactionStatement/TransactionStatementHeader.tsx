import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import _ from "lodash";
import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input";
import moment from "moment";
import {commonManage} from "@/utils/commonManage";
import {orderInfo} from "@/utils/column/ProjectInfo";
import {searchDomesticCustomer} from "@/utils/api/mainApi";
import TextArea from "antd/lib/input/TextArea";
import InputNumber from "antd/lib/input-number";
import {amountFormat} from "@/utils/columnList";
import {DownloadOutlined, PrinterOutlined} from "@ant-design/icons";

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


function sumLengthsUpToIndex(array, index) {
    let totalLength = 0;

    // 인덱스가 유효한지 확인
    if (index >= array.length) {
        return "유효한 인덱스를 입력해주세요.";
    }

    // 0부터 index까지 각 배열의 길이를 합산
    for (let i = 0; i <= index; i++) {
        totalLength += array[i].length;
    }

    return totalLength;
}

export const Header = ({title}) => <>
    <div style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>거 래 명 세 표 <span
        style={{fontSize: 14}}>({title})</span></div>
    <div style={{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'center'
    }}>
        <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>거래일자 :</div>
        <div style={{width: 100, alignItems: 'center'}}><Input style={{border: 'none'}}
                                                               defaultValue={moment().format('YYYY-MM-DD')}
                                                               id={'writtenDate'}/></div>
    </div>
</>

function TransactionStatementHeader({isModalOpen, setIsModalOpen, info, pdfRef, tableRef}: any) {

    const ref1 = useRef<any>()
    const ref2 = useRef<any>()


    const [domesticInfo, setDomesticInfo] = useState<any>(orderInfo['defaultInfo'])

    useEffect(() => {

        const {customerName} = info;

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

    const [data, setData] = useState({});

    useEffect(() => {
        let returnTable = []
        if (tableRef.current) {
            const tableList = tableRef.current?.getSourceData();
            const filterTableList = commonManage.filterEmptyObjects(tableList, ['model'])
            const result = commonManage.splitDataWithSequenceNumber(filterTableList, 18, 30);
            returnTable = result
        }
        setData(returnTable)
    }, [isModalOpen]);


    const totalData = useMemo(() => {

        const list = Object.values(data);
        let bowl = {quantity: 0, net: 0, total: 0, tax: 0, unit: list.length ? list[0][0]['unit'] : ''}

        list.forEach((v: any, i: number) => {
            const result = v.reduce((acc, cur, idx) => {
                const {quantity, net} = cur
                acc[0] += quantity;
                acc[1] += net;
                acc[2] += (quantity * net)
                acc[3] += Math.round((quantity * net) / 10);

                return acc
            }, [0, 0, 0, 0])
            bowl["quantity"] += parseFloat(result[0]);
            bowl["net"] += parseFloat(result[1]);
            bowl["total"] += parseFloat(result[2]);
            bowl["tax"] += parseFloat(result[3]);
        })

        return bowl
    }, [data]);


    function TextAreas({value, numb, objKey = 0}) {

        const [model, setModel] = useState('');

        useEffect(() => {
            setModel(value)
        }, [value]);

        function onChange(e) {
            setModel(e.target.value)
        }


        function blur(e) {
            setData(v => {
                v[objKey][numb]['model'] = model;
                return {...v}
            })
        }

        return <TextArea autoSize={true} style={{border: 'none'}} onChange={onChange} onBlur={blur} value={model}
                         key={`ttt${numb}`}/>
    }


    function NumberInputForm({value, numb, objKey = 0}) {

        const [info, setInfo] = useState({net: value.net, quantity: value.quantity});

        const inputRef = useRef<any>();
        const [toggle, setToggle] = useState(false);

        function blur(e) {
            setToggle(false);
            setData(v => {
                v[objKey][numb][e.target.id] = parseFloat(e.target.value.replaceAll(",", ""));
                return {...v}
            })
        }

        useEffect(() => {
            if (toggle) {
                inputRef.current.focus();
            }

        }, [toggle]);

        function onchange(e) {
            setInfo(v => {
                return {...v, net: e}
            })
        }


        function onQuantity(e) {
            setInfo(v => {
                return {...v, quantity: e.target.value}
            })
        }

        return <>
            <td style={{width: 100, textAlign: 'right'}}>


                <Input style={{border: 'none', textAlign: 'right', fontSize: 13}} id={'quantity'} type={'number'}
                       value={info.quantity}
                       onChange={onQuantity} onBlur={blur} name={'qt'}/>

            </td>

            <td>
                {toggle ? <InputNumber id={'net'} ref={inputRef} onBlur={blur} value={info.net} onChange={onchange}
                                       formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                       parser={(value) => value.replace(/[^0-9]/g, '')}
                                       style={{
                                           border: 'none',
                                           textAlign: 'right',
                                           direction: 'rtl',
                                           width: '90%',
                                           fontSize: 12
                                       }}
                                       name={''}/>
                    :
                    <div style={{
                        fontSize: 13,
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0px 10px'
                    }}
                         onClick={() => {
                             setToggle(true);
                         }}>
                        <span>₩</span>
                        <span className={'netPrice'}>{amountFormat(info.net)}</span>
                    </div>

                }

            </td>
            <td>
                <div style={{
                    fontSize: 13,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0px 10px'
                }}
                     onClick={() => {
                         setToggle(true);
                     }}>
                    <span>₩</span>
                    <span className={'total'}>{amountFormat(info.net * info.quantity)}</span>
                </div>

            </td>

            <td style={{fontWeight: 600}}>
                <div style={{
                    fontSize: 12,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0px 10px'
                }}>

                    <span>₩</span>
                    <span className={'tax'}> {amountFormat((info.net * info.quantity) / 10)}</span>
                </div>
            </td>


        </>
    }

    return <>
        <Modal
            title={<div style={{width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <div>거래명세표 출력</div>
                <div>
                    <button onClick={() => commonManage.pdfDown(pdfRef, false, `${info?.documentNumberFull}_${info?.customerName}_거래명세서`)}
                            style={{
                                padding: "5px 10px",
                                backgroundColor: "#1890ff",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: 11,
                                marginRight: 10
                            }}>
                        <div><DownloadOutlined style={{paddingRight: 8}}/>다운로드</div>
                    </button>
                    {/*@ts-ignore*/}
                    <button onClick={() => commonManage.pdfDown(pdfRef, true, `${info?.documentNumberFull}_${info?.customerName}_거래명세서`)}
                            style={{
                                padding: "5px 10px",
                                backgroundColor: "gray",
                                color: "#fff",
                                border: "none",
                                borderRadius: "4px",
                                cursor: "pointer",
                                fontSize: 11,
                                marginRight: 20
                            }}>
                        <div><PrinterOutlined style={{paddingRight: 8}}/>인쇄</div>
                    </button>
                </div>
            </div>}
            width={1100} open={isModalOpen?.event1}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            onOk={() => setIsModalOpen({event1: false, event2: false})}>

            <div ref={pdfRef}>

                <div style={{

                    width: '1000px',  // A4 가로
                    height: '1354px',  // A4 세로
                    // aspectRatio: '1 / 1.414',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px 20px'
                }}>

                    <div style={{border: '1px solid lightGray', borderBottom: 'none'}}>
                        <Header title={'공급자용'}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{
                            position: 'relative',
                            display: 'grid',
                            gridTemplateColumns: '40px auto',
                            fontSize: 12,
                            borderLeft: '1px solid lightGray',
                            borderTop: '1px solid lightGray',
                            borderBottom: '1px solid lightGray'
                        }}>
                            <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>
                                공급자
                            </div>
                            <table style={{borderLeft: '1px solid lightGray', width: 440}}>
                                <thead>
                                <tr>
                                    <th style={{...headerStyle, borderTop: 'none'}}>등록번호</th>
                                    <th style={{...cellStyle, borderTop: 'none'}} colSpan={3}>714-87-01453</th>
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
                                    <th style={{...headerStyle, borderBottom: 'none'}}>담당자</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}>신단비</th>
                                    <th style={{...headerStyle, borderBottom: 'none'}}>연락처</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}>02-465-7838</th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div style={{
                            position: 'relative',
                            display: 'grid',
                            gridTemplateColumns: '40px auto',
                            fontSize: 12,
                            borderTop: '1px solid lightGray',
                            borderBottom: '1px solid lightGray',
                        }}>
                            <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>공급받는자</div>

                            <table style={{borderLeft: '1px solid lightGray', width: 438}}>
                                <thead>
                                <tr>
                                    <th style={{...headerStyle, borderTop: 'none'}}>등록번호</th>
                                    <th style={{...cellStyle, borderTop: 'none'}} colSpan={3}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.businessRegistrationNumber}/>
                                    </th>
                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={headerStyle}>상호</th>
                                    <th style={cellStyle}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.customerName}/></th>
                                    <th style={headerStyle}>대표자</th>
                                    <th style={cellStyle}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.representative}/></th>
                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={headerStyle}>주소</th>
                                    <th style={cellStyle} colSpan={3}>
                                        <div>
                                    <textarea style={{
                                        resize: 'none',
                                        border: 'none',
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontWeight: 700
                                    }} defaultValue={domesticInfo?.address}/></div>

                                    </th>
                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={headerStyle}>업태</th>
                                    <th style={cellStyle}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.businessType}/></th>
                                    <th style={headerStyle}>종목</th>
                                    <th style={cellStyle}>
                                        <TextArea autoSize={{minRows: 1, maxRows: 6}} style={{
                                            resize: 'none',
                                            border: 'none',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 700
                                        }}
                                                  value={domesticInfo?.businessItem}/></th>

                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={{...headerStyle, borderBottom: 'none'}}>담당자</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}><input
                                        style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                        defaultValue={domesticInfo?.representative}/></th>
                                    <th style={{...headerStyle, borderBottom: 'none'}}>연락처</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}><input
                                        style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                        defaultValue={domesticInfo?.customerTel}/></th>
                                </tr>
                                </thead>
                            </table>

                        </div>
                    </div>

                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center', fontSize: 12

                    }}>
                        <thead>
                        <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                            <th style={{width: 40, borderTop: 'none'}}>NO</th>
                            <th style={{width: '9%', borderTop: 'none'}}>날짜</th>
                            <th style={{width: 300, borderLeft: '1px solid lightGray', borderTop: 'none'}}>품목</th>
                            <th style={{width: '5%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>수량</th>
                            <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>단가</th>
                            <th style={{width: '15%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>공급가액</th>
                            <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>세액</th>
                            <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>비고</th>
                        </tr>
                        </thead>

                        <thead>

                        {data[0]?.map((v, i) =>

                            <tr style={{height: 35}}>
                                <td style={{fontWeight: 600}}>{i + 1}</td>
                                <td style={{fontWeight: 600}}>
                                    <input style={{border: 'none'}} defaultValue={moment().format('YYYY-MM-DD')}/>
                                </td>
                                <td style={{
                                    whiteSpace: 'pre-line',
                                    lineHeight: 2.1,
                                    textAlign: 'left',
                                    paddingLeft: 5
                                }}>

                                    <TextAreas value={v.model} numb={i}/>

                                </td>
                                <NumberInputForm value={v} numb={i}/>


                                <td style={{fontWeight: 600}}>
                                    <TextArea autoSize={{minRows: 1, maxRows: 5}} style={{
                                        resize: 'none',
                                        border: 'none',
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontWeight: 700,

                                    }} defaultValue={''}/>
                                </td>
                            </tr>
                        )}
                        </thead>
                    </table>
                    {Object.keys(data).length > 1 ? <></> :

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'center'
                        }}>
                            <thead>
                            <tr style={{height: 35, fontWeight: 100}}>

                                <th colSpan={2} style={{fontWeight: 600, borderTop: 'none'}}>TOTAL</th>
                                <th style={{
                                    width: '5%',
                                    textAlign: 'right',
                                    paddingRight: 8,
                                    borderTop: 'none'
                                }}>{totalData?.quantity}</th>
                                <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                >{(totalData?.net).toLocaleString()}</th>
                                <th style={{width: '15%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                >{(totalData?.total).toLocaleString()}</th>
                                <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}>
                                    {(totalData?.tax).toLocaleString()}
                                </th>
                                <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                    className={'remark'}></th>
                            </tr>
                            </thead>
                        </table>
                    }
                    <div style={{flexGrow: 1}}/>

                    <div style={{textAlign: 'center'}}>- 1 -</div>
                </div>


                {Object.values(data).map((v: any, i) => {
                    const count: any = commonManage.getPageIndex(Object.values(data), i - 1);
                    if (!i) {
                        return false;
                    }


                    return <div style={{

                        width: '1000px',  // A4 가로
                        height: '1354px',  // A4 세로
                        // aspectRatio: '1 / 1.414',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0px 20px'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            margin: '20px 0px 0px 0px',
                            textAlign: 'center',
                            border: '1px solid lightGray',
                            fontSize: 12
                        }}>
                            <thead>
                            <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                                <th style={{width: 40, borderTop: 'none'}}>NO</th>
                                <th style={{width: '9%', borderTop: 'none'}}>날짜</th>
                                <th style={{width: 300, borderLeft: '1px solid lightGray', borderTop: 'none'}}>품목</th>
                                <th style={{width: '5%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>수량</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>단가</th>
                                <th style={{
                                    width: '15%',
                                    borderLeft: '1px solid lightGray',
                                    borderTop: 'none'
                                }}>공급가액
                                </th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>세액</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>비고</th>
                            </tr>

                            {v?.map((src, idx) => {
                                return <tr style={{height: 35}}>
                                    <td style={{fontWeight: 600}}>{count + idx + 1}</td>
                                    <td style={{fontWeight: 600}}>
                                        <input style={{border: 'none'}} defaultValue={moment().format('YYYY-MM-DD')}/>
                                    </td>
                                    <td style={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 2.1,
                                        textAlign: 'left',
                                        paddingLeft: 5
                                    }}>


                                        <TextAreas value={src.model} numb={idx} objKey={i}/>

                                    </td>
                                    <NumberInputForm value={src} numb={idx} objKey={i}/>

                                    <td style={{fontWeight: 600}}>
                                        <TextArea autoSize={{minRows: 1, maxRows: 5}} style={{
                                            resize: 'none',
                                            border: 'none',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 700,

                                        }} defaultValue={''}/>
                                    </td>
                                </tr>
                            })}
                            </thead>
                        </table>
                        {Object.keys(data).length - 1 === i ? <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                textAlign: 'center',
                                border: '1px solid lightGray',
                                borderTop: 'none'
                            }}>
                                <thead>

                                <tr style={{height: 35, fontWeight: 100}}>

                                    <th colSpan={2} style={{fontWeight: 600, borderTop: 'none'}}>TOTAL</th>
                                    <th style={{
                                        width: '5%',
                                        textAlign: 'right',
                                        paddingRight: 8,
                                        borderTop: 'none'
                                    }}>{totalData?.quantity}</th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                    >{(totalData?.net).toLocaleString()}</th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                    >{(totalData?.total).toLocaleString()}</th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}>
                                        {(totalData?.tax).toLocaleString()}
                                    </th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                        className={'remark'}></th>
                                </tr>
                                </thead>
                            </table>
                            : <></>}
                        <div style={{flexGrow: 1}}/>


                        <div style={{textAlign: 'center'}}>- {i + 1} -</div>
                    </div>

                })}


                <div style={{

                    width: '1000px',  // A4 가로
                    height: '1354px',  // A4 세로
                    // aspectRatio: '1 / 1.414',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '20px 20px'
                }}>

                    <div style={{border: '1px solid lightGray', borderBottom: 'none'}}>
                        <Header title={'공급받는자용'}/>
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{
                            position: 'relative',
                            display: 'grid',
                            gridTemplateColumns: '40px auto',
                            fontSize: 12,
                            borderLeft: '1px solid lightGray',
                            borderTop: '1px solid lightGray',
                            borderBottom: '1px solid lightGray'
                        }}>
                            <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>
                                공급자
                            </div>
                            <table style={{borderLeft: '1px solid lightGray', width: 440}}>
                                <thead>
                                <tr>
                                    <th style={{...headerStyle, borderTop: 'none'}}>등록번호</th>
                                    <th style={{...cellStyle, borderTop: 'none'}} colSpan={3}>714-87-01453</th>
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
                                    <th style={{...headerStyle, borderBottom: 'none'}}>담당자</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}>신단비</th>
                                    <th style={{...headerStyle, borderBottom: 'none'}}>연락처</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}>02-465-7838</th>
                                </tr>
                                </thead>
                            </table>
                        </div>
                        <div style={{
                            position: 'relative',
                            display: 'grid',
                            gridTemplateColumns: '40px auto',
                            fontSize: 12,
                            borderTop: '1px solid lightGray',
                            borderBottom: '1px solid lightGray',
                        }}>
                            <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>공급받는자</div>

                            <table style={{borderLeft: '1px solid lightGray', width: 438}}>
                                <thead>
                                <tr>
                                    <th style={{...headerStyle, borderTop: 'none'}}>등록번호</th>
                                    <th style={{...cellStyle, borderTop: 'none'}} colSpan={3}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.businessRegistrationNumber}/>
                                    </th>
                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={headerStyle}>상호</th>
                                    <th style={cellStyle}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.customerName}/></th>
                                    <th style={headerStyle}>대표자</th>
                                    <th style={cellStyle}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.representative}/></th>
                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={headerStyle}>주소</th>
                                    <th style={cellStyle} colSpan={3}>
                                        <div>
                                    <textarea style={{
                                        resize: 'none',
                                        border: 'none',
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontWeight: 700
                                    }} defaultValue={domesticInfo?.address}/></div>

                                    </th>
                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={headerStyle}>업태</th>
                                    <th style={cellStyle}>
                                        <input
                                            style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                            defaultValue={domesticInfo?.businessType}/></th>
                                    <th style={headerStyle}>종목</th>
                                    <th style={cellStyle}>
                                        <TextArea autoSize={{minRows: 1, maxRows: 6}} style={{
                                            resize: 'none',
                                            border: 'none',
                                            textAlign: 'center',
                                            fontSize: 12,
                                            fontWeight: 700
                                        }}
                                                  value={domesticInfo?.businessItem}/></th>

                                </tr>
                                </thead>

                                <thead>
                                <tr>
                                    <th style={{...headerStyle, borderBottom: 'none'}}>담당자</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}><input
                                        style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                        defaultValue={domesticInfo?.representative}/></th>
                                    <th style={{...headerStyle, borderBottom: 'none'}}>연락처</th>
                                    <th style={{...cellStyle, borderBottom: 'none'}}><input
                                        style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                        defaultValue={domesticInfo?.customerTel}/></th>
                                </tr>
                                </thead>
                            </table>

                        </div>
                    </div>

                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        textAlign: 'center', fontSize: 12

                    }}>
                        <thead>
                        <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                            <th style={{width: 40, borderTop: 'none'}}>NO</th>
                            <th style={{width: '9%', borderTop: 'none'}}>날짜</th>
                            <th style={{width: 300, borderLeft: '1px solid lightGray', borderTop: 'none'}}>품목</th>
                            <th style={{width: '5%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>수량</th>
                            <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>단가</th>
                            <th style={{width: '15%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>공급가액</th>
                            <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>세액</th>
                            <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>비고</th>
                        </tr>
                        </thead>

                        <thead>

                        {data[0]?.map((v, i) =>

                            <tr style={{height: 35}}>
                                <td style={{fontWeight: 600}}>{i + 1}</td>
                                <td style={{fontWeight: 600}}>
                                    <input style={{border: 'none'}} defaultValue={moment().format('YYYY-MM-DD')}/>
                                </td>
                                <td style={{
                                    whiteSpace: 'pre-line',
                                    lineHeight: 2.1,
                                    textAlign: 'left',
                                    paddingLeft: 5
                                }}>

                                    <TextAreas value={v.model} numb={i}/>

                                </td>
                                <NumberInputForm value={v} numb={i}/>


                                <td style={{fontWeight: 600}}>
                                    <TextArea autoSize={{minRows: 1, maxRows: 5}} style={{
                                        resize: 'none',
                                        border: 'none',
                                        textAlign: 'center',
                                        fontSize: 12,
                                        fontWeight: 700,

                                    }} defaultValue={''}/>
                                </td>
                            </tr>
                        )}
                        </thead>
                    </table>
                    {Object.keys(data).length > 1 ? <></> :

                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            textAlign: 'center'
                        }}>
                            <thead>
                            <tr style={{height: 35, fontWeight: 100}}>

                                <th colSpan={2} style={{fontWeight: 600, borderTop: 'none'}}>TOTAL</th>
                                <th style={{
                                    width: '5%',
                                    textAlign: 'right',
                                    paddingRight: 8,
                                    borderTop: 'none'
                                }}>{totalData?.quantity}</th>
                                <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                >{(totalData?.net).toLocaleString()}</th>
                                <th style={{width: '15%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                >{(totalData?.total).toLocaleString()}</th>
                                <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}>
                                    {(totalData?.tax).toLocaleString()}
                                </th>
                                <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                    className={'remark'}></th>
                            </tr>
                            </thead>
                        </table>
                    }
                    <div style={{flexGrow: 1}}/>

                    <div style={{textAlign: 'center'}}>- {Object.keys(data).length + 1} -</div>
                </div>


                {Object.values(data).map((v: any, i) => {
                    const count: any = commonManage.getPageIndex(Object.values(data), i - 1);
                    if (!i) {
                        return false;
                    }


                    return <div style={{

                        width: '1000px',  // A4 가로
                        height: '1354px',  // A4 세로
                        // aspectRatio: '1 / 1.414',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '0px 20px'
                    }}>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            margin: '20px 0px 0px 0px',
                            textAlign: 'center',
                            border: '1px solid lightGray',
                        }}>
                            <thead>
                            <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                                <th style={{width: 40, borderTop: 'none'}}>NO</th>
                                <th style={{width: '9%', borderTop: 'none'}}>날짜</th>
                                <th style={{width: 300, borderLeft: '1px solid lightGray', borderTop: 'none'}}>품목</th>
                                <th style={{width: '5%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>수량</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>단가</th>
                                <th style={{
                                    width: '15%',
                                    borderLeft: '1px solid lightGray',
                                    borderTop: 'none'
                                }}>공급가액
                                </th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>세액</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray', borderTop: 'none'}}>비고</th>
                            </tr>

                            {v?.map((src, idx) => {
                                return <tr style={{height: 35}}>
                                    <td style={{fontWeight: 600}}>{count + idx + 1}</td>
                                    <td style={{fontWeight: 600}}>
                                        <input style={{border: 'none'}} defaultValue={moment().format('YYYY-MM-DD')}/>
                                    </td>
                                    <td style={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 2.1,
                                        textAlign: 'left',
                                        paddingLeft: 5
                                    }}>


                                        <TextAreas value={src.model} numb={idx} objKey={i}/>

                                    </td>
                                    <NumberInputForm value={src} numb={idx} objKey={i}/>

                                    <td style={{fontWeight: 600}}>
                                        <TextArea autoSize={true} style={{border: 'none'}}/>
                                    </td>
                                </tr>
                            })}
                            </thead>
                        </table>
                        {Object.keys(data).length - 1 === i ? <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                textAlign: 'center',
                                border: '1px solid lightGray',
                                borderTop: 'none'
                            }}>
                                <thead>

                                <tr style={{height: 35, fontWeight: 100}}>

                                    <th colSpan={2} style={{fontWeight: 600, borderTop: 'none'}}>TOTAL</th>
                                    <th style={{
                                        width: '5%',
                                        textAlign: 'right',
                                        paddingRight: 8,
                                        borderTop: 'none'
                                    }}>{totalData?.quantity}</th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                    >{(totalData?.net).toLocaleString()}</th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                    >{(totalData?.total).toLocaleString()}</th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}>
                                        {(totalData?.tax).toLocaleString()}
                                    </th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10, borderTop: 'none'}}
                                        className={'remark'}></th>
                                </tr>
                                </thead>
                            </table>
                            : <></>}
                        <div style={{flexGrow: 1}}/>


                        <div style={{textAlign: 'center'}}>- {Object.keys(data).length + 1 + i} -</div>
                    </div>

                })}
            </div>
        </Modal>
    </>
}

export default memo(TransactionStatementHeader, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});