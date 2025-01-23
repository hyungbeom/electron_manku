export default function Home() {
    return (
        <div style={{overflowX: 'hidden'}}>
            <div style={styles.fullscreenImage}>

                <div style={{position: 'fixed', top: 0, left: 0, width: '100%', padding: '30px 75px 30px 60px'}}>

                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}><img
                            src={'/homepage/logo_1.png'} alt=""/>Mankuk Trading
                        </div>

                        <div style={{display: 'flex', gap: '120px'}}>
                            <span>기업정보</span>
                            <span>사업분야</span>
                            <span>한국대리점</span>
                            <span>고객센터</span>
                        </div>

                        <div style={{display: 'flex', gap: '25px'}}>
                            <img src={'/homepage/search.svg'} alt=""/>
                            <img src={'/homepage/lang.svg'} alt=""/>
                            <span>KOR</span>
                        </div>
                    </div>

                </div>

                {/*@ts-ignored*/}
                <div style={styles.textContainer}>
                    <div style={{width: "100%"}}>함께 이어가는 무역의 가치,</div>
                    <div>MANKU TRADE</div>
                    <div style={{fontSize: 18, fontWeight: 400, paddingTop: 20}}>글로벌 비지니스를 연결하며 가치를 확장합니다.</div>
                </div>

                <div style={{
                    display: 'flex', gap: '60px',
                    position: 'absolute', bottom: 90,
                    left: '50%', // 화면의 가로 중앙
                    transform: 'translateX(-50%)', // 요소 너비의 절반만큼 왼쪽으로 이동
                    whiteSpace: 'nowrap', // 텍스트 줄바꿈 방지
                }}>

                    <span>01 &nbsp; About us</span>
                    <span>02 &nbsp; Discover What Drives Us</span>
                    <span>03 &nbsp; What MANKU TRADE do?</span>
                    <span>04 &nbsp; Notice</span>
                    <span>05 &nbsp; Contact us</span>

                </div>
            </div>
            <img src={'/homepage/content1.png'} style={{width: '100%'}} alt=""/>

            <div style={{backgroundColor: '#F7F7F7', padding: 90, textAlign: 'center'}}>
                <div style={{fontSize: 60, fontWeight: 700}}>Discover What Drives Us</div>
                <div style={{paddingTop: 55, fontSize: 24}}>우리의 원동력을 탐구하고, 만쿠무역의 비전을 확인하세요.</div>
                <div style={{
                    backgroundColor: '#173F95',
                    width: 200,
                    height: 50,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    margin: '72px auto'
                }}>자세히보기
                </div>
            </div>

            <div>
                test1
            </div>

            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
            <div>
                test2
            </div>
        </div>
    );
}

const styles = {
    fullscreenImage: {
        height: "100vh", // 화면 높이를 100%로 설정
        width: "100vw", // 화면 너비를 100%로 설정
        backgroundImage: "url('/homepage/landing_img.png')", // 이미지 경로
        backgroundSize: "cover", // 이미지를 화면에 꽉 차게
        backgroundPosition: "center", // 이미지를 중앙에 배치
        backgroundRepeat: "no-repeat", // 이미지 반복 방지
        display: "flex", // Flexbox 사용
        justifyContent: "flex-start", // 수평 방향으로 왼쪽 정렬
        alignItems: "center", // 수직 방향으로 가운데 정렬
        paddingLeft: '15%', // 왼쪽 여백 추가
        color: "#fff", // 텍스트 색상
    },
    textContainer: {
        fontWeight: 500,
        // textAlign: "left",
        fontSize: 60,
        lineHeight: 1.4,
        wordBreak: "break-word", // 줄바꿈 강제
        overflowWrap: "break-word", // 긴 단어 줄바꿈
    },
};