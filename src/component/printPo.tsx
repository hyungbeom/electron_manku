import React, {useEffect, useMemo, useRef, useState} from "react";
import Modal from "antd/lib/modal/Modal";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {commonManage, gridManage} from "@/utils/commonManage";
import Input from "antd/lib/input";
import {getData} from "@/manage/function/api";
import {amountFormat} from "@/utils/columnList";
import Select from "antd/lib/select";
import InputNumber from "antd/lib/input-number";
import {estimateInfo, orderInfo} from "@/utils/column/ProjectInfo";
import moment from "moment/moment";


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


export default function PrintPo({data, isModalOpen, setIsModalOpen, tableRef, infoRef, memberList = [], count = 0}) {

    const pdfRef = useRef<any>();
    const pdfSubRef = useRef<any>();

    let totalAmount = 0;
    let totalQuantity = 0;
    let unit = '';
    let currency = '';

    const [splitData, setSplitData] = useState([[]]);
    const [info, setInfo] = useState([]);

    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    function formattedNumber(number) {
        return number?.toLocaleString();
    }

    useEffect(() => {
        const tableList = tableRef.current?.getSourceData();

        const filterTotalList = tableList.filter(v => !!v.model)
        const result = commonManage.splitDataWithSequenceNumber(filterTotalList, 28, 30);
        setSplitData(result)
    }, [data])

    const generatePDF = async (printMode = false) => {
        const pdf = new jsPDF("portrait", "px", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();

        if (pdfRef.current) {
            const firstCanvas = await html2canvas(pdfRef.current, {scale: 1.5, useCORS: true});

            const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;
            pdf.addImage(firstImgData, "PNG", 0, 0, pdfWidth, firstImgHeight);
        }

        const elements = pdfSubRef.current.children;
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const canvas = await html2canvas(element, {scale: 1.5, useCORS: true});
            const imgData = canvas.toDataURL("image/jpeg", 0.7);
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, imgHeight);
        }

        if (printMode) {
            const pdfBlob = pdf.output("bloburl");
            window.open(pdfBlob, "_blank");
        } else {
            pdf.save(`${data.documentNumberFull}_견적서.pdf`);
        }
    };


    async function getInfo() {
        return await getData.post('admin/getAdminList', {
            "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
            "searchAuthority": null,    // 1: 일반, 0: 관리자
            "page": 1,
            "limit": -1
        }).then(v => {
            return v
        })
    }

    useEffect(() => {


        let infoData = commonManage.getInfo(infoRef, orderInfo['defaultInfo']);
        const findMember = memberList.find(v => v.adminId === parseInt(infoData['managerAdminId']));
        infoData['managerAdminName'] = findMember['name'];

        const dom = infoRef.current.querySelector('#agencyCode');
        const lang = dom.value.startsWith("K");

        let totalDate = ''
        let date = moment(infoData['delivery']); // 기준 날짜
        totalDate = infoData['delivery']
        if(!isNaN(infoData['deliveryTerms'])){
            console.log('숫자')
            let newDate = date.add(infoData['deliveryTerms'], 'weeks'); // 주 단위 추가
            totalDate = newDate.format('YYYY-MM-DD')
        }
        setInfo(
            lang ?

                [
                    {title: '수신처', value: infoData.agencyName, id: 'ourPoNo'},
                    {title: '발주일자', value: totalDate, id: 'name'},
                    {title: '담당자', value: infoData.agencyManagerName, id: 'agencyManagerName'},
                    {title: '발주번호', value: infoData?.documentNumberFull, id: 'contactNumber'},
                    {title: '납품조건', value: data.agencyCode, id: 'agencyCode'},
                    {title: '귀사견적', value: infoData?.yourPoNo, id: 'yourPoNo'},
                    {title: '결제조건.', value: infoData?.paymentTerms, id: 'attnTo'},
                    {title: '담당자', value: findMember?.name, id: ''},
                    {title: '납기조건', value: infoData?.deliveryTerms, id: 'deliveryTerms'},
                    {title: '연락처', value: findMember?.contactNumber, id: 'faxNumber'},
                    {title: '', value: '', id: 'deliveryTerms'},
                    {title: 'E-Mail', value: findMember?.email, id: 'shippingTerms'},

                ]

                : [
                    {title: 'MESSER', value: infoData.agencyName, id: 'ourPoNo'},
                    {title: 'DATE', value: infoData.writtenDate, id: 'writtenDate'},
                    {title: 'ATTN', value: infoData.agencyManagerName, id: 'attnTo'},
                    {title: 'Contact Person', value: infoData.managerAdminName, id: 'ourPoNo'},
                    {title: 'YOUR OFFER NO.', value: infoData.attnTo, id: 'ourPoNo'},
                    {title: 'TEL', value: infoData.managerPhoneNumber, id: 'ourPoNo'},
                    {title: 'MANKU No.', value: infoData.documentNumberFull, id: 'ourPoNo'},
                    {title: 'E-mail', value: infoData.managerEmail, id: 'ourPoNo'},
                    {title: 'Delivery', value: infoData.deliveryTerms, id: 'ourPoNo'},
                    {title: 'HS-code', value: splitData.length ? splitData[0][0]?.hsCode : '', id: 'hscode'},
                    {title: 'Incoterms', value: '', id: 'incoterms'},
                    {title: '', value: '', id: ''},
                    {title: 'Payment', value: infoData.paymentTerms, id: 'ourPoNo'},
                ]
        )


    }, [data, count, splitData])

    const RowTotal = ({defaultValue, id}) => {

        const currency = splitData[0][0]?.currency ? splitData[0][0]?.currency : 'KRW';
        let result = Math.round(defaultValue * 100) / 100;
        let valueData = !isNaN(result) ? amountFormat(result.toFixed(2)) : ''
        if(commonManage.changeCurr(currency) === 'KRW' || commonManage.changeCurr(currency) === 'JPY'){
            valueData=   !isNaN(result) ? amountFormat(result) : ''
        }

        return <div style={{display: 'flex', justifyContent: 'space-between', padding: '0px 5px'}}><span
            style={{fontSize: 12, padding: 5}}>{splitData[0][0]?.currency ? splitData[0][0]?.currency : 'KRW'}</span>
            <Input value={valueData}
                   style={{border: 'none', width: '100%', textAlign: 'right'}} id={id} name={id}/></div>
    }

    const NumberInputForm = ({defaultValue, id, setInfo}) => {

        const inputRef = useRef<any>();
        const [toggle, setToggle] = useState(false);

        const handleChange = (e) => {
            setInfo(v => {
                return {...v, unitPrice: e}
            })
        };

        function blur() {

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
                                        prefix={<span style={{paddingLeft: 10}}>{splitData[0][0]?.currency ? splitData[0][0]?.currency : 'KRW'}</span>}/> :
            <div style={{fontSize: 14, display: 'flex', justifyContent: 'space-between', padding: '0px 10px'}}
                 onClick={() => {
                     setToggle(true);
                 }}>

                <span style={{fontSize : 12, paddingTop : 2}}>{splitData[0][0]?.currency ? splitData[0][0]?.currency : 'KRW'}</span>
                {amountFormat(defaultValue)}

            </div>}</>
    }
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
                    paddingLeft: 10,
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

    const totalSummary = useMemo(() => {


        const totals = splitData.flat().reduce(
            (acc, item) => {
                const quantity = item.quantity || 0;
                const unitPrice = item.unitPrice || 0;
                const amount = quantity * unitPrice;

                acc.totalQuantity += quantity;
                acc.totalUnitPrice += unitPrice;
                acc.totalAmount += amount;

                return acc;
            },
            {
                totalQuantity: 0,
                totalUnitPrice: 0,
                totalAmount: 0,
            }
        );
        return totals
    }, [splitData, count]);

    const RowContent = ({v, i}) => {
        const [info, setInfo] = useState({quantity: v.quantity, unit: v.unit, unitPrice: v.unitPrice})

        useEffect(() => {
            const totalQuantity = Array.from(document.getElementsByName("quantity"))
                .reduce((sum, input: any) => sum + (parseFloat(input.value) || 0), 0);

            const totalPrice = Array.from(document.getElementsByName("unitPrice"))
                .reduce((sum, input: any) => sum + (Number(input.value.replace(/,/g, "")) || 0), 0);

            const totalAmount = Array.from(document.getElementsByName("amount"))
                .reduce((sum, input: any) => sum + (Number(input.value.replace(/,/g, "")) || 0), 0);


            const resultNum = Number(info?.unitPrice ? info?.unitPrice : '');

            if (document.getElementById("total_amount")) {
                // document.getElementById("total_amount").textContent = amountFormat(totalAmount);
                // document.getElementById("total_unit_price").textContent = '(V.A.T)별도';
                // document.getElementById("total_unit").textContent = info.unit;
                // document.getElementById("total_quantity").textContent = totalQuantity.toString()
            }

        }, [info]);


        return <thead style={{height: 30}}>
        <tr style={{height: 30}}>
            <th colSpan={2} style={{

                border: 'none',
                textAlign: 'center',
                paddingLeft: 10,
                borderBottom: '1px solid lightGray', fontSize: 12,
                borderRight: '1px solid lightGray',

            }}>
                <div>{i + 1}</div>
            </th>
            <th colSpan={2} style={{borderBottom: '1px solid lightGray', textAlign: 'left', fontSize: 12}}>
                <Model v={v} refList={[pdfRef, pdfSubRef]} setSplitData={setSplitData}/>
            </th>
            <th style={{
                ...headerStyle,
                width: '5%',
                textAlign: 'right',
                fontWeight: 'lighter',
                fontSize: 12,
                borderLeft: '1px solid lightGray'
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
                width: '5%',
                borderBottom: '1px solid lightGray',
                fontSize: 12,
                borderLeft: '1px solid lightGray'
            }}>
                <Select value={info?.unit}
                        style={{border: 'none'}}
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
                borderLeft: '1px solid lightGray'
            }}>
                <NumberInputForm defaultValue={info?.unitPrice} id={'unitPrice'} setInfo={setInfo}/>
            </th>

            <th style={{
                borderTop: '1px solid lightGray',
                textAlign: 'right', fontWeight: 'lighter', fontSize: 12,
                borderLeft: '1px solid lightGray',
                borderBottom: '1px solid lightGray'
            }}>
                <RowTotal
                    defaultValue={parseFloat(info.quantity) * parseFloat(info?.unitPrice)}
                    id={'amount'}/>
            </th>
            <th style={{
                ...headerStyle,
                width: '5%',
                textAlign: 'right',
                fontWeight: 'lighter',
                fontSize: 12,
                borderLeft: '1px solid lightGray'
            }}>
                <Input
                    style={{
                        border: 'none',
                        textAlign: 'right',
                        padding: 0
                    }}/>
            </th>
        </tr>
        </thead>
    }

    function chechLang() {
        const dom = infoRef.current.querySelector('#agencyCode');
        return dom.value.startsWith("K");
    }

    return (
        <Modal
            title={<div style={{width: '100%', display: "flex", justifyContent: 'space-between', alignItems: 'center'}}>
                <div>발주서 출력</div>
                <div>
                    <button onClick={() => generatePDF(false)} style={{
                        padding: "5px 10px",
                        backgroundColor: "#1890ff",
                        color: "#fff",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                        fontSize: 11,
                        marginRight: 10
                    }}>
                        PDF
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
            <div ref={pdfRef} style={{
                width: '1000px',  // A4 가로
                height: '1414px',  // A4 세로
                aspectRatio: '1 / 1.414',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                padding: 30,
                border: '1px solid lightGray',


            }}>

                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <div style={{width: '40%'}}>
                        <img src={'/manku_ci_black_text.png'} width={50} style={{paddingTop: 5, float: 'left'}}
                             alt=""/>
                        <div style={{float: 'left', fontSize: 11, paddingLeft: 20}}>

                            {infoRef.current.querySelector('#agencyCode').value.startsWith('K') ? <>
                                <div>(주) 만쿠무역</div>
                                <div>Manku Trading Co., Ltd</div>
                                <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                                <div> B동 2층 211호, 212호</div>
                                <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                            </> : <>
                                <div>Manku Trading Co.,Ltd</div>
                                <div>B- 211#, Garden Five Works, 52,</div>
                                <div>Chungmin-ro,</div>
                                <div>Songpa-gu, Seoul, South Korea</div>
                                <div>Postal Code 05839</div>
                            </>
                            }
                        </div>
                    </div>

                    <div style={{
                        fontSize: 38,
                        fontWeight: 700,
                        textAlign: 'center'
                    }}>{chechLang() ? <>발&nbsp;&nbsp;&nbsp;&nbsp;주&nbsp;&nbsp;&nbsp;&nbsp;서</> : <>PURCHASE
                        ORDER</>} </div>
                    <div style={{width: '40%'}}>
                        <img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={180} alt=""/>
                    </div>
                </div>

                <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}></div>
                <div style={{
                    fontFamily: 'Arial, sans-serif',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridTemplateRows: '35px 35px 35px 35px 35px 35px 35px 35px',
                    alignItems: 'center',
                }}>
                    {info?.map((v: any, index) => {

                            return <div style={{
                                display: 'grid',
                                gridTemplateColumns: '135px 1fr',
                                alignItems: 'center',
                                fontSize: 14
                            }}>

                                <div style={{alignItems: 'center', fontWeight: 600}}>{v.title} <span
                                    style={{float: 'right', fontWeight: 600}}>{v.title ? ':' : null}</span></div>

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
                                           style={{
                                               border: 'none',
                                               paddingLeft: 15,
                                               alignItems: 'center',
                                               fontSize: 15,
                                               width: '100%'
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

                        textAlign: 'center',
                        // border: '1px solid lightGray',
                        // borderLeft: 'none',
                        // borderRight: 'none'
                    }}>
                    <thead>
                    <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold', height: 35}}>
                        <th>No</th>
                        <th colSpan={3} style={{borderLeft: '1px solid lightGray'}}>Specification</th>
                        <th colSpan={2} style={{
                            width: '5%',
                            textAlign: 'center',
                            borderLeft: '1px solid lightGray',
                            paddingRight: 10
                        }}>Q`ty
                        </th>
                        <th style={{width: '15%', textAlign: 'center', borderLeft: '1px solid lightGray'}}>{
                            chechLang() ? '단가' : 'Unit Price'
                        }</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>{
                            chechLang() ? '총액' : 'Amount'
                        }</th>
                        <th style={{width: '15%', borderLeft: '1px solid lightGray'}}>Other</th>
                    </tr>
                    </thead>


                    <thead>
                    <tr style={{fontWeight: 'bold', height: 35}}>
                        <th style={{
                            width: '6%',
                            border: '1px solid lightGray',
                            borderLeft: 'none',
                            fontSize: 12,

                        }}>Maker
                        </th>
                        <th colSpan={3} style={{

                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
                            textAlign: 'left', paddingLeft: 10,
                            borderLeft: 'none', borderRight: 'none', fontSize: 12
                        }}>{data?.maker ? data?.maker : '-'}</th>
                        <th colSpan={2} style={{

                            borderTop: '1px solid lightGray', border: '1px solid lightGray',
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
                    <TotalCalc splitData={splitData} totalSummary={totalSummary}/>
                    {/*{splitData.length === 1 ? <TotalCalc/> : <></>}*/}
                </table>
                <div style={{flexGrow: 1}}/>
                {/* 여백 자동 확장하여 아래로 밀어줌 */}


                <div
                    style={{
                        padding: '30px 20px',
                        fontSize: 12,
                        lineHeight: 1.7,
                        borderTop: '1px solid black',
                    }}>
                    {
                        infoRef.current.querySelector('#agencyCode').value.startsWith('K') ? <>
                            <div>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</div>
                            <div>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</div>
                            <div>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</div>
                            <div>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</div>
                            <div>· 성적서 및 품질보증서는 별도입니다.</div>
                        </> : <>
                            <div> * For the invoice* Please indicate few things as below:</div>
                            <div>1. HS Code 6 Digit</div>
                            <div>2. Indication of Country of Origin</div>
                            <div>It has to be written into the remark of every Invoice every time.</div>
                            <div>And your name, your signature and date of signature have to be put in under the
                                sentence as well.
                            </div>
                            <div>* Please give us Order confirmation. (Advise us if we should pay your bank charge as
                                well.)
                            </div>
                        </>
                    }
                        </div>

                        <div style={{textAlign: 'center'}}>- 1 -
                </div>
            </div>

            <div ref={pdfSubRef}>
                {splitData.map((v, idx) => {

                    if (!!idx) {
                        return <div style={{borderTop: '1px solid lightGray', padding: '50px 20px'}}>
                            <div style={{
                                fontSize: 9,
                                borderTop: '1px solid #121212',
                                fontWeight: 500,
                                width: '100%',
                                backgroundColor: '#EBF6F7',
                                display: 'grid',
                                textAlign: 'center',
                                gridTemplateColumns: '0.7fr 3fr 0.5fr 0.9fr 1fr 1fr',
                                borderBottom: '1px solid #A3A3A3'
                            }}>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    Item No.
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    Specification
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    Q`ty
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    HS-CODE
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    Unit Price
                                </div>
                                <div style={{padding: '3px 0'}}>
                                    Amount
                                </div>
                            </div>
                            {splitData[idx].map((v, i) => {
                                totalQuantity += v.quantity
                                totalAmount += v.quantity * v.unitPrice
                                unit = v.unit
                                currency = v.currency
                                return (
                                    <>
                                        <div key={i} style={{
                                            fontSize: 9,
                                            fontWeight: 500,
                                            width: '100%',
                                            display: 'grid',
                                            textAlign: 'center',
                                            gridTemplateColumns: '0.7fr 3fr 0.5fr 0.9fr 1fr 1fr',
                                            borderBottom: '1px solid #A3A3A3',
                                            borderTop: '1px solid #A3A3A3'
                                        }}>
                                            <div style={{
                                                padding: '3px 0',
                                                borderRight: '1px solid #121212',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {v.sequenceNumber}
                                            </div>
                                            <div style={{
                                                padding: '3px 0',
                                                borderRight: '1px solid #121212',
                                                whiteSpace: "pre-line",
                                                textAlign: 'left',
                                                paddingLeft: 10
                                            }}>
                                                {v.model}
                                            </div>
                                            <div style={{
                                                padding: '3px 0',
                                                borderRight: '1px solid #121212',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {v.quantity} {formattedNumber(v.unit)}
                                            </div>
                                            <div style={{
                                                padding: '3px 0',
                                                borderRight: '1px solid #121212',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {v.hsCode !== 'null' ? v.hsCode : ''}
                                            </div>
                                            <div style={{
                                                padding: '3px 10px',
                                                borderRight: '1px solid #121212',
                                                alignItems: 'center',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>{v.currency}</div>
                                                <div>{formattedNumber(v.unitPrice)}</div>
                                            </div>
                                            <div style={{
                                                padding: '3px 10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'space-between'
                                            }}>
                                                <div>{v.currency}</div>
                                                <div>{formattedNumber(v.quantity * v.unitPrice)}</div>
                                            </div>
                                        </div>
                                    </>
                                )
                            })}
                            {/* 합계 */}
                            {(splitData.length - 1) === idx && <div style={{
                                fontSize: 9,
                                fontWeight: 500,
                                width: '100%',
                                backgroundColor: '#EBF6F7',
                                display: 'grid',
                                textAlign: 'center',
                                gridTemplateColumns: '0.7fr 3fr 0.5fr 0.9fr 2fr',
                                borderBottom: '1px solid #121212'
                            }}>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>

                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    Total
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>
                                    {formattedNumber(totalQuantity)} {unit}
                                </div>
                                <div style={{padding: '3px 0', borderRight: '1px solid #121212',}}>

                                </div>

                                <div style={{padding: '3px 20px', display: 'flex', justifyContent: 'space-between'}}>
                                    <div>{currency}</div>
                                    <div>{formattedNumber(totalAmount)}</div>
                                </div>
                            </div>
                            }
                        </div>
                    }
                })}
            </div>
        </Modal>
    )
        ;
}

const TotalCalc = ({splitData = [[]], totalSummary}) => {


    return <thead>
    <tr style={{fontWeight: 'bold', height: 30}}>
        <th colSpan={3} style={{
            width: '6%',
            border: '1px solid lightGray',
            borderLeft: 'none',
            fontSize: 12,
        }}>
        </th>

        <th style={{
            borderTop: '1px solid lightGray', border: '1px solid lightGray',
            borderRight: 'none'
        }}>

        </th>
        <th style={{
            borderTop: '1px solid lightGray',
            border: '1px solid lightGray',
            borderRight: 'none'
        }}>
            <div id={'total_quantity'} style={{textAlign: 'right', paddingRight: 5, fontSize: 13.5}}>{totalSummary?.totalQuantity}</div>

        </th>
        <th style={{
            borderTop: '1px solid lightGray', border: '1px solid lightGray',
            borderRight: 'none'
        }}>
            <div style={{textAlign: 'center', fontSize: 13.5}}>
                <div id={'total_unit'} style={{textAlign: 'left', fontSize: 13.5, paddingLeft: 12}}></div>

            </div>
        </th>
        <th style={{
            borderTop: '1px solid lightGray', border: '1px solid lightGray',
            borderRight: 'none'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '0px 10px'}}>
                <div style={{textAlign: 'left'}}>{splitData[0][0]?.currency ? splitData[0][0]?.currency : 'KRW'}</div>
                <div
                    id={'total_unit_price'}>{totalSummary?.totalUnitPrice ? (totalSummary?.totalUnitPrice).toLocaleString() : ''}</div>
            </div>
        </th>
        <th style={{
            borderTop: '1px solid lightGray', border: '1px solid lightGray',
            borderRight: '1px solid lightGray'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', fontSize: 13.5, padding: '0px 10px'}}>
                <div style={{textAlign: 'left'}}>{splitData[0][0]?.currency ? splitData[0][0]?.currency : 'KRW'}</div>
                <div style={{paddingRight: 5}} id={'total_amount'}>{totalSummary?.totalAmount ? (totalSummary?.totalAmount).toLocaleString() : ''}</div>


            </div>
        </th>
        <th colSpan={3} style={{
            border: '1px solid lightGray',
            borderRight: 'none',
            fontSize: 12,
        }}>
        </th>
    </tr>
    </thead>
}


const headerStyle: any = {

    borderBottom: '1px solid lightGray',
    fontWeight:
        'bold',
    fontSize:
        11,
    padding: 12,
    textAlign: 'left',
    width: 100
};