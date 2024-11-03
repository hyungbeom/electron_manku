import Modal from "antd/lib/modal/Modal";
import React, {useEffect, useState} from "react";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import InputNumber from "antd/lib/input-number";
import Card from "antd/lib/card/Card";
import {TagTypeList} from "@/utils/common";
import Select from "antd/lib/select";
import TextArea from "antd/lib/input/TextArea";
import DatePicker from "antd/lib/date-picker";
import moment from "moment";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";

export default function TableModal({title, initialData, dataInfo, setInfoList, listType,
                                       searchInfo=undefined, isModalOpen=false, setIsModalOpen=undefined, itemId=null, setItemId=undefined }:any) {
    const [detailList, setDetailList] = useState<any>(initialData)

    console.log(detailList, 'initialData')

    useEffect(()=>{
        if(itemId){
            getListFunc(listType, itemId)
        }
    }, [itemId, listType])


    async function showModal () {
        setIsModalOpen(true);
    }

    const handleOk = () => {

        setInfoList(v => {
            let copyData = {...detailList}
            copyData['replyDate'] = moment(detailList['replyDate']).format('YYYY-MM-DD');
            copyData['receiptDate'] = moment(detailList['receiptDate']).format('YYYY-MM-DD');
            copyData['remainingQuantity'] = detailList['receiptQuantity']-detailList['usageQuantity'];

            if(listType==='inventoryList'){
                if(itemId===null){
                    return saveFunc(listType, copyData)
                }else {
                    return updateFunc(listType, copyData)
                }
            }

            const copyData2 = {...v}
            // console.log(copyData2,'copyData2:')
            copyData2[listType].push(copyData);


            copyData2[listType].forEach((v, idx)=>{
                copyData2[listType][idx]['serialNumber']  = idx + 1;
                copyData2[listType][idx]['key']  = idx + 1;
            })

            console.log(copyData2, 'copyData2')
            return copyData2;
        })
        setIsModalOpen(false);
        itemId && setItemId(null);
        setDetailList(initialData);
        console.log(detailList, 'detailList')
    };

    async function getListFunc(listType, itemId){

        let url=''
        let searchKey=''

        switch (listType){
            case 'inventoryList':
                url = `inventory/getInventoryList`;
                searchKey = "searchInventoryId"
                break;
        }

        const requestData={
            [searchKey]:itemId,
            page: 1,
            limit: 10
        }

        const result=await getData.post(url,requestData);
        // console.log(result?.data?.entity?.inventoryList[0], 'result~~')
        setDetailList(result?.data?.entity?.inventoryList[0])

    }

    async function saveFunc(listType, copyData){

        let url=''

        switch (listType){
            case 'inventoryList':
                url = 'inventory/addInventory'
                break;
        }

        await getData.post(url, copyData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다')
            }
        })
    }

    async function updateFunc(listType, copyData){

        let url=''

        switch (listType){
            case 'inventoryList':
                url = 'inventory/updateInventory'
                break;
        }

        await getData.post(url, copyData).then(v => {
            if (v.data.code === 1) {
                message.success('수정되었습니다')
            }
            searchInfo()
        })
    }

    const handleCancel = () => {
        setIsModalOpen(false);
        itemId && setItemId(null);
        setDetailList(initialData)
    };


    function inputChange(e) {
        let bowl = {};
        bowl[e.target.id] = e.target.value;

        // console.log(e.target.id, 'e.target.id')

        setDetailList(v => {
            return {...v, ...bowl}
        })
    }

    return <>  <Button type={'primary'} style={{margin:'10px 0', height:30, width:60, float: 'left', borderRadius : 5}} onClick={showModal} size={'small'}>Add</Button><Modal
        open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Card title={title} style={{marginTop: 30}}>
            {Object.keys(initialData).map(v => {
                switch (TagTypeList[v]?.type) {
                    case 'input' :
                        return <div style={{paddingTop: 8,}}>
                            <div>{dataInfo[v]?.title}</div>
                            <Input id={v} value={detailList[v]} onChange={inputChange}/>
                        </div>
                    case 'inputNumber' :
                        return <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <InputNumber id={v} value={detailList[v]}
                                         onChange={(src) => inputChange({target: {id: v, value: src}})} style={{width : '100%'}}/>
                        </div>
                    case 'select' :
                        return <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <Select id={v} value={detailList[v]} onChange={(src) => inputChange({target: {id: v, value: src}})}   options={
                                TagTypeList[v]?.boxList?.map((src, idx) => {
                                    return {value: src, label: src}
                                })
                            } style={{margin : `7px 0`, fontSize : 11, width : '100%', height : 28}}>
                            </Select>
                        </div>
                    case 'textArea' :
                        return  <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <TextArea id={v} value={detailList[v]} onChange={inputChange}/>
                        </div>
                    case 'date' :
                        return  <div style={{paddingTop: 8}}>
                            <div>{dataInfo[v]?.title}</div>
                            <DatePicker id={v} style={{width : '100%'}} onChange={(src)=>inputChange({target : {id : v, value : src}})}/>
                        </div>
                }

            })}
        </Card>
    </Modal></>
}

// @ts-ignored
// export const getServerSideProps = wrapper.getStaticProps(( listType, itemId, store: any) => async (ctx: any) => {
//
//     let param = {}
//
//     // const {userInfo} = await initialServerRouter(ctx, store);
//
//     // if (!userInfo) {
//     //     return {
//     //         redirect: {
//     //             destination: '/', // 리다이렉트할 경로
//     //             permanent: false, // true면 301 리다이렉트, false면 302 리다이렉트
//     //         },
//     //     };
//     // }
//
//     // store.dispatch(setUserInfo(userInfo));
//
//     if(listType==='inventoryList')
//
//
//     const {orderId} = ctx.query;
//
//
//     const result = await getData.post(`inventory/deleteInventory?inventoryId=${itemId}`);
//
//
//     return {props: {dataInfo: orderId ? result?.data?.entity?.orderList[0] : null}}
// })