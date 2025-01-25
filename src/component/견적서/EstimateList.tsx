import {useEffect, useMemo} from "react";
import {gridManage} from "@/utils/commonManage";

const headerStyle = {
    padding: '10px',
    border: '1px solid #ddd',

    whiteSpace: 'nowrap'
};


export default function EstimateList({data, gridRef}: any) {

    const [totalQuantity, totalValue, list] = useMemo(() => {
        const list = gridManage.getAllData(gridRef);

        const result = list?.reduce((totals, item) => {
            totals.totalQuantity += item.quantity;
            totals.totalValue += item.quantity * item.unitPrice;
            return totals;
        }, {totalQuantity: 0, totalValue: 0});

        return [result?.totalQuantity, result?.totalValue, list]
    }, [data]);

    return (
        <div style={{fontFamily: 'Arial, sans-serif', fontSize: 12}}>
            <table
                style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    margin: '20px 0',
                    textAlign: 'center',
                    border: '1px solid lightGray',
                    borderLeft: 'none',
                    borderRight: 'none'
                }}>
                <thead>
                <tr style={{backgroundColor: '#ebf6f7', fontWeight: 'bold'}}>
                    <th colSpan={3} style={{width: '55%'}}>Specification</th>
                    <th style={headerStyle}>Qty</th>
                    <th style={headerStyle}>Unit Price</th>
                    <th>Amount</th>
                </tr>
                </thead>


                <thead>
                <tr style={{fontWeight: 'bold', height: 50}}>
                    <th colSpan={2} style={{
                        width: '15%',
                        border: '1px solid lightGray',
                        borderLeft: 'none',
                        backgroundColor: '#ebf6f7'
                    }}>MAKER
                    </th>
                    <th style={headerStyle}>{data?.maker ? data?.maker : '-'}</th>
                    <th style={{border: 'none'}}></th>
                    <th style={{border: 'none'}}></th>
                    <th style={{borderTop: '1px solid lightGray'}}></th>
                </tr>
                </thead>


                <thead>
                {list?.map((v, i) => {
                    return <tr style={{fontWeight: 'bold'}}>
                        <th colSpan={2} style={{
                            width: '8%',
                            border: 'none',
                            textAlign: 'left',
                            paddingLeft: 10,
                            borderBottom: '1px solid lightGray'
                        }}>
                            <div style={{width: 30, borderRight: '1px solid lightGray'}}>{i + 1}</div>
                        </th>
                        <th style={{borderBottom: '1px solid lightGray', textAlign: 'left'}}>
                            <div
                                style={{
                                    marginLeft: '-8vw',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap'
                                }}>{v.model}
                            </div>
                        </th>
                        <th style={headerStyle}>{v.quantity} {v.unit}</th>
                        <th style={headerStyle}>{v.unitPrice}</th>
                        <th style={{borderTop: '1px solid lightGray'}}>{v.quantity * v.unitPrice}</th>
                    </tr>
                })}

                </thead>


                <thead>
                <tr style={{fontWeight: 'bold'}}>
                    <th colSpan={3} style={{backgroundColor: '#ebf6f7'}}>합계</th>
                    <th style={headerStyle}>{totalQuantity}</th>
                    <th style={headerStyle}>VAT 별도</th>
                    <th style={{borderTop: '1px solid lightGray'}}>{totalValue}</th>
                </tr>
                </thead>
            </table>
        </div>
    );
}