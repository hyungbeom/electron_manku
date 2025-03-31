import React from 'react';
import {Document, Font, Image, Page, StyleSheet, Text, View} from '@react-pdf/renderer';
import dynamic from "next/dynamic";

// 폰트 설정 (기본 한글 폰트 필요 시 추가해야 함)
Font.register({
    family: 'NotoSansKR',
    src: '/NotoSansKR-Regular.ttf',
});


const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansKR',
        fontSize: 9,
        padding: 20,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },

    // 상단 헤더 관련
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    logoInfo: {
        width: '6%',
        paddingTop: 3
    },
    logo: {
        width: 30,
        height: 20
    },
    leftInfo: {
        width: '25%',
        fontSize: 7
    },
    centerTitle: {
        width: '37%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    title: {
        fontSize: 25,
        fontWeight: 'bold',
    },
    rightInfo: {
        width: '30%',
        alignItems: 'flex-end',
    },
    info: {
        width: 120,
        height: 55
    },
    titleLine: {
        borderTopWidth: 2,
        borderColor: '#71d1df',
        marginTop: 6,
        marginBottom: 3,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 16,
    },

    // 상단 정보 관련
    infoRow: {
        flexDirection: 'row',
        marginBottom: 4,
    },
    label: {
        width: '12%',
        fontWeight: 'bold',
    },
    value: {
        width: '38%',
    },
    labelRight: {
        width: '12%',
        fontWeight: 'bold',
    },
    valueRight: {
        width: '38%',
    },

    // 테이블 관련
    table: {
        borderWidth: 1,
        borderColor: '#444',
        marginTop: 10,
    },
    tableHeader: {
        flexDirection: 'row',
        backgroundColor: '#e3f3f9',
        borderBottomWidth: 1,
        borderColor: '#444',
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    cell: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
    },

    // 하단 푸터 관련
    bottomSection: {
        marginTop: 8,
    },
    totalRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 0,
        marginBottom: 5
    },
    footer: {
        fontSize: 8,
        lineHeight: 1.4,
        borderTopWidth: 1,
        paddingTop: 4,
        marginTop: 4,
    },
    pageNum: {
        textAlign: 'center',
        fontSize: 8,
        marginTop: 2,
    },
});

const colWidths = [40, 210, 50, 30, 110, 110];


const Test2 = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View>
                {/* 상단 헤더 */}
                <View style={styles.header}>
                    <View style={styles.logoInfo}>
                        <Image src="/manku_ci_black_text.png" style={styles.logo}/>
                    </View>
                    <View style={styles.leftInfo}>
                        <Text>(주)만쿠무역</Text>
                        <Text>Manku Trading Co., Ltd</Text>
                        <Text>서울시 송파구 송파대로 52 카타르타워</Text>
                        <Text>B동 213호, 2112</Text>
                        <Text>Tel: 02-445-7838, Fax: 02-445-7839</Text>
                    </View>
                    <View style={styles.centerTitle}>
                        <Text style={styles.title}>견   적   서</Text>
                    </View>
                    <View style={styles.rightInfo}>
                        <Image src="/manku_stamp_ko.png" style={styles.info}/>
                    </View>
                </View>

                <View style={styles.titleLine}/>
                <Text style={styles.subtitle}>
                    (주) 만쿠무역은 세계 각지의 공급자를 통해 의뢰하시는 부품 및 산업자재를 저렴하게 공급합니다.
                </Text>



                {/* 상단 정보 */}
                <View style={styles.infoRow}>
                    <Text style={styles.label}>견적일자 :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>담당자 :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>견적서 No :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>연락처 :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>고객사 :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>E-mail :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>담당자 :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>유효기간 :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>연락처 :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>결제조건 :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>E-mail :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>납기 :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>
                <View style={styles.infoRow}>
                    <Text style={styles.label}>Fax :</Text>
                    <Text style={styles.value}>ㅇㅇ</Text>
                    <Text style={styles.labelRight}>납품조건 :</Text>
                    <Text style={styles.valueRight}>ㅇㅇ</Text>
                </View>



                {/* 표 */}
                <View style={styles.table}>
                    {/* 테이블 헤더 */}
                    <View style={styles.tableHeader}>
                        <View style={{...styles.cell, width: 250}}>
                            <Text style={{textAlign: 'center'}}>Specification</Text>
                        </View>
                        <View style={{...styles.cell, width: 80}}>
                            <Text style={{textAlign: 'center'}}>Q`ty</Text>
                        </View>
                        <View style={{...styles.cell, width: 110}}>
                            <Text style={{textAlign: 'center'}}>Unit Price</Text>
                        </View>
                        <View style={{...styles.cell, width: 110, borderRightWidth: 0}}>
                            <Text style={{textAlign: 'center'}}>Amount</Text>
                        </View>
                    </View>

                    {/* 1번째 빈 행 */}
                    <View style={styles.tableRow}>
                        <View style={{...styles.cell, flex: 1}}><Text>&nbsp;</Text></View>
                    </View>

                    {/* 2번째 maker 행 */}
                    <View style={styles.tableRow}>
                        <View style={{...styles.cell, width: colWidths[0]}}><Text style={{textAlign: 'center'}}>Maker</Text></View>
                        <View style={{...styles.cell, width: colWidths[1]}}><Text style={{textAlign: 'center'}}>3333</Text></View>
                        <View style={{...styles.cell, width: colWidths[2]}}/>
                        <View style={{...styles.cell, width: colWidths[3]}}/>
                        <View style={{...styles.cell, width: colWidths[4]}}/>
                        <View style={{...styles.cell, width: colWidths[5], borderRightWidth: 0}}/>
                    </View>

                    {/* 내용 행 반복 */}
                    {[
                        ['1', 't54y345', '12', 'ea', '₩ 222', '2,664'],
                        ['2', 'fdsfgsdfgsdfg', '54', 'ea', '₩ 3,333', '179,982'],
                    ].map((row, i) => (
                        <View key={i} style={styles.tableRow}>
                            {row.map((text, j) => (
                                <View key={j} style={{
                                    ...styles.cell,
                                    width: colWidths[j],
                                    borderRightWidth: j === 5 ? 0 : 1,
                                }}>
                                    <Text style={{textAlign: 'center'}}>{text}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>

            {/* 하단 푸터 */}
            <View style={styles.bottomSection}>
                {/* TOTAL 행 */}
                <View style={styles.totalRow}>
                    <View style={{...styles.cell, width: colWidths[0]}}/>
                    <View style={{...styles.cell, width: colWidths[1]}}><Text style={{textAlign: 'center'}}>TOTAL</Text></View>
                    <View style={{...styles.cell, width: colWidths[2]}}><Text style={{textAlign: 'center'}}>66</Text></View>
                    <View style={{...styles.cell, width: colWidths[3]}}><Text style={{textAlign: 'center'}}>ea</Text></View>
                    <View style={{...styles.cell, width: colWidths[4]}}><Text style={{textAlign: 'center'}}>3,555</Text></View>
                    <View style={{...styles.cell, width: colWidths[5], borderRightWidth: 0}}><Text style={{textAlign: 'center'}}>182,646</Text></View>
                </View>

                {/* footer */}
                <View style={styles.footer}>
                    <Text>· 의뢰하신 Model로 기준한 견적입니다.</Text>
                    <Text>· 계좌번호 : 기업은행 069-118048-04-010 / 만쿠무역</Text>
                    <Text>· 긴급 납기시 담당자와 협의 가능합니다.</Text>
                </View>

                <Text style={styles.pageNum}>- 1 -</Text>
            </View>
        </Page>
    </Document>
);

// PDFViewer를 동적으로 불러오면서 SSR을 비활성화
const PDFViewer = dynamic(
    () => import('@react-pdf/renderer').then((mod) => mod.PDFViewer),
    { ssr: false }
);
export default function App() {
    return (
        <div style={{width: '100%', height: '100vh'}}>
            <PDFViewer width="100%" height="100%">
                <Test2/>
            </PDFViewer>
        </div>
    );
}