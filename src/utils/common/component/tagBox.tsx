import colorList from "@/utils/common/colorList";
import React from "react";


export const enum TAGBOX {
    JEJU,
    DIVIDE,
    SEASON,
    FARMER
}
export const enum TAG {
    MD,
    MEALKIT,
    BEST,
}


// @ts-ignored
export const BoxTag = ({tag, detail=false}) => {

    switch (tag) {
        case TAGBOX.JEJU :
            // @ts-ignored
        return<div style={{backgroundColor: colorList['point1'],
            textAlign: 'center',
            padding: detail ? '5px 10px' : '5px 3px' ,
            borderRadius: 8,
            color: 'white',
            float: 'left',
            marginLeft: 8}}>
            <div>제주</div>
            <div>특산</div>
        </div>
        case TAGBOX.DIVIDE :
            // @ts-ignored
            return <div style={{backgroundColor: colorList['mainGreen'],
                textAlign: 'center',
                padding: detail ? '5px 10px' : '5px 3px' ,
                borderRadius: 8,
                color: 'white',
                float: 'left',
                marginLeft: 8}}>
                <div>소분</div>
                <div>판매</div>
            </div>
        case TAGBOX.SEASON :
            // @ts-ignored
                return <div style={{backgroundColor: colorList['red'],
                    textAlign: 'center',
                    padding: detail ? '5px 10px' : '5px 3px' ,
                    borderRadius: 8,
                    color: 'white',
                    float: 'left',
                    marginLeft: 8}}>
                <div>제철</div>
                <div>상품</div>
            </div>
        case TAGBOX.FARMER :
            // @ts-ignored
            return <div style={{backgroundColor: 'lightblue',
                textAlign: 'center',
                padding: detail ? '5px 10px' : '5px 3px' ,
                borderRadius: 8,
                color: 'white',
                float: 'left',
                marginLeft: 8}}>
                <div>농부</div>
                <div>핫딜</div>
            </div>
    }
}

export const CommandBox = ({tag}) => {

    const commonCss = {
        fontSize : 10, display : 'flex', alignItems : 'center', justifyContent : 'center', width : 'auto', height : 20, borderRadius : 5,
        float : 'left', marginRight : 5, whiteSpace: 'nowrap', padding: '0 5px'
    }
    switch (tag) {
        case TAG.BEST :
            // @ts-ignored
            return <span style={{border : `1px solid ${colorList['red']}`, color : colorList['red'], ...commonCss}}>BEST</span>
        case TAG.MD :
            // @ts-ignored
            return <span style={{border : `1px solid ${colorList['mainGreen']}`, color : colorList['mainGreen'], ...commonCss }}>MD추천</span>
        case TAG.MEALKIT:
            // @ts-ignored
            return <span style={{border : `1px solid ${colorList['point1']}`,  color : colorList['point1'], ...commonCss }}>밀키트</span>

    }
}

export default function tagBox(){



    return <>

        <div style={{
            backgroundColor: colorList['point1'],
            width: 32,
            textAlign: 'center',
            padding: 5,
            borderRadius: 10,
            color: 'white',
            float: 'left',
            marginLeft: 8
        }}>
            <div>제주</div>
            <div>특산</div>
        </div>
        <div style={{
            backgroundColor: colorList['mainGreen'],
            width: 32,
            textAlign: 'center',
            padding: 5,
            borderRadius: 10,
            color: 'white',
            float: 'left',
            marginLeft: 8
        }}>
            <div>소분</div>
            <div>판매</div>
        </div>
        <div style={{
            backgroundColor: colorList['red'],
            width: 32,
            textAlign: 'center',
            padding: 5,
            borderRadius: 10,
            color: 'white',
            float: 'left',
            marginLeft: 8
        }}>
            <div>제철</div>
            <div>상품</div>
        </div>
    </>
}