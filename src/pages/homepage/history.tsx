import MobileMenu from "@/component/homepage/MobileMenu";
import React from "react";
import MFooter from "@/component/homepage/MFooter";

export default function history(){


    return <div style={{width : '100%'}}>
        <MobileMenu/>
        <img src={'/homepage/mobile/history.svg'} style={{paddingTop : 130, width : '100%'}} alt=""/>
        <MFooter/>
    </div>
}