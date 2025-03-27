import React, {memo, useState} from "react";
import {MinusCircleOutlined, PlusSquareOutlined} from "@ant-design/icons";
import _ from "lodash";

export const SubSend = ({idx}) => {

    const [count, setCount] = useState([])

    return <div id={`cc_${idx}`}>
        <div style={{display: 'grid', gridTemplateColumns: '100px 1fr', gap: 5}}>
                  <span style={{
                      border: '1px solid lightGray',
                      height: 23,
                      fontSize: 12,
                      padding: 2,
                      marginTop: 6,
                      textAlign: 'center'
                  }}>참조(C)</span>
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

