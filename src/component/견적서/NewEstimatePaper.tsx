import React, {useEffect, useMemo, useRef, useState} from "react";
import Input from "antd/lib/input";
import {estimateTopInfo, paperTopInfo} from "@/utils/common";
import {commonManage} from "@/utils/commonManage";
import TextArea from "antd/lib/input/TextArea";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";
import {amountFormat} from "@/utils/columnList";
import {pdf} from "@react-pdf/renderer";
import {PdfForm} from "@/component/견적서/PdfForm";
import EstimateHeader from "@/component/견적서/EstimateHeader";
import {getData} from "@/manage/function/api";


function transformEstimateData(data: any) {
    const grouped = {};

    // documentNumberFull 기준으로 그룹화
    data.forEach(item => {
        const doc = item.documentNumberFull;
        if (!grouped[doc]) grouped[doc] = [];
        grouped[doc].push(item);
    });

    const result = [];

    Object.entries(grouped).forEach(([docNumber, items]) => {
        // 문서번호 줄
        result.push({
            documentNumberFull: docNumber,
            maker: null,
            model: null,
            quantity: null,
            unit: null,
            net: null,
            modelIndex: null
        });

        // 제조사 줄 (model에 제조사명 넣고 modelIndex는 'maker')
        const maker = items[0]?.maker || null;
        result.push({
            documentNumberFull: null,
            maker: null,
            model: maker,
            quantity: null,
            unit: null,
            net: null,
            modelIndex: "maker"
        });


        // @ts-ignore
        items.forEach((item, index) => {
            result.push({
                documentNumberFull: null,
                maker: null,
                model: item.model,
                quantity: item.quantity,
                unit: item.unit,
                net: item.unitPrice ?? null,
                modelIndex: index + 1
            });
        });
    });

    return result;
}


export default function NewEstimatePaper({gridRef, openEstimateModal}) {

    const [bottomInfo, setBottomInfo] = useState('▶의뢰하신 Model로 기준한 견적입니다.\n▶계좌번호 :  (기업은행)069-118428-04-010/만쿠무역\n▶긴급 납기시 담당자와 협의가능합니다.\n▶견적서에 기재되지 않은 서류 및 성적서는 미 포함 입니다.');


    const [title, setTitle] = useState<any>(estimateTopInfo)
    const [data, setData] = useState<any>([])
    const [info, setInfo] = useState<any>({})
    // @ts-ignore
    useEffect(() => {

        const list = gridRef.current.getSelectedRows();

        if (list.length === 0) {
            return false;
        }

        const calcList = transformEstimateData(list);
        const firstRow = list[0];

        console.log(firstRow, 'firstRow:')
        const result = commonManage.splitDataWithSequenceNumber(calcList, 18, 28);

        setInfo(firstRow);
        setData(result)
    }, []);


    const [memberList, setMemberList] = useState([])

    async function getInfo() {
        return await getData.post('admin/getAdminList', {
            "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
            "searchAuthority": null,    // 1: 일반, 0: 관리자
            "page": 1,
            "limit": -1
        }).then(v => {
            setMemberList(v.data.entity.adminList)
        })
    }

    useEffect(() => {
        getInfo()
    }, [])

    const [gapRow, setGapRow] = useState(0)

    function getRowGapSize(){
        const qtyElement = document.querySelector('#lastRow'); // 예: 마지막 Q'ty 셀에 id 부여
        const totalElement = document.querySelector('#total'); // 예: TOTAL 행의 Q'ty 셀

        if (qtyElement && totalElement) {
            const qtyRect = qtyElement.getBoundingClientRect();
            const totalRect = totalElement.getBoundingClientRect();

            const verticalDistance = Math.abs(totalRect.top - qtyRect.bottom);

            setGapRow(verticalDistance)
        }
    }
    useEffect(() => {

        if (memberList.length) {

            const findMember = memberList.find(v => v.adminId === info?.managerAdminId);

            setInfo(v => {
                return {
                    ...v,
                    name: findMember['name'],
                    contactNumber: findMember['contactNumber'],
                    email: findMember['email'],
                    customerManagerName: v.managerName,
                    customerManagerPhone: v.phoneNumber
                }
            });
            getRowGapSize();
        }
    }, [memberList, openEstimateModal]);

    const totalData = useMemo(() => {

        const list = Object.values(data);
        let bowl = {quantity: 0, net: 0, total: 0, unit: list.length ? list[0][0]['unit'] : ''}

        list.forEach((v: any, i: number) => {
            const result = v.reduce((acc, cur, idx) => {
                const {quantity, net} = cur
                acc[0] += quantity;
                acc[1] += net;
                acc[2] += (quantity * net)

                return acc
            }, [0, 0, 0])
            bowl["quantity"] += parseFloat(result[0]);
            bowl["net"] += parseFloat(result[1]);
            bowl["total"] += parseFloat(result[2]);
        })

        return bowl
    }, [data]);

    async function download() {

        const blob = await pdf(<PdfForm data={data} topInfoData={info} totalData={totalData} bottomInfo={bottomInfo}
                                        key={Date.now()}/>).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${info?.documentNumberFull}_견적서.pdf`;
        link.click();

        // 메모리 해제
        URL.revokeObjectURL(url);
    }

    const print = async () => {
        const blob = await pdf(<PdfForm data={data} topInfoData={info} totalData={totalData} bottomInfo={bottomInfo}
                                        key={Date.now()} type={'total'}/>).toBlob();
        const blobUrl = URL.createObjectURL(blob);

        const printWindow = window.open(blobUrl);
        if (printWindow) {
            printWindow.onload = () => {
                // printWindow.focus();
                // printWindow.print();
            };
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }


    function NumberInputForm({value, numb, objKey = 0}) {

        const [info, setInfo] = useState({net: value.net, quantity: value.quantity});

        const inputRef = useRef<any>();
        const [toggle, setToggle] = useState(false);


        function blur(e) {
            setToggle(false);
            setData(v => {
                v[objKey][numb][e.target.id] = parseFloat(e.target.value.replaceAll(",", ""));
                console.log({...v}, ':::')
                return {...v}
            })
        }


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


                <Input style={{border: 'none', textAlign: 'right'}} type={'number'} value={info.quantity}
                       onChange={onQuantity} onBlur={blur} id={'quantity'}/>

            </td>
            <td style={{width: 30, textAlign: 'left', paddingLeft: 5}}>
                <Select defaultValue={value.unit}
                        style={{border: 'none', paddingRight: 0, fontSize: 11}}
                        bordered={false} suffixIcon={null}

                >
                    {['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz'].map(v => {
                        // @ts-ignored
                        return <Option style={{fontSize: 11}} value={v}>{v}</Option>
                    })}
                </Select>
            </td>
            <td>
                {toggle ? <InputNumber ref={inputRef} onBlur={blur} id={'net'} value={info.net}
                                       onChange={onchange}
                                       formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                       parser={(value) => value.replace(/[^0-9]/g, '')}
                                       style={{border: 'none', textAlign: 'right', direction: 'rtl', width: '90%'}}
                                       name={''}/>
                    :
                    <div style={{
                        fontSize: 14,
                        display: 'flex',
                        justifyContent: 'space-between',
                        padding: '0px 10px',
                        fontWeight: 350
                    }}
                         onClick={() => {
                             setToggle(true);
                         }}>
                        <span>{!isNaN(info.net) ? '₩' : ''}</span>
                        <span className={'netPrice'}>{amountFormat(info.net)}</span>
                    </div>

                }

            </td>
            <td>
                <div style={{
                    fontSize: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0px 10px',
                    fontWeight: 350
                }}
                     onClick={() => {
                         setToggle(true);
                     }}>
                    <span>{!isNaN(info.net * info.quantity) ? '₩' : ''}</span>
                    <span
                        className={'total'}>{!isNaN(info.net * info.quantity) ? amountFormat(info.net * info.quantity) : ''}</span>
                </div>

            </td>

        </>
    }

    function TextAreas({value, numb, objKey = 0}) {

        const [model, setModel] = useState(value);


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

    console.log(gapRow,'gapRow:')

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
            <EstimateHeader/>
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

            <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                margin: '20px 0',
                textAlign: 'center',
                border: '1px solid lightGray',
            }}>
                <thead>
                <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                    <th colSpan={3} style={{width: '48%'}}>Specification</th>
                    <th colSpan={2} style={{width: '11%', borderLeft: '1px solid lightGray',}}>Q`ty</th>
                    <th style={{width: '20%', borderLeft: '1px solid lightGray'}}>Unit Price</th>
                    <th style={{width: '20%', borderLeft: '1px solid lightGray'}}>Amount</th>
                </tr>
                </thead>

                <thead>
                <tr style={{fontWeight: 'bold', height: 30}}>
                    <th colSpan={6}/>
                </tr>
                </thead>

                <thead>

                {data[0]?.map((src, idx) => {
                    return <tr>
                        {src.documentNumberFull ?
                            <td colSpan={3} style={{
                                width: '6%',
                                fontWeight: 600,
                                textAlign: 'left',
                                paddingLeft: 15
                            }}>{src.documentNumberFull}</td>
                            :
                            <td colSpan={2} style={{width: '6%', fontWeight: 600}}>{src.modelIndex}</td>
                        }

                        {!src.documentNumberFull ? <td style={{
                                whiteSpace: 'pre-line',
                                lineHeight: 2.1,
                                textAlign: 'left',
                                paddingLeft: 5
                            }}>
                                <TextAreas value={src.model} numb={idx} objKey={0}/>

                            </td>
                            :
                            <></>
                        }
                        <NumberInputForm value={src} numb={idx} objKey={0}/>
                    </tr>
                })}
                </thead>
            </table>


            <div style={{flexGrow: 1}}/>
            {Object.keys(data).length > 1 ? <></> :

                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    margin: '20px 0',
                    textAlign: 'center',
                    border: '1px solid lightGray',
                }}>
                    <thead>
                    <tr style={{height: 35, fontWeight: 100}}>
                        <th colSpan={2} style={{width: '6%', fontWeight: 600}}></th>
                        <th style={{width: '43%'}}>TOTAL</th>
                        <th style={{width: 50, textAlign: 'right', paddingRight: 8}}>
                            {totalData?.quantity}
                        </th>
                        <th style={{width: 40, textAlign: 'left', paddingLeft: 5}}>
                            {totalData?.unit}
                        </th>
                        <th style={{width: '20%', textAlign: 'right', paddingRight: 10}}>
                            (V.A.T) 포함
                        </th>
                        <th style={{width: '20%', textAlign: 'right', paddingRight: 10}}>
                            {((totalData?.total) + ((totalData?.total) / 10)).toLocaleString()}
                        </th>
                        {/*tax*/}
                    </tr>
                    </thead>
                </table>

            }
            {Object.keys(data).length > 1 ? <></> :
                <div
                    style={{
                        paddingTop: 10,
                        // padding: '30px 20px',
                        fontSize: 12,
                        lineHeight: 1.7,
                        borderTop: '1px solid black',
                    }}>
                    <TextArea value={bottomInfo} onChange={e => {
                        setBottomInfo(e.target.value)
                    }}
                              autoSize={true} style={{border: 'none'}}
                    />
                </div>
            }
            <div style={{textAlign: 'center'}}>- 1 -</div>
        </div>

        {Object.values(data)?.map((v: any, i) => {
            if (!i) {
                return false;
            }
            return <div style={{
                fontFamily: "Noto Sans KR, sans-serif",
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
                    margin: '20px 0',
                    textAlign: 'center',
                    border: '1px solid lightGray',
                }}>
                    <thead>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                        <th colSpan={3} style={{width: '48%'}}>Specification</th>
                        <th colSpan={2} style={{width: '11%', borderLeft: '1px solid lightGray',}}>Q`ty</th>
                        <th style={{width: '20%', borderLeft: '1px solid lightGray'}}>Unit Price</th>
                        <th style={{width: '20%', borderLeft: '1px solid lightGray'}}>Amount</th>
                    </tr>
                    </thead>


                    <thead>

                    {v?.map((src, idx) => {
                        return <tr style={{height: 35, fontWeight: 100}}>
                            {src.documentNumberFull ?
                                <td colSpan={3} style={{
                                    width: '6%',
                                    fontWeight: 600,
                                    textAlign: 'left',
                                    paddingLeft: 15
                                }}>{src.documentNumberFull}</td>
                                :
                                <td colSpan={2} style={{width: '6%', fontWeight: 600}}>{src.modelIndex}</td>
                            }

                            {!src.documentNumberFull ? <td style={{
                                    whiteSpace: 'pre-line',
                                    lineHeight: 2.1,
                                    textAlign: 'left',
                                    paddingLeft: 5
                                }}>
                                    <TextAreas value={src.model} numb={idx} objKey={i}/>

                                </td>
                                :
                                <></>
                            }
                            <NumberInputForm value={src} numb={idx} objKey={i}/>
                        </tr>
                    })}

                    </thead>
                </table>


                <div style={{flexGrow: 1}}/>
                {Object.keys(data).length - 1 === i ? <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    margin: '20px 0',
                    textAlign: 'center',
                    border: '1px solid lightGray',
                }}>
                    <thead>
                    <tr style={{height: 35, fontWeight: 100}}>
                        <th colSpan={2} style={{width: '6%', fontWeight: 600}}></th>
                        <th style={{width: '43%'}}>TOTAL</th>
                        <th style={{width: 50, textAlign: 'right', paddingRight: 8}}>
                            {totalData?.quantity}
                        </th>
                        <th style={{width: 40, textAlign: 'left', paddingLeft: 5}}>
                            {totalData?.unit}
                        </th>
                        <th style={{width: '20%', textAlign: 'right', paddingRight: 10}}>
                            (V.A.T) 포함
                        </th>
                        <th style={{width: '20%', textAlign: 'right', paddingRight: 10}}>
                            {((totalData?.total) + ((totalData?.total) / 10)).toLocaleString()}
                        </th>
                    </tr>
                    </thead>
                </table> : <></>


                }

                {Object.keys(data).length - 1 === i ?
                    <div
                        style={{
                            paddingTop: 10,
                            // padding: '30px 20px',
                            fontSize: 12,
                            lineHeight: 1.7,
                            borderTop: '1px solid black',
                        }}>
                        <TextArea value={bottomInfo} onChange={e => {
                            setBottomInfo(e.target.value)
                        }}
                                  autoSize={true} style={{border: 'none'}}
                        />
                    </div>
                    : <></>}
                <div style={{textAlign: 'center'}}>- {1 + i} -</div>
            </div>
        })}

    </>
}