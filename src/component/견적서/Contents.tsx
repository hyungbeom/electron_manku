import Input from "antd/lib/input";
import Select from "antd/lib/select";
import React from "react";

export default function Contents(){



    return <>


        <thead>
        <tr style={{fontWeight: 'bold', height: 10}}>
            <th colSpan={2} style={{
                border: 'none',
                textAlign: 'center',
                borderRight: '1px solid lightGray',
                borderBottom: '1px solid lightGray', fontSize: 12,

            }}>
                <div>{i + 1}</div>
            </th>

            <th style={{borderBottom: '1px solid lightGray', textAlign: 'left', fontSize: 12}}>

            </th>
            <th style={{

                width: 60,
                textAlign: 'right',
                fontWeight: 'lighter',
                fontSize: 12,
                borderLeft: '1px solid lightGray',
                paddingRight: 6

            }}>
                <Input
                       name={'quantity'}

                       style={{
                           border: 'none',
                           textAlign: 'right',
                           padding: 0
                       }}/>
            </th>
            <th style={{
                borderBottom: '1px solid lightGray',
                fontSize: 12,
                borderLeft: '1px solid lightGray',
                textAlign: 'left',
                paddingRight: 0
            }}>
                <Select
                        style={{border: 'none', height: 30, paddingRight: 0}}
                        bordered={false} suffixIcon={null}

                >
                    {['ea', 'Set', 'Pack', 'Can', 'Box', 'MOQ', 'Meter', 'Feet', 'Inch', 'Roll', 'g', 'kg', 'oz'].map(v => {
                        // @ts-ignored
                        return <Option style={{fontSize: 11}} value={v}>{v}</Option>
                    })}
                </Select>
            </th>
            <th style={{
                width: 150,
                borderBottom: '1px solid lightGray',
                textAlign: 'right',
                fontWeight: 'lighter',
                fontSize: 12,
                borderLeft: '1px solid lightGray',
            }}>
                {/*<NumberInputForm value={v.net} idx={i} id={'net'} setInfo={setInfo}/>*/}
            </th>

            <th style={{
                borderTop: '1px solid lightGray',
                fontWeight: 'lighter', fontSize: 12,
                borderLeft: '1px solid lightGray',
                borderBottom: '1px solid lightGray'
            }}>
                <RowTotal
                    defaultValue={info.quantity * Number(info?.net ? info?.net : '')}
                    id={'amount'}/>
            </th>
        </tr>
        </thead>
    </>
}