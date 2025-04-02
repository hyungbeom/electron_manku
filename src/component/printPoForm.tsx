// 폰트 설정 (기본 한글 폰트 필요 시 추가해야 함)
import styles from "@/component/util/Common";
import {Document, Font, Image, Page, Text, View} from '@react-pdf/renderer';
import React from "react";
import {commonManage} from "@/utils/commonManage";

Font.register({
    family: 'NotoSansKR',
    src: '/NotoSansKR-Regular.ttf',
});
Font.register({
    family: 'NotoSansKR_large',
    src: '/NotoSansKR-Bold.ttf',
});


const colWidths = [50, 210, 45, 45, 100, 100, 100];


export function PdfForm({data, topInfoData, totalData}) {

    return <Document>
        <Page size="A4" style={styles.page}>
            <View>
                {/* 상단 헤더 */}
                <View style={styles.header}>
                    <View style={styles.logoInfo}>
                        <Image src="/manku_ci_black_text.png" style={styles.logo}/>
                    </View>
                    <View style={styles.leftInfo}>
                        <Text>(주) 만쿠무역</Text>
                        <Text>Manku Trading Co., Ltd</Text>
                        <Text>서울시 송파구 충민로 52 가든파이브웍스</Text>
                        <Text>B동 2층 211호, 212호</Text>
                        <Text>Tel : 02-465-7838, Fax : 02-465-7839</Text>
                    </View>
                    <View style={styles.centerTitle}>
                        <Text style={styles.title}>발 주 서</Text>
                    </View>
                    <View style={styles.rightInfo}>
                        <Image src="/manku_stamp_ko.png" style={styles.info}/>
                    </View>
                </View>

                <View style={styles.titleLine}/>

                {/* 상단 정보 */}
                <View style={styles.infoRow}>
                    <Text style={styles.label}>수신처 :</Text>
                    <Text style={styles.value}>{topInfoData?.writtenDate}</Text>
                    <Text style={styles.labelRight}>발주일자 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.writtenDate}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>담당자 :</Text>
                    <Text style={styles.value}>{topInfoData?.managerAdminName}</Text>
                    <Text style={styles.labelRight}>발주번호 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.documentNumberFull}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>납품조건 :</Text>
                    <Text style={styles.value}>{topInfoData?.shippingTerms}</Text>
                    <Text style={styles.labelRight}>귀사견적 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.email}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>결제조건 :</Text>
                    <Text style={styles.value}>{topInfoData?.paymentTerms}</Text>
                    <Text style={styles.labelRight}>담당자 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.validityPeriod}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>납기조건 :</Text>
                    <Text style={styles.value}>{topInfoData?.deliveryTerms}</Text>
                    <Text style={styles.labelRight}>연락처 :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.managerPhoneNumber}</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}></Text>
                    <Text style={styles.value}></Text>
                    <Text style={styles.labelRight}>E-Mail :</Text>
                    <Text style={styles.valueRight}>{topInfoData?.managerEmail}</Text>
                </View>

                {/* 표 */}
                <View style={styles.table}>
                    {/* 테이블 헤더 */}
                    <View style={styles.tableHeader}>
                        <View style={{...styles.point, width: 260}}>
                            <Text style={{textAlign: 'center'}}>Specification</Text>
                        </View>
                        <View style={{...styles.point, width: 90}}>
                            <Text style={{textAlign: 'center'}}>Q`ty</Text>
                        </View>
                        <View style={{...styles.point, width: 100}}>
                            <Text style={{textAlign: 'center'}}>Unit Price</Text>
                        </View>
                        <View style={{...styles.point, width: 100}}>
                            <Text style={{textAlign: 'center'}}>Amount</Text>
                        </View>
                        <View style={{...styles.point, width: 100, borderRightWidth: 0}}>
                            <Text style={{textAlign: 'center'}}>Other</Text>
                        </View>
                    </View>

                    {/* 1번째 빈 행 */}
                    <View style={styles.tableRow}>
                        <View style={{...styles.cell, flex: 1}}><Text>&nbsp;</Text></View>
                    </View>

                    {/* 2번째 maker 행 */}
                    <View style={styles.tableRow}>
                        <View style={{...styles.point, width: colWidths[0]}}>
                            <Text style={{textAlign: 'center'}}>Maker</Text>
                        </View>
                        <View style={{...styles.cell, width: colWidths[1]}}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 5,
                                fontFamily: styles.point.fontFamily
                            }}>{topInfoData?.maker}</Text>
                        </View>
                        <View style={{...styles.cell, width: colWidths[2]}}/>
                        <View style={{...styles.cell, width: colWidths[3]}}/>
                        <View style={{...styles.cell, width: colWidths[4]}}/>
                        <View style={{...styles.cell, width: colWidths[5]}}/>
                        <View style={{...styles.cell, width: colWidths[6], borderRightWidth: 0}}/>
                    </View>

                    {/* 내용 행 반복 */}
                    {data[0]?.map((row: any, i) => {
                        const {model, quantity, unit, net} = row;
                        return <> <View key={i} style={styles.tableRow}>
                            <View key={i} style={{
                                ...styles.cell,
                                width: colWidths[0],
                            }}>
                                <Text style={{textAlign: 'center'}}>{i + 1}</Text>
                            </View>
                            <View key={i} style={{
                                ...styles.cell,
                                width: colWidths[1],
                            }}>
                                <Text style={{textAlign: 'left', paddingLeft: 5}}>{model}</Text>
                            </View>
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
                            }}>
                                <Text style={{textAlign: 'right', paddingRight: 5}}>{net?.toLocaleString()}</Text>
                            </View>
                            <View key={i} style={{
                                ...styles.cell,
                                width: colWidths[5],
                            }}>
                                <Text style={{
                                    textAlign: 'right',
                                    paddingRight: 5
                                }}>{(quantity * net)?.toLocaleString()}</Text>
                            </View>
                            <View key={i} style={{
                                ...styles.cell,
                                width: colWidths[6],
                                borderRightWidth: 0,
                            }}>
                                <Text style={{
                                    textAlign: 'left',
                                    paddingLeft: 5
                                }}></Text>
                            </View>
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
                                }}>{(totalData?.net)?.toLocaleString()}</Text>
                        </View>
                        <View style={{
                            ...styles.point,
                            width: colWidths[5],
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}><Text
                            style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    paddingRight: 8
                                }}>{(totalData?.total)?.toLocaleString()}</Text>
                        </View>
                        <View style={{
                            ...styles.point,
                            width: colWidths[6],
                        }}><Text
                            style={{textAlign: 'left', paddingLeft: 8}}></Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text>· 의뢰하실 Model로 기준한 견적입니다.</Text>
                        <Text>· 계좌번호 : (기업은행)069-118428-04-010/만쿠무역</Text>
                        <Text>· 긴급 납기시 담당자와 협의가능합니다.</Text>
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
                            <View style={{...styles.point, width: 260}}>
                                <Text style={{textAlign: 'center'}}>Specification</Text>
                            </View>
                            <View style={{...styles.point, width: 90}}>
                                <Text style={{textAlign: 'center'}}>Q`ty</Text>
                            </View>
                            <View style={{...styles.point, width: 100}}>
                                <Text style={{textAlign: 'center'}}>Unit Price</Text>
                            </View>
                            <View style={{...styles.point, width: 100}}>
                                <Text style={{textAlign: 'center'}}>Amount</Text>
                            </View>
                            <View style={{...styles.point, width: 100, borderRightWidth: 0}}>
                                <Text style={{textAlign: 'center'}}>Other</Text>
                            </View>
                        </View>

                        {/* 내용 행 반복 */}
                        {v.map((row: any, i) => {
                            const count: any = commonManage.getPageIndex(Object.values(data), idx - 1);

                            const {model, quantity, unit, net} = row;
                            return <> <View key={i} style={styles.tableRow}>
                                <View key={i} style={{
                                    ...styles.cell,
                                    width: colWidths[0],
                                }}>
                                    <Text style={{textAlign: 'center'}}>{count + i + 1}</Text>
                                </View>
                                <View key={i} style={{
                                    ...styles.cell,
                                    width: colWidths[1],
                                }}>
                                    <Text style={{textAlign: 'left', paddingLeft: 5}}>{model}</Text>
                                </View>
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
                                }}>
                                    <Text style={{textAlign: 'right', paddingRight: 5}}>{net?.toLocaleString()}</Text>
                                </View>
                                <View key={i} style={{
                                    ...styles.cell,
                                    width: colWidths[5],
                                    borderRightWidth: 0,
                                }}>
                                    <Text style={{
                                        textAlign: 'right',
                                        paddingRight: 5
                                    }}>{(quantity * net)?.toLocaleString()}</Text>
                                </View>
                                <View key={i} style={{
                                    ...styles.cell,
                                    width: colWidths[6],
                                    borderRightWidth: 0,
                                }}>
                                    <Text style={{
                                        textAlign: 'left',
                                        paddingLeft: 5
                                    }}></Text>
                                </View>
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
                                    }}>{(totalData?.net).toLocaleString()}</Text>
                            </View>
                            <View style={{
                                ...styles.point,
                                width: colWidths[5],
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}><Text
                                style={{textAlign: 'right', paddingRight: 8}}>₩</Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>{(totalData?.total).toLocaleString()}</Text>
                            </View>
                            <View style={{
                                ...styles.point,
                                width: colWidths[6],
                            }}><Text
                                style={{textAlign: 'left', paddingLeft: 8}}></Text>
                            </View>
                        </View>

                        {/* footer */}
                        <View style={styles.footer}>
                            <Text>· 의뢰하실 Model로 기준한 견적입니다.</Text>
                            <Text>· 계좌번호 : (기업은행)069-118428-04-010/만쿠무역</Text>
                            <Text>· 긴급 납기시 담당자와 협의가능합니다.</Text>
                        </View>

                    </> : <></>}


                    <Text style={styles.pageNum}>- {idx + 1} -</Text>
                </View>
            </Page>
        })
        }
    </Document>
}