import React, {memo, useEffect, useMemo, useRef, useState} from 'react';
import {commonManage} from "@/utils/commonManage";
import _ from "lodash";
import TopInfo, {BottomInfo} from "@/component/견적서/TopInfo";
import EstimateHeader from "@/component/견적서/EstimateHeader";
import TextArea from "antd/lib/input/TextArea";
import Input from "antd/lib/input";
import Select from "antd/lib/select";
import {amountFormat} from "@/utils/columnList";
import InputNumber from "antd/lib/input-number";
import "@/resources/NotoSansKR-normal";
import Button from "antd/lib/button";
import {pdf} from "@react-pdf/renderer";
import {PdfForm} from "@/component/견적서/PdfForm";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    {ssr: false}
);




const EstimatePaper = ({
                           infoRef,
                           tableRef,
                           memberList = [],
                           count = 0,

                           type = 'estimate',
                           maker,
                           title = ''
                       }: any) => {


    const [data, setData] = useState({});


    useEffect(() => {
        const tableList = tableRef.current?.getSourceData();
        const filterTotalList = tableList.filter(v => !!v.model)
        const result = commonManage.splitDataWithSequenceNumber(filterTotalList, 18, 28);
        let copyData = _.cloneDeep(data);
        result.forEach((v, idx) => {
            copyData[idx] = v;
        })
        setData(copyData);
    }, [count]);

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
            // getTotal()
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
                {toggle ? <InputNumber ref={inputRef} onBlur={blur} id={'net'} value={info.net} onChange={onchange}
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
                        <span>{!isNaN(info.net ) ? '₩' : ''}</span>
                        <span className={'netPrice'}>{amountFormat(info.net)}</span>
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
                    <span>{!isNaN(info.net * info.quantity) ?'₩' : ''}</span>
                    <span className={'total'}>{!isNaN(info.net * info.quantity) ?  amountFormat(info.net * info.quantity) : ''}</span>
                </div>

            </td>

        </>
    }
    const [topInfoData, setTopInfoData] = useState<any>({})


    async function download() {
        const blob = await pdf(<PdfForm data={data} topInfoData={topInfoData} totalData={totalData}
                                        key={Date.now()}/>).toBlob();

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${topInfoData?.documentNumberFull}.pdf`;
        link.click();

        // 메모리 해제
        URL.revokeObjectURL(url);
    }



    function getTopInfoData(e) {
        setTopInfoData(e);
        // setPrintComp(<PdfForm data={data} topInfoData={topInfoData}/>)
    }

    const print = async () => {
        const blob = await pdf(<PdfForm data={data} topInfoData={topInfoData} totalData={totalData}
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
        <div>

            <div style={{marginTop: -10, padding: 15, display: 'flex', justifyContent: 'space-between'}}>
                <div>{title}</div>
                <div>
                    <Button onClick={download} size={'small'} type={'primary'} style={{fontSize : 12, marginRight : 5}}>다운로드</Button>
                    <Button onClick={print} size={'small'} type={'primary'} style={{fontSize : 12, marginRight : 20}}>인쇄</Button>
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
                <TopInfo count={count} infoRef={infoRef} type={type} memberList={memberList}
                         getTopInfoData={getTopInfoData}/>

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
                    <tr style={{fontWeight: 'bold', height: 35}}>
                        <th colSpan={2} style={{width: '6%',}}>Maker</th>
                        <th style={{
                            textAlign: 'left',
                            paddingLeft: 10
                        }}>{maker ? maker : '-'}</th>
                        <th></th>
                        <th></th>
                        <th></th>
                        <th></th>
                    </tr>

                    {data[0]?.map((v, i) => {
                            return <tr style={{height: 35}} key={`re${i}`}>
                                <td colSpan={2} style={{fontWeight: 600}}>{i + 1}</td>
                                <td style={{
                                    whiteSpace: 'pre-line',
                                    lineHeight: 2.1,
                                    textAlign: 'left',
                                    paddingLeft: 5
                                }}>

                                    <TextAreas value={v.model} numb={i}/>

                                </td>
                                <NumberInputForm value={v} numb={i}/>

                            </tr>
                        }
                    )}
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
                                {(totalData?.net).toLocaleString()}
                            </th>
                            <th style={{width: '20%', textAlign: 'right', paddingRight: 10}}>
                                {(totalData?.total).toLocaleString()}
                            </th>
                        </tr>
                        </thead>
                    </table>

                }
                {Object.keys(data).length > 1 ? <></> : <BottomInfo/>}
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
                        padding: '0px 20px'
                    }}>
                        <EstimateHeader/>
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


                            {v.map((src, idx) => {
                                return <tr style={{height: 35, fontWeight: 100}}>
                                    <td colSpan={2} style={{width: '6%', fontWeight: 600}}>{count + idx + 1}</td>
                                    <td style={{
                                        whiteSpace: 'pre-line',
                                        lineHeight: 2.1,
                                        textAlign: 'left',
                                        paddingLeft: 5
                                    }}>

                                        <TextAreas value={src.model} numb={idx} objKey={i}/>

                                    </td>
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
                                        {(totalData?.net).toLocaleString()}
                                    </th>
                                    <th style={{width: '20%', textAlign: 'right', paddingRight: 10}}>
                                        {(totalData?.total).toLocaleString()}
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            : <></>}
                        {Object.keys(data).length - 1 === i ? <BottomInfo/> : <></>}
                        <div style={{textAlign: 'center'}}>- {i + 1} -</div>
                    </div>

                })}
            </div>
        </div>
    )
        ;

};


export default memo(EstimatePaper, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});