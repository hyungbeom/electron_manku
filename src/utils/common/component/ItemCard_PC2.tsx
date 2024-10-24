import {BoxTag, CommandBox} from "@/utils/common/component/tagBox";
import colorList from "@/utils/common/colorList";
import clock from "@/resources/image/icon/clock.svg";
import React, {useEffect, useRef, useState} from "react";
import {IMAGE_URL} from "@/manage/function/api";
import {useRouter} from "next/router";
import {CommonButton} from "@/styles/styled_component/common";

export default function ItemCard_PC({value}){

    const router = useRouter();
    const domRef = useRef<any>();
    const [curHeight, setCurHeight] = useState<any>()

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    }

    const discountedPrice = value.productPrice - (value.productPrice * value.discountValue);


    useEffect(()=>{
        if(domRef?.current){
            setCurHeight(domRef?.current?.clientHeight)
        }
    },[domRef?.current])



    function moveProduct(v){
        router.push({
            pathname: '/product',
            query: {productNo: v.productNo}
        })
    }


    return <div>
        <div style={{position: 'relative'}}>

            {/* <div style={{*/}
            {/*    width: 40,*/}
            {/*    height: 40,*/}
            {/*    right : 0,*/}
            {/*    position: 'absolute',*/}
            {/*    backgroundColor: '#FF8C39',*/}
            {/*    display: 'flex',*/}
            {/*    justifyContent: 'center',*/}
            {/*    alignItems: 'center',*/}
            {/*    fontSize: 24,*/}
            {/*    color: 'white'*/}
            {/*}}>*/}
            {/*    1*/}
            {/*</div>*/}
            {value.event === 'time' && <div style={{
                width: 40,
                height: 40,
                position: 'absolute',
                backgroundColor: colorList['mainGreen'],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                color: 'white'
            }}>
                <img src={clock.src} alt=""/>


            </div>}

            {value.event === 'time' && <div style={{
                width: 40,
                height: 40,
                right : 0,
                top: curHeight - 40,
                position: 'absolute',
                backgroundColor: colorList['mainGreen'],
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                color: 'white'
            }}>
                <img src={clock.src} alt=""/>
            </div>}
           <img onDragStart={(e) => e.preventDefault()} ref={domRef} style={{ borderRadius:'5px', marginBottom: 5, width: '100%', cursor : 'pointer'}} src={IMAGE_URL + '/1024' + value.productImage} alt="" onClick={()=>moveProduct(value)}/>

            <div style={{
                position: 'absolute',
                top: curHeight - 45,
                left: 0,
                width: '100%',
                fontSize: 10,
            }}>
                {[1,2].map(v => <BoxTag tag={v}/>)}
            </div>


            <CommonButton>장바구니 담기</CommonButton>
            <div style={{paddingTop: 13}}>
                {[2,0].map(v => <CommandBox tag={v}/>)}
            </div>
            <br/>

            <div>
            <div onClick={()=>moveProduct(value)} style={{paddingTop: 10, cursor :'pointer'}}>
                {value.productName}
            </div>
            <div ><span style={{color: colorList['mainGreen'], fontSize: 20}}>00%</span>
                <span>미정</span> <span style={{fontSize: 20}}>미정</span></div>
            </div>
        </div>
    </div>
}