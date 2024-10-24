import React, {useState} from 'react';
// import { Button, Form, Input, Popconfirm, Table } from 'antd';
import Table from 'antd/lib/table'
import Card from "antd/lib/card/Card";
import Checkbox from "antd/lib/checkbox";

import Button from "antd/lib/button";
import {CopyOutlined, DeleteOutlined, PrinterOutlined} from "@ant-design/icons";
import {estimateTotalWriteColumn} from "@/utils/common";

const data:any = [
    {
        key: '1',
        name: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: '2',
        name: 'Jim Green',
        age: 42,
        address: 'London No. 1 Lake Park',
        tags: ['loser'],
    },
    {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sydney No. 1 Lake Park',
        tags: ['cool', 'teacher'],
    },
];



const defaultCheckedList = estimateTotalWriteColumn.map((item) => item.key);

const CustomTable = () => {
    const [checkedList, setCheckedList] = useState<any>(defaultCheckedList);

    const options = estimateTotalWriteColumn.map(({ key, title }) => ({
        label: title,
        value: key,
    }));

    const newColumns:any = estimateTotalWriteColumn.map((item) => ({
        ...item,
        hidden: !checkedList.includes(item.key),
    }));


    return (
        <Card style={{border: '1px solid lightGray'}}
              title={<><span>LIST</span><div style={{display: 'flex', justifyContent: 'space-between', width: 170,  float : 'right'}}><Button
                  type={'primary'} size={'small'} style={{fontSize: 11}}><CopyOutlined/>복사</Button><Button
                  // type={'danger'} size={'small'} style={{fontSize: 11}}><DeleteOutlined/>삭제</Button><Button
                  type={'dashed'} size={'small'} style={{fontSize: 11}}><PrinterOutlined/>출력</Button></div></>}>

            <Checkbox.Group
                value={checkedList}
                options={options}
                onChange={(value) => {
                    setCheckedList(value);
                }}
            />

            <Table style={{fontSize : 11}} size={'small'} columns={newColumns} dataSource={data} scroll={{x:'max-content'}} />
        </Card>
    );
};
export default CustomTable;