import React, {memo, useEffect, useMemo, useRef, useState} from "react";
import Modal from "antd/lib/modal/Modal";
import {commonManage} from "@/utils/commonManage";
import Input from "antd/lib/input";
import {amountFormat} from "@/utils/columnList";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";
import {PoHeader} from "@/component/견적서/EstimateHeader";
import {BottomPoInfo, TopPoInfo} from "@/component/견적서/TopInfo";
import TextArea from "antd/lib/input/TextArea";
import _ from "lodash";
import {pdf} from "@react-pdf/renderer";
import {PrintPoForm} from "@/component/PrintPoForm";
import {paperTopInfo} from "@/utils/common";
import {DownloadOutlined, PrinterOutlined} from "@ant-design/icons";

function PrintPo({

                     isModalOpen,
                     setIsModalOpen,
                     tableRef,
                     info,
                     type,
                     count = 0,
                 }) {

    const [data, setData] = useState([[]]);
    const [topInfoData, setTopInfoData] = useState<any>({})

    const bottomInfoKr = '· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.\n· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.\n· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)\n· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠솔루션.\n· 성적서 및 품질보증서는 별도입니다.';
    const bottomInfoEn = '* For the invoice *  Please indicate few things as below:\n1. HS Code 6 Digit\n2. Indication of Country of Origin\nIt has to be written into the remark of every Invoice every time.\nAnd your name, your signature and date of signature have to be put in under the sentence as well.\n* Please give us Order confirmation. (Advise us if we should pay your bank charge as well.)';
    const [bottomInfo, setBottomInfo] = useState<any>(bottomInfoKr);

    function getTopInfoData(e) {
        setTopInfoData(e)
    }

    useEffect(() => {
        const tableList = tableRef.current?.getSourceData();
        const filterTotalList = tableList.filter(v => !!v.model)
        const result = commonManage.splitDataWithSequenceNumber(filterTotalList, 18, 28);
        let copyData = _.cloneDeep(data);
        result.forEach((v, idx) => {
            copyData[idx] = v;
        })
        setData(copyData);

        if(info?.agencyCode?.startsWith('K') || info?.agencyCode?.startsWith('SK')) {
            setBottomInfo(bottomInfoKr);
        } else {
            setBottomInfo(bottomInfoEn);
        }
    }, [count]);

    function numberFormat (number, currency = '') {
        if (number === null || number === undefined || number === '') {
            return '';
        }
        const num = Number(number);
        if (isNaN(num)) {
            return '';
        }
        const fixedNum = num.toFixed(3);
        const [integerPart, decimalPart] = fixedNum.split('.');
        const trimmedDecimal = decimalPart.slice(0, 2);
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // return decimalPart !== '00'
        //     ? `${formattedInteger}.${decimalPart}`
        //     : formattedInteger;
        return currency !== 'KRW'
            ? `${formattedInteger}.${trimmedDecimal}`
            : trimmedDecimal !== '00' ? `${formattedInteger}.${trimmedDecimal}` : formattedInteger;
    }

    const totalData = useMemo(() => {
        const list = Object.values(data);

        let bowl = {
            quantity: 0,
            unitPrice: 0.00,
            total: 0.00,
            unit: list[0].length ? list[0][0]['unit'] : '',
            currency: list[0].length ? list[0][0]['currency'] : ''
        }
        list.forEach((v: any, i: number) => {
            const result = v.reduce((acc, cur, idx) => {
                const {quantity, unitPrice} = cur
                const total = quantity * unitPrice;
                acc[0] += quantity;
                acc[1] += unitPrice;
                acc[2] += total;

                return acc
            }, [0, 0.00, 0.00])
            bowl["quantity"] += parseFloat(result[0]);
            bowl["unitPrice"] += parseFloat(result[1]);
            bowl["total"] += parseFloat(result[2]);
        })
        return bowl
    }, [data]);


    function MakerInput({value}) {
        const [info, setInfo] = useState(value);

        return <Input value={info} style={{border: 'none'}}
                      onChange={e => {
                          setInfo(e.target.value)
                      }}
                      onBlur={e => {
                          setTopInfoData(v => {
                              return {...v, maker: e.target.value}
                          })
                      }}
        />
    }

    function TextAreas({value, numb, objKey = 0, name}) {

        const [model, setModel] = useState('');

        useEffect(() => {
            setModel(value)
        }, [value]);

        function onChange(e) {
            setModel(e.target.value)
        }


        function blur(e) {
            setData(v => {
                v[objKey][numb][name] = model;
                return {...v}
            })
        }

        return <TextArea autoSize={true} style={{border: 'none'}} onChange={onChange} onBlur={blur} value={model}
                         key={`ttt${numb}`}/>
    }


    function NumberInputForm({value, numb, objKey = 0}) {

        const [info, setInfo] = useState({unitPrice: value.unitPrice, quantity: value.quantity, currency: value.currency});

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
                return {...v, unitPrice: e}
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
                       onChange={onQuantity} onBlur={blur} id={'quantity'} name={'qt'}/>

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
                {toggle ? <InputNumber ref={inputRef} onBlur={blur} id={'unitPrice'} value={info.unitPrice}
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
                        padding: '0px 10px'
                    }}
                         onClick={() => {
                             setToggle(true);
                         }}>
                        <span>{!isNaN(info.unitPrice) ? info.currency : ''}</span>
                        <span>{numberFormat(info.unitPrice, info.currency)}</span>
                    </div>

                }

            </td>
            <td>
                <div style={{
                    fontSize: 14,
                    display: 'flex',
                    justifyContent: 'space-between',
                    padding: '0px 10px'
                }}
                     onClick={() => {
                         setToggle(true);
                     }}>
                    <span>{!isNaN(info.unitPrice * info.quantity) ? info.currency : ''}</span>
                    <span
                        className={'total'}>{numberFormat((info.unitPrice * info.quantity), info.currency)}</span>
                </div>

            </td>

        </>
    }

    async function download() {
        const blob = await pdf(<PrintPoForm data={data} topInfoData={topInfoData} totalData={totalData} bottomInfo={bottomInfo}
                                            title={paperTopInfo[type]}
                                            lang={type}
                                            key={Date.now()}/>).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `PO_${topInfoData?.documentNumberFull}.pdf`;
        link.click();

        // 메모리 해제
        URL.revokeObjectURL(url);
    }

    const print = async () => {

        const blob = await pdf(<PrintPoForm data={data} topInfoData={topInfoData} totalData={totalData} bottomInfo={bottomInfo}
                                            title={paperTopInfo[type]}
                                            lang={type}
                                            key={Date.now()}/>).toBlob();
        const blobUrl = URL.createObjectURL(blob);

        const printWindow = window.open(blobUrl);
        if (printWindow) {
            printWindow.onload = () => {
                // printWindow.focus();
                // printWindow.print();
            };
        }
    }

    return (
        <Modal
            title={<div style={{width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <div>{type === 'ko' ? '국내발주서 출력' : '해외발주서 출력'}</div>
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
                        <div><DownloadOutlined style={{paddingRight: 8}}/>다운로드</div>
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
                        <div><PrinterOutlined style={{paddingRight: 8}}/>인쇄</div>
                    </button>
                </div>
            </div>}
            onCancel={() => setIsModalOpen({event1: false, event2: false, event3: false})}
            open={isModalOpen?.event3}
            width={1100}
            footer={null}
            onOk={() => setIsModalOpen({event1: false, event2: false, event3: false})}
        >
            <div style={{

                width: '1000px',  // A4 가로
                height: '1354px',  // A4 세로
                // aspectRatio: '1 / 1.414',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 20
            }}>

                <PoHeader info={info} type={type}/>
                <TopPoInfo info={info} hsCode={data[0][0]?.hsCode} getTopInfoData={getTopInfoData} type={type}/>
                <table style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    margin: '20px 0',
                    textAlign: 'center',
                    border: '1px solid lightGray',
                }}>
                    <thead>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                        <th colSpan={3} style={{width: '45%'}}>Specification</th>
                        <th colSpan={2} style={{width: '10%', borderLeft: '1px solid lightGray',}}>Q`ty</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Unit Price</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Amount</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Other</th>
                    </tr>
                    </thead>

                    <thead>
                    <tr style={{fontWeight: 'bold', height: 35}}>
                        <th colSpan={8}/>
                    </tr>
                    <tr style={{fontWeight: 'bold', height: 35}}>
                        <th>
                            Maker
                        </th>
                        <th colSpan={2} style={{textAlign: 'left', paddingLeft: 5}}>
                            <MakerInput value={topInfoData?.maker}/>
                        </th>
                        <th colSpan={2}></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <thead>

                    {data[0]?.map((v, i) =>
                        <tr style={{height: 35}}>
                            <td colSpan={2} style={{fontWeight: 600}}>{i + 1}</td>
                            <td style={{
                                whiteSpace: 'pre-line',
                                lineHeight: 2.1,
                                textAlign: 'left',
                                paddingLeft: 5
                            }}>
                                <TextAreas value={v.model} numb={i} name={'model'}/>
                            </td>
                            <NumberInputForm value={v} numb={i}/>
                            <td>
                                <TextAreas value={v?.other} numb={i} name={'other'}/>
                            </td>
                        </tr>
                    )}
                    </thead>
                </table>
                <div style={{flexGrow: 1}}/>

                {Object.keys(data).length > 1 ?
                    <></>
                    :
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '20px 0',
                        textAlign: 'center',
                        border: '1px solid lightGray',
                    }}>
                        <thead>
                        <tr style={{height: 35, fontWeight: 100}}>
                            <th style={{width: '44%'}}>TOTAL</th>
                            <th style={{width: '6%', textAlign: 'right', paddingRight: 8}}>
                                {totalData?.quantity}
                            </th>
                            <th style={{width: '6%', textAlign: 'left', paddingLeft: 5}}>
                                {data[0][0]?.unit}
                            </th>
                            <th style={{width: '15%'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 8px'}}>
                                    <span>{data[0][0]?.currency}</span>
                                    <span>{numberFormat(totalData?.unitPrice, data[0][0]?.currency)}</span>
                                </div>
                            </th>
                            <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 8px'}}>
                                    <span>{data[0][0]?.currency}</span>
                                    <span>{numberFormat(totalData?.total, data[0][0]?.currency)}</span>
                                </div>

                            </th>
                            <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                            </th>
                        </tr>
                        </thead>
                    </table>
                }

                {Object.keys(data).length > 1 ?
                    <></>
                    :
                    <BottomPoInfo bottomInfo={bottomInfo} setBottomInfo={setBottomInfo}/>
                }
                <div style={{textAlign: 'center'}}>- 1 -</div>
            </div>


            <div>
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
                        padding: 20
                    }}>
                        <PoHeader info={info} type={type}/>
                        <table style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            margin: '20px 0',
                            textAlign: 'center',
                            border: '1px solid lightGray',
                        }}>
                            <thead>
                            <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                                <th colSpan={3} style={{width: '45%'}}>Specification</th>
                                <th colSpan={2} style={{width: '10%', borderLeft: '1px solid lightGray',}}>Q`ty</th>
                                <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Unit Price</th>
                                <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Amount</th>
                                <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Other</th>
                            </tr>


                            {v.map((src, idx) => {
                                return <tr style={{height: 35, fontWeight: 100}}>
                                    <td colSpan={2} style={{width: '6%', fontWeight: 600}}>{count + idx + 1}</td>
                                    <td style={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 2.1,
                                        textAlign: 'left',
                                        paddingLeft: 5
                                    }}>
                                        <TextAreas value={src.model} numb={idx} objKey={i} name={'model'}/>

                                    </td>
                                    <NumberInputForm value={src} numb={idx} objKey={i}/>
                                    <td>
                                        <TextAreas value={v?.other} numb={i} name={'other'}/>
                                    </td>
                                </tr>
                            })}


                            </thead>
                        </table>


                        <div style={{flexGrow: 1}}/>


                        {Object.keys(data).length - 1 === i ?
                            <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                margin: '20px 0',
                                textAlign: 'center',
                                border: '1px solid lightGray',
                            }}>
                                <thead>
                                <tr style={{height: 35, fontWeight: 100}}>
                                    <th style={{width: '44%'}}>TOTAL</th>
                                    <th style={{width: '6%', textAlign: 'right', paddingRight: 8}}>
                                        {totalData?.quantity}
                                    </th>
                                    <th style={{width: '6%', textAlign: 'left', paddingLeft: 5}}>

                                        {data[0][0]?.unit}
                                    </th>
                                    <th style={{width: '15%'}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 8px'}}>
                                            <span>{data[0][0]?.currency}</span>
                                            <span>{numberFormat(totalData?.unitPrice)}</span>
                                        </div>
                                    </th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 8px'}}>
                                            <span>{data[0][0]?.currency}</span>
                                            <span>{numberFormat(totalData?.total)}</span>
                                        </div>

                                    </th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            :
                            <></>
                        }

                        {Object.keys(data).length - 1 === i ?
                            <BottomPoInfo bottomInfo={bottomInfo} setBottomInfo={setBottomInfo}/>
                            :
                            <></>
                        }
                        <div style={{textAlign: 'center'}}>- {i + 1} -</div>
                    </div>
                })}
            </div>
        </Modal>
    )
        ;
}

export default memo(PrintPo, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});