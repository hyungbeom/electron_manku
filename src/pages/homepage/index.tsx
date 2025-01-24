import {inputForm, selectBoxForm, textAreaForm} from "@/utils/commonForm";
import {commonManage} from "@/utils/commonManage";
import {useState} from "react";

export default function Home() {

    const [info, setInfo] = useState({
        companyName: '',
        name: '',
        phone: '',
        email: '',
        create: '',
        item: '',
        modelNumber: '',
        quantity: '',
        remark: '',
        attachFile: ''
    });

    function onChange(e) {
        commonManage.onChange(e, setInfo)
    }

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

            <div style={{display: 'grid', gridTemplateColumns: '11fr 5.05fr', marginTop: -10}}>
                <div style={{position: 'relative'}}>
                    <img src={'/homepage/content5.png'} style={{width: '100%'}} alt=""/>

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
                    <img src={'/homepage/content6.png'} style={{width: '100%'}} alt=""/>
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


            <div style={{textAlign : 'center', border : '1px solid black', height : 300}}>

                NOTICE!~~~~~~~~~~~~~
            </div>


            <div style={{display: 'grid', gridTemplateColumns: '400px 1fr', gridColumnGap: 120, padding: 150}}>
                <img src={'/homepage/content7.png'} width={'100%'} alt=""/>
                <div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 25}}>
                        {inputForm({
                            title: '회사이름*',
                            id: 'com',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '성함*',
                            id: 'name',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 25, paddingTop: 10}}>
                        {inputForm({
                            title: '연락처*',
                            id: 'phone',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                        {inputForm({
                            title: '이메일*',
                            id: 'email',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>

                    <div style={{paddingTop: 10}}>
                        {selectBoxForm({
                            title: '제작사', id: 'create', onChange: onChange, data: info, list: [
                                {value: 0, label: ''},
                                {value: 1, label: ''},
                                {value: 2, label: ''}
                            ], size: 'middle'
                        })}
                    </div>
                    <div style={{paddingTop: 20}}>
                        {selectBoxForm({
                            title: '아이템', id: 'item', onChange: onChange, data: info, list: [
                                {value: 0, label: ''},
                                {value: 1, label: ''},
                                {value: 2, label: ''}
                            ], size: 'middle'
                        })}
                    </div>
                    <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 25, paddingTop : 20}}>
                        {selectBoxForm({
                            title: '모델넘버', id: 'modelNumber', onChange: onChange, data: info, list: [
                                {value: 0, label: ''},
                                {value: 1, label: ''},
                                {value: 2, label: ''}
                            ], size: 'middle'
                        })}
                        {inputForm({
                            title: '수량',
                            id: 'quantity',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>
                    <div style={{paddingTop : 20}}>
                        {textAreaForm({
                            title: '문의내용*',
                            id: 'remark',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>
                    <div style={{paddingTop : 20}}>
                        {inputForm({
                            title: '파일 또는 사진 첨부',
                            id: 'attachFile',
                            onChange: onChange,
                            data: info,
                            size: 'middle'
                        })}
                    </div>

                    <div>BUTTON +</div>
                </div>

            </div>


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
                        <img src={'/homepage/sns/kakao.png'} style={{width: '15%', cursor: 'pointer'}} alt="카카오톡"/>
                        <img src={'/homepage/sns/store.png'} style={{width: '15%', cursor: 'pointer'}} alt="스토어"/>
                        <img src={'/homepage/sns/naver.png'} style={{width: '15%', cursor: 'pointer'}} alt="네이버"/>
                        <img src={'/homepage/sns/phone.png'} style={{width: '15%', cursor: 'pointer'}} alt="전화"/>
                    </div>
                </div>
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