import React, {useEffect} from "react";

export default function EstimateHeader(){


    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{width: '40%'}}>
                <img src={'/manku_ci_black_text.png'} width={50} style={{paddingTop: 5, float: 'left'}}
                     alt=""/>
                <div style={{float: 'left', fontSize: 11, paddingLeft: 20}}>
                    <div>(주) 만쿠무역</div>
                    <div>Manku Trading Co., Ltd</div>
                    <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                    <div> B동 2층 211호, 212호</div>
                    <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                </div>
            </div>

            <div style={{fontSize: 38, fontWeight: 700}}>견&nbsp;&nbsp;&nbsp;&nbsp;적&nbsp;&nbsp;&nbsp;&nbsp;서
            </div>
            <div style={{width: '40%'}}>
                <img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={180} alt=""/>
            </div>
        </div>

        <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}>
            (주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렴하게 공급합니다.
        </div>
    </>
}


export function PoHeader({info, type}){

    console.log(type,':::')

    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{width: '40%'}}>
                <img src={'/manku_ci_black_text.png'} width={50} style={{paddingTop: 5, float: 'left'}}
                     alt=""/>
                <div style={{float: 'left', fontSize: 11, paddingLeft: 20}}>

                    {type === 'ko' ? <>
                        <div>(주) 만쿠무역</div>
                        <div>Manku Trading Co., Ltd</div>
                        <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                        <div> B동 2층 211호, 212호</div>
                        <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                    </> : <>
                        <div>Manku Trading Co.,Ltd</div>
                        <div>B- 211#, Garden Five Works, 52,</div>
                        <div>Chungmin-ro,</div>
                        <div>Songpa-gu, Seoul, South Korea</div>
                        <div>Postal Code 05839</div>
                    </>
                    }
                </div>
            </div>

            <div style={{
                fontSize: 38,
                fontWeight: 700,
                textAlign: 'center'
            }}>{type === 'ko' ? <>발&nbsp;&nbsp;&nbsp;&nbsp;주&nbsp;&nbsp;&nbsp;&nbsp;서</> : <>PURCHASE
                ORDER</>} </div>
            <div style={{width: '40%'}}>
                <img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={180} alt=""/>
            </div>
        </div>

        <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}></div>
    </>
}