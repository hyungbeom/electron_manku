export default function Footer(){


    return <>
        <div style={{position: 'relative'}}>
            <img src={'/homepage/footer.png'} style={{width: '100%'}} alt=""/>
            <div
                style={{
                    position: 'absolute',
                    bottom: '72%',
                    left: '49.5%',
                    // transform: 'translate(-50%, 0)', // 중앙 정렬을 위해 추가
                    color: 'white',
                    fontWeight: 300,
                    fontSize: '0.8vw',
                }}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end', // 자식들을 우측 정렬
                    alignItems: 'center', // 수직 중앙 정렬
                    width: '36.5vw', gap: 18
                }}>
                    <span style={{cursor: 'pointer'}}>홈</span>
                    <span style={{cursor: 'pointer'}}>가입정보</span>
                    <span style={{cursor: 'pointer'}}>사업분야</span>
                    <span style={{cursor: 'pointer'}}>한국대리점</span>
                    <span style={{cursor: 'pointer'}}>고객센터</span>
                    <span style={{cursor: 'pointer'}}>메일문의</span>
                    <span style={{cursor: 'pointer'}}>네이버스토어</span>
                </div>
            </div>
            <div
                style={{
                    position: 'absolute',
                    bottom: '40%',
                    left: '62%',
                    // transform: 'translate(-50%, 0)', // 중앙 정렬을 위해 추가
                    color: 'white',
                    fontWeight: 300,
                    fontSize: '1.2vw',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end', // 자식들을 우측 정렬
                        alignItems: 'center', // 수직 중앙 정렬
                        width: '24vw',
                    }}
                >
                    <img src={'/homepage/sns/online.png'}
                         style={{width: '28%', marginBottom: 5, cursor: 'pointer'}} alt="온라인 문의"/>
                    <img src={'/homepage/sns/kakao.png'} style={{width: '15%', cursor: 'pointer'}}
                         alt="카카오톡"/>
                    <img src={'/homepage/sns/store.png'} style={{width: '15%', cursor: 'pointer'}}
                         alt="스토어"/>
                    <img src={'/homepage/sns/naver.png'} style={{width: '15%', cursor: 'pointer'}}
                         alt="네이버"/>
                    <img src={'/homepage/sns/phone.png'} style={{width: '15%', cursor: 'pointer'}}
                         alt="전화"/>
                </div>
            </div>
        </div>
    </>
}