import {useEffect, useMemo} from "react";
import {gridManage} from "@/utils/commonManage";
import {amountFormat} from "@/utils/columnList";

const headerStyle = {
    padding: '10px',
    border: '1px solid #ddd',

    whiteSpace: 'nowrap'
};


export default function EstimateList({data, gridRef}: any) {

    const [totalQuantity, totalValue,units, list] = useMemo(() => {
        const list = gridManage.getAllData(gridRef);

        const result = list?.reduce((totals, item) => {
            totals.unit = item.unit;
            totals.totalQuantity += item.quantity;
            totals.totalValue += item.quantity * item.unitPrice;
            return totals;
        }, {totalQuantity: 0, totalValue: 0, unit : ''});

        return [result?.totalQuantity, result?.totalValue, result?.unit,list]
    }, [data]);

    return (
        <div style={{fontFamily: 'Arial, sans-serif', fontSize: 13}}>
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
                    <th style={headerStyle}>Unit</th>
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
                    <th style={{border: 'none'}}></th>
                    <th style={{borderTop: '1px solid lightGray'}}></th>
                </tr>
                </thead>


                <thead>
                {list?.map((v, i) => {
                    return <tr>
                        <th colSpan={2} style={{
                            width: '8%',
                            border: 'none',
                            textAlign: 'left',
                            paddingLeft: 10,
                            borderBottom: '1px solid lightGray', fontSize : 12

                        }}>
                            <div style={{width: 30, borderRight: '1px solid lightGray'}}>{i + 1}</div>
                        </th>
                        <th style={{borderBottom: '1px solid lightGray', textAlign: 'left', fontSize : 12}}>
                            <div
                                style={{
                                    marginLeft: '-4vw',
                                    wordWrap: 'break-word',
                                    wordBreak: 'break-word',
                                    whiteSpace: 'pre-wrap',
                                    fontWeight: 'lighter'
                                }}>{v.model}
                            </div>
                        </th>
                        <th style={{...headerStyle, textAlign : 'right',  fontWeight: 'lighter', fontSize : 12}}>{amountFormat(v.quantity)}</th>
                        <th style={{...headerStyle, fontSize : 12}}>{v.unit}</th>
                        <th style={{...headerStyle, textAlign: 'right',  fontWeight: 'lighter', fontSize : 12}}>{amountFormat(v.unitPrice)}<span
                            style={{paddingLeft: 5, fontSize : 12}}>₩</span></th>
                        <th style={{
                            borderTop: '1px solid lightGray',
                            textAlign: 'right', fontWeight: 'lighter', fontSize : 12
                        }}>{amountFormat(v.quantity * v.unitPrice)}<span style={{paddingLeft: 5,  fontWeight: 'lighter', fontSize : 12}}>₩</span></th>
                    </tr>
                })}

                </thead>


                <thead>
                <tr style={{fontWeight: 'bold'}}>
                    <th colSpan={3} style={{backgroundColor: '#ebf6f7'}}>합계</th>
                    <th style={{...headerStyle, textAlign : 'right'}}>{amountFormat(totalQuantity)}</th>
                    <th style={headerStyle}>{units}</th>
                    <th style={{...headerStyle, textAlign : 'right'}}>VAT 별도</th>
                    <th style={{borderTop: '1px solid lightGray', textAlign : 'right'}}>{amountFormat(totalValue)}<span style={{paddingLeft : 5}}>₩</span></th>
                </tr>
                </thead>
            </table>
        </div>
    );
}