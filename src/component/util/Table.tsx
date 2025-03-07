import 'handsontable/styles/handsontable.css';
import 'handsontable/styles/ht-theme-main.css';
import 'handsontable/styles/ht-theme-horizon.css';
import { registerAllModules } from "handsontable/registry";
import HotTable, { HotColumn } from "@handsontable/react-wrapper";
import { useEffect, useMemo, useRef } from "react";
import moment from "moment";

registerAllModules();

const Table = ({ data = new Array(100).fill({}), column, type = '' }) => {
    const hotRef = useRef(null);

    useEffect(() => {
        if (!hotRef.current?.hotInstance) return;
        hotRef.current.hotInstance.useTheme('ht-theme-main');
        hotRef.current.hotInstance.render();
    }, []);

    // ✅ 초기 데이터 변환 (쉼표 추가 + 숫자 변환)
    const dataList = useMemo(() => {
        if (type !== 'project_write') return data;

        return data.map((v) => ({
            ...v,
            quantity: v?.quantity ? v?.quantity.toLocaleString() : '',
            unitPrice: v?.unitPrice ? v?.unitPrice.toLocaleString() : '',
            purchasePrice: v?.purchasePrice ? v?.purchasePrice.toLocaleString() : '',
            total: !isNaN(v?.quantity * v?.unitPrice) ? (v?.quantity * v?.unitPrice).toLocaleString() : '',
            totalPurchase: !isNaN(v?.quantity * v?.purchasePrice) ? (v?.quantity * v?.purchasePrice).toLocaleString() : '',
        }));
    }, [data]);

    // ✅ 개별 행의 `total`, `totalPurchase` 즉시 업데이트
    const updateRowTotal = (row) => {
        if (!hotRef.current) return;
        const hotInstance = hotRef.current.hotInstance;

        const quantity = parseFloat(hotInstance.getDataAtCell(row, column.columnList.findIndex(c => c.data === "quantity"))?.toString().replace(/,/g, "") || 0);
        const unitPrice = parseFloat(hotInstance.getDataAtCell(row, column.columnList.findIndex(c => c.data === "unitPrice"))?.toString().replace(/,/g, "") || 0);
        const purchasePrice = parseFloat(hotInstance.getDataAtCell(row, column.columnList.findIndex(c => c.data === "purchasePrice"))?.toString().replace(/,/g, "") || 0);

        const total = quantity * unitPrice;
        const totalPurchase = quantity * purchasePrice;

        hotInstance.batch(() => {
            hotInstance.setDataAtCell(row, column.columnList.findIndex(c => c.data === "total"), total.toLocaleString(), "updateSum");
            hotInstance.setDataAtCell(row, column.columnList.findIndex(c => c.data === "totalPurchase"), totalPurchase.toLocaleString(), "updateSum");
        });
    };

    // ✅ 전체 합계를 계산하여 합계 행 업데이트
    const updateTotalSum = () => {
        if (!hotRef.current) return;
        const hotInstance = hotRef.current.hotInstance;
        const lastRow = hotInstance.countRows() - 1; // 마지막 행(합계 행)

        let sum = { quantity: 0, unitPrice: 0, purchasePrice: 0, total: 0, totalPurchase: 0 };

        for (let i = 0; i < lastRow; i++) {
            for (const key in sum) {
                const colIndex = column.columnList.findIndex(c => c.data === key);
                const cellValue = hotInstance.getDataAtCell(i, colIndex);
                const numericValue = cellValue ? parseFloat(cellValue.toString().replace(/,/g, "")) : 0;
                sum[key] += isNaN(numericValue) ? 0 : numericValue;
            }
        }

        hotInstance.batch(() => {
            for (const key in sum) {
                const colIndex = column.columnList.findIndex(c => c.data === key);
                hotInstance.setDataAtCell(lastRow, colIndex, sum[key].toLocaleString(), "updateSum");
            }
        });
    };

    // ✅ afterChange 핸들러 (개별 행 업데이트 + 합계 업데이트)
    let debounceTimer;
    const handleAfterChange = (changes, source) => {
        if (!hotRef.current || source === "loadData" || source === "updateSum") return;

        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            changes?.forEach(([row, prop]) => {
                if (["quantity", "unitPrice", "purchasePrice"].includes(prop)) {
                    updateRowTotal(row); // 개별 행의 `total`, `totalPurchase` 즉시 업데이트
                }
            });
            updateTotalSum(); // 합계 행 업데이트
        }, 100);
    };

    const getCellStyle = (row, col, prop) => {
        if (prop === "total" || prop === 'totalPurchase') {
            return {className: "htRedText"}; // 🔥 total 컬럼에 빨간색 스타일 적용
        }
        if (prop === "unitPrice" || prop === 'purchasePrice' || prop === 'purchasePrice'|| prop === 'quantity') {
            return {className: "priceText"};
        }
    };

    const handleDblClick = (e, coords, TD) => {
        if (!hotRef.current) return;

        const hotInstance = hotRef.current.hotInstance;
        const colIndexUnit = column.columnList.findIndex(c => c.data === "unit");
        const colIndexCurrency = column.columnList.findIndex(c => c.data === "currencyUnit");
        const colIndexRequestDeliveryDate = column.columnList.findIndex(c => c.data === "requestDeliveryDate");

        if (coords.col === colIndexUnit || coords.col === colIndexCurrency || coords.col === colIndexRequestDeliveryDate) {
        }
        const rowData = hotInstance.getSourceDataAtRow(coords.row);


        if(e.target.className === 'colHeader'){
            return false;
        }

        if (coords.col === colIndexUnit && (!rowData?.unit || rowData?.unit === '')) {
            hotInstance?.setDataAtCell(coords.row, coords.col, "ea", "update");
        }

        if (coords.col === colIndexCurrency && (!rowData?.currencyUnit || rowData?.currencyUnit === '')) {
            hotInstance?.setDataAtCell(coords.row, coords.col, "KRW", "update");
        }

        if (coords.col === colIndexRequestDeliveryDate && (!rowData?.requestDeliveryDate || rowData?.requestDeliveryDate === '')) {
            hotInstance?.setDataAtCell(coords.row, coords.col, moment().format('YYYY-MM-DD'), "update");
        }

    };




    return (
        <HotTable
            ref={hotRef}
            data={dataList}
            height={400}
            stretchH="all"
            colWidths={[160, 220, 220, 200, 80, 80, 60, 120, 120, 120, 120, 90, 60, 160, 130, 130, 180, 160, 120, 180]}

            colHeaders={column['column']}
            columns={column['columnList']}
            contextMenu={[
                'copy',
                '---------',
                'row_above',
                'row_below',
                'remove_row',
                '---------',
                'alignment',
                'make_read_only',
                'clear_column',
            ]} // ✅ `"undo"`, `"redo"` 제거하여 우클릭 메뉴에서 안 보이도록 설정
            afterChange={handleAfterChange}
            hiddenColumns={{ indicators: true }}
            fixedRowsBottom={1} // ✅ 마지막 행(합계) 고정
            manualColumnMove={true}
            // multiColumnSorting={true}
            undo={null}
            navigableHeaders={true}
            afterOnCellMouseDown={handleDblClick}
            rowHeaders={true}
            headerClassName="htLeft"
            manualRowMove={true}
            autoWrapRow={true}
            autoWrapCol={true}
            manualRowResize={true}
            manualColumnResize={true}

            cells={(row, col, prop) => getCellStyle(row, col, prop)}
            licenseKey="non-commercial-and-evaluation"
        >
            {column['columnList'].map(v => (
                <HotColumn key={v.data} data={v.data} type={v.type} readOnly={v.readOnly} source={v.source}
                           strict={false} allowInvalid={false} filter={false}
                           dateFormat={v.type === "date" ? "YYYY-MM-DD" : undefined}
                           numericFormat={v.data === "marginRate" ? { pattern: "0.00%", suffix: "%" } : undefined}
                           correctFormat={v.type === "date" ? true : undefined} />
            ))}
        </HotTable>
    );
};

export default Table;