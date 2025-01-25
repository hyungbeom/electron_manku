import Header from "@/component/homepage/Header";
import {wrapper} from "@/store/store";
import Contact from "@/component/homepage/Contact";
import MobileLanding from "@/component/homepage/MobileLanding";



export default function Home({isMobile}) {


    return (
        <>

            {isMobile ?<MobileLanding/> : <>
                <Header/>
                <div style={{overflowX: 'hidden', minWidth: 1049}}>
                    {/*@ts-ignored*/}
                    <div style={styles.fullscreenImage}>
                        {/*@ts-ignored*/}
                        <div style={styles.textContainer}>
                            <div style={{width: "100%"}}>무역의 기준을 다시쓰다.</div>
                            <div>MANKU TRADE</div>
                            {/*@ts-ignored*/}
                            <div style={{fontSize: 18, fontWeight: 400, paddingTop: 20, fontSize: '1.2vw'}}>당신의 성공을 위한
                                맞춤형
                                무역
                                솔루션
                            </div>
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

                    <div style={{position: 'relative'}}>
                        <img style={{width: '100%'}} src={'/homepage/discover.svg'} alt=""/>
                        <img style={{
                            position: 'absolute',
                            bottom: '12%',
                            left: '42.5%',
                            width: '15%',
                            cursor: 'pointer'
                        }}
                             src={'/homepage/look.svg'} alt=""/>

                    </div>

                    <div style={{position: 'relative'}}>
                        <img
                            style={{width: '100%'}}
                            src={'/homepage/content2.png'}
                            alt=""
                        />
                        <div
                            style={{
                                cursor: "pointer",
                                backgroundColor: '#173F95',
                                position: 'absolute',
                                top: '40%', // 이미지 높이의 40%
                                left: '13.5%', // 이미지 너비의 20%
                                zIndex: 10,
                                width: '10.5%', // 버튼 크기도 반응형으로 설정
                                height: '6%',
                                fontSize: '1vw',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white', // 텍스트 가독성을 위해 흰색
                            }}
                        >
                            MRO 서비스 +
                        </div>
                        <div
                            style={{
                                cursor: "pointer",
                                backgroundColor: '#2F363E',
                                position: 'absolute',
                                top: '48%', // 이미지 높이의 40%
                                left: '13.5%', // 이미지 너비의 20%
                                zIndex: 10,
                                width: '9%', // 버튼 크기도 반응형으로 설정
                                height: '6%',
                                fontSize: '1vw',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white', // 텍스트 가독성을 위해 흰색
                            }}
                        >
                            플랜트 사업부
                        </div>
                        <div
                            style={{
                                cursor: "pointer",
                                backgroundColor: '#2F363E',
                                position: 'absolute',
                                top: '56%', // 이미지 높이의 40%
                                left: '13.5%', // 이미지 너비의 20%
                                zIndex: 10,
                                width: '9%', // 버튼 크기도 반응형으로 설정
                                height: '6%',
                                fontSize: '1vw',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white', // 텍스트 가독성을 위해 흰색
                            }}
                        >
                            반도체 사업부
                        </div>
                        <div
                            style={{
                                cursor: "pointer",
                                backgroundColor: '#2F363E',
                                position: 'absolute',
                                top: '64%', // 이미지 높이의 40%
                                left: '13.5%', // 이미지 너비의 20%
                                zIndex: 10,
                                width: '9%', // 버튼 크기도 반응형으로 설정
                                height: '6%',
                                fontSize: '1vw',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                color: 'white', // 텍스트 가독성을 위해 흰색
                            }}
                        >
                            무역 사업부
                        </div>
                    </div>

                    <div style={{display: 'grid', gridTemplateColumns: '11fr 5.05fr', gap: 0, marginTop: -10}}>
                        <div style={{position: 'relative'}}>
                            <img src={'/homepage/content_5.png'} style={{width: '100%'}} alt=""/>

                            <div style={{
                                position: 'absolute',
                                bottom: '27%',
                                left: '10%',
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '2.2vw'
                            }}>거래품목 +
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '17%',
                                left: '10%',
                                color: 'white',
                                fontWeight: 300,
                                fontSize: '1.2vw'
                            }}>기계장비/기계요소, 측정/제어, 밸브/배관/피팅
                            </div>

                        </div>
                        <div style={{position: 'relative'}}>
                            <img src={'/homepage/content_6.png'} style={{width: '100%'}} alt=""/>
                            <div style={{
                                position: 'absolute',
                                bottom: '27%',
                                left: '10%',
                                color: 'white',
                                fontWeight: 500,
                                fontSize: '2.2vw'
                            }}>한국 대리점 +
                            </div>
                            <div style={{
                                position: 'absolute',
                                bottom: '17%',
                                left: '10%',
                                color: 'white',
                                fontWeight: 300,
                                fontSize: '1.2vw'
                            }}>만쿠무역 주요 한국 대리점
                            </div>

                        </div>
                    </div>


                    <div style={{textAlign: 'center', paddingTop: 180}}>
                        <div style={{fontSize: 60, fontWeight: 600}}>Notice</div>
                        <div style={{paddingTop: 60, fontSize: 18, fontWeight: 500}}>공지 사항 및 안내</div>

                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '100%',
                                paddingTop: 90,
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    gap: '23px',
                                    width: '70%',
                                    margin: '0 auto', // 수평 중앙 정렬
                                }}
                            >
                                <div style={{flex: 1, position: 'relative'}}>
                                    <img
                                        src={'/homepage/notice/image_3.png'}
                                        alt=""
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        padding: '8%',
                                        fontSize: 'calc(0.6vw + 2px)',
                                        color: 'white',
                                        textAlign: 'left',
                                        lineHeight: '1.5vw',
                                    }}>
                                        <div>공지사항 공지사항 공지사항 공지사항 고지</div>
                                        <div>공지사항 공지사항 공지사항 어</div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 12,
                                        fontSize: '0.75vw',
                                        color: 'white',
                                        paddingTop: '54%',
                                        lineHeight: '1.5vw',
                                    }}>
                                        2024.12.12
                                    </div>


                                    <div style={{
                                        width: '100%',
                                        backgroundColor: '#D9D8D6',
                                        fontSize: 'calc(0.6vw + 2px)',
                                        lineHeight: '2vw',
                                        fontWeight: 500,
                                        textAlign: 'left',
                                        padding: '8% 8% 4% 8%'
                                    }}>
                                        <div>
                                            공지사항 내용공지사항 자세한 내용 자세한 내용들
                                        </div>
                                        <div>
                                            공지사항 내용공지사항 자세한 내용용용
                                        </div>
                                        <div style={{fontSize: '1.5vw', textAlign: 'right'}}>
                                            {`${'>'}`}
                                        </div>
                                    </div>
                                </div>
                                <div style={{flex: 1, position: 'relative'}}>
                                    <img
                                        src={'/homepage/notice/image_2.png'}
                                        alt=""
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        padding: '8%',
                                        fontSize: 'calc(0.6vw + 2px)',
                                        color: 'white',
                                        textAlign: 'left',
                                        lineHeight: '1.5vw',
                                    }}>
                                        <div>공지사항 공지사항 공지사항 공지사항 고지</div>
                                        <div>공지사항 공지사항 공지사항 어</div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 12,
                                        fontSize: '0.75vw',
                                        color: 'white',
                                        paddingTop: '54%',
                                        lineHeight: '1.5vw',
                                    }}>
                                        2024.12.12
                                    </div>


                                    <div style={{
                                        width: '100%',
                                        backgroundColor: '#D9D8D6',
                                        fontSize: 'calc(0.6vw + 2px)',
                                        lineHeight: '2vw',
                                        fontWeight: 500,
                                        textAlign: 'left',
                                        padding: '8% 8% 4% 8%'
                                    }}>
                                        <div>
                                            공지사항 내용공지사항 자세한 내용 자세한 내용들
                                        </div>
                                        <div>
                                            공지사항 내용공지사항 자세한 내용용용
                                        </div>
                                        <div style={{fontSize: '1.5vw', textAlign: 'right'}}>
                                            {`${'>'}`}
                                        </div>
                                    </div>
                                </div>
                                <div style={{flex: 1, position: 'relative'}}>
                                    <img
                                        src={'/homepage/notice/image_1.png'}
                                        alt=""
                                        style={{width: '100%', height: 'auto'}}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        padding: '8%',
                                        fontSize: 'calc(0.6vw + 2px)',
                                        color: 'white',
                                        textAlign: 'left',
                                        lineHeight: '1.5vw',
                                    }}>
                                        <div>공지사항 공지사항 공지사항 공지사항 고지</div>
                                        <div>공지사항 공지사항 공지사항 어</div>
                                    </div>
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        right: 12,
                                        fontSize: '0.75vw',
                                        color: 'white',
                                        paddingTop: '54%',
                                        lineHeight: '1.5vw',
                                    }}>
                                        2024.12.12
                                    </div>


                                    <div style={{
                                        width: '100%',
                                        backgroundColor: '#D9D8D6',
                                        fontSize: 'calc(0.6vw + 2px)',
                                        lineHeight: '2vw',
                                        fontWeight: 500,
                                        textAlign: 'left',
                                        padding: '8% 8% 4% 8%'
                                    }}>
                                        <div>
                                            공지사항 내용공지사항 자세한 내용 자세한 내용들
                                        </div>
                                        <div>
                                            공지사항 내용공지사항 자세한 내용용용
                                        </div>
                                        <div style={{fontSize: '1.5vw', textAlign: 'right'}}>
                                            {`${'>'}`}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <Contact/>
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
                </div>
            </>}
        </>
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
        overflowX: 'hidden'
    },
    textContainer: {
        fontWeight: 500,
        // textAlign: "left",
        fontSize: '3.8vw',
        lineHeight: 1.4,
        wordBreak: "break-word", // 줄바꿈 강제
        overflowWrap: "break-word", // 긴 단어 줄바꿈

    },
};


export const getServerSideProps: any = wrapper.getStaticProps((store: any) => async (ctx: any) => {
    const userAgent = ctx.req.headers["user-agent"] || "";
    const isMobile = /mobile|android|iphone|ipad|phone/i.test(userAgent); // 모바일 디바이스 감지

    return {
        props: {
            isMobile, // 모바일 여부를 클라이언트에 전달
        },
    };

})
