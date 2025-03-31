
import React from 'react';
import {
    Document,
    Page,
    Text,
    View,
    StyleSheet,
    Font
} from '@react-pdf/renderer';


Font.register({
    family: 'NotoSansKR',
    src: '/NotoSansKR-Regular.ttf',
});


const styles = StyleSheet.create({
    page: {
        fontFamily: 'NotoSansKR',
        fontSize: 11,
        padding: 30,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
    },
    companyTitle: {
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    infoGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    infoRow: {
        width: '50%',
        flexDirection: 'row',
        marginBottom: 2,
    },
    label: {
        width: 80,
        fontWeight: 'bold',
    },
    value: {
        flexGrow: 1,
    },
    table: {
        display: 'table',
        width: '100%',
        marginTop: 10,
        borderStyle: 'solid',
        borderWidth: 1,
        borderRightWidth: 0,
        borderBottomWidth: 0,
    },
    tableRow: {
        flexDirection: 'row',
    },
    tableColHeader: {
        backgroundColor: '#ebf6f7',
        fontWeight: 'bold',
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4,
    },
    tableCol: {
        borderStyle: 'solid',
        borderWidth: 1,
        borderLeftWidth: 0,
        borderTopWidth: 0,
        padding: 4,
    },
    footer: {
        marginTop: 20,
        borderTop: '1 solid black',
        paddingTop: 10,
    },
});

export default function Test({ tableData = [], maker = '-' }){
    const totalQty = tableData.reduce((acc, item) => acc + item.quantity, 0);
    const totalUnit = 'ea';
    const totalNet = tableData.reduce((acc, item) => acc + item.net, 0);
    const totalAmount = tableData.reduce((acc, item) => acc + item.net * item.quantity, 0);

    return <>

        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.companyTitle}>
                        (주)만쿠무역은 세계 각지의 공급사를 통해 최적의 서비스를 통해 산업자재를 저렴하게 공급합니다.
                    </Text>
                    <View style={styles.infoGrid}>
                        <View style={styles.infoRow}><Text style={styles.label}>견적일자</Text>
                            <Text style={styles.value}>2025-03-31</Text>
                        </View>
                        <View style={styles.infoRow}><Text style={styles.label}>담당자</Text><Text style={styles.value}>
                            {true ? '김현진' : <input type="text" value={'김현진'}/>}
                        </Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>견적서 No</Text><Text style={styles.value}>SK-25-0025</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>연락처</Text><Text style={styles.value}>010-3340-2737</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>고객사</Text><Text style={styles.value}>SK E&S 파주</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>E-mail</Text><Text style={styles.value}>import@manku.co.kr</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>담당자</Text><Text style={styles.value}>서의석 매니저</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>유효기간</Text><Text style={styles.value}>견적 발행 후 10일간</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>결제조건</Text><Text style={styles.value}>선수금</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>납기</Text><Text style={styles.value}>20주</Text></View>
                        <View style={styles.infoRow}><Text style={styles.label}>납품조건</Text><Text style={styles.value}>귀사도착도</Text></View>
                    </View>
                </View>

                <View style={styles.table}>
                    <View style={styles.tableRow}>
                        <Text style={[styles.tableColHeader, { width: '8%' }]}>#</Text>
                        <Text style={[styles.tableColHeader, { width: '42%' }]}>Specification</Text>
                        <Text style={[styles.tableColHeader, { width: '10%' }]}>Q'ty</Text>
                        <Text style={[styles.tableColHeader, { width: '20%' }]}>Unit Price</Text>
                        <Text style={[styles.tableColHeader, { width: '20%' }]}>Amount</Text>
                    </View>
                    {tableData.map((item, index) => (
                        <View style={styles.tableRow} key={index}>
                            <Text style={[styles.tableCol, { width: '8%' }]}>{index + 1}</Text>
                            <Text style={[styles.tableCol, { width: '42%' }]}>{item.model}</Text>
                            <Text style={[styles.tableCol, { width: '10%' }]}>{item.quantity}</Text>
                            <Text style={[styles.tableCol, { width: '20%' }]}>₩ {item.net.toLocaleString()}</Text>
                            <Text style={[styles.tableCol, { width: '20%' }]}>₩ {(item.net * item.quantity).toLocaleString()}</Text>
                        </View>
                    ))}
                </View>

                <View style={[styles.tableRow, { marginTop: 10 }]}>
                    <Text style={[styles.tableCol, { width: '50%', fontWeight: 'bold' }]}>TOTAL</Text>
                    <Text style={[styles.tableCol, { width: '10%' }]}>{totalQty}</Text>
                    <Text style={[styles.tableCol, { width: '20%' }]}>{totalUnit}</Text>
                    <Text style={[styles.tableCol, { width: '20%' }]}>₩ {totalAmount.toLocaleString()}</Text>
                </View>

                <View style={styles.footer}>
                    <Text>※ 위 모델 기준 견적입니다.</Text>
                    <Text>※ 계약조건 : (기업은행) 096-118828-04-010 / 만쿠무역</Text>
                    <Text>※ 긴급 납기 / 변경사항 협의 가능합니다.</Text>
                </View>
            </Page>
        </Document>
    </>
}
