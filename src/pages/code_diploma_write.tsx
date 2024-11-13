import React, {useEffect, useRef, useState} from "react";
import moment from "moment/moment";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import Input from "antd/lib/input/Input";
import TextArea from "antd/lib/input/TextArea";

import Button from "antd/lib/button";
import {
    CopyOutlined,
    EditOutlined,
    FileExcelOutlined,
    RetweetOutlined,
    SaveOutlined,
    SearchOutlined,
} from "@ant-design/icons";
import * as XLSX from "xlsx";
import message from "antd/lib/message";

import {
    codeDiplomaReadInitial,

} from "@/utils/initialList";


export default function codeOverseasPurchase() {

    const [info, setInfo] = useState(codeDiplomaReadInitial);

    useEffect(() => {
        const copyData: any = {...codeDiplomaReadInitial}
        copyData['searchDate'] = [moment().subtract(1, 'years').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')];
        setInfo(copyData);
    }, [])


    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setInfo(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {
        const copyData = {...info}
        copyData['writtenDate'] = moment(info['writtenDate']).format('YYYY-MM-DD');
        copyData['replyDate'] = moment(info['replyDate']).format('YYYY-MM-DD');
        copyData['dueDate'] = moment(info['dueDate']).format('YYYY-MM-DD');

        await getData.post('officialDocument/addOfficialDocument', copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setInfo(codeDiplomaReadInitial);
                window.location.href = '/code_diploma'
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });

    }

    const downloadExcel = () => {

        // const worksheet = XLSX.utils.json_to_sheet(tableInfo);
        // const workbook = XLSX.utils.book_new();
        // XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
        // XLSX.writeFile(workbook, "example.xlsx");
    };

    return <LayoutComponent>
        <div style={{display: 'grid', gridTemplateRows: 'auto 1fr', height: '100%', columnGap: 5}}>
            <Card size={'small'} title={'공문서 등록'} style={{fontSize: 12, border: '1px solid lightGray'}}>
                <Card size={'small'} style={{
                    fontSize: 13,
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                }}>
                    <div>
                        <div style={{paddingTop: 8}}>문서번호</div>
                        <Input id={'documentNumber'} value={info['documentNumber']} onChange={onChange}
                               size={'small'}/>
                    </div>
                    <div>
                        <div style={{paddingTop: 8}}>제목</div>
                        <Input id={'documentTitle'} value={info['documentTitle']} onChange={onChange} size={'small'}/>
                    </div>
                    <div style={{paddingTop: 8}}>
                        <div style={{paddingBottom: 3}}>수신</div>
                        <Input id={'recipient'} value={info['recipient']} onChange={onChange} size={'small'}/>
                    </div>
                    <div>
                        <div style={{paddingTop: 8}}>참조</div>
                        <Input id={'reference'} value={info['reference']} onChange={onChange} size={'small'}/>
                    </div>
                    <div>
                        <div style={{paddingTop: 8}}>소제목</div>
                        <Input id={'subTitle'} value={info['subTitle']} onChange={onChange} size={'small'}/>
                    </div>
                    <div style={{paddingTop: 8}}>
                        <div style={{paddingBottom: 3}}>내용</div>
                        <TextArea id={'content'} value={info['content']} onChange={onChange} style={{height: 500}}/>
                    </div>


                    <div style={{paddingTop: 10}}>

                        <Button type={'primary'} size={'small'} style={{marginRight: 8}}
                                onClick={saveFunc}><SaveOutlined/>저장</Button>

                        {/*@ts-ignored*/}
                        <Button type={'danger'} size={'small'}
                                onClick={() => setInfo(codeDiplomaReadInitial)}><RetweetOutlined/>초기화</Button>

                         {/*@ts-ignored*/}
                        <Button type={'dashed'} size={'small'} style={{fontSize: 11, marginLeft:5,}} onClick={downloadExcel}>
                           <FileExcelOutlined/>출력
                        </Button>

                    </div>

                </Card>
            </Card>

        </div>
    </LayoutComponent>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {


    let param = {}

    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);

    const result = await getData.post('officialDocument/getOfficialDocumentList', {
        "searchStartDate": moment().subtract(1, 'years').format('YYYY-MM-DD'),              // 작성일자 시작일
        "searchEndDate": moment().format('YYYY-MM-DD'),
        "searchDocumentNumber": "",           // 문서번호 검색
        "page": 1,
        "limit": -1
    });

    console.log(result?.data?.entity,'result?.data?.entity:')

    if (userInfo) {
        store.dispatch(setUserInfo(userInfo));
    }
    if (codeInfo !== 1) {
        param = {
            redirect: {
                destination: '/', // 리다이렉트할 대상 페이지
                permanent: false, // true로 설정하면 301 영구 리다이렉트, false면 302 임시 리다이렉트
            },
        };
    } else {
        // result?.data?.entity?.estimateRequestList
        param = {
            props: {dataList: result?.data?.entity}
        }
    }

    return param
})