import React from 'react';
// import { Button, Form, Input, Popconfirm, Table } from 'antd';
import Table from 'antd/lib/table'
import Card from "antd/lib/card/Card";
import Space from "antd/lib/space";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button";
import {CopyOutlined, DeleteOutlined, PrinterOutlined} from "@ant-design/icons";


const data = [
    {
        key: 'documentNumberFull',
        model: 'John Brown',
        age: 32,
        address: 'New York No. 1 Lake Park',
        tags: ['nice', 'developer'],
    },
    {
        key: 'documentNumberFull',
        model: 'Jim Green',
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

const CustomTable = ({columns}) => {

    return (
        <Card style={{border: '1px solid lightGray'}}
              title={<><span>LIST</span><div style={{display: 'flex', justifyContent: 'space-between', width: 170,  float : 'right'}}><Button
                  type={'primary'} size={'small'} style={{fontSize: 11}}><CopyOutlined/>복사</Button><Button
                  type={'danger'} size={'small'} style={{fontSize: 11}}><DeleteOutlined/>삭제</Button><Button
                  type={'dashed'} size={'small'} style={{fontSize: 11}}><PrinterOutlined/>출력</Button></div></>}>
            <Table style={{fontSize : 11}} size={'small'} columns={columns} dataSource={data}/>
        </Card>
    );
};
export default CustomTable;