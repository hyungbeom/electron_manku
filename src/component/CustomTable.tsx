import React, {useEffect, useRef, useState} from 'react';
import Table from 'antd/lib/table';
import Card from 'antd/lib/card/Card';
import Select from 'antd/lib/select';
import Pagination from 'antd/lib/pagination';
import message from "antd/lib/message";
import ColumnSetting from "@/component/ColumnSetting";
import {EditableCell, EditableRow} from "@/component/TableAboutRows";
import {DropArea} from "@/styled/common";
import {useDropzone} from "react-dropzone";
import * as XLSX from 'xlsx';
import {InboxOutlined} from "@ant-design/icons";
import Upload from "antd/lib/upload";
import {getData} from "@/manage/function/api";
import {transformData} from "@/utils/common/common";


const {Option} = Select;
const {Dragger} = Upload;
const CustomTable = ({columns, info, setDatabase, content, subContent, rowSelection, listType, excel = false, pageInfo, setPaginationInfo, setTableInfo, visible}:any) => {
    const defaultCheckedList = columns.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);


    // 엑셀 파일을 읽어들이는 함수
    const handleFile = (file) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            const binaryStr = e.target.result;
            const workbook = XLSX.read(binaryStr, {type: 'binary'});

            // 첫 번째 시트 선택
            const worksheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[worksheetName];

            // 데이터를 JSON 형식으로 변환 (첫 번째 행을 컬럼 키로 사용)
            const jsonData = XLSX.utils.sheet_to_json(worksheet, {header: 1});

            // 데이터 첫 번째 행을 컬럼 이름으로 사용
            const headers = jsonData[0];
            const dataRows = jsonData.slice(1);


            // 테이블 데이터 설정 (컬럼 키를 사용)
            const tableData = dataRows.map((row, index):any => {
                const rowData = {};
                // @ts-ignored
                row?.forEach((cell, cellIndex) => {
                    rowData[headers[cellIndex]] = cell; // 컬럼 키를 사용하여 데이터 설정
                });
                return {key: index, ...rowData};
            });

            setDatabase(v => {
                const copyData = {...v};
                copyData[listType] = tableData;
                return copyData
            })

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


    const visibleColumns = columns.filter((item) => checkedList.includes(item.key));

    const tableRef = useRef()
    // table column checkList
    const handleSelectChange = (value) => {
        setCheckedList(value);
    };

    // =====================================================

    const handleSave = (row) => {
        const newData = [...info];
        const index = newData.findIndex((item) => row.key === item.key);
        const item = newData[index];
        newData.splice(index, 1, {
            ...item,
            ...row,
        });

        setDatabase(v => {
            const copyData = {...v};
            copyData[listType] = newData;
            return copyData
        })
    };

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const setColumns = visibleColumns.map((col) => {
        if (!col.editable) {
            return col;
        }
        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave,
            }),
        };
    });


    async function check(e, size) {
        setPaginationInfo({rowPerPage: size, page: e, totalRow: pageInfo['totalRow']})

        const copyData: any = {...info}
        copyData['limit'] = size;
        copyData['page'] = e;
        const result = await getData.post('estimate/getEstimateRequestList', copyData);

        console.log(result?.data?.entity?.estimateRequestList,'result?.data?.entity?.estimateRequestList:')
        setTableInfo(transformData(result?.data?.entity?.estimateRequestList))
    }

    return (
        <div style={{overflow: 'auto', maxHeight: '100%', maxWidth: '100%'}}>
            <Card size={'small'} style={{border: '1px solid lightGray', height: '100%'}}
                  title={
                      <>
                          <span>LIST</span>
                          <div style={{display: 'flex', justifyContent: 'space-between', width: 170, float: 'right'}}>
                              {subContent}
                          </div>
                      </>
                  }>
                {content}

                <ColumnSetting columns={columns} checkedList={checkedList} handleSelectChange={handleSelectChange}/>

                <Table ref={tableRef}

                       style={{fontSize: 11, width: '100%'}}
                       scroll={{x: true}}
                       size={'small'}
                       bordered
                       pagination={false}
                       columns={setColumns}
                       dataSource={[...info]}
                       components={components}
                       rowClassName={() => 'editable-row'}
                       rowSelection={{
                           type: 'checkbox',
                           ...rowSelection,
                       }}
                />
                {/*@ts-ignored*/}
                {visible && <Pagination value={pageInfo['page']} total={pageInfo['totalRow']}
                             style={{float: 'right', paddingTop: 25}} pageSize={pageInfo['rowPerPage']}
                             onChange={check}/>}

                {excel && <Dragger {...uploadProps} style={{marginBottom: '20px'}}>
                    <p className="ant-upload-drag-icon">
                        <InboxOutlined/>
                    </p>
                    <p className="ant-upload-text">여기에 파일을 드래그 앤 드롭하거나 클릭하여 업로드하세요.</p>
                    <p className="ant-upload-hint">엑셀 파일(.xlsx, .xls)만 지원합니다.</p>
                </Dragger>}
            </Card>
        </div>
    );
};

export default CustomTable;