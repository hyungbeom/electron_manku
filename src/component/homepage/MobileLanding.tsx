export default function MobileLanding() {


    return <>
        <div style={{position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden'}}>
            <img src={'/homepage/m_landing.png'} style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                height: '100%',
                width: 'auth'
            }} alt=""/>

            <div style={{position: 'absolute', textAlign: 'center', color: 'white', width: '100%', top: '30%'}}>
                <div style={{fontSize: 15}}>무역을 바탕으로</div>
                <div style={{fontSize: 15}}>미래 사업을 창출하는 종합사업회사</div>
                <div style={{fontSize: 35, fontWeight: 600, paddingTop: 10}}>주식회사 만쿠무역</div>
                <div style={{fontSize: 12, paddingTop: 10}}>글로벌 비지니스를 연결하는 가치를 확장합니다.</div>
            </div>

            <div style={{position: 'absolute', textAlign: 'center', color: 'white', width: '100%', bottom: '30%'}}>
                <div style={{fontSize: 15, fontWeight: 600}}>SCROLL</div>
                <div className="gradient-arrow">
                    {`${'>>'}`}
                </div>
            </div>

            <div style={{position: 'absolute', textAlign: 'center', color: 'white', width: '100%', bottom: '10%'}}>
                <div style={{fontSize: 15, fontWeight: 600}}>
                    여기에 어떤 아이콘을?
                </div>
            </div>
        </div>
    </>
}