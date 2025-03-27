import moment from "moment";
import * as XLSX from "xlsx";
import {dateFormat, rfqReadColumns} from "@/utils/columnList";
import message from "antd/lib/message";
import {jsPDF} from "jspdf";
import html2canvas from "html2canvas";
import {getData} from "@/manage/function/api";


export const commonManage: any = {}
export const apiManage: any = {}
export const commonFunc: any = {}
export const tableManage: any = {}
export const gridManage: any = {}
export const fileManage: any = {}


// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================


commonManage.pdfDown = async function (pdfRef=null,pdfSubRef =null,  printMode = false, title) {
    const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: "a4",
        compress: true, // 압축 활성화
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const padding = 30; // 좌우 여백 설정
    const contentWidth = pdfWidth - padding * 2; // 실제 이미지 너비

    let elements = null
    if(!pdfRef){
        return false;
    }

    if(pdfSubRef) {
        elements = Array.from(pdfSubRef.current.children).filter(
            (el: any) => el.offsetHeight > 0 && el.innerHTML.trim() !== ""
        );
    }

    if (pdfRef) {
        const firstCanvas = await html2canvas(pdfRef.current, {scale: 1.5, useCORS: true});
        const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
        const firstImgProps = pdf.getImageProperties(firstImgData);
        const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;
        pdf.addImage(firstImgData, "JPEG", 0, 20, pdfWidth, firstImgHeight);
    }

    if(pdfSubRef) {
        for (let i = 0; i < elements.length; i++) {
            const element: any = elements[i];
            const firstCanvas = await html2canvas(element, {scale: 1.5, useCORS: true});
            const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
            const firstImgProps = pdf.getImageProperties(firstImgData);
            const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;

            pdf.addPage();
            pdf.addImage(firstImgData, "JPEG", 0, 0, pdfWidth, firstImgHeight);
        }
    }
    if (printMode) {
        const pdfBlob = pdf.output("bloburl");
        window.open(pdfBlob, "_blank");
    } else {
        pdf.save(`${title}.pdf`);
    }

}

commonManage.getMemberList = async function () {
    // @ts-ignore
    const v = await getData.post('admin/getAdminList', {
        "searchText": null, // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
        "searchAuthority": null, // 1: 일반, 0: 관리자
        "page": 1,
        "limit": -1
    });
    return v.data.entity.adminList;
}


/**
 * @description info정보를 가지고오는 function
 * @param infoRef 페이지의 input-dom들을 감싸고있는 container dom에 연결된 ref
 * @param obj info 기본정보를 가지고 있는 object가 보통
 */
commonManage.getInfo = function (infoRef, obj) {
    const result = Object.keys(obj).map(v => `#${v}`)
    const test = `${result.join(',')}`;
    const elements = infoRef.current.querySelectorAll(test);

    let bowl = {}
    for (let element of elements) {
        bowl[element.id] = element.value
    }

    return bowl;
}

commonManage.checkValue = function (value) {
    return value ? value : ''
}

/**
 * @description 입력정보를 초기화 하는 기능 function
 * @param infoRef 페이지의 input-dom들을 감싸고있는 container dom에 연결된 ref
 * @param obj input 초기화 할 key : value(초기값) 리스트
 * @param adminId 로그인 user의 managerAdminId 에 해당하는 adminId
 */
commonManage.setInfo = function (infoRef, obj, adminId?) {
    console.log(obj,'obj:')
    const result = Object.keys(obj).map(v => `#${v}`)
    const test = `${result.join(',')}`;


    if (test) {
        const elements = infoRef.current.querySelectorAll(test);

        elements.forEach(element => {

            if (element.id === 'managerAdminId' && !isNaN(adminId)) {
                element.value = parseInt(adminId)
            } else {
                element.value = obj[element.id]
            }
        });
    }
}


/**
 *
 * @param data 대표적으로 tableData 가 될것이다.(or 비슷한 유형의 데이터)
 * @param excludeFields 유효하지않는 값인지 판단할 key-list (한개라도 유효하면 return)
 */
commonManage.filterEmptyObjects = function (data, excludeFields = []) {
    if (data.length === 0) return [];
    return data.slice(0, -1).filter((obj) => {
        const isEmpty = excludeFields.every(field =>
            obj[field] === '' || obj[field] === null || obj[field] === undefined
        );
        return !isEmpty;
    });
};


commonManage.filterEmptyObjects = function (data, excludeFields = []) {
    if (data.length === 0) return [];
    return data.slice(0, -1).filter((obj) => {
        const isEmpty = excludeFields.every(field =>
            obj[field] === '' || obj[field] === null || obj[field] === undefined
        );
        return !isEmpty;
    });
};


/**
 * @description 객체를 원하는만큼 복사하는 로직(주로 테이블 100-Row 맞추는 용도로 사용)
 * @param item 기본 key : value table-data 기본값
 * @param numb 객체를 만들 갯수
 */
commonFunc.repeatObject = function (item, numb) {
    return Array.from({length: numb}, () => ({...item}));
}


// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================
// =========================================================================================


gridManage.getSelectRows = function (gridRef) {
    const selectedNodes = gridRef.current.getSelectedNodes(); // gridOptions 대신 gridRef 사용
    const selectedData = selectedNodes.map(node => node.data);
    return selectedData;
}


gridManage.exportSelectedRowsToExcel = function (hotRef, title) {
    const hot = hotRef.current?.hotInstance;
    const exportPlugin = hot?.getPlugin('exportFile');

    exportPlugin?.downloadFile('csv', {
        bom: true,
        columnDelimiter: ',',
        columnHeaders: true,
        exportHiddenColumns: true,
        exportHiddenRows: true,
        fileExtension: 'csv',
        filename: 'Handsontable-CSV-file_[YYYY]-[MM]-[DD]',
        mimeType: 'text/csv',
        rowDelimiter: '\r\n',
        rowHeaders: true,
    });
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
    gridRef?.current?.forEachNode((node) => {
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

        if (gridRef.current) {
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
                const isEmptyRow = Object.values(row).every(value => value === null || value === undefined || value === '' || value === 0);
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

    if (e.target.id === 'searchDate' || e.target.id === 'searchArrivalDate') {
        if (!e.target.value[0] || !e.target.value[1]) {
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
            addDate['total'] = parseFloat(e.target.value) + Math.round(e.target.value * 0.1)
        }
        console.log(bowl,'bowl:')
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
    '매입 단가': 'net',
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
                if (key.includes('Date') && key !== 'deliveryDate') {
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
            formData.append(`attachmentFileList[${count}].fileName`, fileNames[index]);
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


commonManage.removeInvalid = function (obj) {
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

commonManage.getPdfCreate = async function (pdfRef, pdfSubRef) {
    const pdf = new jsPDF("portrait", "px", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const padding = 30; // 좌우 여백 설정
    const contentWidth = pdfWidth - padding * 2; // 실제 이미지 너비

    // ✅ 높이가 0이 아닌 요소만 필터링
    const elements = Array.from(pdfSubRef.current.children).filter(
        (el: any) => el.offsetHeight > 0 && el.innerHTML.trim() !== ""
    );

    if (pdfRef.current) {
        const firstCanvas = await html2canvas(pdfRef.current, {scale: 1.5, useCORS: true});
        const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
        const firstImgProps = pdf.getImageProperties(firstImgData);
        const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;
        pdf.addImage(firstImgData, "PNG", 0, 20, pdfWidth, firstImgHeight);


    }

    for (let i = 0; i < elements.length; i++) {
        const element: any = elements[i];
        const firstCanvas = await html2canvas(element, {scale: 1.5, useCORS: true});
        const firstImgData = firstCanvas.toDataURL("image/jpeg", 0.7);
        const firstImgProps = pdf.getImageProperties(firstImgData);
        const firstImgHeight = (firstImgProps.height * pdfWidth) / firstImgProps.width;

        pdf.addPage();
        pdf.addImage(firstImgData, "PNG", 0, 0, pdfWidth, firstImgHeight);

    }
    return pdf
}

commonManage.getPdfFile = async function (pdf, documentNumberFull) {
    const pdfBlob = pdf.output("blob");
    console.log(`PDF Blob Size: ${pdfBlob.size} bytes`);
    const fileName = `${documentNumberFull}_견적서.pdf`;
    const pdfFile = new File([pdfBlob], fileName, {type: "application/pdf"});
    return pdfFile;
}

commonManage.splitDataWithSequenceNumber = function (data, firstLimit = 20, nextLimit = 30) {
    const result = [];
    let currentGroup = [];
    let currentCount = 0;
    let currentLimit = firstLimit; // 첫 번째 그룹은 20줄 제한
    let sequenceNumber = 1; // ✅ 전체 데이터에서 순서를 추적하는 시퀀스 넘버

    data?.forEach(item => {
        const model = item.model || '';
        const lineCount = model.split('\n').length;

        // 현재 그룹에 추가해도 제한을 넘지 않으면 추가
        if (currentCount + lineCount <= currentLimit) {
            currentGroup.push({...item, sequenceNumber}); // ✅ 각 객체에 순서 추가
            currentCount += lineCount;
            sequenceNumber++; // ✅ 순서 증가
        } else {
            // 현재 그룹을 result에 추가하고 새로운 그룹 시작
            result.push(currentGroup);
            currentGroup = [{...item, sequenceNumber}]; // ✅ 새로운 그룹의 첫 번째 아이템
            currentCount = lineCount;
            sequenceNumber++; // ✅ 순서 증가

            // ✅ 첫 번째 그룹 이후부터는 기준을 30으로 변경
            currentLimit = nextLimit;
        }
    });

    // 마지막 그룹이 남아있으면 추가
    if (currentGroup.length > 0) {
        result.push(currentGroup);
    }

    return result;
}

