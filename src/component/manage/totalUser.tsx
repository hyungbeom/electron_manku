import Table from "antd/lib/table";
import Tag from "antd/lib/tag";
import {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";

export default function TotalUser(){


    const [list, setList] = useState([])

    useEffect(()=>{
        console.log('!!!')
        async function getList() {
            const result = await getData.post('admin/getAdminList', {
                "searchText": null,         // 아이디, 이름, 직급, 이메일, 연락처, 팩스번호
                "searchAuthority": null,    // 1: 일반, 0: 관리자
                "page": 1,
                "limit": 20
            });

            setList(result?.data?.entity?.adminList)
        }
        getList();
    },[])

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
            dataIndex: 'authority',
            key: 'authority',
            render: (text) => {
                return <>{text ? <Tag color={'blue'}>
                    일반유저
                </Tag> : <Tag color={'red'} >
                    관리자
                </Tag>  }</>
            },

        },
        {
            title: '승인상태',
            dataIndex: 'isApproval',
            key: 'isApproval',
            render: (text) => {
                return <>{text ? <Tag color={'blue'}>
                    승인
                </Tag> : <Tag color={'red'} >
                    미승인
                </Tag>  }</>
            },

        }
    ];


    return <Table columns={columns} dataSource={list}/>
}