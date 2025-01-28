import MobileMenu from "@/component/homepage/MobileMenu";
import React from "react";
import MFooter from "@/component/homepage/MFooter";

export default function aboutus(){


    return <div style={{width : '100%'}}>
        <MobileMenu/>
        <img src={'/homepage/mobile/about_us.svg'} style={{paddingTop : 130, width : '100%'}} alt=""/>
        <MFooter/>
    </div>
}