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
import Button from "antd/lib/button";

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

export const Header = () => <>
    <div style={{textAlign: 'center', fontSize: 30, fontWeight: 'bold'}}>거래명세표</div>
    <div style={{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        paddingTop: 20,
        display: 'flex',
        justifyContent: 'center'
    }}>
        <div style={{alignItems: 'center', display: 'flex', justifyContent: 'center'}}>거래일자 :</div>
        <div style={{width: 100, alignItems: 'center'}}><Input style={{border: 'none'}}
                                                               defaultValue={moment().format('YYYY-MM-DD')}
                                                               id={'writtenDate'}/></div>
    </div>
</>

function TransactionStatementHeader({isModalOpen, setIsModalOpen, infoRef, pdfRef, pdfSubRef, tableRef}: any) {

    const ref1 = useRef<any>()
    const ref2 = useRef<any>()


    const [domesticInfo, setDomesticInfo] = useState<any>(orderInfo['defaultInfo'])

    useEffect(() => {
        let infoData = commonManage.getInfo(infoRef, orderInfo['defaultInfo']);
        const {customerName} = infoData;

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


    const [tableData] = useMemo(() => {

        let returnTable = []
        if (tableRef.current) {
            const tableList = tableRef.current?.getSourceData();
            const filterTableList = commonManage.filterEmptyObjects(tableList, ['model'])
            const result = commonManage.splitDataWithSequenceNumber(filterTableList, 18, 35);
            returnTable = result
        }
        return [returnTable]
    }, [isModalOpen]);


    function getTotal() {
        const totalPrice = document.querySelectorAll('.total');
        let total = 0;
        totalPrice.forEach((input: any) => {
            const numberString = input.innerText.replace(/[₩,]/g, ''); // ₩와 ,를 제거
            total += parseFloat(numberString) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });

        const taxDom = document.querySelectorAll('.tax');
        let sumTax = 0;
        taxDom.forEach((input: any) => {
            const numberString = input.innerText.replace(/[₩,]/g, ''); // ₩와 ,를 제거
            sumTax += parseFloat(numberString) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });

        const netPrice = document.querySelectorAll('.netPrice');
        let sum = 0;
        netPrice.forEach((input: any) => {
            const numberString = input.innerText.replace(/[₩,]/g, ''); // ₩와 ,를 제거
            sum += parseFloat(numberString) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });

        const inputs = document.getElementsByName('qt');
        let sum2 = 0;
        inputs.forEach((input: any) => {
            sum2 += parseFloat(input.value) || 0;  // 숫자가 아닌 값이 있을 경우 0으로 처리
        });
        if (ref2.current) {
            ref2.current.childNodes.forEach(v => {
                if (v.className === 'total_qt') {
                    v.innerText = sum2;
                }
                if (v.className === 'total_unit') {
                    if (tableData.length) {
                        v.innerText = tableData[0][0]?.unit;
                    }
                }
                if (v.className === 'total_netPrice') {
                    v.innerText = sum.toLocaleString();
                }
                if (v.className === 'total_amount') {
                    v.innerText = total?.toLocaleString();
                }
                if (v.className === 'total_tax') {
                    v.innerText = sumTax?.toLocaleString();
                }
            })
        }
        if (ref1.current) {
            ref1.current.childNodes.forEach(v => {
                if (v.className === 'total_qt') {
                    v.innerText = sum2;
                }
                if (v.className === 'total_unit') {
                    if (tableData.length) {
                        v.innerText = tableData[0][0]?.unit;
                    }
                }
                if (v.className === 'total_netPrice') {
                    v.innerText = sum.toLocaleString();
                }
                if (v.className === 'total_amount') {
                    v.innerText = total?.toLocaleString();
                }
                if (v.className === 'total_tax') {
                    v.innerText = sumTax?.toLocaleString();
                }
            })
        }

    }


    useEffect(() => {
        getTotal()
    }, [tableData]);

    function NumberInputForm({value}) {

        const [info, setInfo] = useState({net: value.net, quantity: value.quantity});

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


                <Input style={{border: 'none', textAlign: 'right', fontSize: 13}} type={'number'} value={info.quantity}
                       onChange={onQuantity} onBlur={blur} name={'qt'}/>

            </td>

            <td>
                {toggle ? <InputNumber ref={inputRef} onBlur={blur} value={info.net} onChange={onchange}
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
            title={<div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 30px'}}>
                <span>거래명세표 출력</span>
                <span>
                       <Button style={{fontSize: 11, marginRight: 10}} size={'small'}
                               onClick={() => commonManage.pdfDown(pdfRef, pdfSubRef, false, 'test')}>다운로드</Button>
                       <Button style={{fontSize: 11}} size={'small'}
                               onClick={() => commonManage.pdfDown(pdfRef, pdfSubRef, true, 'test')}>인쇄</Button>
                </span>
            </div>}
            width={1100} open={isModalOpen?.event1}
            onCancel={() => setIsModalOpen({event1: false, event2: false})}
            onOk={() => setIsModalOpen({event1: false, event2: false})}
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
                <Header/>
                <div style={{display: 'flex', justifyContent: 'center', paddingTop: 50}}>
                    <div style={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: '40px auto',
                        fontSize: 12,borderLeft : '1px solid lightGray'
                    }}>
                        <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>
                            공급자
                        </div>
                        <table style={{borderLeft: '1px solid lightGray', width: 440}}>
                            <thead>
                            <tr>
                                <th style={headerStyle}>등록번호</th>
                                <th style={cellStyle} colSpan={3}>714-87-01453</th>
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
                                <th style={headerStyle}>담당자</th>
                                <th style={cellStyle}>신단비</th>
                                <th style={headerStyle}>연락처</th>
                                <th style={cellStyle}>02-465-7838</th>
                            </tr>
                            </thead>
                        </table>
                    </div>
                    <div style={{
                        position: 'relative',
                        display: 'grid',
                        gridTemplateColumns: '40px auto',
                        fontSize: 12
                    }}>
                        <div style={{width: 25, margin: "auto", paddingLeft: 7, fontWeight: 700}}>
                            공급받는자
                        </div>
                        <table style={{borderLeft: '1px solid lightGray', width: 438}}>
                            <thead>
                            <tr>
                                <th style={headerStyle}>등록번호</th>
                                <th style={cellStyle} colSpan={3}>
                                    <input style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                           defaultValue={domesticInfo?.businessRegistrationNumber}/>
                                </th>
                            </tr>
                            </thead>
                            <thead>
                            <tr>
                                <th style={headerStyle}>상호</th>
                                <th style={cellStyle}>
                                    <input style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                           defaultValue={domesticInfo?.customerName}/></th>
                                <th style={headerStyle}>대표자</th>
                                <th style={cellStyle}>
                                    <input style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
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
                                    <input style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                           defaultValue={domesticInfo?.businessType}/></th>
                                <th style={headerStyle}>종목</th>
                                <th style={cellStyle}>
                                    <input style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                           defaultValue={domesticInfo?.businessItem}/></th>
                            </tr>
                            </thead>
                            <thead>
                            <tr>
                                <th style={headerStyle}>담당자</th>
                                <th style={cellStyle}><input
                                    style={{border: 'none', textAlign: 'center', fontSize: 12, fontWeight: 700}}
                                    defaultValue={domesticInfo?.representative}/></th>
                                <th style={headerStyle}>연락처</th>
                                <th style={cellStyle}><input
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
                    margin: '20px 0',
                    textAlign: 'center', fontSize: 12

                }}>
                    <thead>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                        <th style={{width: 80}}>NO</th>
                        <th style={{width: '9%'}}>날짜</th>
                        <th style={{width: 300, borderLeft: '1px solid lightGray'}}>품목</th>
                        <th style={{width: '5%', borderLeft: '1px solid lightGray'}}>수량</th>
                        <th style={{width: '12%', borderLeft: '1px solid lightGray'}}>단가</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>공급가액</th>
                        <th style={{width: '12%', borderLeft: '1px solid lightGray'}}>세액</th>
                        <th style={{width: '12%', borderLeft: '1px solid lightGray'}}>비고</th>
                    </tr>
                    </thead>

                    <thead>

                    {tableData[0]?.map((v, i) =>

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

                                <TextArea autoSize={true} style={{border: 'none', fontSize: 12}}
                                          defaultValue={v.model}/>

                            </td>
                            <NumberInputForm value={v}/>

                            <td style={{fontWeight: 600}}>
                                <TextArea autoSize={true} style={{border: 'none', fontSize: 12}}/>
                            </td>
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

                            <th colSpan={2} style={{fontWeight: 600}}>TOTAL</th>
                            <th style={{width: '5%', textAlign: 'right', paddingRight: 8}} className={'total_qt'}></th>
                            <th style={{width: '12%', textAlign: 'right', paddingRight: 10}}
                                className={'total_netPrice'}></th>
                            <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}
                                className={'total_amount'}></th>
                            <th style={{width: '12%', textAlign: 'right', paddingRight: 10}}
                                className={'total_tax'}></th>
                            <th style={{width: '12%', textAlign: 'right', paddingRight: 10}} className={'remark'}></th>
                        </tr>
                        </thead>
                    </table>

                }
                <div style={{textAlign: 'center'}}>- 1 -</div>
            </div>


            <div ref={pdfSubRef}>

                {tableData.map((v, i) => {

                    const count: any = sumLengthsUpToIndex(tableData, i - 1);
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
                            margin: '20px 0',
                            textAlign: 'center',
                            border: '1px solid lightGray',
                        }}>
                            <thead>
                            <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                                <th style={{width: 80}}>NO</th>
                                <th style={{width: '11%'}}>날짜</th>
                                <th style={{width: 300, borderLeft: '1px solid lightGray'}}>품목</th>
                                <th style={{width: '5%', borderLeft: '1px solid lightGray'}}>수량</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray'}}>단가</th>
                                <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>공급가액</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray'}}>세액</th>
                                <th style={{width: '12%', borderLeft: '1px solid lightGray'}}>비고</th>
                            </tr>

                            {v.map((src, idx) => {
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

                                        <TextArea autoSize={true} style={{border: 'none', fontSize: 12}}
                                                  defaultValue={src.model}/>

                                    </td>
                                    <NumberInputForm value={src}/>

                                    <td style={{fontWeight: 600}}>
                                        <TextArea autoSize={true} style={{border: 'none'}}/>
                                    </td>
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

                                    <th colSpan={2} style={{fontWeight: 600}}>TOTAL</th>
                                    <th style={{width: '5%', textAlign: 'right', paddingRight: 8}}
                                        className={'total_qt'}></th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10}}
                                        className={'total_netPrice'}></th>
                                    <th style={{width: '15%', textAlign: 'right', paddingRight: 10}}
                                        className={'total_amount'}></th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10}}
                                        className={'total_tax'}></th>
                                    <th style={{width: '12%', textAlign: 'right', paddingRight: 10}}
                                        className={'remark'}></th>
                                </tr>
                                </thead>
                            </table>
                            : <></>}

                        <div style={{textAlign: 'center'}}>- {i + 1} -</div>
                    </div>

                })}
            </div>
        </Modal>
    </>
}

export default memo(TransactionStatementHeader, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});