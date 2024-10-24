import {useEffect, useState} from "react";
import Table from "antd/lib/table";
import Tag from "antd/lib/tag";
import Button from "antd/lib/button";
import {getData} from "@/manage/function/api";
import {setCookies} from "@/manage/function/cookie";

export default function ApproveUser({memberList}){

    const [list, setList] = useState([])

    const columns = [
        {
            title: '이름',
            dataIndex: 'name',
            key: 'name',
        },{
            title: '아이디',
            dataIndex: 'adminName',
            key: 'adminName',
        },
        {
            title: '직책',
            dataIndex: 'position',
            key: 'position',
        },
        {
            title: '전화번호',
            dataIndex: 'contactNumber',
            key: 'address',
        },
        {
            title: '권한',
            dataIndex: 'adminId',
            key: 'adminId',
            render: (text) => {
                return <Button type={'primary'} onClick={async () => {
                    await getData.post('admin/approvalAdmin', {'adminId': text}).then(async v => {
                        if (v.data.code === 1) {
                            const result = await getData.post('admin/getAdminList', {
                                "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
                                "searchAuthority": null,    // 1: 일반, 0: 관리자
                                "page": 1,
                                "limit": 20
                            });
                            const result2 = filterList(result?.data?.entity?.adminList)
                            setList(result2)
                        }
                    })
                }}>승인하기</Button>
            },
        }
    ];


    function filterList(list){
        return list?.filter(v=>v.isApproval === 0)
    }

    useEffect(()=>{
       const result = filterList(memberList)
        setList(result)
    },[memberList])


    return <Table columns={columns} dataSource={list}/>
}