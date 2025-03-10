import {useState} from "react";
import {commonManage} from "@/utils/commonManage";
import {inputForm, textAreaForm} from "@/utils/commonForm";

export default function Contact(){



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

    return <>
        <div style={{paddingLeft: 150, paddingTop: 180}}>
            <div style={{fontSize: 18, fontWeight: 500, color: '#173F95'}}>{`고객센터 ${'>'} 온라인 문의`}</div>
            <div style={{fontSize: 54, fontWeight: 600, marginBottom: -30}}>온라인 문의</div>
        </div>
        <div style={{display: 'grid', gridTemplateColumns: '380px 1fr', gridColumnGap: 60, padding: 120}}>
            <div>
                <img src={'/homepage/content7.png'} width={'100%'} alt=""/>
                <div style={{position: 'absolute', left: 210, marginTop: -80}}>
                    <img src={'/homepage/sns/kakao.png'} style={{width: '15%', cursor: 'pointer'}} alt="카카오톡"/>
                    <img src={'/homepage/sns/store.png'} style={{width: '15%', cursor: 'pointer'}} alt="스토어"/>
                    <img src={'/homepage/sns/naver.png'} style={{width: '15%', cursor: 'pointer'}} alt="네이버"/>
                    <img src={'/homepage/sns/phone.png'} style={{width: '15%', cursor: 'pointer'}} alt="전화"/>
                </div>
            </div>
            <div>
                <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gridColumnGap: 25}}>
                    {inputForm({
                        title: '회사이름*',
                        id: 'com',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                    {inputForm({
                        title: '성함*',
                        id: 'name',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridColumnGap: 25,
                    paddingTop: 10
                }}>
                    {inputForm({
                        title: '연락처*',
                        id: 'phone',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                    {inputForm({
                        title: '이메일*',
                        id: 'email',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                </div>

                <div style={{paddingTop: 10}}>
                    {inputForm({
                        title: '제작사',
                        id: 'create',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                </div>
                <div style={{paddingTop: 20}}>
                    {inputForm({
                        title: '아이템',
                        id: 'item',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}

                </div>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gridColumnGap: 25,
                    paddingTop: 20
                }}>
                    {inputForm({
                        title: '모델넘버',
                        id: 'modelNumber',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                    {inputForm({
                        title: '수량',
                        id: 'quantity',
                        onChange: onChange,
                        data: info,
                        size: 'large'
                    })}
                </div>
                {/*<div style={{paddingTop: 20}}>*/}
                {/*    {textAreaForm({*/}
                {/*        title: '문의내용*',*/}
                {/*        id: 'remark',*/}
                {/*        onChange: onChange,*/}
                {/*        data: info*/}
                {/*    })}*/}
                {/*</div>*/}
                {/*<div style={{paddingTop: 20}}>*/}
                {/*    {inputForm({*/}
                {/*        title: '파일 또는 사진 첨부',*/}
                {/*        id: 'attachFile',*/}
                {/*        onChange: onChange,*/}
                {/*        data: info,*/}
                {/*        size: 'large'*/}
                {/*    })}*/}
                {/*</div>*/}

                <div style={{margin: '30px auto', textAlign: 'center'}}>
                    <img src={'/homepage/send_button.png'} style={{cursor: 'pointer', width: '8vw'}} alt=""/>
                </div>
            </div>

        </div>
    </>
}