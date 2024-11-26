import Button from "antd/lib/button";
import {DownOutlined, InboxOutlined, SettingOutlined, UploadOutlined, UpOutlined} from "@ant-design/icons";
import Select from "antd/lib/select";
import React, {useState} from "react";
import Upload from "antd/lib/upload";
import * as XLSX from 'xlsx';
import message from "antd/lib/message";
const { Dragger } = Upload;
export default function ColumnSetting({columns, checkedList, handleSelectChange}){

    const [open, setOpen] = useState(false);
    const [data, setData] = useState([]);
    const [column, setColumn] = useState([]);

    // 엑셀 파일을 읽어들이는 함수
    const handleFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, { type: 'binary' });

            // 첫 번째 시트 선택
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 데이터를 JSON 형식으로 변환
            const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // 데이터 첫 번째 행을 컬럼 이름으로 사용
            const headers:any = jsonData[0];
            const dataRows:any = jsonData.slice(1);

            // 테이블 컬럼 설정
            const tableColumns = headers?.map((header, index) => ({
                title: header,
                dataIndex: index,
                key: index,
            }));

            // 테이블 데이터 설정
            const tableData = dataRows.map((row, index) => {
                const rowData = {};
                row.forEach((cell, cellIndex) => {
                    rowData[cellIndex] = cell;
                });
                return { key: index, ...rowData };
            });

            setColumn(tableColumns);
            setData(tableData);
        };

        reader.readAsBinaryString(file);
    };
    const uploadProps = {
        name: 'file',
        accept: '.xlsx, .xls',
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isExcel = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel';

            if (!isExcel) {
                message.error('엑셀 파일만 업로드 가능합니다.');
                return Upload.LIST_IGNORE;
            }

            // 파일 읽기
            handleFile(file);

            // false를 반환하여 업로드 방지 (자동 업로드 차단)
            return false;
        },
    };



    return <>

        <Button  style={{ marginBottom: 10, float: 'right', borderRadius : 5 }} onClick={() => setOpen(v => !v)}  size={'small'} type={'dashed'}>
        <SettingOutlined />Column Setting {open ? <UpOutlined /> : <DownOutlined />}

    </Button>
        {open && <Select
            mode="multiple"
            style={{ width: '100%', marginBottom: '16px' }}
            placeholder="Select columns to display"
            value={checkedList}
            onChange={handleSelectChange}
        >
            {columns?.map(({ key, title }) => (
                // @ts-ignored
                <Option key={key} value={key}>
                    {title}
                </Option>
            ))}
        </Select>}</>
}