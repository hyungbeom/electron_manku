import React, { useState } from 'react';
import Table from 'antd/lib/table';
import Card from 'antd/lib/card/Card';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import {
    CopyOutlined,
    DeleteOutlined,
    DownOutlined,
    PrinterOutlined,
    SettingOutlined,
    UpOutlined
} from '@ant-design/icons';
import TableModal from "@/utils/TableModal";
import { subRfqWriteInitial } from "@/utils/initialList";

const { Option } = Select;

const CustomTable = ({ columns, info, content }) => {
    const defaultCheckedList = columns.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [open, setOpen] = useState(false);
    const [selectedRowKeys, setSelectedRowKeys] = useState([]); // 선택된 Row의 키 관리

    // Row 선택 시 호출되는 함수
    const onSelectChange = (newSelectedRowKeys) => {
        setSelectedRowKeys(newSelectedRowKeys);
    };

    const rowSelection = {
        selectedRowKeys,
        onChange: onSelectChange,
    };

    const handleSelectChange = (value) => {
        setCheckedList(value);
    };

    // 선택된 컬럼에 해당하는 항목만 필터링하여 테이블에 표시
    const visibleColumns = columns.filter((item) => checkedList.includes(item.key));

    return (
        <div style={{ overflow: 'auto', maxHeight: '100%', maxWidth: '100%' }}>
            <Card size={'small'} style={{ border: '1px solid lightGray', height: '100%' }}
                  title={
                      <>
                          <span>LIST</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', width: 170, float: 'right' }}>
                              <Button type={'primary'} size={'small'} style={{ fontSize: 11 }}>
                                  <CopyOutlined />복사
                              </Button>
                              <Button type={'dashed'} size={'small'} style={{ fontSize: 11 }}>
                                  <PrinterOutlined />출력
                              </Button>
                          </div>
                      </>
                  }>
                {/*<TableModal data={initial} dataInfo={dataInfo} setInfoList={setInfo} />*/}
                {content}
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
                    {columns.map(({ key, title }) => (
                        <Option key={key} value={key}>
                            {title}
                        </Option>
                    ))}
                </Select>}


                <Table
                    style={{ fontSize: 11, width : '100%' }}
                    scroll={{x : true}}
                    size={'large'}
                    columns={visibleColumns}
                    dataSource={[...info]}
                    rowSelection={{
                        type: 'checkbox', // 'checkbox' or 'radio' 중 선택 가능
                        selectedRowKeys: selectedRowKeys, // 현재 선택된 Row들만 표시
                        onChange: onSelectChange, // 선택 변경 처리
                        preserveSelectedRowKeys: true // 선택 상태를 유지하도록 설정
                    }}
                />
            </Card>
        </div>
    );
};

export default CustomTable;