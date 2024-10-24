
export const estimateWriteColumns = [
    {
        title: 'No.',
        dataIndex: 'documentNumberFull',
        key: 'documentNumberFull',
        render: (text) => {text},
    },
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        render: (text) => {text},
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (text) => {text},
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        render: (text) => {text},
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (text) => {text},
    },
    {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => {text},
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
        render: (text) => {text},
    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',
        render: (text) => {text},
    },

];

export const estimateReadColumns = [
    {
        title: '작성일자',
        dataIndex: 'writtenDate',
        key: 'writtenDate',
        render: (text) => {text},
    },
    {
        title: '문서번호',
        dataIndex: 'documentNumberFull',
        key: 'documentNumberFull',
        render: (text) => {text},
    },
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        render: (text) => {text},
    },
    {
        title: '거래처명',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (text) => {text},
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
        render: (text) => {text},
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
        render: (text) => {text},
    },
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        render: (text) => {text},
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (text) => {text},
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        render: (text) => {text},
    },
    {
        title: '납기',
        dataIndex: 'delivery',
        key: 'delivery',
        render: (text) => {text},
    },
    {
        title: '주문',
        dataIndex: 'order',
        key: 'order',
        render: (text) => {text},
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (text) => {text},
    },
    {
        title: '합계',
        dataIndex: 'total',
        key: 'total',
        render: (text) => {text},
    },
    {
        title: '등록자',
        dataIndex: 'registerer',
        key: 'registerer',
        render: (text) => {text},
    },
    {
        title: '비고란',
        dataIndex: 'remarks',
        key: 'remarks',
        render: (text) => {text},
    },
]

export const estimateTotalColumns = [
    {
        title: '작성일자',
        dataIndex: 'writtenDate',
        key: 'writtenDate',
        render: (text) => {text},
    },
    {
        title: '문서번호',
        dataIndex: 'documentNumberFull',
        key: 'documentNumberFull',
        render: (text) => {text},
    },
    {
        title: '코드',
        dataIndex: 'agencyCode',
        key: 'agencyCode',
        render: (text) => {text},
    },
    {
        title: '거래처명',
        dataIndex: 'customerName',
        key: 'customerName',
        render: (text) => {text},
    },
    {
        title: 'MAKER',
        dataIndex: 'maker',
        key: 'maker',
        render: (text) => {text},
    },
    {
        title: 'ITEM',
        dataIndex: 'item',
        key: 'item',
        render: (text) => {text},
    },
    {
        title: 'MODEL',
        dataIndex: 'model',
        key: 'model',
        render: (text) => {text},
    },
    {
        title: '수량',
        dataIndex: 'quantity',
        key: 'quantity',
        render: (text) => {text},
    },
    {
        title: '단위',
        dataIndex: 'unit',
        key: 'unit',
        render: (text) => {text},
    },
    {
        title: 'CURR',
        dataIndex: 'currency',
        key: 'currency',
        render: (text) => {text},
    },
    {
        title: 'NET/P',
        dataIndex: 'net',
        key: 'net',
        render: (text) => {text},
    },
    {
        title: '금액',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => {text},
    },
    {
        title: '화폐단위',
        dataIndex: 'amount',
        key: 'amount',
        render: (text) => {text},
    },
    {
        title: '단가',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
        render: (text) => {text},
    },
    {
        title: '등록자',
        dataIndex: 'registerer',
        key: 'registerer',
        render: (text) => {text},
    },
    {
        title: '등록일자',
        dataIndex: 'registerDate',
        key: 'registerDate',
        render: (text) => {text},
    },
]














// {
//     title: 'Tags',
//     key: 'tags',
//     dataIndex: 'tags',
//     render: (_, {tags}) => (
//         <>
//             {tags.map((tag) => {
//                 let color = tag.length > 5 ? 'geekblue' : 'green';
//                 if (tag === 'loser') {
//                     color = 'volcano';
//                 }
//                 return (
//                     <Tag color={color} key={tag}>
//                         {tag.toUpperCase()}
//                     </Tag>
//                 );
//             })}
//         </>
//     ),
// },
// {
//     title: 'Action',
//     key: 'action',
//     render: (_, record) => (
//         <Space size="middle">
//             <a>Invite {record.name}</a>
//             <a>Delete</a>
//         </Space>
//     ),
// },