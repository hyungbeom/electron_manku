import React from "react";

export default function EstimateHeader() {

    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
            <div style={{width: '40%'}}>
                <img src={'/kor.png'} height={85} style={{paddingBottom: 24, float: 'left'}} alt=""/>
            </div>

            <div style={{fontSize: 38, fontWeight: 700, paddingBottom: 20}}>견&nbsp;&nbsp;&nbsp;&nbsp;적&nbsp;&nbsp;&nbsp;&nbsp;서</div>
            <div style={{
                height: 129, // 부모 높이 명시
                width: '40%',
                display: 'flex',
                alignItems: 'flex-end',  // 이미지 아래 정렬
                justifyContent: 'flex-end' // 오른쪽 정렬 유지
            }}>

                <div style={{float: 'left', fontSize: 11, paddingTop: 10}}>
                    <div>(주) 만쿠솔루션</div>
                    <div>Manku Solution Co., Ltd</div>
                    <div>서울시 송파구 충민로 52</div>
                    <div>가든파이브웍스 B동 2층 211호, 212호</div>
                    <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                </div>
                <div style={{marginLeft: -55, paddingBottom: 20}}>
                    <img src={'/stamp.png'} height={90} alt="만쿠솔루션 도장"/>
                </div>
                {/*<img src={'/manku_stamp_ko.png'} height={90} alt="만쿠솔루션 도장"/>*/}
            </div>
        </div>

        <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}>
            {/*(주) 만쿠무역은 세계 각지의 공급처를 통해 원하시는 부품 및 산업자재를 저렴하게 공급합니다.*/}
        </div>
    </>
}


export function PoHeader({info, type}) {

    return <>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'end'}}>
            <div style={{width: '40%'}}>

                <div style={{width: '40%'}}>
                    <img src={type === 'ko' ? '/kor.png' : '/eng.png'} height={type === 'ko' ? 85 : 75}
                         style={{paddingBottom: type === 'ko' ? 24 : 12, float: 'left'}} alt=""/>
                </div>
            </div>


            <>{type === 'ko' ? <div style={{
                    fontSize: 38,
                    fontWeight: 700,
                    paddingBottom: 20,
                    textAlign: 'center'
                }}>발&nbsp;&nbsp;&nbsp;&nbsp;주&nbsp;&nbsp;&nbsp;&nbsp;서</div> :
                <div style={{
                    fontSize: 38,
                    fontWeight: 700,
                    paddingBottom: 0,
                    lineHeight: 1.3,
                    textAlign: 'center',
                    paddingLeft: 20
                }}>PURCHASE ORDER</div>}
            </>

            <div style={{
                height: 129, // 부모 높이 명시
                width: '40%',
                display: 'flex',
                alignItems: 'flex-end',  // 이미지 아래 정렬
                justifyContent: 'flex-end' // 오른쪽 정렬 유지
            }}>

                <div style={{float: 'left', fontSize: 11, paddingTop: 10}}>
                    {type === 'ko' ? <>
                            <div>(주) 만쿠솔루션</div>
                            <div>Manku Solution Co., Ltd</div>
                            <div>서울시 송파구 충민로 52</div>
                            <div>가든파이브웍스 B동 2층 211호, 212호</div>
                            <div>Tel : 02-465-7838, Fax : 02-465-7839</div>
                        </> :
                        <>
                            <div>Manku Solution Co.,Ltd</div>
                            <div>B-211.212# 52, Chungmin-ro,</div>
                            <div>(Garden 5 Works)</div>
                            <div>Songpa-gu, Seoul, South Korea</div>
                            <div>Tel : +82/2 465 7838</div>
                        </>
                    }
                </div>
                <div style={type === 'ko' ? {marginLeft: -55, paddingBottom: 20} : {
                    paddingBottom: 20,
                    marginRight: -15,
                    marginLeft: -20
                }}>
                    <img src={'/stamp.png'} height={90} alt="만쿠솔루션 도장"/>
                </div>
                {/*<img src={'/manku_stamp_ko.png'} height={90} alt="만쿠솔루션 도장"/>*/}
            </div>
        </div>

        <div style={{padding: 5, borderTop: '2px solid #71d1df', textAlign: 'center', marginTop: 5}}></div>
    </>
}