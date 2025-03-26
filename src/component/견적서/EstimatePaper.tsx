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

const EstimatePaper = ({
                           infoRef,
                           pdfRef,
                           pdfSubRef,
                           tableRef,
                           memberList = [],
                           count = 0,
                           position = true,
                           type = 'estimate',
                           maker
                       }: any) => {

    console.log(maker,'maker:')

    const ref1 = useRef<any>()
    const ref2 = useRef<any>()

    const [tableData] = useMemo(() => {

        const tableList = tableRef.current?.getSourceData();
        const filterTotalList = tableList.filter(v => !!v.model)
        const result = commonManage.splitDataWithSequenceNumber(filterTotalList, 18, 28);
        return [result]
    }, [count]);


    useEffect(() => {
        getTotal()
    }, [tableData]);

    function getTotal(){
        const totalPrice = document.querySelectorAll('.total');
        let total = 0;
        totalPrice.forEach((input:any) => {
            const numberString = input.innerText.replace(/[₩,]/g, ''); // ₩와 ,를 제거
            total += parseFloat(numberString) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });



        const netPrice = document.querySelectorAll('.netPrice');
        let sum = 0;
        netPrice.forEach((input:any) => {
            const numberString = input.innerText.replace(/[₩,]/g, ''); // ₩와 ,를 제거
            sum += parseFloat(numberString) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });

        const inputs = document.getElementsByName('qt');
        let sum2 = 0;
        inputs.forEach((input:any) => {
            sum2 += parseFloat(input.value) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });
        if(ref2.current){
            ref2.current.childNodes.forEach(v=>{
                if(v.className === 'total_qt'){
                    v.innerText = sum2;
                }
                if(v.className === 'total_unit'){
                    if(tableData.length) {
                        v.innerText = tableData[0][0]?.unit;
                    }
                }
                if(v.className === 'total_netPrice'){
                    v.innerText = sum.toLocaleString();
                }
                if(v.className === 'total_amount'){
                    v.innerText = total?.toLocaleString();
                }
            })
        }
        if(ref1.current){
            ref1.current.childNodes.forEach(v=>{
                if(v.className === 'total_qt'){
                    v.innerText = sum2;
                }
                if(v.className === 'total_unit'){
                    if(tableData.length) {
                        v.innerText = tableData[0][0]?.unit;
                    }
                }
                if(v.className === 'total_netPrice'){
                    v.innerText = sum.toLocaleString();
                }
                if(v.className === 'total_amount'){
                    v.innerText = total?.toLocaleString();
                }
            })
        }

    }

    function NumberInputForm({value}) {

        const [info, setInfo] = useState({net : value.net, quantity : value.quantity});

        const inputRef = useRef<any>();
        const [toggle, setToggle] = useState(false);

        function blur() {
            setToggle(false);
            getTotal();
        }

        useEffect(() => {
            if (toggle) {
                inputRef.current.focus();
            }
            getTotal()
        }, [toggle]);

        function onchange(e){
            setInfo(v=>{
                return {...v, net : e}
            })
        }
        function onQuantity(e){
            setInfo(v=>{
                return {...v, quantity : e.target.value}
            })
        }
        return <>
            <td style={{width: 100, textAlign: 'right'}}>


                <Input style={{border: 'none', textAlign: 'right'}} type={'number'} value={info.quantity} onChange={onQuantity} onBlur={blur} name={'qt'}/>

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
                {toggle ? <InputNumber ref={inputRef} onBlur={blur} value={info.net} onChange={onchange}
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
                            <span>₩</span>
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
                    <span>₩</span>
                    <span className={'total'}>{amountFormat(info.net * info.quantity)}</span>
                </div>

            </td>

        </>
    }


    return (
        <div style={!position ? {position: 'absolute', top: 0, zIndex: -100} : {}}>

            <div ref={pdfRef} style={{
                border: '1px solid lightGray',
                width: '1000px',  // A4 가로
                height: '1354px',  // A4 세로
                // aspectRatio: '1 / 1.414',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: '0px 20px'
            }}>
                <EstimateHeader/>
                <TopInfo count={count} infoRef={infoRef} type={type} memberList={memberList}/>
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

                    {tableData[0]?.map((v, i) =>

                        <tr style={{height: 35}}>
                            <td colSpan={2} style={{fontWeight: 600}}>{i + 1}</td>
                            <td style={{
                                whiteSpace: 'pre-line',
                                lineHeight: 2.1,
                                textAlign: 'left',
                                paddingLeft: 5
                            }}>

                                <TextArea autoSize={true} style={{border: 'none'}} defaultValue={v.model}/>

                            </td>
                            <NumberInputForm value={v}/>

                        </tr>
                    )}
                    </thead>
                </table>
                <div style={{flexGrow: 1}}/>
                {tableData.length > 1 ? <></> :

                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        margin: '20px 0',
                        textAlign: 'center',
                        border: '1px solid lightGray',
                    }}>
                        <thead>
                        <tr style={{height: 35, fontWeight: 100}} ref={ref1}>
                            <th colSpan={2} style={{width: '6%', fontWeight: 600}}></th>
                            <th style={{width: '43%'}}>TOTAL</th>
                            <th style={{width: 50, textAlign: 'right', paddingRight: 8}} className={'total_qt'}></th>
                            <th style={{width: 40, textAlign: 'left', paddingLeft: 5}} className={'total_unit'}></th>
                            <th style={{width: '20%', textAlign : 'right', paddingRight : 10}} className={'total_netPrice'}></th>
                            <th style={{width: '20%', textAlign : 'right', paddingRight : 10}} className={'total_amount'}></th>
                        </tr>
                        </thead>
                    </table>

                }
                {tableData.length > 1 ? <></> : <BottomInfo/>}
                <div style={{textAlign: 'center'}}>- 1 -</div>
            </div>


            <div ref={pdfSubRef}>

                {tableData.map((v, i) => {

                    const count: any = sumLengthsUpToIndex(tableData, i - 1);
                    if (!i) {
                        return false;
                    }

                    return <div style={{
                        border: '1px solid lightGray',
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

                                        <TextArea autoSize={true} style={{border: 'none'}} defaultValue={src.model}/>

                                    </td>
                                    <NumberInputForm value={src}/>
                                </tr>
                            })}
                            </thead>
                        </table>
                        <div style={{flexGrow: 1}}/>
                        {tableData.length - 1 === i ? <table style={{
                                width: '100%',
                                borderCollapse: 'collapse',
                                margin: '20px 0',
                                textAlign: 'center',
                                border: '1px solid lightGray',
                            }}>
                                <thead>
                                <tr style={{height: 35, fontWeight: 100}} ref={ref2}>
                                    <th colSpan={2} style={{width: '6%', fontWeight: 600}}></th>
                                    <th style={{width: '43%'}}>TOTAL</th>
                                    <th style={{width: 50, textAlign: 'right', paddingRight: 8}} className={'total_qt'}></th>
                                    <th style={{width: 40, textAlign: 'left', paddingLeft: 5}} className={'total_unit'}></th>
                                    <th style={{width: '20%', textAlign : 'right', paddingRight : 10}} className={'total_netPrice'}></th>
                                    <th style={{width: '20%', textAlign : 'right', paddingRight : 10}} className={'total_amount'}></th>
                                </tr>
                                </thead>
                            </table>
                            : <></>}
                        {tableData.length - 1 === i ? <BottomInfo/> : <></>}
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