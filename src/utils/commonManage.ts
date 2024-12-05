import moment from "moment";
import * as XLSX from "xlsx";
import {rfqReadColumns} from "@/utils/columnList";

export const commonManage: any = {}
export const commonFunc: any = {}
export const commonCalc: any = {}

commonManage.getSelectRows = function (gridRef) {
    const selectedNodes = gridRef.current.api.getSelectedNodes(); // gridOptions 대신 gridRef 사용
    const selectedData = selectedNodes.map(node => node.data);
    return selectedData;
}
/**
 * @param file 업로드 파일입니다.
 * @description 업로드한 파일을 json으로 풀어서 컬럼에 맞게 데이터 재출력을 하기위한 함수
 */
commonManage.excelDownload = function (data) {
    const headers = [];
    const fields = [];

    const extractHeaders = (columns) => {
        columns.forEach((col) => {
            if (col.children) {
                extractHeaders(col.children); // 자식 컬럼 재귀적으로 처리
            } else {
                headers.push(col.headerName); // headerName 추출
                fields.push(col.field); // field 추출
            }
        });
    };

    extractHeaders(rfqReadColumns);

    const worksheetData = data.map((row) =>
        fields.map((field) => row[field] || "") // field에 해당하는 데이터 추출
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...worksheetData]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "rfq_list.xlsx");

};

/**
 * @param file 업로드 파일입니다.
 * @description 업로드한 파일을 json으로 풀어서 컬럼에 맞게 데이터 재출력을 하기위한 함수
 */
commonManage.excelFileRead = function (file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const binaryStr = e.target.result;
                const workbook = XLSX.read(binaryStr, {type: 'binary'});

                // 첫 번째 시트 읽기
                const worksheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[worksheetName];

                // 데이터를 JSON 형식으로 변환 (첫 번째 행을 컬럼 키로 사용)
                const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

                // 데이터 첫 번째 행을 컬럼 이름으로 사용
                const headers = jsonData[0];
                const dataRows = jsonData.slice(1);

                const tableData = dataRows
                    .filter((row: any) => row.some((cell) => cell !== null && cell !== undefined && cell !== ''))
                    .map((row: any) => {
                        const rowData = {};
                        row?.forEach((cell, cellIndex) => {
                            const header = commonManage.changeColumn[headers[cellIndex]];
                            rowData[header] = cell ?? ''; // 값이 없으면 기본값으로 빈 문자열 설정
                        });
                        return rowData;
                    });


                // 성공적으로 데이터를 반환
                resolve(tableData);
            } catch (error) {
                // 에러 발생 시 Promise 거부
                reject(error);
            }
        };

        reader.onerror = (error) => {
            // 파일 읽기 에러 처리
            reject(error);
        };

        reader.readAsBinaryString(file);
    });
};

/**
 * @param date date
 * @description datePicker에서 오늘날짜 이전의 날짜들을 제한하기 위한 함수
 */
commonManage.disabledDate = function (date) {
    return date && date < moment().startOf('day');
}


commonManage.calcFloat = function (params, numb) {

    if (params.value == null || params.value === '') {
        return ''; // 값이 없으면 빈 문자열 반환
    }
    return parseFloat(params.value).toFixed(numb); // 소수점 두 자리로 제한
}

commonManage.getUnCheckList = function (api) {

    const uncheckedData = [];
    for (let i = 0; i < api.getDisplayedRowCount(); i++) {
        const rowNode = api.getDisplayedRowAtIndex(i);
        if (!rowNode.isSelected()) {
            uncheckedData.push(rowNode.data);
        }
    }

    return uncheckedData
}

commonManage.onChange = function (e, setInfo) {
    let bowl = {}
    bowl[e.target.id] = e.target.value;
    setInfo(v => {
        return {...v, ...bowl}
    })
}

commonManage.openModal = function (e, setIsModalOpen) {
    let bowl = {};
    bowl[e] = true
    setIsModalOpen(v => {
        return {...v, ...bowl}
    })
}


commonManage.changeColumn = {
    'Model': 'model',
    '수량': 'quantity',
    '단위': 'unit',
    'CURR': 'currency',
    'NET/P': 'net',
    '납기': 'deliveryDate',
    '회신여부': 'content',
    '회신일': 'replyDate',
    '비고': 'remarks',
}
commonManage.changeCurr = function (value) {
    switch (value) {
        case "ATI":
        case "ARC":
        case "ABP":
        case "AUD":
            return 'USD'
        case "GAW":
        case "GMT":
        case "GHY":
            return 'EUR'
        case "JTL":
        case "JEC":
        case "JDE":
        case "JAT":
        case "JSU":
            return 'JPY'
        case "ETF":
            return 'GBP'
        case "ETF":
            return 'GBP'

        case "CZY":
        case "CIN":
            return 'USD'
        case "SOK":
        case "GKN":
            return ''
        case "APF":
            return ''
        case "AHC":
        case "ADS":
            return 'USD'
        case "GDH":
        case "IAD":
        case "GFF":
        case "ART":
        case "GSW":
        case "NZR":
        case "EAM":
        case "SAA":
        case "GSS":
        case "ADO":
        case "GCM":
        case "AMC":
        case "ATT":
            return ''
        case "AKE":
        case "CMA":
        case "ACI":
        case "GFM":
        case "CLE":
        case "CVT":
        case "CHJ":
        case "DAV":
        case "CHM":
        case "MOU":
        case "AEL":
        case "JEJ":
        case "CTT":
        case "KOE":
        case "CSA":
        case "UWC":
        case "AVI":
        case "EFA":
        case "CBB":
        case "CWT":
        case "AHH":
        case "TES":
        case "CNC":
        case "AWM":
        case "GTC":
            return 'USD'
        case "ITI":
        case "GRM":
        case "GPT":
        case "GMK":
        case "AAC":
        case "ALI":
        case "WIN":
            return ''
        case "GGP":
        case "GRA":
            return 'EUR'
        case "AJL":
        case "AIM":
        case "STO":
        case "ACR":
            return 'USD'
        case "FBM":
        case "GMI":
        case "GEG":
        case "IPF":
        case "IMC":
        case "ICS":
            return 'EUR'
        case "AFU":
        case "CCH":
        case "CSE":
        case "CHT":
            return 'USD'
        default :
            return 'KRW'
    }
}


commonFunc.sumCalc = function calculateTotals(rowData) {


    if (!rowData) {
        return false
    }

    const unitPrice = rowData.reduce((sum, row) => sum + (parseFloat(row.unitPrice) || 0), 0);
    const net = rowData.reduce((sum, row) => sum + (parseFloat(row.net) || 0), 0);
    const receivedQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.receivedQuantity) || 0), 0);
    const unreceivedQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.unreceivedQuantity) || 0), 0);


    let amount = 0
    rowData.map((row) => {
        const sum = (parseFloat(row.net) || 0) * (parseFloat(row.quantity) || 0);
        amount += sum;
    });


    const totalPrice = rowData.reduce((sum, row) => {
        const calculatedPrice = (parseFloat(row.unitPrice) || 0) * (parseFloat(row.quantity) || 0);
        return sum + calculatedPrice;
    }, 0);
    const totalQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.quantity) || 0), 0);
    return {
        writtenDate: 'Total',
        amount: totalPrice,
        quantity: totalQuantity,
        receivedQuantity: receivedQuantity,
        unreceivedQuantity: totalQuantity -  receivedQuantity,
        totalAmount: amount,
        unitPrice: unitPrice,
        net: net,
        totalPrice: totalPrice
    };
}

