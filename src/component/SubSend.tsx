import React, {memo, useState} from "react";
import {MinusCircleOutlined, PlusSquareOutlined} from "@ant-design/icons";
import _ from "lodash";
import Button from "antd/lib/button";

export const SubSend = ({idx}) => {

    const [count, setCount] = useState([])

    return <div id={`cc_${idx}`}>
        <div style={{display: 'grid', gridTemplateColumns: '100px 1fr', gap: 5}}>

            <Button type={'primary'} size={'small'} style={{fontSize : 12, marginTop : 5}}>참조(C)</Button>
            <div>
                {count.map((src, numb) => {
                    return <div style={{width: '100%', display: 'flex'}}>
                        <input type="text" style={{marginTop: 6, height: 23}} onChange={e => {

                            e.target.style.border = ''
                        }}/>
                        <MinusCircleOutlined style={{
                            color: 'red',
                            fontSize: 15,
                            fontWeight: 700,
                            paddingLeft: 5,
                            cursor: 'pointer',
                            opacity: 0.7
                        }} onClick={() => {
                            setCount(v => {
                                let copyArr = [...v]
                                copyArr.splice(numb, 1)
                                return copyArr
                            })
                        }}/>
                    </div>
                })}
            </div>
        </div>

        <div style={{paddingTop: 5}}>
            <span style={{color: 'blue', cursor: 'pointer'}} onClick={() => {
                setCount(v => {
                    return [...v, '']
                })
            }}>추가<PlusSquareOutlined/></span>
        </div>
    </div>
}


export default memo(SubSend, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});

