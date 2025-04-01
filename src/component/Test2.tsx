import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font,
    Image, PDFViewer
} from '@react-pdf/renderer';
import MyDocument from "@/pages/_document";

// 폰트 설정 (기본 한글 폰트 필요 시 추가해야 함)
Font.register({
    family: 'NotoSansKR',
    src: '/NotoSansKR-Regular.ttf',
});


const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansKR',
        fontSize: 9,
        padding: 30,
        flexDirection: 'column',
        justifyContent: 'space-between',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    leftInfo: {
        width: '30%',
    },
    centerTitle: {
        width: '40%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 10,
    },
    rightInfo: {
        width: '30%',
        alignItems: 'flex-end',
    },
    logo: {
        width: 60,
        height: 60,
        marginBottom: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    grayLine: {
        borderTopWidth: 1,
        borderColor: '#444',
        marginTop: 6,
        marginBottom: 4,
    },
    subtitle: {
        textAlign: 'center',
        marginBottom: 8,
    },
    infoRow: {
        flexDirection: 'row',
        marginBottom: 2,
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
    totalRow: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#000',
        marginTop: 0,
    },
    bottomSection: {
        marginTop: 8,
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

const colWidths = [30, 150, 30, 20, 60, 60];


const Test2 = () => (
    <Document>
        <Page size="A4" style={styles.page}>
            {/* Top Section */}
            <View>
                {/* 상단 헤더 */}
                <View style={styles.header}>
                    <View style={styles.leftInfo}>
                        <Text>(주)만쿠무역</Text>
                        <Text>Manku Trading Co., Ltd</Text>
                        <Text>서울시 송파구 송파대로 52 카타르타워</Text>
                        <Text>B동 213호, 2112</Text>
                        <Text>Tel: 02-445-7838, Fax: 02-445-7839</Text>
                    </View>
                    <View style={styles.centerTitle}>
                        <Text style={styles.title}>견 적 서</Text>
                    </View>
                    <View style={styles.rightInfo}>
                        <Image src="/manku_stamp_kor.png" style={styles.logo}/>
                        <Text>714-87-01453</Text>
                        <Text>주 식 회 사</Text>
                        <Text style={{fontWeight: 'bold'}}>만 쿠 무 역</Text>
                        <Text>서울특별시 송파구 송파대로 52</Text>
                        <Text>카타르타워 B동 213호, 2112호</Text>
                        <Text>대표자: 이형범</Text>
                    </View>
                </View>

                <View style={styles.grayLine}/>
                <Text style={styles.subtitle}>
                    (주) 만쿠무역은 세계 각지의 공급자를 통해 의뢰하시는 부품 및 산업자재를 저렴하게 공급합니다.
                </Text>

                {/* 견적 정보 */}
                {[
                    ['견적일자', '2025-03-28', '담당자', '이형범'],
                    ['견적서 No', '99994', '연락처', '010-8636-2553'],
                    ['고객사', '', 'E-mail', 'test1@manku.co.kr'],
                    ['담당자', '', '견적 유효기간', '견적 발행 후 10일간'],
                    ['연락처', '', '결제조건', '발주시 50% / 납품시 50%'],
                    ['E-mail', '', '납기', '주'],
                    ['Fax', '', '납품조건', '귀사도착도'],
                ].map((row, i) => (
                    <View key={i} style={styles.infoRow}>
                        <Text style={styles.label}>{row[0]} :</Text>
                        <Text style={styles.value}>{row[1]}</Text>
                        <Text style={styles.labelRight}>{row[2]} :</Text>
                        <Text style={styles.valueRight}>{row[3]}</Text>
                    </View>
                ))}

                {/* 표 */}
                <View style={styles.table}>
                    <View style={styles.tableHeader}>
                        {['', 'Specification', 'Q\'ty', '', 'Unit Price', 'Amount'].map((text, i) => (
                            <View key={i} style={{...styles.cell, width: colWidths[i]}}>
                                <Text>{text}</Text>
                            </View>
                        ))}
                    </View>

                    {/* Maker row */}
                    <View style={styles.tableRow}>
                        <View style={{...styles.cell, width: colWidths[0]}}/>
                        <View style={{...styles.cell, width: colWidths[1]}}><Text>Maker</Text></View>
                        <View style={{...styles.cell, width: colWidths[2]}}><Text>3333</Text></View>
                        <View style={{...styles.cell, width: colWidths[3]}}/>
                        <View style={{...styles.cell, width: colWidths[4]}}/>
                        <View style={{...styles.cell, width: colWidths[5], borderRightWidth: 0}}/>
                    </View>

                    {/* 항목들 */}
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
                                    <Text>{text}</Text>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>
            </View>

            {/* Bottom Section: TOTAL + Footer + Page Number */}
            <View style={styles.bottomSection}>
                <View style={styles.totalRow}>
                    <View style={{...styles.cell, width: colWidths[0]}}/>
                    <View style={{...styles.cell, width: colWidths[1]}}><Text>TOTAL</Text></View>
                    <View style={{...styles.cell, width: colWidths[2]}}><Text>66</Text></View>
                    <View style={{...styles.cell, width: colWidths[3]}}><Text>ea</Text></View>
                    <View style={{...styles.cell, width: colWidths[4]}}><Text>3,555</Text></View>
                    <View style={{...styles.cell, width: colWidths[5]}}><Text>182,646</Text></View>
                </View>

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

// export default function App() {
//     return (
//         <div style={{width: '100%', height: '100vh'}}>
//             <PDFViewer width="100%" height="100%">
//                 <Test2/>
//             </PDFViewer>
//         </div>
//     );
// }