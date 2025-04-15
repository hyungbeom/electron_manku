import {HyperFormula} from 'hyperformula';
import {HotTable} from '@handsontable/react-wrapper';
import {registerAllModules} from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import Handsontable from "handsontable";
import moment from "moment/moment";
import {tableButtonList} from "@/utils/commonForm";
import {commonFunc, commonManage} from "@/utils/commonManage";
import EstimateListModal from "@/component/EstimateListModal";
import OrderListModal from "@/component/OrderListModal";
import Button from "antd/lib/button";
import * as XLSX from 'xlsx';
import {UploadOutlined} from "@ant-design/icons";
import HsCodeListModal from "@/component/HsCodeListModal";
import _ from "lodash";
// register Handsontable's modules
registerAllModules();


const Table = forwardRef(({
                              data = new Array(1000).fill({}),
                              column,
                              type = '',
                              funcButtons,
                              infoRef = null,
                          }: any, ref) => {

    const rowRef = useRef(null)
    const fileInputRef = useRef(null); // 파일 업로드 input 참조

    const hotRef = useRef(null)
    const [isModalOpen, setIsModalOpen] = useState({estimate: false, agency: false});


    useImperativeHandle(ref, () => ({
        hotInstance: hotRef.current?.hotInstance, // Handsontable 인스턴스 접근
        getData: () => hotRef.current?.hotInstance?.getData(), // 현재 테이블 데이터 가져오기
        getSourceData: () => hotRef.current?.hotInstance?.getSourceData(), // 현재 테이블 데이터 가져오기
        setData: (newData) => hotRef.current?.hotInstance?.loadData(newData), // 테이블 데이터 업데이트
        forceRender: () => hotRef.current?.hotInstance?.render(), // 강제 렌더링
    }));

    const tableContainerRef = useRef(null);

    const [tableData, setTableData] = useState([])

    useEffect(() => {
        setTableData(calcData(data))
    }, [data, column]);

    function calcData(sourceData) {
        const keyOrder = Object.keys(column['defaultData']);
        return sourceData
            .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
            .map(column['excelExpert'])
            .concat(column['totalList']); // `push` 대신 `concat` 사용
    }

    useEffect(() => {
        if (!hotRef.current?.hotInstance) return;
        hotRef.current.hotInstance.useTheme('ht-theme-main');
        hotRef.current.hotInstance.render();

    }, []);


    const afterRenderer = (td, row, col, prop, value) => {
        if (["unitPrice", 'totalNet', "total", 'net', "totalPurchase", "purchasePrice", 'quantity', 'receivedQuantity', 'unreceivedQuantity'].includes(prop)) {
            td.style.textAlign = "right"; // 우측 정렬
            td.style.color = "black"; // 텍스트 굵게
            if (['totalNet', "total", "totalPurchase", 'net', 'unitPrice', 'purchasePrice'].includes(prop)) {
                if (value === 0 || isNaN(value)) {
                    td.textContent = ""; // 🔥 0 또는 NaN이면 빈 문자열 적용
                } else {
                    td.textContent = value?.toLocaleString(); // 🔢 숫자는 쉼표 추가
                }
            }

            if (["total", "totalPurchase", 'totalNet'].includes(prop)) {
                if (value === 0 || isNaN(value)) {
                    td.textContent = ""; // 🔥 0 또는 NaN이면 빈 문자열 적용
                } else {
                    td.textContent = value?.toLocaleString(); // 🔢 숫자는 쉼표 추가
                }
                if (row === 1000) {

                }
                td.style.fontWeight = "bold"; // 텍스트 굵게
            }
        }
    };


    /**
     * @description cell의 입력 데이터가 포커스아웃이 되는순간 이벤트를 캐치하는 ㄴ함수
     * @param changes
     * @param source
     */
    function afterChange(changes, source) {
        if (source === "edit" || source === "Checkbox") {
            changes.forEach((change, index) => {
                const [row, prop, oldValue, newValue] = change; // 구조 분해 할당
                if (prop === "content" && newValue === "회신") {
                    hotRef.current.hotInstance.suspendExecution(); // ⚠️ 자동 계산 방지
                    hotRef.current.hotInstance.setDataAtCell(row, 8, moment().format('YYYY-MM-DD')); // replyDate 컬럼 업데이트
                    hotRef.current.hotInstance.resumeExecution(); // ✅ 다시 계산 시작
                }
                if (prop === "quantity") {
                    if (type === 'order_write_column') {

                        hotRef.current.hotInstance.setDataAtCell(row, 8, newValue); // replyDate 컬럼 업데이트
                    }
                }
                if (prop === 'unitPrice') {
                    const propIndex = change.indexOf('unitPrice'); // 'unitPrice'의 인덱스 찾기
                    const newValueIndex = propIndex + 2; // newValue 위치 (prop + 2)

                    changes[index][newValueIndex] = parseFloat(change[newValueIndex]).toFixed(2); // ✅ 소수점 2자리 변환

                    if (type === 'rfq_write_column') {
                        hotRef.current.hotInstance.setDataAtCell(row, 7, '회신'); // replyDate 컬럼 업데이트
                        hotRef.current.hotInstance.setDataAtCell(row, 8, moment().format('YYYY-MM-DD')); // replyDate 컬럼 업데이트
                    }
                }
                if (prop === 'calcCheck') {
                    let data = [...hotRef.current.hotInstance.getSourceData()]
                    if (newValue) {
                        data[row].totalPurchase = `= (H${row + 1} * K${row + 1}) + M${row + 1}`;
                        data[row].unitPrice = `= (L${row + 1} / H${row + 1}) +  ((L${row + 1} / H${row + 1}) * (F${row + 1} / 100))`;
                        data[row].total = `=H${row + 1}*I${row + 1}`;
                    } else {
                        data[row].totalPurchase = `= (H${row + 1} * K${row + 1}) + M${row + 1}`;
                        // data[row].unitPrice = `=H${row + 1}`;
                        data[row].total = `=H${row + 1}*I${row + 1}`;
                    }
                    setTableData(data);
                }
            });
        }
    }

    function relatedLink(event, coords) {
        if (event.ctrlKey) { // ✅ Ctrl 키가 눌렸는지 확인
            const colIndex = coords.col;
            const colName = hotRef.current.hotInstance.getColHeader(colIndex);
            const cellValue = hotRef.current.hotInstance.getDataAtCell(coords.row, coords.col); // ✅ 데이터 가져오기

            if (colName === "관련링크") { // ✅ 특정 컬럼인지 확인

                if (typeof cellValue === "string" && (cellValue.includes('http') || cellValue.includes('www'))) {
                    const fixedUrl = cellValue.startsWith("http://") || cellValue.startsWith("https://") ? cellValue : `https://${cellValue}`;

                    window.open(fixedUrl, "_blank"); // ✅ 새 탭에서 URL 열기
                }
            }
            if (colName === '단위') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, "ea");
            }
            if (colName === '수량') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, 1);
            }
            if (colName === '납기(weeks)') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, 1);
            }
            if (colName === '회신일') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, moment().format('YYYY-MM-DD'));
            }
            if (colName === '화폐단위') {
                const dom = infoRef?.current?.querySelector('#agencyCode');
                if (dom) {

                    hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, commonManage.changeCurr(dom.value));
                } else {
                    hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, "KRW");
                }
            }
            if (colName === '납품기한') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, moment().format('YYYY-MM-DD'));
            }
            if (colName === 'CURR') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, moment().format('YYYY-MM-DD'));
            }
            if (colName === '회신여부') {
                const contentColIndex = hotRef.current.hotInstance.getColHeader().indexOf("content");
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, '회신');
                if (contentColIndex !== -1) {
                    // ✅ 같은 행의 "content" 셀 값 변경
                    hotRef.current.hotInstance.setDataAtCell(coords.row, contentColIndex, moment().format('YYYY-MM-DD'));
                }
            }

        }
    }

    function afterColumnResize(column, newSize) {
        if (hotRef.current) {

            const totalColumns = hotRef.current.hotInstance.countCols();
            const columnWidths = [];

            for (let col = 0; col < totalColumns; col++) {
                columnWidths.push(hotRef.current.hotInstance.getColWidth(col) || null);
            }

            localStorage.setItem(type, JSON.stringify(columnWidths));
        }
    }

    // 🔹 1. 컬럼 넓이를 `localStorage`에서 불러오기
    const getStoredColumnWidths = () => {
        const storedWidths = localStorage.getItem(type);

        return storedWidths ? JSON.parse(storedWidths) : column["columnWidth"]; // 저장된 값이 없으면 기본값 사용
    };

    const storedColumnWidths = useMemo(() => {
        return getStoredColumnWidths()
    }, [type]);

    const percentRenderer = (instance, td, row, col, prop, value, cellProperties) => {
        if (typeof value === "number") {
            td.innerText = `${value}%`; // 🔥 100 곱하지 않고 그대로 % 붙이기
        } else {
            td.innerText = value || "";
        }
    };


    const iconRenderer = (instance, td, row, col, prop, value, cellProperties) => {
        td.innerHTML = ""; // 기존 내용 초기화
        td.style.position = "relative"; // 셀 내부에서 상대 위치 지정
        td.style.overflow = "visible"; // 아이콘이 잘리지 않도록 설정

        const totalColumns = instance.countRows(); // 전체 컬럼 개수
        if (row === totalColumns - 1) {
            // 🔥 마지막 열이면 아이콘 추가 X
            td.innerText = value || "";
            return td;
        }

        // 🔹 기존 텍스트 추가
        const textNode = document.createElement("span");
        textNode.innerText = value || ""; // 값이 없으면 빈 문자열
        textNode.style.display = "inline-block";
        textNode.style.paddingRight = "20px"; // 아이콘과 텍스트 간격 확보

        // 🔹 아이콘 추가 (ℹ️ - 정보 아이콘)
        const icon: any = document.createElement("span");
        icon.innerHTML = "🔍"; // 텍스트 아이콘
        icon.style.position = "absolute";
        icon.style.opacity = 0.7;
        icon.style.right = "5px"; // 🔥 우측에 고정
        icon.style.top = "50%";
        icon.style.transform = "translateY(-50%)"; // 수직 중앙 정렬
        icon.style.cursor = "pointer";
        icon.style.color = "#007bff"; // 아이콘 색상
        icon.style.fontSize = "14px";

        icon.addEventListener("click", (event) => {
            event.stopPropagation(); // 셀 클릭 이벤트 방지
            rowRef.current = {row: row, col: col, prop: prop, value: value}

            setIsModalOpen(v => {
                if (prop === 'orderDocumentNumberFull') {
                    return {...v, order: true}
                } else if (prop === 'hsCode') {
                    return {...v, hsCode: true}
                } else {
                    return {...v, estimate: true}
                }

            });
        });

        // 🔹 요소 추가
        td.appendChild(textNode);
        td.appendChild(icon);

        return td;
    };


    function getSelectedRows(ref) {
        if (ref.current) {
            const selectedRows = ref.current.getSelectedRows();
            const instance = hotRef.current.hotInstance;
            if (selectedRows.length) {
                const list = selectedRows.map(v => {
                    return {
                        ...v,
                        connectInquiryNo: v.documentNumberFull,
                        currencyUnit: v.currency,
                        spec: v.unit,
                        agencyManagerPhone: v.agencyManagerPhoneNumber
                    }
                })

                const currentList = instance.getSourceData();
                const {row, col} = rowRef.current;

                list.forEach((v, i) => {
                    v['total'] = `=G${row + i + 1}*H${row + i + 1}`
                    v['totalPurchase'] = `=G${row + i}*J${row + i}`
                    currentList[row + i] = v
                })

                const resultlist = calcData(currentList);
                setTableData(resultlist)
            }
        } else {
            console.warn('Grid API is not available.');
            return [];
        }
    }


    function getSelectedRows3(data) {

        const instance = hotRef.current.hotInstance;
        const currentList = instance.getSourceData();
        // console.log(currentList)
        currentList[rowRef.current['row']] = {...currentList[rowRef.current['row']], hsCode: data.hsCode}
        setTableData(currentList)
        // } else {
        //     console.warn('Grid API is not available.');
        //     return [];
        // }
    }

    function getSelectedRows2(ref) {
        if (ref.current) {
            const selectedRows = ref.current.getSelectedRows();
            const instance = hotRef.current.hotInstance;
            if (selectedRows.length) {
                const list = selectedRows.map(v => {
                    return {
                        ...v,
                        orderDocumentNumberFull: v.documentNumberFull,
                        currencyUnit: v.currency,
                        spec: v.unit,
                        agencyManagerPhone: v.agencyManagerPhoneNumber
                    }
                })

                const currentList = instance.getSourceData();
                const {row, col} = rowRef.current;


                list.forEach((v, i) => {
                    v['total'] = `=G${row + i + 1}*H${row + i + 1}`
                    v['totalPurchase'] = `=G${row + i}*J${row + i}`
                    currentList[row + i] = v
                })

                const resultlist = calcData(currentList);
                setTableData(resultlist)
            }
        } else {
            console.warn('Grid API is not available.');
            return [];
        }
    }

    const formatManagerTypes = [
        'domestic_agency_write_column', 'domestic_agency_update_column', 'overseas_agency_write_column', 'overseas_agency_update_column',
        'domestic_customer_write_column', 'domestic_customer_update_column', 'overseas_customer_write_column', 'overseas_customer_update_column'
    ]
    function handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {type: "array"});
            const sheetName = workbook.SheetNames[0]; // 첫 번째 시트 선택
            const sheet = workbook.Sheets[sheetName];

            // 1. 배열 형태로 변환 (첫 번째 행을 헤더로 사용)
            const rawData = XLSX.utils.sheet_to_json(sheet, {header: 1});

            if (rawData.length === 0) {
                console.error("빈 데이터입니다.");
                return;
            }

            // ✅ 날짜 변환이 필요한 컬럼 지정
            const dateColumns = ["requestDeliveryDate", 'replyDate'];

            // ✅ 컬럼 매핑 (엑셀 헤더 → 내부 객체 키값)
            const excelHeaders: any = rawData[0]; // 첫 번째 행 (엑셀의 원래 컬럼명)
            const mappedHeaders = excelHeaders.map(header =>
                Object.keys(column['mapping']).find(key => column['mapping'][key] === header) || header
            );
            // ✅ 데이터를 새로운 키값으로 매핑 & 날짜 변환 적용
            let formattedData = rawData.slice(1).map((row) =>
                mappedHeaders.reduce((obj, key, index) => {
                    let value = row[index] ?? ""; // 값이 없으면 빈 문자열 처리

                    // ✅ 날짜 컬럼이면 변환 적용
                    if (dateColumns.includes(key) && typeof value === "number" && value > 10000) {
                        const date = XLSX.SSF.parse_date_code(value);
                        value = `${date.y}-${String(date.m).padStart(2, "0")}-${String(date.d).padStart(2, "0")}`;
                    }

                    obj[key] = value;
                    return obj;
                }, {})
            );
            // ✅ 최대 100개 데이터만 유지
            formattedData = formattedData.slice(0, 1000);

            const instance = hotRef.current.hotInstance;
            const currentList = instance.getSourceData();

            /**
             * 데이터 관리의 엑셀 업로드를 위해서 분기처리함
             * 데이터 관리 엑셀들은 model, inquiryNo가 없음
             * (사용처: 국내/해외 매입처,고객사 등록, 수정시 managerName으로 filtering)
             */
            let filterList, filterList2;
            if (formatManagerTypes.includes(type)) {
                filterList = currentList.filter(v => !!v?.managerName);
                filterList2 = formattedData.filter(v => !!v?.managerName);
            } else {
                filterList = currentList.filter(v => !!v?.model || v?.connectInquiryNo);
                filterList2 = formattedData.filter(v => !!v?.model || v?.connectInquiryNo);
            }

            const count = filterList.length + filterList2.length

            // ✅ 변환된 데이터를 계산 및 저장
            const resultlist = calcData([...filterList, ...filterList2, ...commonFunc.repeatObject(column['defaultData'], 1000 - count)]);
            setTableData(resultlist);
        };

        reader.readAsArrayBuffer(file);
        event.target.value = "";
    }

    function upload() {
        fileInputRef.current.click();
    }


    const currencyRenderer = (instance, td, row, col, prop, value, cellProperties) => {
        const rowData = instance.getSourceDataAtRow(row);
        const currencyValue = rowData?.currencyUnit || "KRW"; // 기본값 KRW


        // ✅ 포맷 적용할 대상 컬럼인지 확인
        const targetColumns = ["unitPrice", "total", "purchasePrice", "totalPurchase"];

        if (targetColumns.includes(prop)) {
            // 🔥 USD면 소수점 2자리, KRW면 정수로 변환
            const formattedValue =
                currencyValue === "USD" ? parseFloat(value).toFixed(2) : parseInt(value, 10);

            // 🔥 Handsontable의 기본 숫자 렌더러 적용
            Handsontable.renderers.NumericRenderer(instance, td, row, col, prop, formattedValue, cellProperties);
            td.innerText = formattedValue;
        } else {
            // 그 외 컬럼은 기본 렌더러 유지
            Handsontable.renderers.TextRenderer(instance, td, row, col, prop, value, cellProperties);
        }
    };


    const handleBeforePaste = (data, coords) => {
        const hotInstance = hotRef.current.hotInstance;

        coords.forEach(({startCol}) => {
            const columnConfig = hotInstance.getSettings().columns[startCol];

            if (columnConfig?.type === "numeric") {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < data[i].length; j++) {
                        data[i][j] = data[i][j].replace(/,/g, ""); // 쉼표 제거
                    }
                }
            }
        });
    };


    return (
        <div ref={tableContainerRef} className="table-container" style={{width: '100%', overflowX: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'end'}}>
                <input type="file" accept=".xlsx, .xls, .csv" onChange={handleFileUpload} ref={fileInputRef}
                       style={{display: "none"}}/>
                <div style={{display: 'flex', gap: 5, paddingBottom: 0}}>
                    <Button style={{fontSize: 11}} size={'small'} onClick={upload}><UploadOutlined/>업로드</Button>
                    {funcButtons?.map(v => tableButtonList(v, hotRef))}
                </div>
            </div>
            <EstimateListModal isModalOpen={isModalOpen['estimate']} setIsModalOpen={setIsModalOpen}
                               getRows={getSelectedRows}/>
            <OrderListModal isModalOpen={isModalOpen['order']} setIsModalOpen={setIsModalOpen}
                            getRows={getSelectedRows2}/>
            <HsCodeListModal isModalOpen={isModalOpen['hsCode']} setIsModalOpen={setIsModalOpen}
                             getRows={getSelectedRows3}/>
            <HotTable
                style={{
                    border: '1px solid #ebebed',
                    boxShadow: '0px 6px 12px rgba(0, 0, 0, 0.07)'
                }}

                ref={hotRef}
                data={tableData}
                formulas={{
                    engine: HyperFormula,
                }}
                colWidths={storedColumnWidths}
                height={'calc(100% - 25px)'}
                viewportRowRenderingOffset={20}
                // height={500}
                colHeaders={column["column"]}
                fixedRowsBottom={1}
                stretchH="all"
                autoWrapRow={true}
                autoWrapCol={true}
                manualColumnMove={true}
                multiColumnSorting={column["type"] === "read"}
                navigableHeaders={true}
                afterOnCellMouseDown={relatedLink}
                afterGetRowHeader={(row, TH) => {
                    const hotInstance = hotRef.current.hotInstance;
                    const totalRows = hotInstance.countRows();
                    const fixedBottomRows = hotInstance.getSettings().fixedRowsBottom;

                    // 하단 고정 행의 인덱스를 숨김
                    if (row >= totalRows - fixedBottomRows) {
                        TH.innerHTML = "";
                    }

                }}
                afterGetColHeader={(col, TH) => {
                    const headerText = column["column"][col]; // 컬럼 이름 가져오기
                    if (["매출 총액", '매입 총액'].includes(headerText)) {
                        // TH.classList.add("redHeader"); // 🔥 특정 컬럼 제목만 빨간색 적용
                    } else {
                        TH.classList.add("allHeader"); // 🔥 특정 컬럼 제목만 빨간색 적용
                    }
                }}
                rowHeaders={true}
                headerClassName="htLeft"
                manualRowMove={true}
                manualRowResize={true}
                manualColumnResize={true}
                outsideClickDeselects={false}
                // 🔥 특정 컬럼에 스타일 적용 (수정)

                cells={(row, col, prop) => {
                    const totalRowIndex = data.length; // 🔥 마지막 행의 인덱스
                    if (row === totalRowIndex) {
                        return {readOnly: true}; // 🔥 마지막 행은 읽기 전용
                    }

                    if (prop === 'unitPrice' || prop === 'total' || prop === 'net' || prop === 'totalNet') {
                        return {numericFormat: {pattern: '0,0.00'}};
                    }
                }}

                afterColumnResize={afterColumnResize}
                afterChange={afterChange}
                columns={column["columnList"].map(col => {
                    const isDate = col.type === "date";


                    return ({
                        data: col.data,
                        type: col.type,
                        source: col.source,
                        strict: false,
                        allowInvalid: false,
                        allowHtml: true,
                        dateFormat: col.type === "date" ? "YYYY-MM-DD" : undefined,
                        // correctFormat: col.data === "marginRate" ? true : undefined, // 🔥 숫자가 올바른 형식이 아니면 자동 수정
                        numericFormat: col.data === "marginRate" ? {
                            pattern: "0%",
                            suffix: "%"
                        } : (col.data.includes('rice') ? {pattern: '0,00'} : undefined), // 🔥 소수점 둘째 자리 고정 + % 유지
                        renderer: col.data === "marginRate" ? percentRenderer : ((col.data === 'orderDocumentNumberFull' || col.data === 'connectInquiryNo' || col.data === 'hsCode') ? iconRenderer : ((col.data === 'unitPrice') ? currencyRenderer : col.type)), // 🔥 커스텀 렌더러 적용
                        readOnly: col.readOnly,
                        filter: false,
                        datePickerConfig: {
                            position: 'auto', // or 'above', 'below'
                            static: false,
                            appendTo: document.body // 이걸 설정하면 팝업이 body 기준으로 나와서 안 짤림
                        }
                    })
                })}

                beforePaste={handleBeforePaste}
                afterRenderer={afterRenderer} // 🔥 특정 컬럼에 스타일 직접 적용
                licenseKey="non-commercial-and-evaluation"
            />
        </div>
    );
});

export default memo(Table, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});