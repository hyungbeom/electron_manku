export default function Header(){

    return <>
        <div style={{
            position: 'fixed',
            zIndex: 120,
            top: 0,
            left: 0,
            minWidth: 1048,
            width: '100%',
            padding: '30px 35px 30px 35px',
            color: 'black',
            backgroundColor: 'white',
            borderBottom: '1px solid lightGray'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 600}}><img
                    src={'/homepage/logo_1.png'} alt=""/>Manku Trading
                </div>

                <div style={{display: 'flex', gap: '30px', textAlign: 'center', fontWeight: 600}}>
                    <span style={{cursor: "pointer", width: 150}}>기업정보</span>
                    <span style={{cursor: "pointer", width: 150}}>사업분야</span>
                    <span style={{cursor: "pointer", width: 150}}>한국대리점</span>
                    <span style={{cursor: "pointer", width: 150}}>고객센터</span>
                </div>

                <div style={{display: 'flex', gap: '25px'}}>
                    <img src={'/homepage/search.svg'} alt=""/>
                    <img src={'/homepage/lang.svg'} alt=""/>
                    <span>KOR</span>
                </div>
            </div>
        </div>
        <div style={{
            position: 'fixed',
            zIndex: 120,
            top: 83,
            left: 0,
            minWidth: 1048,
            width: '100%',
            padding: '30px 75px 30px 75px',
            color: 'black',
            backgroundColor: 'white',
            borderBottom: '1px solid lightGray'
        }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                <div style={{paddingLeft: 20}}/>

                <div style={{display: 'flex', gap: '30px', textAlign: 'center'}}>
                             <span style={{
                                 cursor: "pointer",
                                 width: 150,
                                 display: 'grid',
                                 gridTemplateRows: '35px 35px 35px 35px'
                             }}>
                                <div>회사소개</div>
                                <div>연혁</div>
                                <div>주요고객</div>
                                <div>오시는길</div>
                            </span>
                    <span style={{
                        opacity: 0.3,
                        cursor: "pointer",
                        width: 150,
                        display: 'grid',
                        gridTemplateRows: '35px 35px 35px 35px'
                    }}>
                                <div>MRO 서비스</div>
                                <div>플랜트 사업부</div>
                                <div>반도체 사업부</div>
                                <div>무역 사업부</div>
                            </span>
                    <span style={{
                        opacity: 0.3,
                        cursor: "pointer",
                        width: 150,

                        display: 'grid',
                        gridTemplateRows: '35px 35px 35px 35px'
                    }}>
                                <div>KOENIG</div>
                                <div>DST Chemical</div>
                                <div>Daiichi</div>
                                <div>Powerflex</div>
                                <div>Bamo</div>
                            </span>
                    <span style={{
                        opacity: 0.3,
                        cursor: "pointer",
                        width: 150,

                        display: 'grid',
                        gridTemplateRows: '35px 35px 35px 35px'
                    }}>
                                <div>온라인문의</div>
                                <div>채용안내</div>
                            </span>
                </div>
                <div/>
            </div>
        </div>
    </>
}