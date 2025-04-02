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


function PrintPo({

                     isModalOpen,
                     setIsModalOpen,
                     tableRef,
                     infoRef,
                     maker = '',
                     memberList = [],
                     count = 0,
                     title = ''
                 }) {


    const [data, setData] = useState([[]]);
    const [topInfoData, setTopInfoData] = useState<any>({})

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
    }, [count]);

    const totalData = useMemo(() => {

        const list = Object.values(data);

        let bowl = {quantity: 0, net: 0, total: 0, unit: list[0].length ? list[0][0]['unit'] : ''}
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


        // ===test
        // ===test
        // ===test

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
                        <span>{!isNaN(info.net) ? data[0][0]?.currency : ''}</span>
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
                    <span>{!isNaN(info.net * info.quantity) ? data[0][0]?.currency : ''}</span>
                    <span
                        className={'total'}>{!isNaN(info.net * info.quantity) ? amountFormat(info.net * info.quantity) : ''}</span>
                </div>

            </td>

        </>
    }

    async function download() {
        // const blob = await pdf(<PdfForm data={data} topInfoData={topInfoData} totalData={totalData}
        //                                 key={Date.now()}/>).toBlob();
        //
        // const url = URL.createObjectURL(blob);
        // const link = document.createElement('a');
        // link.href = url;
        // link.download = `${topInfoData?.documentNumberFull}.pdf`;
        // link.click();
        //
        // // 메모리 해제
        // URL.revokeObjectURL(url);
    }


    return (
        <Modal
            title={<div style={{width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <div>발주서 출력</div>
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
                    <button onClick={() => generatePDF(true)} style={{
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

                <PoHeader infoRef={infoRef}/>
                <TopPoInfo infoRef={infoRef} memberList={memberList} getTopInfoData={getTopInfoData}/>
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
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>단가</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>총액</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Other</th>
                    </tr>
                    </thead>

                    <thead>
                    <tr style={{fontWeight: 'bold', height: 30}}>
                        <th colSpan={8}/>
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
                                    <span>        {(totalData?.net).toLocaleString()}</span>
                                </div>
                            </th>
                            <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 8px'}}>
                                    <span>{data[0][0]?.currency}</span>
                                    <span>{(totalData?.total).toLocaleString()}</span>
                                </div>

                            </th>
                            <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                            </th>
                        </tr>
                        </thead>
                    </table>

                }
                {Object.keys(data).length > 1 ? <></> : <BottomPoInfo infoRef={infoRef}/>}

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
                        <PoHeader infoRef={infoRef}/>
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
                                <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>단가</th>
                                <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>총액</th>
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


                        {Object.keys(data).length - 1 === i ? <table style={{
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
                                            <span>        {(totalData?.net).toLocaleString()}</span>
                                        </div>
                                    </th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                                        <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 8px'}}>
                                            <span>{data[0][0]?.currency}</span>
                                            <span>{(totalData?.total).toLocaleString()}</span>
                                        </div>

                                    </th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}>
                                    </th>
                                </tr>
                                </thead>
                            </table>
                            : <></>}
                        {Object.keys(data).length - 1 === i ? <BottomPoInfo infoRef={infoRef}/> : <></>}
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