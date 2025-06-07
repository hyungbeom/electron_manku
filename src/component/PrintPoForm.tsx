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


export function PrintPoForm({data, topInfoData, totalData, bottomInfo, title, lang}) {

    function numberFormat (number, currency = '') {
        if (number === null || number === undefined || number === '') {
            return '';
        }
        const num = Number(number);
        if (isNaN(num)) {
            return '';
        }
        const fixedNum = num.toFixed(3);
        const [integerPart, decimalPart] = fixedNum.split('.');
        const trimmedDecimal = decimalPart.slice(0, 2);
        const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        // return decimalPart !== '00'
        //     ? `${formattedInteger}.${decimalPart}`
        //     : formattedInteger;
        return currency !== 'KRW'
            ? `${formattedInteger}.${trimmedDecimal}`
            : trimmedDecimal !== '00' ? `${formattedInteger}.${trimmedDecimal}` : formattedInteger;
    }

    return <Document>
        <Page size="A4" style={styles.page}>
            <View>
                {/* 상단 헤더 */}

                {
                    lang === 'ko' ?
                        <View style={styles.header}>
                            <View style={styles.leftInfo}>
                                <Image src="/kor.png" style={styles.logo}/>
                            </View>
                            <View style={styles.centerTitle}>
                                <Text style={styles.title}>발&nbsp;&nbsp;&nbsp;&nbsp;주&nbsp;&nbsp;&nbsp;&nbsp;서</Text>
                            </View>
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
                        </View>
                        :
                        <View style={styles.header}>
                            <View style={{...styles.leftInfo, paddingBottom : 5, marginLeft : -10}}>
                                <Image src="/eng.png" style={{width : '90%'}}/>
                            </View>
                            <View style={styles.centerTitle2}>
                                <Text style={styles.title2}>PURCHASE</Text>
                                <Text style={styles.title2}>ORDER</Text>
                            </View>

                                <View style={styles.companyInfo}>
                                    <View style={{   justifyContent: 'flex-start', width : 145}}>
                                    <Text>Manku Solution Co.,Ltd</Text>
                                    <Text>B- 211#, Garden Five Works,</Text>
                                    <Text>52, Chungmin-ro,</Text>
                                    <Text>Songpa-gu, Seoul, South Korea</Text>
                                    <Text>Postal Code 05839</Text>
                                    </View>
                                    <Image
                                        src="/stamp.png"
                                        style={{
                                            position: 'absolute',
                                            top: -17,
                                            right: -6,
                                            width: 55,
                                        }}
                                    />
                                </View>
                        </View>
                }

                <View style={styles.titleLine2}/>

                {Object.keys(title).map((v, i) => {
                    if (i % 2 === 1) {
                        return false;
                    }

                    return <View style={styles.infoRow}>
                        <Text style={styles.label}>{title[v]} {v === 'blank' ? '' : ':'}</Text>
                        <Text style={styles.value}>{topInfoData[v]}</Text>
                        <Text
                            style={styles.labelRight}>{title[Object.keys(title)[i + 1]]} {!Object.keys(title)[i + 1] || Object.keys(title)[i + 1] === 'blank' ? '' : ':'}</Text>
                        <Text style={styles.valueRight}>{topInfoData[Object.keys(title)[i + 1]]}</Text>
                    </View>
                })}

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
                        <View style={{...styles.cell, width: 600}}>
                            <Text style={{
                                textAlign: 'left',
                                paddingLeft: 5,
                                fontFamily: styles.point.fontFamily
                            }}>{topInfoData?.maker}</Text>
                        </View>
                    </View>

                    {/* 내용 행 반복 */}
                    {data[0]?.map((row: any, i) => {
                        const {model, quantity, unit, unitPrice, currency} = row;
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


                            <View style={{
                                ...styles.cell,
                                width: colWidths[4],
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}><Text
                                style={{textAlign: 'right', paddingRight: 8}}>{currency}</Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>{numberFormat(unitPrice, currency)}</Text>
                            </View>

                            <View style={{
                                ...styles.cell,
                                width: colWidths[5],
                                flexDirection: 'row',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}><Text
                                style={{textAlign: 'right', paddingRight: 8}}>{currency}</Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>{numberFormat(quantity * unitPrice, currency)}</Text>
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
                            style={{textAlign: 'right', paddingRight: 8}}>{totalData?.currency}</Text>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    paddingRight: 8
                                }}>{numberFormat(totalData?.unitPrice, totalData?.currency)}</Text>
                        </View>
                        <View style={{
                            ...styles.point,
                            width: colWidths[5],
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}><Text
                            style={{textAlign: 'right', paddingRight: 8}}>{totalData?.currency}</Text>
                            <Text
                                style={{
                                    textAlign: 'right',
                                    paddingRight: 8
                                }}>{numberFormat(totalData?.total, totalData?.currency)}</Text>
                        </View>
                        <View style={{
                            ...styles.point,
                            width: colWidths[6],
                        }}><Text
                            style={{textAlign: 'left', paddingLeft: 8}}></Text>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Text>{bottomInfo}</Text>
                    </View>
                    {/*{*/}
                    {/*    lang === 'ko' ?*/}
                    {/*        <View style={styles.footer}>*/}
                    {/*            <Text>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</Text>*/}
                    {/*            <Text>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</Text>*/}
                    {/*            <Text>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</Text>*/}
                    {/*            <Text>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</Text>*/}
                    {/*            <Text>· 성적서 및 품질보증서는 별도입니다.</Text>*/}
                    {/*        </View>*/}
                    {/*        :*/}
                    {/*        <View style={styles.footer}>*/}
                    {/*            <Text>* For the invoice* Please indicate few things as below:</Text>*/}
                    {/*            <Text>1. HS Code 6 Digit</Text>*/}
                    {/*            <Text>2. Indication of Country of Origin</Text>*/}
                    {/*            <Text>It has to be written into the remark of every Invoice every time.</Text>*/}
                    {/*            <Text>And your name, your signature and date of signature have to be put in under the*/}
                    {/*                sentence as well.</Text>*/}
                    {/*            <Text>* Please give us Order confirmation. (Advise us if we should pay your bank charge as*/}
                    {/*                well.)</Text>*/}
                    {/*        </View>*/}
                    {/*}*/}

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
                    {
                        lang === 'ko' ?
                            <View style={styles.header}>
                                <View style={styles.leftInfo}>
                                    <View style={styles.logoInfo}>
                                        <Image src="/kor.png" style={styles.logo}/>
                                    </View>
                                    <View style={styles.companyInfo}>
                                        <Text>(주) 만쿠솔루션</Text>
                                        <Text>Manku Solution Co., Ltd</Text>
                                        <Text>서울시 송파구 충민로 52 가든파이브웍스</Text>
                                        <Text>B동 2층 211호, 212호</Text>
                                        <Text>Tel : 02-465-7838, Fax : 02-465-7839</Text>
                                    </View>
                                </View>
                                <View style={styles.centerTitle}>
                                    <Text style={styles.title}>발 주 서</Text>
                                </View>
                                <View style={styles.rightInfo}>
                                    {/*<Image src="/manku_stamp_ko.png" style={styles.info}/>*/}
                                </View>
                            </View>
                            :
                            <View style={styles.header}>
                                <View style={styles.leftInfo}>
                                    <View style={styles.logoInfo}>
                                        <Image src="/eng.png" style={styles.logo}/>
                                    </View>
                                    <View style={styles.companyInfo}>
                                        <Text>Manku Solution Co.,Ltd</Text>
                                        <Text>B- 211#, Garden Five Works, 52,</Text>
                                        <Text>Chungmin-ro,</Text>
                                        <Text>Songpa-gu, Seoul, South Korea</Text>
                                        <Text>Postal Code 05839</Text>
                                    </View>
                                </View>
                                <View style={styles.centerTitle2}>
                                    <Text style={styles.title2}>PURCHASE</Text>
                                    <Text style={styles.title2}>ORDER</Text>
                                </View>
                                <View style={styles.rightInfo}>
                                    {/*<Image src="/manku_stamp_en.png" style={styles.info}/>*/}
                                </View>
                            </View>
                    }

                    <View style={styles.titleLine}/>

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

                            const {model, quantity, unit, unitPrice, currency} = row;
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
                                <View style={{
                                    ...styles.cell,
                                    width: colWidths[4],
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}><Text
                                    style={{textAlign: 'right', paddingRight: 8}}>{currency}</Text>
                                    <Text style={{
                                        textAlign: 'right',
                                        paddingRight: 5
                                    }}>{numberFormat(unitPrice, currency)}</Text>
                                </View>


                                <View style={{
                                    ...styles.cell,
                                    width: colWidths[5],
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}><Text
                                    style={{textAlign: 'right', paddingRight: 8}}>{currency}</Text>
                                    <Text
                                        style={{
                                            textAlign: 'right',
                                            paddingRight: 8
                                        }}>{numberFormat((quantity * unitPrice), currency)}</Text>
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
                                style={{textAlign: 'right', paddingRight: 8}}>{totalData?.currency}</Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>{numberFormat(totalData?.unitPrice, totalData.currency)}</Text>
                            </View>
                            <View style={{
                                ...styles.point,
                                width: colWidths[5],
                                flexDirection: 'row',
                                justifyContent: 'space-between'
                            }}><Text
                                style={{textAlign: 'right', paddingRight: 8}}>{totalData?.currency}</Text>
                                <Text
                                    style={{
                                        textAlign: 'right',
                                        paddingRight: 8
                                    }}>{numberFormat(totalData?.total, totalData.currency)}</Text>
                            </View>
                            <View style={{
                                ...styles.point,
                                width: colWidths[6],
                            }}><Text
                                style={{textAlign: 'left', paddingLeft: 8}}></Text>
                            </View>
                        </View>

                        <View style={styles.footer}>
                            <Text>{bottomInfo}</Text>
                        </View>

                        {/*{*/}
                        {/*    lang === 'ko' ?*/}
                        {/*        <View style={styles.footer}>*/}
                        {/*            <Text>· 금일 환율 기준으로 2%이상 인상될 시 , 단가가 인상될 수 있습니다.</Text>*/}
                        {/*            <Text>· 러-우전쟁 및 COVID-19 장기화로 납기 변동성이 큰 시기입니다. 납기 지연이 발생할 수 있는 점 양해 부탁드립니다.</Text>*/}
                        {/*            <Text>· 의뢰하신 Model로 기준한 견적이며, 견적 수량 전량 구입시 가격입니다. (긴급 납기시 담당자와 협의 가능합니다.)</Text>*/}
                        {/*            <Text>· 계좌번호: (기업은행)069-118428-04-010/(주)만쿠무역.</Text>*/}
                        {/*            <Text>· 성적서 및 품질보증서는 별도입니다.</Text>*/}
                        {/*        </View>*/}
                        {/*        :*/}
                        {/*        <View style={styles.footer}>*/}
                        {/*            <Text>* For the invoice* Please indicate few things as below:</Text>*/}
                        {/*            <Text>1. HS Code 6 Digit</Text>*/}
                        {/*            <Text>2. Indication of Country of Origin</Text>*/}
                        {/*            <Text>It has to be written into the remark of every Invoice every time.</Text>*/}
                        {/*            <Text>And your name, your signature and date of signature have to be put in under the*/}
                        {/*                sentence as well.</Text>*/}
                        {/*            <Text>* Please give us Order confirmation. (Advise us if we should pay your bank charge as*/}
                        {/*                well.)</Text>*/}
                        {/*        </View>*/}
                        {/*}*/}

                    </> : <></>}

                    <Text style={styles.pageNum}>- {idx + 1} -</Text>
                </View>
            </Page>
        })
        }
    </Document>
}