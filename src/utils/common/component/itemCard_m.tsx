import {BoxTag, CommandBox} from "@/utils/common/component/tagBox";
import colorList from "@/utils/common/colorList";
import clock from "@/resources/image/icon/clock.svg";
import React, {useEffect, useRef, useState} from "react";
import {useRouter} from "next/router";
import {CommonButton} from "@/styles/styled_component/common";
import {IMAGE_URL} from "@/manage/function/api";
import cartSVG from "@/resources/image/icon/top/cart.svg";
import heartSVG from "@/resources/image/icon/top/heart.svg";
import cardSVG from "@/resources/image/icon/cart_green.svg";
import message from "antd/lib/message";


export default function ItemCard_m({value, listPage=false, time=false, rank=null, index=null,}){

    const domRef = useRef<HTMLImageElement>(null);

    const router = useRouter()
    // 임시 데이터
    const eventTagList= [{color:"#FF2424", tagName:"BEST"}, {color:"#FF8C39", tagName:"SALE",}, {color:"#5BAE39", tagName:"인기상품",}]

    const formatPrice = (value: number) => {
        return new Intl.NumberFormat('ko-KR').format(value);
    }

    const discountedPrice = value.productPrice - (value.productPrice * value.discountValue);

    function moveProduct(v){
        router.push({
            pathname: '/product',
            query: {productNo: v.productNo}
        })
    }


    return (
        <div style={{width:'100%'}}>
            <div style={{position: 'relative', width: '100%', height: 'auto'}}>
                <img onDragStart={(e) => e.preventDefault()} ref={domRef}
                     src={value.src? value.src.src :  IMAGE_URL + '/480' + value.productImage} alt=""
                     style={{
                         marginBottom: 5,
                         width: '100%',
                         aspectRatio: '0.94/1',
                         cursor: 'pointer',
                         borderRadius: '5px'
                     }} onClick={() => moveProduct(value)}/>

                <div style={{
                    position: 'absolute',
                    bottom: 15,
                    left: 0,
                    width: '100%',
                    fontSize: 7.5
                }}>
                    {(value.eventCategoryList ?? []).map((v, i) => {
                        return <div key={i} style={{
                            width: 24,
                            backgroundColor: v.bgColor,
                            textAlign: 'center',
                            padding: '3px 4px',
                            borderRadius: 4,
                            color: 'white',
                            float: 'left',
                            marginLeft: 5,
                            boxSizing: 'border-box'
                        }}>
                            {v.cateName}
                        </div>
                    })}
                </div>
                <div style={{
                    width: 30,
                    height: 30,
                    right: 7,
                    bottom: 15,
                    borderRadius: '50%',
                    position: 'absolute',
                    backgroundColor: 'white',
                    padding: '5px 0 0 7px',
                    boxSizing:'border-box'
                }} onClick={()=>{
                    message.info('11월 20일 시즌마켓 오픈합니다!. 많은 관심 부탁드립니다.');
                }}>
                    <img src={cardSVG.src} alt='cart' />
                </div>

                {rank!=null && <div style={{
                    width: 24,
                    height: 'auto',
                    right: 0,
                    top: 0,
                    position: 'absolute',
                    backgroundColor: '#FF8C39',
                    paddingTop: 3,
                    textAlign: 'center',
                    fontSize: 18,
                    color: 'white'
                }}>
                    {rank + 1}</div>}

                {time && <div style={{
                    top: 0,
                    height: 35,
                    width: 35,
                    position: 'absolute',
                    backgroundColor: colorList['mainGreen'],
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}>
                    <img width={16} src={clock.src} alt=""/></div>}

            </div>

            <div style={{width:'100%', height:'auto'}}>
                {value.isSale &&

                    <span style={{border: `1px solid ${colorList['mainGreen']}`, color: colorList['mainGreen'],
                        margin: '0 5px 5px 0', fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center',
                        width : 'auto', height : 18, borderRadius : 5, float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px',
                    }}>Sale</span>}
                {value.isBest &&

                    <span style={{border: `1px solid ${colorList['red']}`, color: colorList['red'],
                        margin: '0 5px 5px 0', fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center',
                        width : 'auto', height : 18, borderRadius : 5, float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px',
                    }}>Best</span>}
                {value.isPopular &&
                    <span style={{border: `1px solid ${colorList['point1']}`, color: colorList['point1'],
                        margin: '0 5px 5px 0', fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center',
                        width : 'auto', height : 18, borderRadius : 5, float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px',
                    }}>인기상품</span>}

            </div>
            {/*<br/>*/}
            <div style={{
                fontSize: 15,
                width: '100%',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                cursor: 'pointer',
                lineHeight: 1.5
            }}
                 onClick={() => moveProduct(value)}>
                {value.productTitle}
            </div>
            {listPage && <span style={{color: colorList['grey2'], textDecoration: 'line-through'}}>0</span>}
            {/*<div style={{display:'flex', alignItems:'center', justifyContent: 'space-between', width:'100%'}}><span style={{color: colorList['mainGreen'], fontSize: 20, fontWeight:600 }}>{value.discountValue*100}%</span>*/}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%'}}>
                <div>
                    <span
                        // style={{color: colorList['mainGreen'], marginRight: 9}}>0%</span>
                        style={{color: colorList['mainGreen'], marginRight: 9}}>가격</span>
                    {/*<span style={{color: colorList['grey2'], textDecoration: 'line-through',  marginRight: 9}}>{formatPrice(value.productPrice)}</span> <span style={{fontSize: 20, fontWeight:800}}>{formatPrice(discountedPrice)}</span></div>*/}
                    <span style={{fontSize: 18, fontWeight: 800}}>미정</span>
                </div>
                <div>
                    {listPage && <>
                        <img src={cartSVG.src} style={{width: '20px', float: "right", padding: 7}} alt="cart"/>
                        <img src={heartSVG.src} style={{width: '20px', float: "right", padding: 7}} alt="heart"/></>}
                </div>
            </div>
        </div>
    )
}