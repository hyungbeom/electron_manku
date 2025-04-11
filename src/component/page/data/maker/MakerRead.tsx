import React, {memo, useEffect, useRef, useState} from "react";
import {getData} from "@/manage/function/api";
import {makerColumn,} from "@/utils/columnList";
import {codeDomesticPurchaseInitial, orderReadInitial,} from "@/utils/initialList";
import TableGrid from "@/component/tableGrid";
import {inputForm, MainCard, radioForm, TopBoxCard} from "@/utils/commonForm";
import {searchMaker} from "@/utils/api/mainApi";
import {commonManage, gridManage} from "@/utils/commonManage";
import Spin from "antd/lib/spin";
import Popconfirm from "antd/lib/popconfirm";
import {ExclamationCircleOutlined, ReloadOutlined, SaveOutlined, SearchOutlined} from "@ant-design/icons";
import Button from "antd/lib/button";
import moment from "moment/moment";
import {useNotificationAlert} from "@/component/util/NoticeProvider";
import message from "antd/lib/message";
import _ from "lodash";
import Space from "antd/lib/space";
import ReceiveComponent from "@/component/ReceiveComponent";


function MakerRead({getPropertyId, getCopyPage}: any) {
    const gridRef = useRef(null);
    const notificationAlert = useNotificationAlert();
    const copyInit = _.cloneDeep(codeDomesticPurchaseInitial)
    const [info, setInfo] = useState({...copyInit});
    const [mini, setMini] = useState(true);
    const [totalRow, setTotalRow] = useState(0);
    const [loading, setLoading] = useState(false);

    const [isSearch, setIsSearch] = useState(false);
    useEffect(() => {
        if (isSearch) {
            searchInfo(true);
            setIsSearch(false);
        }
    }, [isSearch]);

    const onGridReady = async (params) => {
        gridRef.current = params.api;
        await searchMaker({data: orderReadInitial}).then(v => {
            params.api.applyTransaction({add: v.data});
            setTotalRow(v.pageInfo.totalRow)
        })
    };

    function handleKeyPress(e) {
        if (e.key === 'Enter') {
            searchInfo(true)
        }
    }

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

    async function moveRouter() {
        getCopyPage('maker_write', {})
    }

    async function searchInfo(e) {
        if (e) {
            setLoading(true)
            await searchMaker({
                data: {
                    "searchType": info['searchType'],      // 1: 코드, 2: 상호명, 3: Maker
                    "searchText": info['searchText'],
                    "page": 1,
                    "limit": -1
                }
            }).then(v => {
                gridManage.resetData(gridRef, v.data);
                setTotalRow(v.pageInfo.totalRow)
                setLoading(false)
            })
        }
    }

    function clearAll() {
        gridRef.current.deselectAll();
        setInfo({...copyInit});
        setIsSearch(true);
    }

    async function deleteList() {
        if (gridRef.current.getSelectedRows().length < 1) {
            return message.error('삭제할 Maker를 선택해주세요.')
        }
        setLoading(true)

        const list = gridRef.current.getSelectedRows()
        const filterList = list.map(v => v.makerId);

        await getData.post('maker/deleteMakers', {makerIdList: filterList}).then(v => {
            if (v?.data?.code === 1) {
                searchInfo(true)
                notificationAlert('success', '🗑️Maker 삭제완료',
                    <>
                        <div>Maker
                            : {list[0].makerName} {list.length > 1 ? ('외' + " " + (list.length - 1) + '개') : ''} 이(가)
                            삭제되었습니다.
                        </div>
                        <div>삭제일자 : {moment().format('YYYY-MM-DD HH:mm:ss')}</div>
                    </>
                    , null, null, 2
                )
            } else {
                message.error(v?.data?.message)
            }
            setLoading(false)
        })
    }

    return <Spin spinning={loading} tip={'Maker 조회중...'}>
        <ReceiveComponent searchInfo={searchInfo}/>
        <div style={{
            display: 'grid',
            gridTemplateRows: `${mini ? '150px' : '65px'} calc(100vh - ${mini ? 280 : 195}px)`,
            columnGap: 5
        }}>
            <MainCard title={'메이커 조회'}
                      list={[{
                          name: <div><SaveOutlined style={{paddingRight: 8}}/>신규작성</div>,
                          func: moveRouter,
                          type: ''
                      }]}
                      mini={mini} setMini={setMini}>

                {mini ?
                    <TopBoxCard title={''} grid={'240px 270px 190px'}>
                        <Space style={{marginTop: 10}}>
                            {radioForm({
                                title: '',
                                id: 'searchType',
                                onChange: onChange,
                                data: info,
                                list: [{value: 1, title: 'Maker'},
                                    {value: 2, title: 'Item'},
                                    {value: 3, title: 'AREA'}],
                            })}
                        </Space>
                        <div style={{marginTop: 5}}>
                            {inputForm({
                                title: '',
                                id: 'searchText',
                                onChange: onChange,
                                handleKeyPress: handleKeyPress,
                                data: info,
                                size: 'middle'
                            })}
                        </div>
                        <Space size={10}>
                            <Button type="primary" size="small" style={{fontSize: 11}} onClick={searchInfo}>
                                <SearchOutlined/>조회
                            </Button>
                            <Button type="primary" danger size="small" style={{fontSize: 11}} onClick={clearAll}>
                                <ReloadOutlined/>초기화
                            </Button>
                        </Space>
                    </TopBoxCard>
                    : <></>}
            </MainCard>

            {/*@ts-ignored*/}
            <TableGrid
                deleteComp={<Popconfirm
                    title="삭제하시겠습니까?"
                    onConfirm={deleteList}
                    icon={<ExclamationCircleOutlined style={{color: 'red'}}/>}>
                    <Button type={'primary'} danger size={'small'} style={{fontSize: 11, marginLeft: 5}}>삭제</Button>
                </Popconfirm>
                }
                totalRow={totalRow}
                getPropertyId={getPropertyId}
                gridRef={gridRef}
                columns={makerColumn}
                onGridReady={onGridReady}
                funcButtons={['agPrint']}
            />
        </div>
    </Spin>
}

export default memo(MakerRead, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});