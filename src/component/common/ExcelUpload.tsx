import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {UploadOutlined} from "@ant-design/icons";
import React, {useRef, useState} from "react";
import _ from "lodash";
import Tooltip from "antd/lib/tooltip";
import message from "antd/lib/message";
import * as XLSX from "xlsx";
import {gridManage} from "@/utils/commonManage";
export function ExcelUpload({gridRef, list}) {
    const excelRef:any= useRef();


    function onChange(e){
        const file = e.target.files[0];

        if (!file) return;

        const allowedExtensions = ['.xls', '.xlsx', '.csv'];
        const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
            message.error('Only Excel files are allowed.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e:any) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            // 첫 번째 시트를 가져옴
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            // 시트를 JSON으로 변환
            const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });


            // 첫 번째 행을 키로 사용해 객체 배열 생성
            const keys:any = jsonData[0];
            const rows = jsonData.slice(1);
            const formattedData = rows.map((row) => {
                const rowData = {};
                keys.forEach((key, index) => {
                    rowData[key] = row[index] || ''; // 값이 없으면 빈 문자열로 처리
                });
                return rowData;
            });
            console.log(formattedData,'formattedData:')

           const result = gridManage.uploadExcelData(formattedData, list)


            gridManage.resetData(gridRef, result);
            message.success(`${file.name}_불러오기가 완료되었습니다.`);

    }
        reader.onerror = () => {
            message.error('Failed to read the file.');
        };

        reader.readAsArrayBuffer(file);
        e.target.value = '';
}
    return (
        <Tooltip placement={'leftTop'} title="Excel 업로드합니다." color={'cyan'} key={'cyan'}>

                <Button size={'small'} style={{fontSize: 11}} icon={<UploadOutlined/>} onClick={()=>{
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