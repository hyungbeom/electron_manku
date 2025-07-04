// 폰트 설정 (기본 한글 폰트 필요 시 추가해야 함)
import styles from "@/component/util/Common";
import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer';
import React from "react";
import {commonManage} from "@/utils/commonManage";
import {amountFormat} from "@/utils/columnList";

Font.register({
    family: 'NotoSansKR',
    src: '/NotoSansKR-Regular.ttf',
});


Font.register({
    family: 'NotoSansKR_large',
    src: '/NotoSansKR-Bold.ttf',
});


const colWidths = [40, 210, 50, 50, 110, 110];

export function NewPdfForm({
                               data,
                               topInfoData,
                               totalData,
                               type = '',
                               bottomInfo = '▶의뢰하신 Model로 기준한 견적입니다.\n▶계좌번호 :  (기업은행)069-118428-04-010/만쿠솔루션\n▶긴급 납기시 담당자와 협의가능합니다.\n▶견적서에 기재되지 않은 서류 및 성적서는 미 포함 입니다.'
                           }) {

    return <Document>
        <Page size="A4" style={styles.page}>
            <View>
                {/* 상단 헤더 */}
                <View style={styles.header}>
                    <View style={styles.leftInfo}>
                        <Image src="/kor.png" style={styles.logo}/>
                    </View>
                    <View style={styles.centerTitle}>
                        <Text style={styles.title}>견&nbsp;&nbsp;&nbsp;&nbsp;적&nbsp;&nbsp;&nbsp;&nbsp;서</Text>
                    </View>
                    {/*<View style={styles.rightInfo}>*/}
                    <View style={styles.companyInfo}>
                        <View style={{   justifyContent: 'flex-start', width : 140}}>
                        <Text>(주) 만쿠솔루션</Text>
                        <Text>Manku Solution Co., Ltd</Text>
                        <Text>서울시 송파구 충민로 52</Text>
                        <Text>가든파이브웍스 B동 2층 211호, 212호</Text>
                        <Text>Tel : 02-465-7838, Fax : 02-465-7839</Text>
                        </View>
                        <Image
                            src="/stamp.png"
                            style={{
                                position: 'absolute',
                                top: -17,
                                right: 0,
                                width: 55,
                            }}
                        />

                    </View>

                    {/*</View>*/}
                </View>

                <View style={styles.titleLine}/>


                {/* 상단 정보 */}
                <View style={styles.infoRow}>
                    <Text style={styles.label}>견적일자 :</Text>
                    <Text style={styles.value}>{topInfoData?.writtenDate}</Text>
                    <Text style={styles.labelRight}>담당자 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.name}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>견적서 No :</Text>
                    <Text style={styles.value}>{topInfoData?.documentNumberFull}</Text>
                    <Text style={styles.labelRight}>연락처 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.contactNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>고객사 :</Text>
                    <Text style={styles.value}>{topInfoData?.customerName}</Text>
                    <Text style={styles.labelRight}>E-mail :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>담당자 :</Text>
                    <Text style={styles.value}>{topInfoData?.customerManagerName}</Text>
                    <Text style={styles.labelRight}>유효기간 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.validityPeriod}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>연락처 :</Text>
                    <Text style={styles.value}>{topInfoData?.customerManagerPhone}</Text>
                    <Text style={styles.labelRight}>결제조건 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.paymentTerms}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>E-mail :</Text>
                    <Text style={styles.value}>{topInfoData?.customerManagerEmail}</Text>
                    <Text style={styles.labelRight}>납기 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.delivery}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Fax :</Text>
                    <Text style={styles.value}>{topInfoData?.faxNumber}</Text>
                    <Text style={styles.labelRight}>납품조건 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.shippingTerms}</Text>
                </View>


                {/* 표 */}
                <View style={styles.table}>
                    {/* 테이블 헤더 */}
                    <View style={styles.tableHeader}>
                        <View style={{...styles.point, width: 250}}>
                            <Text style={{textAlign: 'center'}}>Specification</Text>
                        </View>
                        <View style={{...styles.point, width: 100}}>
                            <Text style={{textAlign: 'center'}}>Q`ty</Text>
                        </View>
                        <View style={{...styles.point, width: 110}}>
                            <Text style={{textAlign: 'center'}}>Unit Price</Text>
                        </View>
                        <View style={{...styles.point, width: 110, borderRightWidth: 0}}>
                            <Text style={{textAlign: 'center'}}>Amount</Text>
                        </View>
                    </View>

                    {/* 1번째 빈 행 */}
                    <View style={styles.tableRow}>
                        <View style={{...styles.cell, flex: 1}}><Text>&nbsp;</Text></View>
                    </View>

                    {/* 2번째 maker 행 */}
                    {type !== 'total' ? <View style={styles.tableRow}>
                        <View style={{...styles.point, width: colWidths[0]}}>
                            <Text style={{textAlign: 'center'}}>Maker</Text>
                        </View>
                        <View style={{...styles.cell, width: 530, borderRightWidth: 0}}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 5,
                                fontFamily: styles.point.fontFamily
                            }}>{topInfoData?.maker}</Text>
                        </View>
                    </View> : <></>}

                    {/* 내용 행 반복 */}
                    {data[0]?.map((row: any, i) => {
                        const {model, quantity, unit, net, modelIndex, documentNumberFull} = row;
                        return <> <View key={i} style={styles.tableRow}>

                            {documentNumberFull ?
                                <>
                                    <View key={i} style={{
                                        ...styles.cell,
                                        width: colWidths[0] + colWidths[1],
                                    }}>
                                        <Text style={{textAlign: 'left', paddingLeft: 5}}>{documentNumberFull}</Text>
                                    </View>
                                    <View key={i} style={{...styles.cell, width: colWidths[2]}}></View>
                                    <View key={i} style={{...styles.cell, width: colWidths[3]}}></View>
                                    <View key={i} style={{...styles.cell, width: colWidths[4]}}></View>
                                    <View key={i}
                                          style={{...styles.cell, width: colWidths[5], borderRightWidth: 0}}></View>
                                </>
                                :
                                <>
                                    <View key={i} style={{
                                        ...styles.cell,
                                        width: colWidths[0],
                                    }}>
                                        <Text
                                            style={{textAlign: 'center'}}>{type === 'total' ? modelIndex : i + 1}</Text>
                                    </View>
                                    <View key={i} style={{
                                        ...styles.cell,
                                        width: colWidths[1],
                                    }}>
                                        <Text style={{textAlign: 'left', paddingLeft: 5}}>{model}</Text>
                                    </View>
                                    {modelIndex === 'Maker' ?
                                        <>
                                            <View key={i} style={{...styles.cell, width: colWidths[2]}}></View>
                                            <View key={i} style={{...styles.cell, width: colWidths[3]}}></View>
                                            <View key={i} style={{...styles.cell, width: colWidths[4]}}></View>
                                            <View key={i} style={{
                                                ...styles.cell,
                                                width: colWidths[5],
                                                borderRightWidth: 0
                                            }}></View>
                                        </>
                                        :
                                        <>
                                            <View key={i} style={{
                                                ...styles.cell,
                                                width: colWidths[2],
                                            }}>
                                                <Text style={{textAlign: 'right', paddingRight: 5}}>{quantity}</Text>
                                            </View>
                                            <View key={i} style={{
                                                ...styles.cell,
                                                width: colWidths[3],
                                            }}>
                                                <Text style={{textAlign: 'left', paddingLeft: 5}}>{unit}</Text>
                                            </View>
                                            <View key={i} style={{
                                                ...styles.cell,
                                                width: colWidths[4],
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}>
                                                {/*<Text style={{textAlign: 'right', paddingRight: 5}}>{net?.toLocaleString()}</Text>*/}
                                                <Text
                                                    style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                                                <Text
                                                    style={{
                                                        textAlign: 'right',
                                                        paddingRight: 8
                                                    }}>{amountFormat(net)}</Text>
                                            </View>
                                            <View key={i} style={{
                                                ...styles.cell,
                                                width: colWidths[5],
                                                borderRightWidth: 0,
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}>
                                                {/*<Text style={{*/}
                                                {/*    textAlign: 'right',*/}
                                                {/*    paddingRight: 5*/}
                                                {/*}}>{(quantity * net)?.toLocaleString()}</Text>*/}
                                                <Text
                                                    style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                                                <Text
                                                    style={{
                                                        textAlign: 'right',
                                                        paddingRight: 8
                                                    }}>{amountFormat(quantity * net)}</Text>
                                            </View>
                                        </>
                                    }
                                </>
                            }
                        </View>
                        </>
                    })}
                </View>
            </View>

            {/* 하단 푸터 */}
            <View style={styles.bottomSection}>
                {/* TOTAL 행 */}
                {Object.keys(data).length === 1 ? <>
                    <View style={styles.totalRow}>
                        <View style={{...styles.cell, width: colWidths[0]}}/>
                        <View style={{...styles.point, width: colWidths[1]}}><Text
                            style={{textAlign: 'center'}}>TOTAL</Text></View>
                        <View style={{...styles.point, width: colWidths[2]}}><Text
                            style={{textAlign: 'right', paddingRight: 5}}>{totalData?.quantity}</Text></View>
                        <View style={{...styles.point, width: colWidths[3]}}><Text
                            style={{textAlign: 'left', paddingLeft: 5}}>{totalData?.unit}</Text></View>
                        {/*<View style={{*/}
                        {/*    ...styles.point,*/}
                        {/*    width: colWidths[4],*/}
                        {/*    flexDirection: 'row',*/}
                        {/*    justifyContent: 'space-between'*/}
                        {/*}}><Text*/}
                        {/*    style={{textAlign: 'right', paddingRight: 8}}></Text>*/}
                        {/*    <Text*/}
                        {/*        style={{*/}
                        {/*            textAlign: 'right',*/}
                        {/*            paddingRight: 8*/}
                        {/*        }}>(V.A.T) 미포함</Text>*/}
                        {/*</View>*/}
                        <View style={{
                            ...styles.point,
                            width: colWidths[4]
                        }}>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    paddingRight: 8
                                }}>(V.A.T) 미포함</Text>
                        </View>
                        <View style={{
                            ...styles.point,
                            width: colWidths[4],
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}><Text
                            style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    paddingRight: 8
                                }}>
                                {amountFormat(totalData?.total)}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text>{bottomInfo}</Text>
                    </View>
                </> : <></>}
                <Text style={styles.pageNum}>- 1 -</Text>
            </View>
        </Page>

        {Object.values(data).map((v: any, idx: number) => {

            if (!idx) {
                return false;
            }

            return <Page size="A4" style={styles.page}>
                <View>

                    {/* 표 */}
                    <View style={styles.table}>
                        {/* 테이블 헤더 */}
                        <View style={styles.tableHeader}>
                            <View style={{...styles.point, width: 250}}>
                                <Text style={{textAlign: 'center'}}>Specification</Text>
                            </View>
                            <View style={{...styles.point, width: 100}}>
                                <Text style={{textAlign: 'center'}}>Q`ty</Text>
                            </View>
                            <View style={{...styles.point, width: 110}}>
                                <Text style={{textAlign: 'center'}}>Unit Price</Text>
                            </View>
                            <View style={{...styles.point, width: 110, borderRightWidth: 0}}>
                                <Text style={{textAlign: 'center'}}>Amount</Text>
                            </View>
                        </View>

                        {/* 내용 행 반복 */}
                        {v.map((row: any, i) => {
                            const count: any = commonManage.getPageIndex(Object.values(data), idx - 1);

                            const {model, quantity, unit, net, documentNumberFull, modelIndex} = row;
                            return <> <View key={i} style={styles.tableRow}>

                                {documentNumberFull ?
                                    <>
                                        <View key={i} style={{
                                            ...styles.cell,
                                            width: colWidths[0] + colWidths[1],
                                        }}>
                                            <Text
                                                style={{textAlign: 'left', paddingLeft: 5}}>{documentNumberFull}</Text>
                                        </View>
                                        <View key={i} style={{...styles.cell, width: colWidths[2]}}></View>
                                        <View key={i} style={{...styles.cell, width: colWidths[3]}}></View>
                                        <View key={i} style={{...styles.cell, width: colWidths[4]}}></View>
                                        <View key={i}
                                              style={{...styles.cell, width: colWidths[5], borderRightWidth: 0}}></View>
                                    </>
                                    :
                                    <>
                                        <View key={i} style={{
                                            ...styles.cell,
                                            width: colWidths[0],
                                        }}>
                                            <Text
                                                style={{textAlign: 'center'}}>{type === 'total' ? modelIndex : count + i + 1}</Text>
                                        </View>
                                        <View key={i} style={{
                                            ...styles.cell,
                                            width: colWidths[1],
                                        }}>
                                            <Text style={{textAlign: 'left', paddingLeft: 5}}>{model}</Text>
                                        </View>
                                        {modelIndex === 'Maker' ?
                                            <>
                                                <View key={i} style={{...styles.cell, width: colWidths[2]}}></View>
                                                <View key={i} style={{...styles.cell, width: colWidths[3]}}></View>
                                                <View key={i} style={{...styles.cell, width: colWidths[4]}}></View>
                                                <View key={i} style={{
                                                    ...styles.cell,
                                                    width: colWidths[5],
                                                    borderRightWidth: 0
                                                }}></View>
                                            </>
                                            :
                                            <>
                                                <View key={i} style={{
                                                    ...styles.cell,
                                                    width: colWidths[2],
                                                }}>
                                                    <Text
                                                        style={{textAlign: 'right', paddingRight: 5}}>{quantity}</Text>
                                                </View>
                                                <View key={i} style={{
                                                    ...styles.cell,
                                                    width: colWidths[3],
                                                }}>
                                                    <Text style={{textAlign: 'left', paddingLeft: 5}}>{unit}</Text>
                                                </View>
                                                <View key={i} style={{
                                                    ...styles.cell,
                                                    width: colWidths[4],
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    {/*<Text style={{textAlign: 'right', paddingRight: 5}}>{net?.toLocaleString()}</Text>*/}
                                                    <Text
                                                        style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                                                    <Text
                                                        style={{
                                                            textAlign: 'right',
                                                            paddingRight: 8
                                                        }}>{amountFormat(net)}</Text>
                                                </View>
                                                <View key={i} style={{
                                                    ...styles.cell,
                                                    width: colWidths[5],
                                                    borderRightWidth: 0,
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    {/*<Text style={{*/}
                                                    {/*    textAlign: 'right',*/}
                                                    {/*    paddingRight: 5*/}
                                                    {/*}}>{(quantity * net)?.toLocaleString()}</Text>*/}
                                                    <Text
                                                        style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                                                    <Text
                                                        style={{
                                                            textAlign: 'right',
                                                            paddingRight: 8
                                                        }}>{amountFormat(quantity * net)}</Text>
                                                </View>
                                            </>
                                        }
                                    </>
                                }
                            </View>
                            </>
                        })}
                    </View>
                </View>

                {/* 하단 푸터 */}
                <View style={styles.bottomSection}>
                    {/* TOTAL 행 */}


                    {Object.keys(data).length - 1 === idx ? <>
                        <View style={styles.totalRow}>
                            <View style={{...styles.cell, width: colWidths[0]}}/>
                            <View style={{...styles.point, width: colWidths[1]}}><Text
                                style={{textAlign: 'center'}}>TOTAL</Text></View>
                            <View style={{...styles.point, width: colWidths[2]}}><Text
                                style={{textAlign: 'right', paddingRight: 5}}>{totalData?.quantity}</Text></View>
                            <View style={{...styles.point, width: colWidths[3]}}><Text
                                style={{textAlign: 'left', paddingLeft: 5}}>{totalData?.unit}</Text></View>
                            {/*<View style={{*/}
                            {/*    ...styles.point,*/}
                            {/*    width: colWidths[4],*/}
                            {/*    flexDirection: 'row',*/}
                            {/*    justifyContent: 'space-between'*/}
                            {/*}}><Text*/}
                            {/*    style={{textAlign: 'right', paddingRight: 8}}>₩</Text>*/}
                            {/*    <Text*/}
                            {/*        style={{*/}
                            {/*            textAlign: 'right',*/}
                            {/*            paddingRight: 8*/}
                            {/*        }}>(V.A.T) 미포함</Text>*/}
                            {/*</View>*/}
                            <View style={{
                                ...styles.point,
                                width: colWidths[4]
                            }}>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>(V.A.T) 미포함</Text>
                            </View>
                            <View style={{
                                ...styles.point,
                                width: colWidths[4],
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}><Text
                                style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>{amountFormat(totalData?.total)}</Text>
                            </View>
                        </View>

                        {/* footer */}
                        <View style={styles.footer}>
                            <Text>{bottomInfo}</Text>

                        </View>

                    </> : <></>}


                    <Text style={styles.pageNum}>- {idx + 1} -</Text>
                </View>
            </Page>
        })
        }
    </Document>
}

