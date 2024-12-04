import Card from "antd/lib/card/Card";
import React from "react";


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
                     boxShadow: '0 4px 8px rgba(0, 0, 0, 0.02), 0 6px 20px rgba(0, 0, 0, 0.02)'
                 }}>
        {children}
    </Card>
}