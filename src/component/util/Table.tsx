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

const currencyRenderer = (instance, td, row, col, prop, value, cellProperties) => {
    if (typeof value === 'number') {
        if (prop === "marginRate") {
            td.textContent = (value * 100).toFixed(2) + "%"; // 🔥 marginRate 값을 자동 변환 (0.00%)
        } else {
            td.textContent = value.toLocaleString(); // 쉼표 포함된 숫자로 변환
        }
    } else {
        td.textContent = value || ''; // 값이 없으면 빈 문자열 처리
    }
};

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
    const [tableHeight, setTableHeight] = useState(400); // 기본값 설정

    const updateTableHeight = () => {
        if (tableContainerRef.current) {
            const parentHeight = tableContainerRef.current.clientHeight;
            setTableHeight(parentHeight - 10); // 🔥 부모 높이에서 약간 여유 공간 확보
        }
    };

    useEffect(() => {
        updateTableHeight(); // 최초 실행 시 테이블 크기 설정
        window.addEventListener("resize", updateTableHeight); // 창 크기 변경 감지

        return () => {
            window.removeEventListener("resize", updateTableHeight); // 이벤트 해제
        };
    }, []);


    const tableData = useMemo(() => {
        function reorderObjectsArray(dataArray: Record<string, any>[], keyOrder: string[]) {
            return dataArray.map(data => {
                return keyOrder.reduce((acc, key) => {
                    acc[key] = data[key] !== undefined ? data[key] : ""; // 키가 없으면 빈 문자열
                    return acc;
                }, {} as Record<string, any>);
            });
        }
        const reorderedDataArray = reorderObjectsArray(data, Object.keys(column['defaultData']));

        let calcData: any = reorderedDataArray.map(column['excelExpert']);

        calcData.push(column['totalList'])

        return calcData
    }, [data])

    useEffect(() => {
        if (!hotRef.current?.hotInstance) return;
        hotRef.current.hotInstance.useTheme('ht-theme-main');
        hotRef.current.hotInstance.render();

    }, []);


    const afterRenderer = (td, row, col, prop, value) => {
        if (["unitPrice", "total", "totalPurchase", "purchasePrice"].includes(prop)) {
            td.style.textAlign = "right"; // 우측 정렬

            if (["total", "totalPurchase"].includes(prop)) {
                if (value === 0 || isNaN(value)) {
                    td.textContent = ""; // 🔥 0 또는 NaN이면 빈 문자열 적용
                } else {
                    td.textContent = value?.toLocaleString(); // 🔢 숫자는 쉼표 추가
                }
                td.style.color = "#ff4d4f"; // 🔴 원하는 컬럼에 직접 스타일 적용
                td.style.fontWeight = "bold"; // 텍스트 굵게
            }

        }
    };

    const handleBeforeChange = (changes) => {
        if (!hotRef.current) return;

        changes.forEach(([row, prop, oldValue, newValue]) => {
            if (prop === "marginRate" && newValue !== null && newValue !== undefined) {
                let numericValue = parseFloat(newValue);
                if (!isNaN(numericValue)) {
                    changes[0][3] = numericValue / 100; // 🔥 사용자가 `5` 입력 시 `0.05`로 변환
                }
            }
        });
    };


    return (
        <div ref={tableContainerRef} className="table-container">
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


                colHeaders={column["column"]}
                fixedRowsBottom={1}
                stretchH="all"
                height={tableHeight}
                autoWrapRow={true}
                autoWrapCol={true}
                beforeChange={handleBeforeChange} // 🔥 사용자 입력값 변환
                manualColumnMove={false}
                multiColumnSorting={column["type"] === "read"}
                navigableHeaders={true}
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
                    if (["Model", "Item", "Maker"].includes(headerText)) {
                        TH.classList.add("redHeader"); // 🔥 특정 컬럼 제목만 빨간색 적용
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
                columns={column["columnList"].map(col => {
                    return ({
                        data: col.data,
                        type: col.type,
                        source: col.source,
                        strict: false,
                        allowInvalid: false,
                        allowHtml: true,
                        dateFormat: col.type === "date" ? "YYYY-MM-DD" : undefined,
                        correctFormat: col.data === "marginRate" ? true : undefined, // 🔥 숫자가 올바른 형식이 아니면 자동 수정
                        numericFormat: col.data === "marginRate" ? {pattern: "0.00%", suffix: "%"} : undefined, // 🔥 소수점 둘째 자리 고정 + % 유지
                        renderer: col.data.includes("Price") || col.data.includes("total") ? currencyRenderer : undefined,
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