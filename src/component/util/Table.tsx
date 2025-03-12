import {HyperFormula} from 'hyperformula';
import {HotTable} from '@handsontable/react-wrapper';
import {registerAllModules} from 'handsontable/registry';
import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import Handsontable from "handsontable";
import renderers = Handsontable.renderers;
import moment from "moment/moment";
import {tableButtonList} from "@/utils/commonForm";
import {projectInfo} from "@/utils/column/ProjectInfo";

// register Handsontable's modules
registerAllModules();


const Table = forwardRef(({data = new Array(100).fill({}), column, type = '', funcButtons}: any, ref) => {

    const hotRef = useRef(null)

    useImperativeHandle(ref, () => ({
        hotInstance: hotRef.current?.hotInstance, // Handsontable 인스턴스 접근
        getData: () => hotRef.current?.hotInstance?.getData(), // 현재 테이블 데이터 가져오기
        getSourceData: () => hotRef.current?.hotInstance?.getSourceData(), // 현재 테이블 데이터 가져오기
        setData: (newData) => hotRef.current?.hotInstance?.loadData(newData), // 테이블 데이터 업데이트
        forceRender: () => hotRef.current?.hotInstance?.render(), // 강제 렌더링
    }));


    const tableContainerRef = useRef(null);


    const tableData = useMemo(() => {
        const keyOrder = Object.keys(column['defaultData']);
        return data
            .map((item) => keyOrder.reduce((acc, key) => ({...acc, [key]: item[key] ?? ""}), {}))
            .map(column['excelExpert'])
            .concat(column['totalList']); // `push` 대신 `concat` 사용
    }, [data, column]);

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
                if (row === 100) {

                }

                td.style.fontWeight = "bold"; // 텍스트 굵게
            }


        }
    };


    function afterChange(changes, source) {
        if (source === "edit") {
            changes.forEach(([row, prop, oldValue, newValue]) => {
                if (prop === "content" && newValue === "회신") {

                    hotRef.current.hotInstance.suspendExecution(); // ⚠️ 자동 계산 방지
                    hotRef.current.hotInstance.setDataAtCell(row, 8, moment().format('YYYY-MM-DD')); // replyDate 컬럼 업데이트
                    hotRef.current.hotInstance.resumeExecution(); // ✅ 다시 계산 시작

                }
            });
        }
    }

    function relatedLink(event, coords) {
        if (event.ctrlKey) { // ✅ Ctrl 키가 눌렸는지 확인
            const colIndex = coords.col;
            const colName = hotRef.current.hotInstance.getColHeader(colIndex);
            const cellValue = hotRef.current.hotInstance.getDataAtCell(coords.row, coords.col); // ✅ 데이터 가져오기

            console.log(cellValue, 'cellValue：')
            console.log(colName, 'colName：')
            if (colName === "관련링크") { // ✅ 특정 컬럼인지 확인

                if (typeof cellValue === "string" && cellValue.startsWith("http")) {
                    window.open(cellValue, "_blank"); // ✅ 새 탭에서 URL 열기
                }
            }
            if (colName === '단위') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, "ea");
            }
            if (colName === '화폐단위') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, "KRW");
            }
            if (colName === '납품기한') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, moment().format('YYYY-MM-DD'));
            }
            if (colName === 'CURR') {
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, moment().format('YYYY-MM-DD'));
            }
            if (colName === '회신여부') {
                const  contentColIndex = hotRef.current.hotInstance.getColHeader().indexOf("content");
                hotRef.current.hotInstance.setDataAtCell(coords.row, coords.col, '회신');
                if (contentColIndex !== -1) {
                    // ✅ 같은 행의 "content" 셀 값 변경
                    hotRef.current.hotInstance.setDataAtCell(coords.row, contentColIndex, moment().format('YYYY-MM-DD'));
                }
            }

        }
    }

    return (
        <div ref={tableContainerRef} className="table-container" style={{width: '100%', overflowX: 'auto'}}>
            <div style={{display: 'flex', justifyContent: 'end'}}>

                <div style={{display: 'flex', gap: 5, paddingBottom: 0}}>
                    {funcButtons?.map(v => tableButtonList(v, hotRef))}
                </div>
            </div>
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
                colWidths={column['columnWidth']}
                height={'calc(100% - 25px)'}

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
                }}


                afterChange={afterChange}
                columns={column["columnList"].map(col => {
                    return ({
                        data: col.data,
                        type: col.type,
                        source: col.source,
                        strict: false,
                        allowInvalid: false,
                        allowHtml: true,
                        dateFormat: col.type === "date" ? "YYYY-MM-DD" : undefined,
                        // correctFormat: col.data === "marginRate" ? true : undefined, // 🔥 숫자가 올바른 형식이 아니면 자동 수정
                        numericFormat: col.data === "marginRate" ? {pattern: "0%", suffix: "%"} : undefined, // 🔥 소수점 둘째 자리 고정 + % 유지
                        readOnly: col.readOnly,
                    })
                })}
                afterRenderer={afterRenderer} // 🔥 특정 컬럼에 스타일 직접 적용
                licenseKey="non-commercial-and-evaluation"
            />
        </div>
    );
});

export default memo(Table);