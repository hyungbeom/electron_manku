import Card from "antd/lib/card/Card";
import React from "react";
import Button from "antd/lib/button";
import {DownCircleFilled, RetweetOutlined, SaveOutlined, UpCircleFilled} from "@ant-design/icons";


export function TopBoxCard({children, title = '', grid}) {

    return <Card size={'small'} title={title}
                 style={{
                     fontSize: 13,
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                 }}>
        <div style={{
            display: 'grid',
            gridTemplateColumns: grid,
            maxWidth: 900,
            minWidth: 600,
            columnGap: 15
        }}>
            {children}
        </div>
    </Card>
}

export function BoxCard({children, title = ''}) {

    return <Card size={'small'} title={title}
                 style={{
                     fontSize: 13,
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)',

                 }}>
        {children}
    </Card>
}


export function MainCard({children, title, list, mini = null, setMini = Function()}) {

    return <Card title={
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
            <div style={{fontSize: 14, fontWeight: 550}}>{title}</div>
            <div style={{display: 'grid', gridTemplateColumns: `${'1fr '.repeat(list.length)}auto`.trim(), columnGap: 8}}>

                {list.map(v => <Button type={v.type} size={'small'}
                                       onClick={v.func}><SaveOutlined/>{v.name}</Button>)}

                {mini !== null ? <span style={{fontSize: 20, cursor: 'pointer', marginTop: -5}}
                       onClick={() => setMini(v => !v)}> {!mini ?
                    <DownCircleFilled/> : <UpCircleFilled/>}</span> : <></>}
            </div>

        </div>
    }>
        {children}
    </Card>
}