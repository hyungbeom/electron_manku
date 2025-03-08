import Button from "antd/lib/button";
import {UploadOutlined} from "@ant-design/icons";
import React, {useRef} from "react";
import Tooltip from "antd/lib/tooltip";
import message from "antd/lib/message";
import * as XLSX from "xlsx";
import {gridManage} from "@/utils/commonManage";
import {v4 as uuid} from 'uuid';

export function ExcelUpload({ref, list}) {
    const excelRef: any = useRef();

    console.log(ref,'refref:12')

    function onChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]; // 파일 선택
        if (!file) return;

        // 허용된 파일 확장자 목록
        const allowedExtensions = ['.xls', '.xlsx', '.csv'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            message.error('엑셀 파일(.xls, .xlsx, .csv)만 업로드할 수 있습니다.');
            return;
        }

        const reader = new FileReader();

        // 파일 읽기 완료 이벤트 핸들러
        reader.onload = (event: ProgressEvent<FileReader>) => {
            try {
                const data = new Uint8Array(event.target?.result as ArrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                if (workbook.SheetNames.length === 0) {
                    message.error('파일에 시트가 존재하지 않습니다.');
                    return;
                }

                // 첫 번째 시트 가져오기
                const sheetName = workbook.SheetNames[0];
                const sheet = workbook.Sheets[sheetName];

                // 시트 데이터를 JSON 형식으로 변환
                const jsonData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

                if (jsonData.length < 2) {
                    message.error('파일에 데이터가 없습니다. 최소한 헤더와 데이터 한 줄이 필요합니다.');
                    return;
                }

                // 첫 번째 행을 키(key)로 사용하여 객체 배열로 변환
                const [keys, ...rows] = jsonData;
                const formattedData = rows.map(row => row.map(value => value || ''));

                const uploadCell = formattedData.slice(0,100);

                ref.current.hotInstance.loadData(uploadCell);
                message.success(`${file.name} 불러오기가 완료되었습니다.`);
            } catch (error) {
                console.error('파일 처리 중 오류 발생:', error);
                message.error('파일을 처리하는 중 오류가 발생했습니다.');
            }
        };

        // 파일 읽기 실패 시
        reader.onerror = () => {
            message.error('파일을 읽을 수 없습니다.');
        };

        reader.readAsArrayBuffer(file); // 파일을 ArrayBuffer로 읽음
        e.target.value = ''; // 파일 선택 초기화 (같은 파일 재선택 가능하도록)
    }
    return (
        <Tooltip placement={'leftTop'} title="Excel 업로드합니다." color={'cyan'} key={uuid()}>

            <Button size={'small'} style={{fontSize: 11}} icon={<UploadOutlined/>} onClick={() => {
                if (excelRef.current) {
                    excelRef.current.click();
                }
            }}>Upload</Button>
            <input
                type="file"
                ref={excelRef}
                style={{display: 'none'}}
                onChange={onChange}
                accept=".xls,.xlsx,.csv"
            />
        </Tooltip>
    );
}