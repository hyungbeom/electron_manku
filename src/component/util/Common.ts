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
        alignItems: 'flex-end',  // 이미지 아래 정렬
    },
    leftInfo: {
        width : '33%',
        alignItems: 'center',  // 이미지 아래 정렬
        paddingBottom : 15,
        justifyContent: 'flex-start', // 오른쪽 정렬 유지
    },
    logoInfo: {
        // width : 100,
        // height : 15

    },
    logo: {
        width : '100%'
    },
    companyInfo: {
        width : '33%',
        fontSize: 7.5,
        display: 'flex',
        alignItems: 'flex-end',     // 위쪽 정렬 (선택)
        paddingBottom : 0
    },
    centerTitle: {
        alignItems: 'flex-end',
        height: 85, // 부모 높이 명시
        display: 'flex',
        justifyContent: 'flex-end', // 오른쪽 정렬 유지
        paddingBottom : 15
    },
    centerTitle2: {
        width: '33%',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingBottom : 5
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily : 'NotoSansKR_large'
    },
    title2: {
        fontSize: 23,
        fontWeight: 'bold',
        fontFamily : 'NotoSansKR_large',
        lineHeight: 1.2,
    },
    rightInfo: {
        fontSize : 7,
        width: 300,
        alignItems: 'flex-end',
        height: 85, // 부모 높이 명시
        display: 'flex',
        textAlign : 'left',
        // justifyContent: 'flex-start' // 오른쪽 정렬 유지
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
    titleLine2: {
        borderTopWidth: 2,
        borderColor: '#71d1df',
        marginTop: 6,
        marginBottom: 8,
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
        width: '16%',
        fontWeight: 'bold',
        textAlign: 'left'
    },
    value: {
        width: '34%',
        paddingLeft: 10
    },
    labelRight: {
        fontFamily : 'NotoSansKR_large',
        width: '16%',
        fontWeight: 'bold',
        textAlign: 'left'
    },
    valueRight: {
        width: '34%',
        paddingLeft: 10
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
        fontSize : 8
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