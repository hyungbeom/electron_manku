import Modal from "antd/lib/modal/Modal";
import Input from "antd/lib/input/Input";
import Button from "antd/lib/button";
import {AgGridReact} from "ag-grid-react";
import {searchAgencyCodeColumn, searchMakerColumn} from "@/utils/columnList";
import React, {useEffect, useState} from "react";
import {getData} from "@/manage/function/api";
import {tableTheme} from "@/utils/common";
import Card from "antd/lib/card/Card";
import TextArea from "antd/lib/input/TextArea";
import {RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import {codeSaveInitial, makerWriteInitial} from "@/utils/initialList";
import message from "antd/lib/message";

export default function SearchMakerModal({makerData, info, setInfo, isModalOpen, setIsModalOpen}){
    const [data, setData] = useState(makerData)
    const [maker, setMaker] = useState(info['maker']);
    const [writeData, setWriteData] = useState(makerWriteInitial);

    function onChange(e) {

        let bowl = {}
        bowl[e.target.id] = e.target.value;

        setWriteData(v => {
            return {...v, ...bowl}
        })
    }

    async function saveFunc() {

        console.log(writeData, 'writeData')

        let api = '';

        if (writeData['makerId'])
            api = 'maker/updateMaker'
        else
            api = 'maker/addMaker'

        await getData.post(api, writeData).then(v => {
            if (v.data.code === 1) {
                message.success('저장되었습니다.')
                setWriteData(makerWriteInitial);
            } else {
                message.error('저장에 실패하였습니다.')
            }
        });
        searchFunc()

    }

    useEffect(() => {
        searchFunc();
    }, [])

    useEffect(() => {
        setData(makerData);
    }, [makerData])

    async function searchFunc() {
        const result = await getData.post('maker/getMakerList', {
            "searchType": "1",
            "searchText": maker,
            "page": 1,
            "limit": -1
        });

        // console.log(result, 'result~~~~')
        setData(result?.data?.entity?.makerList)

    }

    function handleKeyPress(e){
        if (e.key === 'Enter') {
            searchFunc();
        }
    }

    return <>
         <Modal
        // @ts-ignored
        id={'event1'}
        title={'maker 조회'}
        onCancel={() => setIsModalOpen({event1: false, event2: false, event3: false})}
        open={isModalOpen?.event3}
        width={'50vw'}
        onOk={() => setIsModalOpen({event1: false, event2: false, event3: false})}
    >
        <div style={{height: '80vh'}}>
            <div style={{display:'flex', justifyContent:'space-between', gap:15, marginBottom: 10}}>
                <Input style={{width:'100%'}} onKeyDown={handleKeyPress} id={'maker'} value={maker} onChange={(e)=>setMaker(e.target.value)}></Input>
                <Button onClick={searchFunc}>조회</Button>
            </div>

            <AgGridReact containerStyle={{height:'50%', width:'100%', marginBottom:10 }} theme={tableTheme}
                         onCellClicked={(e)=>{
                             setWriteData(v=>{
                                 return {
                                     ...v, ... e.data
                                 }})
                         }}
                         onCellDoubleClicked={(e)=>{
                             setInfo(v=>{
                                 return {
                                     ...v,
                                     maker: e.data.makerName,
                                     item: e.data.item,
                                     instructions: e.data.instructions,
                                 }})
                             setIsModalOpen({event1: false, event2: false, event3: false})
                         }}
                         rowData={data}
                         columnDefs={searchMakerColumn}
                         pagination={true}

            />
            <Card title={<span style={{fontSize: 12,}}>Maker 등록 / 수정</span>} headStyle={{marginTop: -10, height: 30}}
                  style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>

                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', columnGap: 20}}>

                    <div>
                        <div style={{fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>MAKER</div>
                            <Input id={'makerName'} value={writeData['makerName']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>ITEM</div>
                            <Input id={'item'} value={writeData['item']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>홈페이지</div>
                            <Input id={'homepage'} value={writeData['homepage']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>한국매입처</div>
                            <Input id={'koreanAgency'} value={writeData['koreanAgency']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                    </div>

                    <div>
                        <div style={{fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>AREA</div>
                            <Input id={'area'} value={writeData['area']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>원산지</div>
                            <Input id={'origin'} value={writeData['origin']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>담당자 확인</div>
                            <Input id={'managerConfirm'} value={writeData['managerConfirm']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>직접 확인</div>
                            <Input id={'directConfirm'} value={writeData['directConfirm']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>
                    </div>
                    <div>
                        <div style={{marginTop: 8, fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>FTA-No</div>
                            <Input id={'ftaNumber'} value={writeData['ftaNumber']} onChange={onChange}
                                   style={{fontSize: 11}} size={'small'}/>
                        </div>

                        <div style={{fontSize: 11}}>
                            <div style={{paddingBottom: 3}}>지시사항</div>
                            <TextArea id={'instructions'} value={writeData['instructions']} onChange={onChange}
                                      style={{fontSize: 11, height: '79%'}} size={'small'}/>
                        </div>
                    </div>

                </div>

                <div style={{width: '100%', textAlign: 'right'}}>
                    <Button type={'primary'} size={'small'} style={{fontSize: 11, marginRight: 8}}
                            onClick={saveFunc}><SaveOutlined/>{writeData['makerId'] ? '수정' : '등록'}</Button>

                    {/*@ts-ignored*/}
                    <Button type={'danger'} size={'small'} style={{fontSize: 11,}}
                            onClick={() => setWriteData(makerWriteInitial)}><RetweetOutlined/>초기화</Button>

                </div>
            </Card>
        </div>
         </Modal>
    </>
}