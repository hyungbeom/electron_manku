import React, {useState} from 'react';
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
import {subRfqWriteInitial} from "@/utils/initialList";

const {Option} = Select;

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

const CustomTable = ({columns, initial, dataInfo}) => {
    const defaultCheckedList = columns?.map((item) => item.key);
    const [checkedList, setCheckedList] = useState(defaultCheckedList);
    const [open, setOpen] = useState(false);


    const handleSelectChange = (value) => {
        setCheckedList(value);
    };

    // 선택된 컬럼에 해당하는 항목만 필터링하여 테이블에 표시
    const visibleColumns = columns.filter((item) => checkedList.includes(item.key));

    return (
        <div style={{overflow: 'auto', maxHeight: '100%', maxWidth: '100%'}}>
            <Card style={{border: '1px solid lightGray', height : '100%'}}
                  title={
                      <>
                          <span>LIST</span>
                          <div style={{display: 'flex', justifyContent: 'space-between', width: 170, float: 'right'}}>
                              <Button type={'primary'} size={'small'} style={{fontSize: 11}}>
                                  <CopyOutlined/>복사
                              </Button>
                              <Button type={'dashed'} size={'small'} style={{fontSize: 11}}>
                                  <PrinterOutlined/>출력
                              </Button>
                          </div>
                      </>
                  }>


                <TableModal data={subRfqWriteInitial} dataInfo={dataInfo}/>
                <Button style={{marginBottom: 10, float : 'right'}} onClick={() => setOpen(v => !v)} type={'primary'}><SettingOutlined/>Column
                    Setting {open ?
                        <UpOutlined/> : <DownOutlined/>} </Button>
                {open && <Select
                    mode="multiple"
                    style={{width: '100%', marginBottom: '16px'}}
                    placeholder="Select columns to display"
                    value={checkedList}
                    onChange={handleSelectChange}
                >
                    {columns.map(({key, title}) => (
                        <Option key={key} value={key}>
                            {title}
                        </Option>
                    ))}
                </Select>}



                <Table style={{fontSize: 11}} size={'large'} columns={visibleColumns} dataSource={data}
                       scroll={{x: 'max-content'}} />
            </Card>
        </div>
    );
};

export default CustomTable;