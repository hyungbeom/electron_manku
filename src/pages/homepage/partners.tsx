import MobileMenu from "@/component/homepage/MobileMenu";
import React from "react";
import MFooter from "@/component/homepage/MFooter";

export default function partners(){


    return <div style={{width : '100%'}}>
        <MobileMenu/>
        <img src={'/homepage/mobile/partners.svg'} style={{padding : '130px 0px 110px 0px', width : '100%'}} alt=""/>
        <MFooter/>
    </div>
}