import LayoutComponent from "@/component/LayoutComponent";
import Card from "antd/lib/card/Card";
import React, {useEffect, useState} from "react";
import Button from "antd/lib/button";
import {setCookies} from "@/manage/function/cookie";
import nookies from "nookies";

export default function SettingDefault() {

    const [info, setInfo] = useState({display: 'vertical'});


    useEffect(() => {
        const cookies = nookies.get()
        const {display = 'horizon'} = cookies;
        setCookies(null, 'display', display)
        setInfo(v => {
            return {...v, ...{display: display}}
        })
    }, [])

    function infoChange(e) {


        setCookies(null, 'display', e)
        setInfo(v => {
            return {...v, ...{display: e}}
        })

    }

    return <LayoutComponent>
        <>
            <Card title={'기본설정'} style={{fontSize: 12}}>
                <Button id={'vertical'} type={info['display'] === 'vertical' ? 'primary' : null}
                        onClick={() => infoChange('vertical')}>세로</Button>
                <Button id={'horizon'} type={info['display'] === 'horizon' ? 'primary' : null}
                        onClick={() => infoChange('horizon')}>가로</Button>
            </Card>
        </>
    </LayoutComponent>
}