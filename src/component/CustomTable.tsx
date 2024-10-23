import React from 'react';
// import { Button, Form, Input, Popconfirm, Table } from 'antd';
import Table from 'antd/lib/table'
import Card from "antd/lib/card/Card";
import Space from "antd/lib/space";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button";
import {CopyOutlined, DeleteOutlined, PrinterOutlined} from "@ant-design/icons";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text) => <a>{text}</a>,
    },
    {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
    },
    {
        title: 'Address',
        dataIndex: 'address',
        key: 'address',
    },
    {
        title: 'Tags',
        key: 'tags',
        dataIndex: 'tags',
        render: (_, {tags}) => (
            <>
                {tags.map((tag) => {
                    let color = tag.length > 5 ? 'geekblue' : 'green';
                    if (tag === 'loser') {
                        color = 'volcano';
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: 'Action',
        key: 'action',
        render: (_, record) => (
            <Space size="middle">
                <a>Invite {record.name}</a>
                <a>Delete</a>
            </Space>
        ),
    },
];
const data = [
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
const CustomTable = () => {

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