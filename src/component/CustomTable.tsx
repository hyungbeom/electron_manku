import React, { useState } from 'react';
import Table from 'antd/lib/table';
import Card from 'antd/lib/card/Card';
import Select from 'antd/lib/select';
import Button from 'antd/lib/button';
import { CopyOutlined, DeleteOutlined, PrinterOutlined } from '@ant-design/icons';

const { Option } = Select;



const CustomTable = ({ columns =[] }) => {

    const [data, setData] = useState([])

    const defaultCheckedList = columns.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);

    const handleSelectChange = (value) => {
        setCheckedList(value);
    };

    // 선택된 항목에 해당하는 컬럼만 필터링하여 표시
    const filteredColumns = columns.filter((item) =>
        checkedList.includes(item.key)
    );

    return (
        <Card
            style={{ border: '1px solid lightGray' }}
            title={
                <>
                    <span>LIST</span>
                    <div
                        style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            width: 170,
                            float: 'right',
                        }}
                    >
                        <Button type={'primary'} size={'small'} style={{ fontSize: 11 }}>
                            <CopyOutlined />
                            복사
                        </Button>
                        <Button type={'danger'} size={'small'} style={{ fontSize: 11 }}>
                            <DeleteOutlined />
                            삭제
                        </Button>
                        <Button type={'dashed'} size={'small'} style={{ fontSize: 11 }}>
                            <PrinterOutlined />
                            출력
                        </Button>
                    </div>
                </>
            }
        >


            <Select
                mode="multiple"
                style={{ width: '100%', marginBottom: '16px' }}
                placeholder="Select columns"
                value={checkedList}
                onChange={handleSelectChange}
            >
                {columns.map(({ key, title }) => (
                    <Option key={key} value={key}>
                        {title}
                    </Option>
                ))}
            </Select>

            <Table style={{ fontSize: 11 }} size={'small'} columns={filteredColumns} dataSource={data} />
        </Card>
    );
};

export default CustomTable;