import moment from "moment";
import {commonManage} from "@/utils/commonManage";
import message from "antd/lib/message";


let lastClickedRowNode = null; // ✅ 마지막으로 클릭된 row 추적


function handleCellClick(params) {
    const clickedNode = params.node;

    // 이전에 클릭된 row 높이를 복귀
    if (lastClickedRowNode && lastClickedRowNode !== clickedNode) {
        lastClickedRowNode.setRowHeight(25); // ✅ 기본 높이로 복귀
        params.api.onRowHeightChanged(); // ✅ 높이 변경 반영
    }

    // 현재 클릭된 row 높이를 확장
    const rowContent = params.data[params.colDef.field] || '';
    const lines = rowContent.split('\n').length; // 줄바꿈 기준으로 줄 수 계산
    const newHeight = Math.max(40, lines * 20); // 줄 수에 따라 높이 조정

    clickedNode.setRowHeight(newHeight); // ✅ 새로운 높이 적용
    params.api.onRowHeightChanged(); // ✅ 높이 변경 반영

    // 현재 row를 마지막 클릭된 row로 추적
    lastClickedRowNode = clickedNode;
}

function handleCellMouseOut(params) {
    // 현재 row가 아닌 경우, 기본 높이로 복귀
    if (lastClickedRowNode && lastClickedRowNode !== params.node) {
        lastClickedRowNode.setRowHeight(40); // ✅ 기본 높이로 복귀
        params.api.onRowHeightChanged(); // ✅ 높이 변경 반영
        lastClickedRowNode = null; // 추적 초기화
    }
}


class CustomTextEditor {
    init(params: any) {
        // @ts-ignore
        this.params = params;
        // @ts-ignore
        this.defaultRowHeight = 40; // ✅ 한 줄 높이
        // @ts-ignore
        this.eInput = document.createElement('textarea');
        // @ts-ignore
        this.eInput.style.width = '100%';
        // @ts-ignore
        this.eInput.style.minHeight = `${this.defaultRowHeight}px`; // ✅ 기본 높이 설정
        // @ts-ignore
        this.eInput.style.height = 'auto';
        // @ts-ignore
        this.eInput.style.overflow = 'hidden'; // ✅ 내부 스크롤 방지
        // @ts-ignore
        this.eInput.style.whiteSpace = 'pre-wrap'; // ✅ 줄바꿈 유지
        // @ts-ignore
        this.eInput.style.resize = 'none'; // ✅ 사용자가 크기 조절 못하도록
        // @ts-ignore
        this.eInput.value = params.value || '';

        // ✅ Shift + Enter 줄바꿈 추가
        // @ts-ignore
        this.eInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                if (event.shiftKey) {
                    event.preventDefault();
                    // @ts-ignore
                    this.eInput.value += "\n"; // 줄바꿈 추가
                    this.adjustHeight();
                } else {
                    event.preventDefault();
                    this.completeEditingAndMoveNext();
                }
            }
        });

        // 입력할 때마다 높이 조정 + row 높이 동기화
        // @ts-ignore
        this.eInput.addEventListener("input", () => {
            this.adjustHeight();
        });

        // ✅ Focus Out (편집 종료) 시 원래 row 높이로 강제 복귀
        // @ts-ignore
        this.eInput.addEventListener("blur", () => {
            this.resetRowHeight();
        });

        // 초기 높이 조정
        setTimeout(() => this.adjustHeight(), 0);
    }

    getGui() {
        // @ts-ignore
        return this.eInput;
    }

    getValue() {
        // @ts-ignore
        return this.eInput.value;
    }

    // ✅ 높이 자동 조정 + row 높이 동기화
    adjustHeight() {
        // @ts-ignore
        this.eInput.style.height = 'auto'; // 초기화 후 높이 재계산
        // @ts-ignore
        this.eInput.style.height = Math.max(this.eInput.scrollHeight, this.defaultRowHeight) + 'px'; // 최소 row 높이 유지

        // ✅ ag-Grid row 높이 동기화
        // @ts-ignore
        if (this.params && this.params.api) {
            // @ts-ignore
            this.params.node.setRowHeight(this.eInput.scrollHeight + 10); // 추가 여유값 적용
            // @ts-ignore
            this.params.api.onRowHeightChanged(); // 높이 변경 이벤트 호출
        }
    }

    // ✅ Focus Out 시 row 높이를 기본값(한 줄)으로 강제 복귀
    resetRowHeight() {
        // @ts-ignore
        if (this.params && this.params.api) {
            // @ts-ignore
            this.eInput.style.height = `${this.defaultRowHeight}px`;
            // @ts-ignore
            this.eInput.style.whiteSpace = 'nowrap'; // ✅ 한 줄로 설정
            // @ts-ignore
            this.eInput.style.overflow = 'hidden';
            // @ts-ignore
            this.eInput.style.textOverflow = 'ellipsis';
            // @ts-ignore
            this.params.node.setRowHeight(this.defaultRowHeight);
            // @ts-ignore
            this.params.api.onRowHeightChanged();
            // @ts-ignore
            this.params.api.redrawRows({rowNodes: [this.params.node]});

            setTimeout(() => {
                // @ts-ignore
                this.params.api.onRowHeightChanged();
                // @ts-ignore
                this.params.api.redrawRows({rowNodes: [this.params.node]});
            }, 50);
        }
    }

    // ✅ Enter 키 입력 시 편집 종료 후 다음 필드로 이동
    completeEditingAndMoveNext() {
        // @ts-ignore
        if (this.params && this.params.api) {
            // @ts-ignore
            this.params.api.stopEditing(); // 현재 편집 종료
            setTimeout(() => {
                // @ts-ignore
                this.params.api.tabToNextCell(); // 다음 필드로 이동
            }, 0);
        }
    }
}


const makeAbsoluteUrl = (url) => {
    if (!/^https?:\/\//i.test(url)) {
        return `https://${url}`;
    }
    return url;
};

export const dateFormat = (params) => {
    return moment(params.value).format('YYYY-MM-DD')
};

export const numberFormat = (params) => {
    return Math.floor(params.value).toLocaleString();
};

export const amountFormat = (params) => {
    if (params === null || params === undefined) {
        return "";
    }
    // 숫자를 3자리마다 쉼표로 포맷
    return params?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

export const amountFormatParser = (params) => {
    // 쉼표 제거 후 숫자로 변환하여 저장
    const parsedValue = parseFloat(params.newValue.replace(/,/g, ""));
    return isNaN(parsedValue) ? params.oldValue : parsedValue;
}
export const columnPlaceHolder = (params, placeHolder, suffix) => {

    return params.value ? (
        <div><span>{params.value}</span> <span>{suffix}</span></div>
    ) : (
        <span style={{color: 'lightGray'}} className="ag-cell-placeholder">{placeHolder}</span>
    );

}


export const searchCustomerColumn = [

    {
        headerName: '상호명',
        field: 'customerName',
        key: 'customerName',

    },
    {
        headerName: '담당자',
        field: 'managerName',
        key: 'managerName',

    },
    {
        headerName: '연락처',
        field: 'directTel',
        key: 'directTel',

    },
    {
        headerName: '팩스/이메일',
        field: 'faxNumber',
        key: 'faxNumber',

    }
];
export const searchAgencyCodeColumn = [
    {
        headerName: '구분',
        field: 'agencyType',
        key: 'agencyType',

    },
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',

    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',

    },
    {
        headerName: '담당자',
        field: 'managerName',
        key: 'managerName',

    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
        key: 'phoneNumber',
    },


];

export const searchMakerColumn = [
    {
        headerName: 'Maker',
        field: 'makerName',
        minWidth: 180,
        editable: true,
    },
    {
        headerName: 'Item',
        field: 'item',
        editable: true,
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        editable: true,
    },
    {
        headerName: 'AREA',
        field: 'area',
        editable: true,
    },
    {
        headerName: '원산지',
        field: 'origin',
        editable: true,
    },
    {
        headerName: '담당자확인', //없음
        field: 'managerConfirm',
        editable: true,
    },
    {
        headerName: '한국대리점',
        field: 'koreanAgency',
        editable: true,
    },
    {
        headerName: '직접확인',
        field: 'directConfirm',
        editable: true,
    },
    {
        headerName: 'FTA_No.',
        field: 'ftaNumber', // 없음
        editable: true,
    },
    {
        headerName: '지시사항',
        field: 'instructions',
        editable: true,
    },
    {
        headerName: '작성자',
        field: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
        ,
    },
];


export const makerColumn = [
    {
        headerName: "", // 컬럼 제목
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: 'Maker',
        field: 'makerName',
        key: 'makerName',
        pinned: "left", // 왼쪽에 고정
        maxWidth: 150,
        render: (text) => <div style={{width: 80}} className="ellipsis-cell">{text}</div>,

    },
    {
        headerName: 'Item',
        field: 'item',
        key: 'item',
        render: (text) => <div style={{width: 80}} className="ellipsis-cell">{text}</div>,

    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
        render: (text) => <a rel="noopener noreferrer" href={makeAbsoluteUrl(text)}>
            <div style={{width: 100}} className="ellipsis-cell">{text}</div>
        </a>,

    },
    {
        headerName: 'AREA',
        field: 'area',
        key: 'area',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: '원산지',
        field: 'origin',
        key: 'origin',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: '담당자확인', //없음
        field: 'managerConfirm',
        key: 'managerConfirm',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 70}}>{text}</div>
    },
    {
        headerName: '한국대리점',
        field: 'koreanAgency',
        key: 'koreanAgency',
        render: (text) => <div className="ellipsis-cell" style={{width: 100}}>{text}</div>
    },
    {
        headerName: '직접확인',
        field: 'directConfirm',
        key: 'directConfirm',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: 'FTA_No.',
        field: 'ftaNumber', // 없음
        key: 'ftaNumber',
        align: 'center',
        render: (text) => <div className="ellipsis-cell" style={{width: 50}}>{text}</div>
    },
    {
        headerName: '지시사항',
        field: 'instructions',
        key: 'instructions',
        render: (text) => <div className="ellipsis-cell">{text}</div>
    },
];

export const subRfqWriteColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: 'Model',
        field: 'model',
        minWidth: 300,
        cellEditor: CustomTextEditor, // ✅ 커스텀 에디터 적용
        wrapText: true,
        autoHeight: true,
        cellStyle: {
            "white-space": "nowrap",  // ✅ 한 줄로 유지
            "overflow": "hidden",      // ✅ 넘치는 부분 숨김
            "text-overflow": "ellipsis" // ✅ 생략(...) 처리
        },
        editable: true,
        tooltipField: "model", // ✅ 마우스를 올리면 전체 텍스트 표시 가능
    },
    {
        headerName: '수량',
        field: 'quantity',
        editable: true,
        maxWidth: 50,
        cellEditor: 'agNumberCellEditor',
        valueFormatter: numberFormat,
        cellRenderer: (e) => e.value ? e.value : ''
    },
    {
        headerName: '단위',
        field: 'unit',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW','USD', 'EUR', 'JPY', 'GBP','직접입력'],
        }
    },
    {
        headerName: '매입 단가',
        field: 'net',
        cellEditor: 'agNumberCellEditor',
        editable: true,
        valueFormatter: params => params.data.net ?? 0,
        // cellRenderer: (e)=> e.value ? e.value : '',
        // valueGetter: (e)=> e.value ? e.value : 0,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '납기',
        field: 'deliveryDate',
        editable: true,
        cellEditor: "agNumberCellEditor",
        valueSetter: (params) => {

            if (params.newValue > 100) {
                return message.warn('100주 이하로 설정이 가능합니다.')
            }
            params.data.deliveryDate = params.newValue
            return true
        },
        valueParser: (params) => {
            return params.newValue == null || params.newValue === "" ? 0 : params.newValue;
        },
        cellRenderer: (e) => columnPlaceHolder(e, 'week', '주')
    },
    {
        headerName: '회신여부',
        field: 'content',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['미회신', '회신', '정보부족', '한국대리점', 'MOQ', 'OEM', '단종', '견적포기', '입찰마감', '견적불가', '기타'],
        }

    },
    {
        headerName: '회신일',
        field: 'replyDate',
        editable: true,
        cellEditor: 'agDateCellEditor',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        },
        valueGetter: (params) => {
            return params.data.replyDate
        },
    },
    {
        headerName: '비고',
        field: 'remarks',
        editable: true,
    }
];

export const tableOrderWriteColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellEditor: CustomTextEditor, // ✅ 커스텀 에디터 적용
        wrapText: true,
        autoHeight: true,
        cellStyle: {
            "white-space": "nowrap",  // ✅ 한 줄로 유지
            "overflow": "hidden",      // ✅ 넘치는 부분 숨김
            "text-overflow": "ellipsis" // ✅ 생략(...) 처리
        },
        editable: true,
        tooltipField: "model", // ✅ 마우스를 올리면 전체 텍스트 표시 가능
    },

    {
        headerName: '단위',
        field: 'unit',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        },
    },
    {
        headerName: 'CURR',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: '매입 단가',
        field: 'net',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 2),
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '매입 총액',
        field: 'totalAmount',
        editable: true,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, net} = params.data;
            return Math.floor(quantity * net).toLocaleString();
        }
    },
    {
        headerName: '주문',
        field: 'quantity',
        editable: true,
        valueFormatter: numberFormat,
    },
    {
        headerName: '입고',
        field: 'receivedQuantity',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 0),
    },
    {
        headerName: '미 입고',
        field: 'unreceivedQuantity',
        valueFormatter: (params) => {
            const {quantity, receivedQuantity} = params.data;
            return !isNaN(quantity - receivedQuantity) ? quantity - receivedQuantity : ''
        }
    },
    {
        headerName: '매출 단가',
        field: 'unitPrice',
        editable: true,
        valueFormatter: numberFormat,

    },
    {
        headerName: '매출 총액',
        field: 'totalPrice',
        editable: true,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, unitPrice} = params.data;
            return Math.floor(quantity * unitPrice).toLocaleString();
        }
    }, {
        headerName: 'HS-CODE',
        field: 'hsCode',
        editable: true,

    }
];


export const estimateTotalColumns = [
    {
        headerName: '작성일자',
        field: 'writtenDate',
        key: 'writtenDate',
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        key: 'documentNumberFull',

    }, {
        headerName: '대리점코드',
        field: 'agencyCode',
        key: 'agencyCode',

    }, {
        headerName: '고객사명',
        field: 'customerName',
        key: 'customerName',
    },
    {
        headerName: 'Maker',
        field: 'maker',
        key: 'maker',
        minWidth: 180,
    },
    {
        headerName: 'Item',
        field: 'item',
        key: 'item',
    },
    {
        headerName: 'Model',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
    },
    {
        headerName: '단위',
        field: 'unit',
        key: 'unit',
    },
    {
        headerName: 'CURR',
        field: 'currency',
        key: 'currency',
    },
    {
        headerName: '매입 단가',
        field: 'net',
        key: 'net',
    },
    {
        headerName: '금액',
        field: 'amount',
        key: 'amount',
    },
    {
        headerName: '화폐단위',
        field: 'priceUnit',
        key: 'priceUnit',
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
    },
    {
        headerName: '작성자',
        field: 'createdBy',
        key: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
    }
];
export const tableEstimateReadColumns = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "left"}, // 스타일 설정
        maxWidth: 50, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {

        headerName: '작성일자',
        field: 'writtenDate',
        maxWidth: 80, // 컬럼 너비
        pinned: 'left'
    },
    {
        // headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        // checkboxSelection: true, // 각 행에 체크박스 추가
        headerName: 'Inquiry No.',
        field: 'documentNumberFull',
        pinned: 'left',
        maxWidth: 100, // 컬럼 너비
        cellRenderer: (params) => {
            const rowIndex = params.node.rowIndex;
            const currentData = params.value;
            const previousData = params.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.documentNumberFull;

            // 이전 값과 같다면 빈 문자열 반환
            if (rowIndex > 0 && currentData === previousData) {
                return '';
            }
            return currentData; // 첫 번째 값만 출력
        },

    },
    // {
    //     headerName: '매입처',
    //     field: 'agencyName',
    //     maxWidth: 100,
    // },
    {
        headerName: '고객사명',
        field: 'customerName',
        maxWidth: 100,
    },
    {
        headerName: '고객사담당자',
        field: 'managerName',
        maxWidth: 80,
    },
    {
        headerName: '담당자',
        field: 'managerAdminName',
        maxWidth: 80,
    },
    {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellStyle: {
            "white-space": "pre-wrap", // ✅ 줄바꿈 유지
            "overflow": "hidden",     // ✅ 넘치는 부분 숨김
        },
        onCellClicked: handleCellClick, // ✅ 셀 클릭 시 처리
        onCellMouseOut: handleCellMouseOut, // ✅ 셀 밖으로 이동 시 처리
    }, {
        headerName: 'Maker',
        field: 'maker',
        minWidth: 200
    },
    {
        headerName: 'Item',
        field: 'item',
        minWidth: 200
    },
    {
        headerName: '수량',
        field: 'quantity',
        maxWidth: 60,
        cellDataType: 'number',
        valueFormatter: numberFormat,
    },
    {
        headerName: '단위',
        field: 'unit',
        maxWidth: 60,
    },

    {
        headerName: '주문여부',
        field: 'order',
        maxWidth: 80,
        cellDataType: 'text',
        initialValue: '미주문'
    },
    {
        headerName: '매출 단가',
        field: 'net',
        minWidth: 70,
        cellDataType: 'number',
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '매출 총액',
        field: 'amount',
        minWidth: 70,
        cellDataType: 'number',
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, net} = params.data;
            const quantitys = !isNaN(quantity) ? quantity : 0
            const copyQuantity = !isNaN(net) ? net : 0
            console.log(copyQuantity,'copyQuantity：：')
            // console.log(quantity, receivedQuantity,'quantity, receivedQuantity:')
            return (quantitys * copyQuantity).toLocaleString()
        },
        cellStyle: {textAlign: 'right'}
    },    {
        headerName: '납기',
        field: 'delivery',
        minWidth: 70,
        cellStyle: {textAlign: 'right'}
    },
    // {
    //     headerName: 'Amount',
    //     field: 'totalAmount',
    //     editable: true,
    //     valueFormatter: (params) => {
    //         if (params.node.rowPinned) {
    //             // 고정 행 (푸터)에서는 원래 값을 그대로 반환
    //             return params.value !== undefined ? params.value.toLocaleString() : '0';
    //         }
    //         const {quantity, unitPrice} = params.data;
    //         return Math.floor(quantity * unitPrice).toLocaleString();
    //     },
    //     cellStyle: {textAlign: 'right'}
    // },
];

export const tableEstimateWriteColumns = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellEditor: CustomTextEditor, // ✅ 커스텀 에디터 적용
        wrapText: true,
        autoHeight: true,
        cellStyle: {
            "white-space": "nowrap",  // ✅ 한 줄로 유지
            "overflow": "hidden",      // ✅ 넘치는 부분 숨김
            "text-overflow": "ellipsis" // ✅ 생략(...) 처리
        },
        editable: true,
        tooltipField: "model", // ✅ 마우스를 올리면 전체 텍스트 표시 가능
    },
    {
        headerName: '수량',
        field: 'quantity',
        editable: true,
        maxWidth: 50, // 컬럼 너비
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '단위',
        field: 'unit',
        maxWidth: 50, // 컬럼 너비
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        },
        filter : null,

        editable: true,
    },
    {
        headerName: '매출 단가',
        field: 'unitPrice',
        editable: true,
        filter : null,

        valueFormatter: params => !isNaN(params?.value) ? params?.value?.toLocaleString() : 0,
        cellStyle: {textAlign: 'right'}
    },

    {
        headerName: '매출 총액',
        field: 'amount',
        width: 120,
        // editable: true,
        filter : null,

        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, unitPrice} = params.data;
            return (!quantity || !unitPrice) ? null : Math.floor(quantity * unitPrice).toLocaleString();
        },
        cellStyle: {textAlign: 'right'}
    }, {
        headerName: '마진율',
        field: 'marginRate',
        maxWidth: 80,
        filter : null,

        editable: true,
    },
    {
        headerName: 'CURR',
        field: 'currency',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        filter : null,
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: '매입 단가',
        field: 'net',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 2),
        cellStyle: {textAlign: 'right'}
    }
];


export const rfqReadColumns = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스

        maxWidth: 55, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false,
        cellStyle: (params) => {

            if (!!params.data.isRead) {
                return {color: 'blue', textAlign: "center"}; // 값이 100 이상이면 초록색
            } else {
                return {textAlign: "center"}; // 값이 100 미만이면 빨간색
            }
        }
    },
    {
        headerName: '작성일자',
        field: 'writtenDate',
        maxWidth: 80, // 컬럼 너비
        pinned: 'left'
    },

    {

        headerName: 'Inquiry No.',
        field: 'documentNumberFull',
        maxWidth: 100, // 컬럼 너비
        pinned: 'left',

        // rowDrag: true
        cellRenderer: (params) => {
            const rowIndex = params.node.rowIndex;
            const currentData = params.value;
            const previousData = params.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.documentNumberFull;

            // 이전 값과 같다면 빈 문자열 반환
            if (rowIndex > 0 && currentData === previousData) {
                return '';
            }
            return currentData; // 첫 번째 값만 출력
        },
    },
    {
        headerName: '매입처명',
        field: 'agencyName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 100,
        maxWidth: 120,
        // cellStyle: { backgroundColor: "#f4e7d5" }
    },
    {
        headerName: '담당자',
        field: 'managerName',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
        minWidth: 100,
        maxWidth: 120,
    },

    {
        headerName: 'Maker',
        field: 'maker',
        minWidth: 200,
    },
    {
        headerName: 'Item',
        field: 'item',
        minWidth: 200,
    },
    {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellStyle: {
            "white-space": "pre-wrap", // ✅ 줄바꿈 유지
            "overflow": "hidden",     // ✅ 넘치는 부분 숨김
        },
        onCellClicked: handleCellClick, // ✅ 셀 클릭 시 처리
        onCellMouseOut: handleCellMouseOut, // ✅ 셀 밖으로 이동 시 처리
    },
    {
        headerName: '수량',
        field: 'quantity',
        minWidth: 60,
        maxWidth: 120,
        valueFormatter: numberFormat,
    },
    {
        headerName: '단위',
        field: 'unit',
        minWidth: 60,
        maxWidth: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currencyUnit',
        minWidth: 60,
        maxWidth: 120,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: '매입 단가',
        field: 'unitPrice',
        minWidth: 60,
        maxWidth: 120,
        valueFormatter: params => !isNaN(params?.value) ? params?.value?.toLocaleString() : 0,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '납기',
        field: 'deliveryDate',
        minWidth: 100,
        maxWidth: 120,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: {
            min: '2023-01-01',
            max: '2028-12-31',
        }
    },

    {
        headerName: '회신여부',
        field: 'content',
        minWidth: 120,
        maxWidth: 120,
        // cellStyle: { backgroundColor: "#f4e7d5" }
    },


    {
        headerName: '발송',
        field: 'sentStatus',
        minWidth: 60,
        maxWidth: 120
    },

    {
        headerName: '작성자',
        field: 'createdBy',
        minWidth: 60,
        maxWidth: 120,
    },
    {
        headerName: '회신일',
        field: 'replyDate',
        minWidth: 100,
        maxWidth: 120,
        cellEditor: 'agDateCellEditor',
        cellEditorParams: {
            min: '2023-01-01',
            max: '2028-12-31',
        }
    },
    {
        headerName: 'End User',
        field: 'endUser',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '비고',
        field: 'remarks',
        minWidth: 100,
        maxWidth: 120,
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        minWidth: 100,
        maxWidth: 120,
        valueFormatter: (params) => moment(params.value).format('YYYY-MM-DD')
    },

    {
        headerName: '지시사항',
        field: 'instructions',
        minWidth: 180,
        maxWidth: 120,
    }


];


export const tableOrderReadColumns = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {
        headerName: '작성일자',
        field: 'writtenDate',
        maxWidth: 80,
        pinned: 'left'
    },
    {
        headerName: 'Inquiry No.',
        field: 'documentNumberFull',
        maxWidth: 100,
        pinned: 'left',
        valueGetter: (params) => {
            const currentRowIndex = params.node.rowIndex;
            const currentValue = params.data.documentNumberFull;
            const previousRowNode = params.api.getDisplayedRowAtIndex(currentRowIndex - 1);

            // 이전 행의 데이터가 없거나 값이 다르면 현재 값을 유지
            if (!previousRowNode || previousRowNode.data.documentNumberFull !== currentValue) {
                return currentValue;
            }
            // 중복되면 null 반환
            return null;
        },
        cellRenderer: (params) => {
            // valueGetter에서 null로 설정된 값은 빈칸으로 표시
            return params.value !== null ? params.value : '';
        },
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 100,
    },
    {
        headerName: 'Maker',
        field: 'maker',
        align: 'center',
        minWidth: 200,
    },
    {
        headerName: 'Item',
        field: 'item',
        align: 'center',
        minWidth: 200,

    },
    {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellStyle: {
            "white-space": "pre-wrap", // ✅ 줄바꿈 유지
            "overflow": "hidden",     // ✅ 넘치는 부분 숨김
        },
        onCellClicked: handleCellClick, // ✅ 셀 클릭 시 처리
        onCellMouseOut: handleCellMouseOut, // ✅ 셀 밖으로 이동 시 처리
    },
    {
        headerName: '단위',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        align: 'center',
        minWidth: 50,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: '매입 단가',
        field: 'net',
        align: 'center',
        minWidth: 40,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '수량',
        field: 'quantity',
        key: 'quantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '입고',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, receivedQuantity} = params.data;
            return params.value !== undefined ? params.value.toLocaleString() : '0';
            // return !isNaN(quantity - receivedQuantity) ? (quantity - receivedQuantity).toLocaleString('en-US') : null

        },
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '미 입고',
        field: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, receivedQuantity} = params.data;
            const quantitys = !isNaN(quantity) ? quantity : 0
            const copyQuantity = !isNaN(receivedQuantity) ? receivedQuantity : 0
            console.log(copyQuantity,'copyQuantity：：')
            // console.log(quantity, receivedQuantity,'quantity, receivedQuantity:')
            return quantitys - copyQuantity
        },
        cellStyle: {textAlign: 'right'}
        // valueFormatter: (params) => {
        //     if (params.node.rowPinned) {
        //         // 고정 행 (푸터)에서는 원래 값을 그대로 반환
        //         return params.value !== undefined ? params.value.toLocaleString() : '0';
        //     }
        //     const {quantity, receivedQuantity} = params.data;
        //     return !isNaN(quantity - receivedQuantity) ? quantity - receivedQuantity : null
        // }
    },
    {
        headerName: '매출 단가',
        field: 'unitPrice',
        key: 'unitPrice',
        align: 'center',
        minWidth: 50,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '매출 총액',
        field: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
        minWidth: 60,
        valueFormatter: (params) => {
            const {quantity, unitPrice} = params.data;
            return Math.floor(quantity * unitPrice).toLocaleString();
        },
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '예상납기',
        field: 'delivery',
        key: 'delivery',
        align: 'center',
        minWidth: 80,
    },
    {
        headerName: '견적서담당자',
        field: 'estimateManager',
        key: 'estimateManager',
        align: 'center',
        minWidth: 70,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        align: 'center',
        minWidth: 100,
    },
];

export const subTableOrderReadColumns = [

    {
        headerName: '작성일자',
        field: 'writtenDate',
        maxWidth: 80,
        pinned: 'left'
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        maxWidth: 100,
        pinned: 'left',
        valueGetter: (params) => {
            const currentRowIndex = params.node.rowIndex;
            const currentValue = params.data.documentNumberFull;
            const previousRowNode = params.api.getDisplayedRowAtIndex(currentRowIndex - 1);

            // 이전 행의 데이터가 없거나 값이 다르면 현재 값을 유지
            if (!previousRowNode || previousRowNode.data.documentNumberFull !== currentValue) {
                return currentValue;
            }
            // 중복되면 null 반환
            return null;
        },
        cellRenderer: (params) => {
            // valueGetter에서 null로 설정된 값은 빈칸으로 표시
            return params.value !== null ? params.value : '';
        },
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 100,
    },
    {
        headerName: 'Maker',
        field: 'maker',
        align: 'center',
        minWidth: 200,
    },
    {
        headerName: 'Item',
        field: 'item',
        align: 'center',
        minWidth: 200,

    },
    {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellStyle: {
            "white-space": "pre-wrap", // ✅ 줄바꿈 유지
            "overflow": "hidden",     // ✅ 넘치는 부분 숨김
        },
        onCellClicked: handleCellClick, // ✅ 셀 클릭 시 처리
        onCellMouseOut: handleCellMouseOut, // ✅ 셀 밖으로 이동 시 처리
    },
    {
        headerName: '단위',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        }
    },
    {
        headerName: 'CURR',
        field: 'currency',
        align: 'center',
        minWidth: 50,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    },
    {
        headerName: '매입 단가',
        field: 'net',
        align: 'center',
        minWidth: 40,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '주문수량',
        field: 'quantity',
        key: 'quantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '입고수량',
        field: 'receivedQuantity',
        key: 'receivedQuantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '미입고수량',
        field: 'unreceivedQuantity',
        key: 'unreceivedQuantity',
        align: 'center',
        minWidth: 70,
        valueFormatter: (params) => {
            if (params.node.rowPinned) {
                // 고정 행 (푸터)에서는 원래 값을 그대로 반환
                return params.value !== undefined ? params.value.toLocaleString() : '0';
            }
            const {quantity, receivedQuantity} = params.data;
            return !isNaN(quantity - receivedQuantity) ? (quantity - receivedQuantity).toLocaleString('en-US') : null
        },
        cellStyle: {textAlign: 'right'}
        // valueFormatter: (params) => {
        //     if (params.node.rowPinned) {
        //         // 고정 행 (푸터)에서는 원래 값을 그대로 반환
        //         return params.value !== undefined ? params.value.toLocaleString() : '0';
        //     }
        //     const {quantity, receivedQuantity} = params.data;
        //     return !isNaN(quantity - receivedQuantity) ? quantity - receivedQuantity : null
        // }
    },
    {
        headerName: '단가',
        field: 'unitPrice',
        key: 'unitPrice',
        align: 'center',
        minWidth: 50,
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '금액',
        field: 'totalPrice',
        key: 'totalPrice',
        align: 'center',
        minWidth: 60,
        valueFormatter: (params) => {
            const {quantity, unitPrice} = params.data;
            return Math.floor(quantity * unitPrice).toLocaleString();
        },
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '예상납기',
        field: 'delivery',
        key: 'delivery',
        align: 'center',
        minWidth: 80,
    },
    {
        headerName: '견적서담당자',
        field: 'estimateManager',
        key: 'estimateManager',
        align: 'center',
        minWidth: 70,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        align: 'center',
        minWidth: 100,
    },
];


export const subSecTableOrderReadColumns = [

    {
        headerName: '작성일자',
        field: 'writtenDate',
        maxWidth: 80,
        pinned: 'left'
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        maxWidth: 100,
        pinned: 'left',
        valueGetter: (params) => {
            const currentRowIndex = params.node.rowIndex;
            const currentValue = params.data.documentNumberFull;
            const previousRowNode = params.api.getDisplayedRowAtIndex(currentRowIndex - 1);

            // 이전 행의 데이터가 없거나 값이 다르면 현재 값을 유지
            if (!previousRowNode || previousRowNode.data.documentNumberFull !== currentValue) {
                return currentValue;
            }
            // 중복되면 null 반환
            return null;
        },
        cellRenderer: (params) => {
            // valueGetter에서 null로 설정된 값은 빈칸으로 표시
            return params.value !== null ? params.value : '';
        },
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 100,
    },
    {
        headerName: 'Maker',
        field: 'maker',
        align: 'center',
        minWidth: 200,
    },
    {
        headerName: 'Item',
        field: 'item',
        align: 'center',
        minWidth: 200,

    },
    {
        headerName: '예상납기',
        field: 'delivery',
        key: 'delivery',
        align: 'center',
        minWidth: 80,
    },
    {
        headerName: '견적서담당자',
        field: 'estimateManager',
        key: 'estimateManager',
        align: 'center',
        minWidth: 70,
    },
    {
        headerName: '비고란',
        field: 'remarks',
        key: 'remarks',
        align: 'center',
        minWidth: 100,
    },
];


export const remittanceDomesticColumns = [

    {
        headerName: '운송사',
        field: 'customerName',
        width: 70,
        pinned: 'left',
    },
    {
        headerName: '문서번호',
        field: 'documentNumberFull',
        width: 80,
        pinned: 'left',
    },
    {
        headerName: '고객사코드',
        field: 'writtenDate',
        width: 70,
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '발주일',
        field: 'writtenDate',
        width: 120,
    },
    {
        headerName: '송금일',
        field: 'writtenDate',
        width: 120,
    },
    {
        headerName: '송금액',
        field: 'writtenDate',
        width: 70,
    },
    {
        headerName: '화폐단위',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'set', 'm', 'feet', 'roll', 'box', 'g', 'kg', 'Pack', 'Inch', 'MOQ'],
        },
    },
    {
        headerName: '환율',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '원화',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '수수료',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '부가세',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '관세',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '운임비',
        field: 'customerName',
        minWidth: 70,
    },
    {
        headerName: '비용 합계',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: 'VAT 포함',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '지불수단',
        field: 'unit',
        align: 'center',
        minWidth: 60,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['현금', '신용',],
        },
    },
    {
        headerName: '판매금액',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '영업이익',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: 'VAT 포함',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '입고일',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '출고일',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '계산서발행일',
        field: 'customerName',
        minWidth: 120,
    },
    {
        headerName: '결제여부',
        field: 'unit',
        align: 'center',
        minWidth: 70,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['미결제', '부분결제', '결제완료'],
        },
    },
    {
        headerName: '선수금',
        field: 'customerName',
        minWidth: 80,
    },
    {
        headerName: '무게',
        field: 'customerName',
        minWidth: 70,
    },
];


export const tableOrderInventory = [
    {
        headerName: 'Maker',
        field: 'maker',
        key: 'maker',
    },
    {
        headerName: 'Model',
        field: 'model',
        key: 'model',
    },
    {
        headerName: '잔량',
        field: 'remainingQuantity',
        key: 'remainingQuantity',
    },
    {
        headerName: '출고',
        field: 'shippedQuantity',
        key: 'shippedQuantity',
    },
    {
        headerName: '합계',
        field: 'totalQuantity',
        key: 'totalQuantity',
    },
    {
        headerName: '위치',
        field: 'location',
        key: 'location',
    },

];


export const tableOrderCustomerColumns = [
    {
        headerName: 'No',
        field: 'key',
        key: 'key',
    },
    {
        headerName: '고객사명',
        field: 'customerName',
        key: 'customerName',
    },
    {
        headerName: '미입고금액',
        field: 'unpaidAmount',
        key: 'unpaidAmount',
    },
    {
        headerName: '입고금액',
        field: 'paidAmount',
        key: 'paidAmount',
    },
    {
        headerName: '합계',
        field: 'totalAmount',
        key: 'totalAmount',
    },
];


export const subAgencyReadColumns = [
    {
        headerName: 'No',
        field: 'key',
        key: 'key',
    },
    {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
    },
    {
        headerName: '매입처명',
        field: 'agencyName',
        key: 'agencyName',
    },
    {
        headerName: '미입고외화',
        field: 'pendingForeignAmount',
        key: 'pendingForeignAmount',
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '입고외화',
        field: 'receivedForeignAmount',
        key: 'receivedForeignAmount',
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '외화합계',
        field: 'totalForeignAmount',
        key: 'totalForeignAmount',
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
    {
        headerName: '원화합계',
        field: 'totalAmountInKrw',
        key: 'totalAmountInKrw',
        valueFormatter: numberFormat,
        cellStyle: {textAlign: 'right'}
    },
];


export const tableCodeDomesticAgencyWriteColumns = [
    {
        headerName: '담당자',
        field: 'managerName',
        key: 'managerName',
        editable: true,
    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
        key: 'phoneNumber',
        editable: true,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        editable: true,
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        editable: true,
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        editable: true,
    },
    {
        headerName: '국가대리점',
        field: 'countryAgency',
        key: 'countryAgency',
        editable: true,
    },
    {
        headerName: '휴대폰',
        field: 'mobilePhone',
        key: 'mobilePhone',
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        editable: true,
    },
]


export const tableCodeDomesticPurchaseColumns = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        maxWidth: 70,
        pinned: "left",
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
    }, {
        headerName: 'Item',
        field: 'item',
        key: 'item',
    },
    {
        headerName: 'Maker',
        field: 'maker',
        key: 'maker',
        minWidth: 180,
    },
    {
        headerName: '딜러구분',
        field: 'dealerType',
        key: 'dealerType',
    },
    {
        headerName: '등급',
        field: 'grade',
        key: 'grade',
    },
    {
        headerName: '마진',
        field: 'margin',
        key: 'margin',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
    },
    {
        headerName: '사업자번호',
        field: 'businessRegistrationNumber',
        key: 'businessRegistrationNumber',
    },
    {
        headerName: '계좌번호',
        field: 'bankAccountNumber',
        key: 'bankAccountNumber',
    },
    {
        headerName: '작성자',
        field: 'createdBy',
        key: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }

    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    },
];

export const tableCodeOverseasPurchaseColumns = [
    {
        headerName: "", // 컬럼 제목
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        headerName: '코드',
        field: 'agencyCode',
        key: 'agencyCode',
        maxWidth: 80, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
    },
    {
        headerName: '상호',
        field: 'agencyName',
        key: 'agencyName',
        pinned: "left", // 왼쪽에 고정
    },
    {
        headerName: '딜러구분',
        field: 'dealerType',
        key: 'dealerType',
    },
    {
        headerName: '등급',
        field: 'grade',
        key: 'grade',
    },
    {
        headerName: '마진',
        field: 'margin',
        key: 'margin',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
    },
    {
        headerName: 'Item',
        field: 'item',
        key: 'item',
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
        key: 'tradeStartDate',
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '담당자',
        field: 'manager',
        key: 'manager',
    },
    {
        headerName: '계좌번호',
        field: 'bankAccountNumber',
        key: 'bankAccountNumber',
    },
    {
        headerName: '국가',
        field: 'country',
        key: 'country',
    },
    {
        headerName: 'FTANo',
        field: 'ftaNumber',
        key: 'ftaNumber',
    },
    {
        headerName: '송금중개은행',
        field: 'intermediaryBank',
        key: 'intermediaryBank',
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
    },
    {
        headerName: 'IBanCode',
        field: 'ibanCode',
        key: 'ibanCode',
    },
    {
        headerName: 'SwiftCode',
        field: 'swiftCode',
        key: 'swiftCode',
    },
    {
        headerName: '작성자',
        field: 'createdBy',
        key: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        key: 'createdDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
        key: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        key: 'modifiedDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    }
];


export const tableCodeOverseasAgencyWriteColumns = [

    {
        headerName: "", // 컬럼 제목
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {
        headerName: '담당자',
        field: 'customerManager',
        key: 'customerManager',
        editable: true,

        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
        key: 'phoneNumber',
        editable: true,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
        editable: true,
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
        editable: true,
    },
    {
        headerName: '주소',
        field: 'address',
        key: 'address',
        editable: true,
    },
    {
        headerName: '국가대리점',
        field: 'countryAgency',
        key: 'countryAgency',
        editable: true,
    },
    {
        headerName: '휴대폰',
        field: 'mobilePhone',
        key: 'mobilePhone',
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
        editable: true,
    },
]

export const tableCodeDomesticSalesColumns = [
    {
        headerName: "", // 컬럼 제목
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {
        headerName: '코드',
        field: 'customerCode',
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        pinned: "left", // 왼쪽에 고정
        maxWidth: 55
    },
    {
        headerName: '상호',
        field: 'customerName',
        pinned: "left", // 왼쪽에 고정
        maxWidth: 120
    },
    {
        headerName: '지역',
        field: 'customerRegion',

    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
    },
    {
        headerName: '연락처',
        field: 'customerTel',

    },
    {
        headerName: '팩스번호',
        field: 'customerFax',

    },
    {
        headerName: '홈페이지',
        field: 'homepage',

    },
    {
        headerName: '우편번호',
        field: 'zipCode',

    },
    {
        headerName: '주소',
        field: 'address',

    },
    {
        headerName: '사업자번호',
        field: 'businessRegistrationNumber',

    },
    {
        headerName: '고객사',
        field: 'customerType',

    },

    {
        headerName: '비고',
        field: 'remarks',

    },
    {
        headerName: '만쿠담당자',
        field: 'mankuTradeManager',
    },
    {
        headerName: '업체확인사항',
        field: 'companyVerify',
    },
    {
        headerName: '화물운송료',
        field: 'freightCharge',

    },

    {
        headerName: '화물지점',
        field: 'freightBranch',

    },
    {
        headerName: '결제방법',
        field: 'paymentMethod',

    },
    {
        headerName: '업체형태',
        field: 'companyType',

    },
    {
        headerName: '작성자',
        field: 'createdBy',

    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }

    },
    {
        headerName: '수정자',
        field: 'modifiedBy',
    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    },
];


export const tableCodeDomesticWriteColumn = [
    {
        headerName: '담당자',
        field: 'managerName',
        editable: true,
    },
    {
        headerName: '연락처',
        field: 'directTel',
        editable: true,
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        editable: true,
    },
    {
        headerName: '휴대폰번호',
        field: 'mobileNumber',
        editable: true,
    },
    {
        headerName: '이메일',
        field: 'email',
        editable: true,
    },
    {
        headerName: '비고',
        field: 'remarks',
        editable: true,
    },
]


export const tableCodeOverseasSalesColumns = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {
        headerName: '코드',
        field: 'customerCode',
    },
    {
        headerName: '상호',
        field: 'customerName',
    },
    {
        headerName: '지역',
        field: 'customerRegion',
    },
    {
        headerName: '거래시작일',
        field: 'tradeStartDate',
    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
    },
    {
        headerName: '주소',
        field: 'address',
    },
    {
        headerName: '고객사',
        field: 'customerName',
    },
    {

        headerName: '홈페이지',
        field: 'homepage',
    },
    {

        headerName: '비고란',
        field: 'remarks',
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
    },
    {
        headerName: '만쿠담당자',
        field: 'mankuTradeManager',
    },
    {
        headerName: '고객사담당자',
        field: 'manager',
    },
    {
        headerName: 'FTANo',
        field: 'ftaNumber',
    },
    {
        headerName: '작성자',
        field: 'createdBy',
    },
    {
        headerName: '등록일자',
        field: 'createdDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    },
    {
        headerName: '수정자',
        field: 'modifiedBy',

    },
    {
        headerName: '수정일자',
        field: 'modifiedDate',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    },

];


export const tableCodeExchangeColumns = [
    {
        headerName: '통화',
        field: 'documentNumber',
        key: 'documentNumber',
    },
    {
        headerName: '통화명',
        field: 'documentNumber',
        key: 'documentNumber',
    },
    {
        headerName: '매매기준율',
        field: 'model',
        key: 'model',
        minWidth: 150,
    },
    {
        headerName: '송금보낼때',
        field: 'importUnitPrice',
        key: 'importUnitPrice',
    },
    {
        headerName: '송금받을때',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '현찰살때(스프레드)',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '현찰팔때(스프레드)',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: 'T/C살때',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
    {
        headerName: '미화환산율',
        field: 'currencyUnit',
        key: 'currencyUnit',
    },
]

export const tableCodeReadColumns = [

    {
        headerName: "", // 컬럼 제목

        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        pinned: 'left',
        headerName: 'Item',
        field: 'item',
        maxWidth: 250
    },
    {
        headerName: 'HS-CODE',
        field: 'hsCode',
    },
]




export const tableCompanyAccountColumns = [

    {
        headerName: "", // 컬럼 제목
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        pinned: 'left',
        headerName: '회사이름',
        field: 'companyName',
        maxWidth: 250
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
    },
    {
        headerName: '아이디',
        field: 'userName',
    },
    {
        headerName: '비밀번호',
        field: 'password',
    },
    {
        headerName: '비고',
        field: 'remarks',
    },
]



export const subTableCodeReadColumns = [

    {
        headerName: "", // 컬럼 제목

        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        pinned: 'left',
        headerName: 'Item',
        field: 'item',
        maxWidth: 250
    },
    {
        headerName: 'HS-CODE',
        field: 'hsCode',
    },
]


export const TableCodeUserColumns = [
    {
        headerName: '업체명',
        field: 'customerName',
        key: 'customerName',
    },
    {
        headerName: 'id',
        field: 'id',
        key: 'id',
    },
    {
        headerName: 'Password',
        field: 'pw',
        key: 'pw',
    },
    {
        headerName: '홈페이지',
        field: 'homepage',
        key: 'homepage',
    }, {
        headerName: '비고',
        field: 'remarks',
        key: 'remarks',
    },

]

export const TableCodeErpColumns = [
    {
        headerName: 'ID',
        field: 'id',
        key: 'id',
    },
    {
        headerName: 'Password',
        field: 'pw',
        key: 'pw',
    },
    {
        headerName: '이름',
        field: 'name',
        key: 'name',
    },
    {
        headerName: '직급',
        field: 'position',
        key: 'position',
    },
    {
        headerName: '권한',
        field: 'right',
        key: 'right',
    },
    {
        headerName: '이메일',
        field: 'email',
        key: 'email',
    },
    {
        headerName: '연락처',
        field: 'phoneNumber',
        key: 'phoneNumber',
    },
    {
        headerName: '팩스번호',
        field: 'faxNumber',
        key: 'faxNumber',
    },
    {
        headerName: '권한정보',
        field: 'rightInfo',
        key: 'rightInfo',
    },

]

export const modalCodeDiplomaColumn = [
    {
        headerName: '문서번호',
        field: 'documentNumber',
    },
    {
        headerName: '제목',
        field: 'documentTitle',
    },
    {
        headerName: '수신',
        field: 'recipient',
    },
    {
        headerName: '참조',
        field: 'reference',
    },
    {
        headerName: '소제목',
        field: 'subTitle',
    },
    {
        headerName: '내용',
        field: 'content',
    },

];


export const projectWriteColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {

        pinned: 'left',
        headerName: '연결 Inquiry No.',
        field: 'connectInquiryNo',
        maxWidth: 110,
        editable: true,
    }, {
        headerName: 'Model',
        field: 'model',
        minWidth: 200,
        cellEditor: CustomTextEditor, // ✅ 커스텀 에디터 적용
        wrapText: true,
        autoHeight: true,
        cellStyle: {
            "white-space": "nowrap",  // ✅ 한 줄로 유지
            "overflow": "hidden",      // ✅ 넘치는 부분 숨김
            "text-overflow": "ellipsis" // ✅ 생략(...) 처리
        },
        editable: true,
        tooltipField: "model", // ✅ 마우스를 올리면 전체 텍스트 표시 가능
    },
    {
        headerName: 'Maker',
        field: 'maker',
        minWidth: 200,
        editable: true,
    }, {
        headerName: 'Item',
        field: 'item',
        minWidth: 200,
        editable: true,
    }, {
        headerName: '마진율',
        field: 'marginRate',
        minWidth: 80,
        filter: 'agNumberColumnFilter',
        editable: true,
    }, {
        headerName: '단위',
        field: 'unit',
        maxWidth: 50,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz', '직접입력'],
        },
    }, {
        headerName: '수량',
        field: 'quantity',
        minWidth: 80,
        editable: true,
        filter: 'agNumberColumnFilter',
        // valueFormatter: amountFormat,
        // valueParser: amountFormatParser,
    }, {
        headerName: '매출 단가',
        field: 'unitPrice',
        minWidth: 150,
        editable: true,
        filter: 'agNumberColumnFilter',
        valueFormatter: (e) => amountFormat(e.value),
        valueParser: amountFormatParser,
    }, {
        headerName: '매출 총액',
        field: 'total',
        minWidth: 150,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => {
            const value = params.data.quantity * params.data.unitPrice;
            if (isNaN(value)) {
                return "";
            }
            // 숫자를 3자리마다 쉼표로 포맷
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }

    }, {
        headerName: '매입 단가',
        field: 'purchasePrice',
        minWidth: 120,
        filter: 'agNumberColumnFilter',
        editable: true,
    }, {
        headerName: '매입 총액',
        field: 'totalPurchase',
        minWidth: 120,
        filter: 'agNumberColumnFilter',
        valueFormatter: params => {
            const value = params.data.quantity * params.data.purchasePrice;
            if (isNaN(value)) {
                return "";
            }
            // 숫자를 3자리마다 쉼표로 포맷
            return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }
    },
    {
        headerName: '화폐단위',
        field: 'currencyUnit',
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['KRW', 'EUR', 'JPY', 'USD', 'GBP',],
        }
    }, {
        headerName: '납기',
        field: 'deliveryDate',
        minWidth: 150,
        editable: true,
        filter: 'agNumberColumnFilter',
        valueSetter: (params) => {
            if (params.newValue > 100) {
                return message.warn('100주 이하로 설정이 가능합니다.')
            }
            params.data.deliveryDate = params.newValue
            return true
        },
        valueFormatter: (e) => amountFormat(e.value),
        valueParser: amountFormatParser,
        cellRenderer: (e) => columnPlaceHolder(e, 'week', '주')
    }, {
        headerName: '매입처명',
        field: 'agencyName',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '매입처 담당자명',
        field: 'agencyManagerName',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '매입처 연락처',
        field: 'agencyManagerPhone',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '매입처 이메일',
        field: 'agencyManagerEmail',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '관련링크',
        field: 'relatedLink',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '납품기한',
        field: 'requestDeliveryDate',
        minWidth: 150,
        filter: "agDateColumnFilter",
        cellEditor: 'agDateCellEditor',
        valueFormatter: (params) => {
            if (!params.value) return ''; // 값이 없는 경우 처리
            return moment(params.value).isValid() ? moment(params.value).format('YYYY-MM-DD') : '';
        },
        valueParser: (params) => {
            const value = params.newValue;
            return moment(params.value).isValid() ? dateFormat(params) : ''
        },
        editable: true,
    }, {
        headerName: '비고',
        field: 'remarks',
        minWidth: 150,
        editable: true,
    }
];


export const projectReadColumn = [
    {
        headerName: 'Project No.',
        field: 'documentNumberFull',
        maxWidth: 120,
        headerCheckboxSelection: true,
        checkboxSelection: true,
        pinned: 'left',
        cellRenderer: (params) => {
            // 현재 행 데이터와 이전 행 데이터를 비교
            const rowIndex = params.node.rowIndex; // 현재 행 인덱스
            const currentValue = params.value;    // 현재 셀 값
            const previousValue = params.api.getDisplayedRowAtIndex(rowIndex - 1)?.data?.documentNumberFull; // 이전 행의 값

            // 이전 값과 동일하면 빈 문자열 반환
            if (currentValue === previousValue) {
                return '';
            }
            return currentValue;
        },
    }, {
        headerName: '프로젝트 제목',
        field: 'projectTitle',
        maxWidth: 130,
        pinned: 'left'
    }, {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 150,
    }, {
        headerName: '고객사 담당자명',
        field: 'customerManagerName',
        minWidth: 150,
    }, {
        headerName: '마감 일자',
        field: 'dueDate',
        minWidth: 150,
    }, {
        headerName: '담당자',
        field: 'managerAdminName',
        minWidth: 150,
    }, {
        headerName: '연결 Inquiry No',
        field: 'connectInquiryNo',
        minWidth: 150,
    },
    {
        headerName: 'Maker',
        field: 'maker',

    }, {
        headerName: 'Item',
        field: 'item',
        minWidth: 150,
    }, {
        headerName: '단위',
        field: 'unit',
        minWidth: 150,
    }, {
        headerName: '수량',
        field: 'quantity',
        minWidth: 150,
    }, {
        headerName: '매출 단가',
        field: 'unitPrice',
        minWidth: 150,
        valueGetter: (params) => {
            return (params.data.unitPrice)?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // A와 B를 곱한 값
        },
    }, {
        headerName: '매출 총액',
        field: 'total',
        minWidth: 150,
        pinned: 'right',
        valueGetter: (params) => {
            const a = params.data?.quantity || 0; // A 필드 값
            const b = params.data?.unitPrice || 0; // B 필드 값
            return (a * b).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","); // A와 B를 곱한 값
        },
    }, {
        headerName: '화폐단위',
        field: 'currencyUnit',
        minWidth: 150,
    }, {
        headerName: '납기',
        field: 'deliveryDate',
        minWidth: 150,
    },
    {
        headerName: '비고',
        field: 'remarks',
        minWidth: 150,
        hide: true,
    }, {
        headerName: '납품기한',
        field: 'requestDeliveryDate',
        minWidth: 150,
        hide: true,
    },
    {
        headerName: '관련링크',
        field: 'relatedLink',
        minWidth: 150,
        hide: true,
    },
    {
        headerName: '매입처 이메일',
        field: 'agencyManagerEmail',
        minWidth: 150,
        hide: true,
    },
    {
        headerName: '매입처 연락처',
        field: 'agencyManagerPhone',
        minWidth: 150,
        hide: true,
    },
    {
        headerName: '매입처 담당자',
        field: 'agencyManagerName',
        minWidth: 150,
        hide: true,
    },
    {
        headerName: '매입처명',
        field: 'agencyName',
        minWidth: 150,
        hide: true,
    }
];


export const delilveryReadColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    },
    {

        pinned: 'left',
        headerName: '출고일자.',
        field: 'deliveryDate',
        maxWidth: 80
    }, {
        headerName: '운송유형',
        field: 'deliveryType',
        minWidth: 80
    }, {
        headerName: 'Inquiry No.',
        field: 'connectInquiryNo',
        maxWidth: 120,
        pinned: 'left',
    }, {
        headerName: '받는분 성명',
        field: 'recipientName',
        minWidth: 80
    }, {
        headerName: '받는분 연락처',
        field: 'recipientPhone',
        minWidth: 100
    }, {
        headerName: '받는분 주소',
        field: 'recipientAddress',
        minWidth: 300
    }, {
        headerName: '수량',
        field: 'quantity',
        minWidth: 50
    },
    {
        headerName: '포장',
        field: 'packagingType',
        cellEditor: 'agNumberCellEditor',
        editable: true,
        valueFormatter: params => commonManage.calcFloat(params, 2),
        cellStyle: {textAlign: 'right'}
    }, {
        headerName: '배송방식',
        field: 'shippingType',
        minWidth: 150
    }, {
        headerName: '결제방식',
        field: 'paymentMethod',
        minWidth: 150
    }, {
        headerName: '운송장번호',
        field: 'trackingNumber',
        minWidth: 150
    }, {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 150,
        pinned: 'right'
    }, {
        headerName: 'model',
        field: 'model',
        maxWidth: 120,
    }, {
        headerName: 'maker',
        field: 'maker',
        minWidth: 150,
    }, {
        headerName: 'item',
        field: 'item',
        minWidth: 150,
    }, {
        headerName: '확인 여부',
        field: 'isConfirm',
        maxWidth: 80,
        pinned: 'right'
    }
];


export const remittanceReadColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: 'Inquiry No.',
        field: 'connectInquiryNo',
        maxWidth: 80,
        pinned: 'left'
    }, {
        headerName: '담당자',
        field: 'managerAdminName',
        minWidth: 150,
        pinned: 'right'
    }, {
        headerName: '송금요청일자',
        field: 'requestDate',
        minWidth: 150,

    }, {
        headerName: '송금지정일자',
        field: 'assignedDate',
        minWidth: 150,

    }, {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 150,

    }, {
        headerName: '매입처명',
        field: 'agencyName',
        minWidth: 150,

    }, {
        headerName: '공급가액',
        field: 'supplyAmount',
        minWidth: 150,
        valueFormatter: params => params.data.supplyAmount?.toLocaleString(),

    },
    {
        headerName: '부가세',
        field: 'net',
        valueFormatter: params => Math.round(params.data.supplyAmount / 10)?.toLocaleString(),
        cellEditor: 'agNumberCellEditor',

    }, {
        headerName: '합계',
        field: 'total',
        valueFormatter: params => (params.data.supplyAmount + Math.round(params.data.supplyAmount / 10))?.toLocaleString(),
        minWidth: 150,
    }
    , {
        headerName: '송금여부',
        field: 'isSend',
        minWidth: 150,
    }, {
        headerName: '계산서 발행 여부',
        field: 'isInvoice',
        minWidth: 150,
    }, {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 150,
    }
];


export const storeWriteColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {

        headerName: 'Inquiry No.',
        field: 'orderDocumentNumberFull',
        minWidth: 150,
        editable: true
    }, {
        headerName: '세부항목 번호',
        field: 'itemDetailNo',
        minWidth: 150,
        editable: true
    }, {
        headerName: '매입처명',
        field: 'agencyName',
        minWidth: 150,
    }, {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 150,
    }, {
        headerName: '환율',
        field: 'exchangeRate',
        minWidth: 150,
        editable: true,
        valueFormatter: (params) => {
            // 소수점 두 자리로 포맷팅
            if (params.value === undefined || params.value === null) return '';
            return parseFloat(params.value).toFixed(2);
        },
        valueParser: (params) => {
            // 숫자만 입력 가능하도록 파싱
            const value = parseFloat(params.newValue);
            return isNaN(value) ? null : Math.round(value * 100) / 100; // 소수점 두 자리로 제한
        },
        cellEditor: 'agTextCellEditor', // 텍스트 입력기 사용
    }, {
        headerName: '발주일자',
        field: 'orderDate',
        minWidth: 150
    }, {
        headerName: '송금일자',
        field: 'remittanceDate',
        minWidth: 150,
    },
    {
        headerName: '금액',
        field: 'amount',
        valueFormatter: (params) => {
            // 소수점 두 자리로 포맷팅
            if (params.value === undefined || params.value === null) return '';
            return parseFloat(params.value).toFixed(2);
        },
        valueParser: (params) => {
            // 숫자만 입력 가능하도록 파싱
            const value = parseFloat(params.newValue);
            return isNaN(value) ? null : Math.round(value * 100) / 100; // 소수점 두 자리로 제한
        },
        cellEditor: 'agTextCellEditor', // 텍스트 입력기 사용
    }, {
        headerName: '환폐단위',
        field: 'currencyUnit',
        cellEditor: 'agDateCellEditor',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '원화환산금액',
        field: 'returnAmount',
        minWidth: 150,
        valueGetter: (params) => {
            // 원화 금액 계산 후 반환
            if (!params.data) return '₩ 0';
            const calculatedValue = Math.round(params.data.amount * params.data.exchangeRate);
            return `₩ ${calculatedValue.toLocaleString()}`;
        },
        valueSetter: (params) => {
            // 사용자가 입력한 값을 저장
            const newValue = parseFloat(params.newValue.replace(/[₩,]/g, '')); // ₩와 , 제거
            if (isNaN(newValue)) return false;

            params.data.amount = newValue / params.data.exchangeRate; // 환율 반영
            return true; // 데이터 변경이 반영되었음을 알림
        }
    }, {
        headerName: '수수료',
        field: 'commissionFee',
        minWidth: 150,
        editable: true,
        valueFormatter: numberFormat,
    }, {
        headerName: '판매금액',
        field: 'salesAmount',
        minWidth: 150,
        valueFormatter: numberFormat,
    }, {
        headerName: '판매금액(VAT 포함)',
        field: 'salesAmountVat',
        minWidth: 150,
        valueFormatter: numberFormat,
    }, {
        headerName: '입고일자',
        field: 'receiptDate',
        minWidth: 150,
        editable: true,
        cellEditor: 'agDateCellEditor',
        valueFormatter: (params) => {
            return moment(params.value).isValid() ? dateFormat(params) : ''
        }
    }, {
        headerName: '출고일자',
        field: 'deliveryDate',
        minWidth: 150,
        cellEditor: 'agDateCellEditor',

    }, {
        headerName: '계산서 발행일자',
        field: '',
        minWidth: 150,
        editable: true,
    }, {
        headerName: '결제 여부',
        field: 'paymentStatus',
        minWidth: 150,
        editable: true,
        cellEditor: 'agSelectCellEditor',
        cellEditorParams: {
            values: ['완료', '부분완료', '미완료'],
        }
    }, {
        headerName: '선수금',
        field: 'advancePayment',
        minWidth: 150,
        editable: true
    }, {
        headerName: '비고',
        field: 'remarks',
        minWidth: 150,
        editable: true,
    }
];


export const storeReadColumn = [
    {
        headerName: "", // 컬럼 제목
        headerCheckboxSelection: true, // 헤더 체크박스 추가 (전체 선택/해제)
        checkboxSelection: true, // 각 행에 체크박스 추가
        valueGetter: (params) => params.node.rowIndex + 1, // 1부터 시작하는 인덱스
        cellStyle: {textAlign: "center"}, // 스타일 설정
        maxWidth: 45, // 컬럼 너비
        pinned: "left", // 왼쪽에 고정
        filter: false
    }, {
        headerName: '운수사명',
        field: 'carrierName',
        minWidth: 80,
    }, {
        headerName: 'B/L No.',
        field: 'blNo',
        maxWidth: 100,
        pinned: 'left'
    }, {
        headerName: 'Inquiry No.',
        field: 'orderDocumentNumberFull',
        maxWidth: 120,

        pinned: 'left'
    }, {
        headerName: '세부항목 번호',
        field: 'itemDetailNo',
        minWidth: 150,
    }, {
        headerName: '고객사명',
        field: 'customerName',
        minWidth: 100,
    }, {
        headerName: '매입처명',
        field: 'agencyName',
        minWidth: 100
    }, {
        headerName: '환율',
        field: 'exchangeRate',
        minWidth: 80,
    },
    {
        headerName: '발주일자',
        field: 'amount',
        cellEditor: 'agDateCellEditor',
        minWidth: 100
    }, {
        headerName: '송금일자',
        field: 'currencyUnit',
        cellEditor: 'agDateCellEditor',
        minWidth: 100,
    }, {
        headerName: '금액',
        field: 'amount',
        minWidth: 120
    }, {
        headerName: '화폐단위',
        field: 'currencyUnit',
        minWidth: 80
    }, {
        headerName: '원화환산금액',
        field: 'salesAmount',
        minWidth: 120,
        valueFormatter: numberFormat,
    }, {
        headerName: '수수료',
        field: 'commissionFee',
        minWidth: 120,
        valueFormatter: numberFormat,
    }, {
        headerName: '부가세',
        field: 'vatAmount',
        minWidth: 120,
        editable: true
    }, {
        headerName: '관세',
        field: 'tariff',
        minWidth: 150,
        cellEditor: 'agDateCellEditor',

    }, {
        headerName: '운임비',
        field: 'shippingFee',
        minWidth: 120,
    }, {
        headerName: '합계',
        field: 'paymentStatus',
        minWidth: 150
    }, {
        headerName: '합계(VAT 포함)',
        field: 'advancePayment',
        minWidth: 150
    }, {
        headerName: '판매금액',
        field: 'remarks',
        minWidth: 150
    }, {
        headerName: '판매금액 (VAT 포함)',
        field: 'remarks',
        minWidth: 150
    }, {
        headerName: '영업이익금',
        field: 'remarks',
        minWidth: 150
    }, {
        headerName: '입고일자',
        field: 'receiptDate',
        minWidth: 150
    }, {
        headerName: '출고일자',
        field: 'remarks',
        minWidth: 150
    }, {
        headerName: '계산서 발행일자',
        field: 'invoiceDate',
        minWidth: 150
    }, {
        headerName: '결제여부',
        field: 'paymentStatus',
        minWidth: 150
    }, {

        headerName: '선수금',
        field: 'remarks',
        minWidth: 150
    }
];
