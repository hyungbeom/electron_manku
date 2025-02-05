import moment from "moment";
import * as XLSX from "xlsx";
import {dateFormat, rfqReadColumns} from "@/utils/columnList";
import message from "antd/lib/message";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";

export const commonManage: any = {}
export const apiManage: any = {}
export const commonFunc: any = {}
export const commonCalc: any = {}
export const gridManage: any = {}
export const fileManage: any = {}


gridManage.getSelectRows = function (gridRef) {
    const selectedNodes = gridRef.current.getSelectedNodes(); // gridOptions 대신 gridRef 사용
    const selectedData = selectedNodes.map(node => node.data);
    return selectedData;
}

gridManage.exportSelectedRowsToExcel = function (gridRef, title) {
    if (gridRef.current) {
        // 체크된 행 데이터 가져오기
        const selectedRows = gridRef.current.getSelectedRows();

        if (selectedRows.length === 0) {
            message.error('선택된 행이 없습니다.');
            return;
        }

        // 컬럼 정의와 필드 정보 가져오기
        const columns = gridRef.current.getAllDisplayedColumns();
        const headers = columns.map((col) => col.getColDef().headerName); // 컬럼 헤더
        const fields = columns.map((col) => col.getColDef().field); // 컬럼 필드
        // 데이터와 컬럼 순서를 매핑하여 정리
        const worksheetData = [
            headers, // 헤더 추가
            ...selectedRows.map((row) =>
                fields.map((field) => row[field] || '') // 필드 순서에 맞는 데이터 매핑
            ),
        ];


        // Excel 워크시트 생성
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

        // 컬럼 너비 설정
        const columnWidths = columns.map((col) => {
            const width = col.getActualWidth(); // Ag-Grid의 실제 너비
            return {wpx: width}; // 너비를 픽셀 단위로 설정
        });
        worksheet['!cols'] = columnWidths;

        // 워크북 생성 및 다운로드
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, title);
        XLSX.writeFile(workbook, `${title}.xlsx`);

    } else {
        console.warn('GridRef or API is not available.');
    }
};

gridManage.getFieldValue = function (gridRef, field) {
    if (gridRef.current) {
        const selectedRows = gridRef.current.getSelectedRows();
        const fieldValues = selectedRows.map((row) => row[field]).filter(Boolean); // 필드 값이 존재하는 경우만 필터링
        return fieldValues;
    } else {
        return [];
    }
};

gridManage.getFieldDeleteList = function (gridRef, fieldMappings) {
    if (gridRef.current) {
        const selectedRows = gridRef.current.getSelectedRows();

        // fieldMappings으로 원하는 필드 조합 생성
        const fieldValues = selectedRows.map((row: any) => {
            const mappedObject = {};
            for (const [key, field] of Object.entries(fieldMappings)) {
                // @ts-ignore
                if (row[field] !== undefined) {
                    // @ts-ignore
                    mappedObject[key] = parseFloat(row[field]);
                }
            }
            return mappedObject;
        }).filter((obj) => Object.keys(obj).length > 0); // 필드 값이 존재하는 경우만 필터링

        return fieldValues;
    } else {
        return [];
    }
};

gridManage.deleteAll = function (gridRef) {
    // 모든 데이터 제거
    const allData = [];
    gridRef.current.forEachNode((node) => {
        allData.push(node.data);
    });

    gridRef.current.applyTransaction({remove: allData});
};

gridManage.newData = function (gridRef, data) {
    gridRef.current.applyTransaction({add: data});
};

gridManage.resetData = function (gridRef, data) {

    this.deleteAll(gridRef);
    this.newData(gridRef, data);
};

// ================================================================/

gridManage.getColumnsSums = function (gridRef, keyPairs) {
    if (gridRef.current) {
        const gridApi = gridRef.current; // API 가져오기
        const results = {}; // 결과를 저장할 객체

        // 모든 keyPairs를 순회하며 합산 작업 수행
        keyPairs.forEach(({key1, key2, name}) => {
            let totalSum = 0;

            gridApi.forEachNode(node => {
                if (node.data) {
                    const value1 = parseFloat(node.data[key1]) || 0;
                    const value2 = key2 ? parseFloat(node.data[key2]) || 0 : 1; // key2가 없으면 1로 처리
                    totalSum += value1 * value2;
                }
            });

            // 결과를 객체에 저장
            results[name] = parseFloat(totalSum.toFixed(2)); // 소수점 2자리로 제한
        });

        return results;
    } else {
        console.warn('GridRef or API is not available');
        return keyPairs.reduce((acc, {name}) => {
            acc[name] = 0; // 모든 결과를 0으로 초기화
            return acc;
        }, {});
    }
};


gridManage.getAllData = function (gridRef) {
    if (gridRef.current) {
        const allData = [];
        const nodesToRemove = [];

        // 모든 노드를 순회
        gridRef.current.forEachNode((node) => {
            // 데이터를 수정하여 null을 0으로 변환
            const row = {...node.data};
            Object.keys(row).forEach((key) => {

                if (row[key] === null || row[key] === undefined) {
                    if (key === 'net' || key === 'unitPrice') {
                        row[key] = 0;
                    }
                    if (key === 'currency') {
                        row[key] = '';
                    }
                }
            });

            // 행이 빈 행인지 확인
            const isEmptyRow = Object.values(row).every(value => value === null || value === undefined || value === '' ||  value === 0);
            if (isEmptyRow) {
                nodesToRemove.push(node); // 빈 행은 삭제 대상으로 추가
            } else {
                allData.push(row); // 유효한 행만 배열에 추가
            }
        });

        // 빈 행 제거
        if (nodesToRemove.length > 0) {
            gridRef.current.applyTransaction({remove: nodesToRemove.map(node => node.data)});
        }

        return allData; // 빈 행이 제거된 데이터를 반환
    }
}


gridManage.uploadExcelData = function (data, list) {
// 데이터 변환 로직
    const transformedData = data.map(obj => {
        const newObj = {};
        Object.keys(list).forEach(key => {
            if (obj[key] !== undefined) {
                newObj[list[key]] = obj[key];
            }
        });
        return newObj;
    });
    return transformedData
}

gridManage.updateAllFields = function (gridRef, fieldName, newValue) {
    if (gridRef.current) {
        gridRef.current.forEachNode((node) => {
            // 특정 필드의 값을 변경
            node.setDataValue(fieldName, newValue);
        });
    }
};


// ===============================================


apiManage.generateCodeVerifier = function () {
    const array = new Uint32Array(56 / 2);
    window.crypto.getRandomValues(array);
    return Array.from(array, dec => ('0' + dec.toString(16)).substr(-2)).join('');
}


apiManage.generateCodeChallenge = async function (codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    // @ts-ignore
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}


// ===============================================


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

commonManage.getUnCheckList = function (gridRef) {

    const uncheckedData = [];
    for (let i = 0; i < gridRef.current.getDisplayedRowCount(); i++) {
        const rowNode = gridRef.current.getDisplayedRowAtIndex(i);
        if (!rowNode.isSelected()) {
            uncheckedData.push(rowNode.data);
        }
    }

    return uncheckedData
}

commonManage.getCheckList = function (gridRef) {

    const checkedData = [];
    for (let i = 0; i < gridRef.current.getDisplayedRowCount(); i++) {
        const rowNode = gridRef.current.getDisplayedRowAtIndex(i);
        if (rowNode.isSelected()) {
            checkedData.push(rowNode.data);
        }
    }
    return checkedData
}


commonManage.onChange = function (e, setInfo) {
    if (e.target.id === 'documentNumberFull') {
        commonFunc.unValidateInput('documentNumberFull')
    }

    if(e.target.id === 'searchDate' ||e.target.id === 'searchArrivalDate'){
        if(!e.target.value[0] || !e.target.value[1]){
            e.target.value = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        }
    }
    let bowl = {}
    bowl[e.target.id] = e.target.value;
    setInfo(v => {
        let addDate = {}
        if (e.target.id === 'searchDate') {
            addDate['searchStartDate'] = e.target.value[0];
            addDate['searchEndDate'] = e.target.value[1];
        }
        if (e.target.id === 'searchArrivalDate') {
            addDate['searchStartArrivalDate'] = e.target.value[0];
            addDate['searchEndArrivalDate'] = e.target.value[1];
        }
        if (e.target.id === 'supplyAmount') {
            addDate['surtax'] = Math.round(e.target.value * 0.1)
            addDate['total'] = e.target.value + Math.round(e.target.value * 0.1)
        }
        return {...v, ...bowl, ...addDate}
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

commonFunc.repeatObject = function (item, numb) {
    return Array.from({length: numb}, () => ({...item}));
}
commonFunc.validateInput = function (id) {
    const inputElement = document.getElementById(id);
    if (inputElement) {
        inputElement.style.border = "1px solid red"; // 빨간색 테두리
        inputElement.style.boxShadow = "none"; // 그림자 제거
        inputElement.focus();
    }
}
commonFunc.unValidateInput = function (id) {
    const inputElement = document.getElementById(id);
    if (inputElement) {
        inputElement.style.border = ""; // 빨간색 테두리
        inputElement.style.boxShadow = ""; // 그림자 제거
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
        unreceivedQuantity: totalQuantity - receivedQuantity,
        totalAmount: amount,
        unitPrice: unitPrice,
        net: net,
        totalPrice: totalPrice
    };
}


// ====================================================================================

commonManage.commonCalc = function (info) {
    const iterableObj = {
        ...info,
        [Symbol.iterator]: function* () {
            for (const [key, value] of Object.entries(this)) {
                yield {key, value};
            }
        },
    };

    return iterableObj
}


// ----------------------------------------------------------------------------------------

commonManage.setInfoFormData = function (info, formData, listType, list?) {
    for (const {key, value} of commonManage.commonCalc(info)) {
        if (key !== listType) {
            if (key === 'dueDate') {
                formData.append(key, moment(value).format('YYYY-MM-DD'));
            } else {
                formData.append(key, value);
            }
        }
    }
    this.setInfoDetailFormData(formData, listType, list)
}
commonManage.setInfoDetailFormData = function (formData, listType, list?) {

    list.forEach((detail, index) => {
        Object.keys(detail).forEach((key) => {
            if (!(key == 'orderDate' || key === 'orderProcessing' || key === 'order')) {
                if (key.includes('Date')&& key !== 'deliveryDate') {
                    formData.append(`${listType}[${index}].${key}`, moment(detail[key]).isValid() ? dateFormat(detail[key]) : '');
                } else {
                    formData.append(`${listType}[${index}].${key}`, detail[key]);
                }
            }
        });
        formData.delete(`${listType}[${index}].serialNumber`);
    });
}


commonManage.getUploadList = function (fileRef, formData) {
    const uploadContainer = document.querySelector(".ant-upload-list"); // 업로드 리스트 컨테이너
    const fileNodes = uploadContainer.querySelectorAll(".ant-upload-list-item-name");
    const fileNames = Array.from(fileNodes).map((node: any) => node.textContent.trim());

    let count = 0
    fileRef.current.fileList.forEach((item, index) => {
        if (item?.originFileObj) {
            formData.append(`attachmentFileList[${count}].attachmentFile`, item.originFileObj);
            formData.append(`attachmentFileList[${count}].fileName`, fileNames[index].replace(/\s+/g, ""));
            count += 1;
        }
    });

    return count
}

commonManage.deleteUploadList = function (fileRef, formData, originFileList) {

    //기존 기준 사라진 파일
    const result = originFileList?.filter(itemA => !fileRef.current.fileList.some(itemB => itemA.id === itemB.id));

    result.map((v, idx) => {
        formData.append(`deleteAttachmentIdList[${idx}]`, v.id);
    })
}


fileManage.getFormatFiles = function (list) {
    return list?.map((v) => ({
        ...v,
        uid: v.uid || Math.random().toString(36).substr(2, 9), // 고유 UID 생성
        name: v.fileName,
        status: "done",
    }))

}


commonManage.removeInvalid = function(obj){
    // 객체의 모든 키를 순회
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            // 값이 객체이면 재귀 호출
            if (typeof obj[key] === "object" && obj[key] !== null) {
                this.removeInvalid(obj[key]);
            }
            // 값이 "Invalid date"이면 빈 문자열로 변경
            if (obj[key] === "Invalid date") {
                obj[key] = "";
            }
        }
    }
    return obj;
}

commonManage.getPdfCreate = async function(pdfRef){
    const element = pdfRef.current;

    // HTML 캡처 후 PDF 생성
    const canvas = await html2canvas(element, { scale: 1, useCORS: true });
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF("portrait", "px", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    
    return pdf
}

commonManage.getPdfFile = async function(pdf, documentNumberFull){
    const pdfBlob = pdf.output("blob");
    console.log(`PDF Blob Size: ${pdfBlob.size} bytes`);
    const fileName = `${documentNumberFull}_견적서.pdf`;
    const pdfFile = new File([pdfBlob], fileName, { type: "application/pdf" });
    return pdfFile;
}