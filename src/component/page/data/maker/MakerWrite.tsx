import React, {useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {wrapper} from "@/store/store";
import initialServerRouter from "@/manage/function/initialServerRouter";
import {setUserInfo} from "@/store/user/userSlice";
import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";

import Button from "antd/lib/button";
import {RetweetOutlined, SaveOutlined} from "@ant-design/icons";
import message from "antd/lib/message";
import {makerWriteInitial,} from "@/utils/initialList";
import Input from "antd/lib/input/Input";
import TextArea from "antd/lib/input/TextArea";
import {commonManage} from "@/utils/commonManage";
import {BoxCard, datePickerForm, inputForm, MainCard, textAreaForm, tooltipInfo} from "@/utils/commonForm";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import {DriveUploadComp} from "@/component/common/SharePointComp";
import PanelSizeUtil from "@/component/util/PanelSizeUtil";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import moment from "moment/moment";

export default function MakerWrite({copyPageInfo}) {
    const notificationAlert = useNotificationAlert();
    const [info, setInfo] = useState(makerWriteInitial);
    const groupRef = useRef<any>(null)
    const infoRef = useRef<any>(null)

    const getSavedSizes = () => {
        const savedSizes = localStorage.getItem('maker_write');
        return savedSizes ? JSON.parse(savedSizes) : [20, 20, 20, 0]; // 기본값 [50, 50, 50]
    };

    const [sizes, setSizes] = useState(getSavedSizes); // 패널 크기 상태


    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function saveFunc() {

        await getData.post('maker/addMaker', info).then(v => {
            console.log(info,'v.data:')
            if(v.data.code === 1){
                notificationAlert('success', '💾Maker 등록완료',
                    <>
                        <div>Maker : {info['makerName']}</div>
                        <div>Log : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    ,null,
                    {cursor: 'pointer'}
                )
            } else {
                message.error(v.data.message)
            }
        });

    }

    return <div ref={infoRef}>
        <PanelSizeUtil groupRef={groupRef} storage={'maker_write'}/>
        <MainCard title={'메이커 등록'} list={[
            {name: '저장', func: saveFunc, type: 'primary'},
            {name: '초기화', func: null, type: 'danger'}
        ]}>
            <PanelGroup ref={groupRef} className={'ground'} direction="horizontal"
                        style={{gap: 0.5, paddingTop: 3}}>
                <Panel defaultSize={sizes[0]} minSize={5}>
                    <BoxCard title={'Maker 정보'} tooltip={tooltipInfo('readProject')}>
                        {inputForm({
                            title: 'Maker',
                            id: 'makerName',
                            onChange : onChange,
                            data : info
                        })}
                        {inputForm({
                            title: 'Item',
                            id: 'item',
                            onChange : onChange,
                            data : info
                        })}
                        {inputForm({
                            title: '홈페이지',
                            id: 'homepage',
                            onChange : onChange,
                            data : info
                        })}
                        {inputForm({
                            title: '한국대리점',
                            id: 'koreanAgency',
                            onChange : onChange,
                            data : info
                        })}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle id={'resize'} className={'ground'}/>
                <Panel defaultSize={sizes[1]} minSize={5}>
                    <BoxCard title={'담당자 정보'} tooltip={tooltipInfo('customer')}>
                        {inputForm({
                            title: 'AREA',
                            id: 'area',
                            onChange : onChange,
                            data : info
                        })}
                        {inputForm({
                            title: '원산지',
                            id: 'origin',
                            onChange : onChange,
                            data : info
                        })}
                        {inputForm({
                            title: '담당자 확인',
                            id: 'managerConfirm',
                            onChange : onChange,
                            data : info
                        })}
                        {inputForm({
                            title: '직접 확인',
                            id: 'directConfirm',
                            onChange : onChange,
                            data : info
                        })}
                    </BoxCard>
                </Panel>
                <PanelResizeHandle/>
                <Panel defaultSize={sizes[2]} minSize={5}>
                    <BoxCard title={'기타 정보'} tooltip={tooltipInfo('etc')}>
                        {textAreaForm({
                            title: '지시사항',
                            rows: 2,
                            id: 'instructions',
                            onChange : onChange,
                            data : info
                        })}
                    </BoxCard>
                </Panel>

            </PanelGroup>
        </MainCard>

            {/*<div style={{display: 'grid', gridTemplateRows: 'auto 1fr', columnGap: 5}}>*/}
            {/*    <Card title={<span style={{fontSize: 12,}}>Maker 등록</span>} headStyle={{marginTop: -10, height: 30}}*/}
            {/*          style={{border: '1px solid lightGray',}} bodyStyle={{padding: '10px 24px'}}>*/}

            {/*        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', width: '100%', columnGap: 20}}>*/}

            {/*            <Card size={'small'} style={{*/}
            {/*                fontSize: 11,*/}
            {/*                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',*/}
            {/*            }}>*/}

            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>Maker</div>*/}
            {/*                    <Input id={'makerName'} value={info['makerName']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>Item</div>*/}
            {/*                    <Input id={'item'} value={info['item']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>홈페이지</div>*/}
            {/*                    <Input id={'homepage'} value={info['homepage']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>한국대리점</div>*/}
            {/*                    <Input id={'koreanAgency'} value={info['koreanAgency']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}

            {/*            </Card>*/}

            {/*            <Card size={'small'} style={{*/}
            {/*                fontSize: 11,*/}
            {/*                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',*/}
            {/*            }}>*/}
            {/*                <div>*/}
            {/*                    <div style={{paddingBottom: 3}}>AREA</div>*/}
            {/*                    <Input id={'area'} value={info['area']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>원산지</div>*/}
            {/*                    <Input id={'origin'} value={info['origin']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>담당자 확인</div>*/}
            {/*                    <Input id={'managerConfirm'} value={info['managerConfirm']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>직접 확인</div>*/}
            {/*                    <Input id={'directConfirm'} value={info['directConfirm']} onChange={onChange}*/}
            {/*                           size={'small'}/>*/}
            {/*                </div>*/}
            {/*            </Card>*/}

            {/*            <Card size={'small'} style={{*/}
            {/*                fontSize: 11,*/}
            {/*                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',*/}
            {/*            }}>*/}

            {/*                <div style={{marginTop: 8}}>*/}
            {/*                    <div style={{paddingBottom: 3}}>지시사항</div>*/}
            {/*                    <TextArea id={'instructions'} value={info['instructions']} onChange={onChange}*/}
            {/*                              size={'small'}/>*/}
            {/*                </div>*/}
            {/*            </Card>*/}
            {/*        </div>*/}

            {/*        <div style={{marginTop: 8, width:'100%', textAlign:'right'}}>*/}
            {/*            <Button type={'primary'} size={'small'} style={{fontSize: 11, marginRight: 8}}*/}
            {/*                    onClick={saveFunc}><SaveOutlined/>저장</Button>*/}

            {/*            /!*@ts-ignored*!/*/}
            {/*            <Button type={'danger'} size={'small'} style={{fontSize: 11,}}*/}
            {/*                    onClick={() => setInfo(makerWriteInitial)}><RetweetOutlined/>초기화</Button>*/}

            {/*        </div>*/}
            {/*    </Card>*/}

            {/*</div>*/}
        </div>
}

// @ts-ignore
export const getServerSideProps = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const {query} = ctx;



    const {userInfo, codeInfo} = await initialServerRouter(ctx, store);



    if (codeInfo !== 1) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        };
    }
    store.dispatch(setUserInfo(userInfo));

    if (query?.data) {
        const data = JSON.parse(decodeURIComponent(query.data));
        return {props: {dataInfo: data}}
    }

})