import React from "react";

export default function MFooter(){

    return <>
        <div style={{backgroundColor: '#2F363E', padding: '24px 30px', width : '100%'}}>

            <div style={{color: 'white', fontSize: '3vw', display: 'flex', gap: 10, justifyContent: 'end'}}>
                <span>홈</span>
                <span>기업정보</span>
                <span>사업분야</span>
                <span>한국대리점</span>
                <span>고객센터</span>
            </div>

            <div style={{
                color: 'white',
                fontSize: '3vw',
                display: 'flex',
                gap: 10,
                justifyContent: 'end',
                paddingTop: 10
            }}>
                <span>메일문의</span>
                <span>네이버스토어</span>
            </div>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between', // 자식들을 우측 정렬
                    alignItems: 'center', // 수직 중앙 정렬
                    paddingTop: 22
                }}
            >
                <img src={'/homepage/sns/online.png'}
                     style={{width: '28%', cursor: 'pointer'}} alt="온라인 문의"/>


                <img src={'/homepage/sns/kakao.png'} style={{width: '15%', cursor: 'pointer'}}
                     alt="카카오톡"/>
                <img src={'/homepage/sns/store.png'} style={{width: '15%', cursor: 'pointer'}}
                     alt="스토어"/>
                <img src={'/homepage/sns/naver.png'} style={{width: '15%', cursor: 'pointer'}}
                     alt="네이버"/>
                <img src={'/homepage/sns/phone.png'} style={{width: '15%', cursor: 'pointer'}}
                     alt="전화"/>

            </div>
            <img src="/homepage/mobile/m_footer.png" width={'100%'} style={{paddingTop: 20}}
                 alt=""/>

        </div>
    </>
}