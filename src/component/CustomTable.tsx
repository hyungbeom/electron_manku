import React, { useState } from 'react';
import Input from 'antd/lib/input';
import Button from 'antd/lib/button';
import Select from 'antd/lib/select';
import  Card from 'antd/lib/card';
import Table from 'antd/lib/table';
import { DownOutlined, SettingOutlined, UpOutlined } from '@ant-design/icons';

const { Option } = Select;

const CustomTable = ({ columns, info, content, subContent, rowSelection, onRowDoubleClick, onUpdate }) => {
    // 상태 관리
    const [checkedList, setCheckedList] = useState(columns.map((item) => item.key));
    const [open, setOpen] = useState(false);
    const [editingKey, setEditingKey] = useState(null);
    const [editingData, setEditingData] = useState({});

    // 편집 모드로 전환
    const enterEditMode = (record) => {
        setEditingKey(record.key);
        setEditingData({ ...record });
    };

    // 편집 모드 종료 및 데이터 저장
    const saveEdit = () => {
        if (editingKey === null) return;

        const updatedData = info.map((item) =>
            item.key === editingKey ? { ...editingData } : item
        );

        onUpdate((prevInfo) => ({
            ...prevInfo,
            estimateRequestDetailList: updatedData,
        }));

        setEditingKey(null);
    };

    // Input 변경 시 편집 데이터 업데이트
    const handleInputChange = ({ target: { value } }, dataIndex) => {
        setEditingData((prev) => ({ ...prev, [dataIndex]: value }));
    };

    // 컬럼을 렌더링하는 함수
    const renderEditableCell = (text, record, dataIndex) =>
        editingKey === record.key ? (
            <Input
                size="small"
                value={editingData[dataIndex]}
                onChange={(e) => handleInputChange(e, dataIndex)}
                onBlur={saveEdit}
            />
        ) : (
            text
        );

    // 선택된 컬럼에 해당하는 항목만 필터링하여 테이블에 표시
    const visibleColumns = columns
        .filter((item) => checkedList.includes(item.key))
        .map((col) => ({
            ...col,
            render: (text, record) => renderEditableCell(text, record, col.dataIndex),
        }));

    return (
        <div style={{ overflow: 'auto', maxHeight: '100%', maxWidth: '100%' }}>
            <Card
                size="small"
                style={{ border: '1px solid lightGray', height: '100%' }}
                title={
                    <>
                        <span>LIST</span>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: 170, float: 'right' }}>
                            {subContent}
                        </div>
                    </>
                }
            >
                {content}
                <Button
                    style={{ marginBottom: 10, float: 'right', borderRadius: 5 }}
                    onClick={() => setOpen((prev) => !prev)}
                    size="small"
                    type="dashed"
                >
                    <SettingOutlined />
                    Column Setting {open ? <UpOutlined /> : <DownOutlined />}
                </Button>

                {open && (
                    <Select
                        mode="multiple"
                        style={{ width: '100%', marginBottom: 16 }}
                        placeholder="Select columns to display"
                        value={checkedList}
                        onChange={setCheckedList}
                    >
                        {columns.map(({ key, title }) => (
                            <Option key={key} value={key}>
                                {title}
                            </Option>
                        ))}
                    </Select>
                )}

                <Table
                    style={{ fontSize: 11, width: '100%' }}
                    scroll={{ x: true }}
                    size="small"
                    columns={visibleColumns}
                    dataSource={[...info]}
                    onRow={(record) => ({
                        style: { cursor: 'pointer' },
                        onDoubleClick: () => {
                            enterEditMode(record);
                            onRowDoubleClick && onRowDoubleClick(record); // 부모의 더블 클릭 이벤트도 호출
                        },
                    })}
                    rowSelection={{
                        style: { cursor: 'pointer' },
                        type: 'checkbox',
                        ...rowSelection,
                    }}
                />
            </Card>
        </div>
    );
};

export default CustomTable;