import colorList from "@/utils/common/colorList";
import clock from "@/resources/image/icon/clock.svg";
import React, {useRef} from "react";
import {useRouter} from "next/router";
import {CommonButton} from "@/styles/styled_component/common";
import {IMAGE_URL} from "@/manage/function/api";
import cartSVG from "@/resources/image/icon/top/cart.svg";
import heartSVG from "@/resources/image/icon/top/heart.svg";
import message from "antd/lib/message";

export default function ItemCard_PC({value, listPage=false}){


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


    return <div>
        <div>

            {value.rank && <div style={{
                width: 40,
                height: 40,
                right : 0,
                position: 'absolute',
                backgroundColor: '#FF8C39',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 24,
                color: 'white'
            }}>
                {value.rank}
            </div>}
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

            <div style={{position:'relative'}}>

                <img onDragStart={(e) => e.preventDefault()} ref={domRef} src={IMAGE_URL + '/1024' + value.productImage} alt=""
                     style={{marginBottom:5, width: '100%', aspectRatio:'0.83/1', cursor : 'pointer', borderRadius:'5px'}} onClick={()=>moveProduct(value)}/>

                <div style={{
                    position: 'absolute',
                    bottom: 20,
                    left: 0,
                    width: '100%',
                    fontSize: 10
                }}>
                    {(value.eventCategoryList??[]).map((v, i)=>{
                        return<div key={i} style={{
                            width: 23,
                            backgroundColor: v.bgColor,
                            textAlign: 'center',
                            padding: '7px 10px',
                            borderRadius: 8,
                            color: 'white',
                            float: 'left',
                            marginLeft: 8}}>
                            {v.cateName}
                        </div>
                    })}
            </div>

            </div>
            {!listPage && <CommonButton onClick={()=>  message.info('11월 20일 시즌마켓 오픈합니다!. 많은 관심 부탁드립니다.')}>장바구니 담기</CommonButton>}

            <div>
                {value.isSale &&
                    <span style={{border: `1px solid ${colorList['mainGreen']}`, color: colorList['mainGreen'],
                        marginTop: 13, fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center',
                        width : 'auto', height : 20, borderRadius : 5, float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px',
                }}>Sale</span>}
                {value.isBest &&
                    <span style={{border: `1px solid ${colorList['red']}`, color: colorList['red'],
                        marginTop: 13, fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center',
                        width : 'auto', height : 20, borderRadius : 5, float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px',
                    }}>Best</span>}
                {value.isPopular &&
                    <span style={{border: `1px solid ${colorList['point1']}`, color: colorList['point1'],
                        marginTop: 13, fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center',
                        width : 'auto', height : 20, borderRadius : 5, float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px',
                    }}>인기상품</span>}
            </div>
            {/*<br/>*/}
            <div style={{
                fontSize: 14,
                paddingTop: 10,
                width: '100%',
                overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box',WebkitBoxOrient: 'vertical',WebkitLineClamp: 2, cursor : 'pointer', lineHeight:1.5}}
                 onClick={()=>moveProduct(value)}>
                {value.productTitle} {value.title}
            </div>
            {listPage && <span style={{color: colorList['grey2'], textDecoration: 'line-through'}}>0</span>}
            {/*<div style={{display:'flex', alignItems:'center', justifyContent: 'space-between', width:'100%'}}><span style={{color: colorList['mainGreen'], fontSize: 20, fontWeight:600 }}>{value.discountValue*100}%</span>*/}
            <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', width:'100%'}}>
                <div>
                    <span style={{color: colorList['mainGreen'], fontSize: 20, fontWeight: 600, marginRight: 9}}>0%</span>
                    {/*<span style={{color: colorList['grey2'], textDecoration: 'line-through',  marginRight: 9}}>{formatPrice(value.productPrice)}</span> <span style={{fontSize: 20, fontWeight:800}}>{formatPrice(discountedPrice)}</span></div>*/}
                    {!listPage && <span style={{color: colorList['grey2'], textDecoration: 'line-through',  marginRight: 9}}>0</span>}
                    <span style={{fontSize: 20, fontWeight: 800}}>미정</span>
                </div>
                <div style={{cursor : 'pointer'}}>
                    {listPage && <>
                    <img src={cartSVG.src} style={{width: '20px', float:"right", padding:7}} alt="cart" onClick={()=>  message.info('11월 20일 시즌마켓 오픈합니다!. 많은 관심 부탁드립니다.')}/>
                    <img src={heartSVG.src} style={{width: '20px', float:"right", padding:7}} alt="heart" onClick={()=>  message.info('11월 20일 시즌마켓 오픈합니다!. 많은 관심 부탁드립니다.')}/></>}
                </div>
            </div>
        </div>
    </div>
}