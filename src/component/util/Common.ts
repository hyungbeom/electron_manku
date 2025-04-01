import {StyleSheet} from "@react-pdf/renderer";

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
        fontFamily : 'NotoSansKR_large'
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
        marginBottom: 8,
    },
    label: {
        fontFamily : 'NotoSansKR_large',
        width: '12%',
        fontWeight: 'bold',
    },
    value: {
        width: '38%',
    },
    labelRight: {
        fontFamily : 'NotoSansKR_large',
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
        backgroundColor: '#ebf6f7',
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
    }, point: {
        padding: 4,
        borderRightWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        fontFamily : 'NotoSansKR_large'
    },
});

export default styles;