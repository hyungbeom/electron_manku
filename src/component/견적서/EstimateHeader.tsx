import React, {useEffect} from "react";

export default function EstimateHeader(){


    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{width: '40%'}}>
                <div style={{height: 35}}>
                    <img src={'/kor.png'} height={34} style={{paddingTop: 5, float: 'left', marginTop : -4}}
                         alt=""/>
                </div>
                <div style={{float: 'left', fontSize: 11,paddingTop : 10}}>
                    <div>(주) 만쿠솔루션</div>
                    <div>Manku Solution Co., Ltd</div>
                    <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                    <div> B동 2층 211호, 212호</div>
                    <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                </div>
            </div>

            <div style={{fontSize: 38, fontWeight: 700, marginBottom : -12}}>견&nbsp;&nbsp;&nbsp;&nbsp;적&nbsp;&nbsp;&nbsp;&nbsp;서</div>
            <div style={{
                height: 129, // 부모 높이 명시
                width: '40%',
                display: 'flex',
                alignItems: 'flex-end',  // 이미지 아래 정렬
                justifyContent: 'flex-end' // 오른쪽 정렬 유지
            }}>
                {/*<img src={'/manku_stamp_ko.png'} height={90} alt="만쿠솔루션 도장"/>*/}
            </div>
        </div>

        <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}>
            {/*(주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렴하게 공급합니다.*/}
        </div>
    </>
}


export function PoHeader({info, type}) {

    console.log(type,':::')

    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <div style={{width: '40%'}}>
                <div style={{height: 35}}>
                    <img src={type === 'ko' ? '/kor.png' : '/eng.png'} height={34}
                         style={{paddingTop: 5, float: 'left', marginTop: -4}}
                         alt=""/>
                </div>
                <div style={{float: 'left', fontSize: 11, paddingTop: 10}}>

                    {type === 'ko' ? <>
                        <div>(주) 만쿠솔루션</div>
                        <div>Manku Solution Co., Ltd</div>
                        <div>서울시 송파구 충민로 52 가든파이브웍스</div>
                        <div> B동 2층 211호, 212호</div>
                        <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                    </> : <>
                        <div>Manku Solution Co.,Ltd</div>
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
                    {/*<img src={'/manku_stamp_ko.png'} style={{float: 'right'}} width={180} alt=""/>*/}
                </div>
            </div>

            <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}></div>
    </>
}