import {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import Table from "antd/lib/table";
import moment from "moment/moment";

const columns = [
    {
        title: 'CRUD',
        dataIndex: 'actionType',
        key: 'name',
    },{
        title: '작업자',
        dataIndex: 'adminName',
        key: 'adminName',
    },{
        title: '카테고리',
        dataIndex: 'category',
        key: 'category',
    },{
        title: '작업일자',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text) => moment(text).format('YYYY-MM-DD HH:mm:ss'),
    }

];

export default function HistoryPage() {

    const [list, setList] = useState([]);

    useEffect(() => {
        getHistory().then(v => {
            if (v.code === 1) {
                setList(v.entity.workHistoryList)
            }
        })
    }, [])

    async function getHistory() {
        return await getData.post('etc/getWorkHistoryList', {
            page: 1,
            limit: -1,
            "searchStartDate": "",
            "searchEndDate": "",
            "searchAdminName": "",
            "searchCategory": "",
            "searchActionType": ""
        }).then(v => {
            return v.data;
        })
    }

    return <>
        <Table columns={columns} dataSource={list}/>
    </>
}