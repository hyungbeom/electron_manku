import {useEffect, useState} from "react";

export default function Seo(props){


    let bowl = 0;

    const [Numb, setNumb] = useState(0);


    // 1.hook

    // useEffect
    // useState


    useEffect(()=>{

    },[Numb])



    function test(){
        setNumb(v=> v + 1)
    }


    return <div onClick={test}>{Numb}</div>
}


export async function getServerSideProps() {


    let bowl = 10
    return {
        props: {bbb : bowl, list : ['']},
    };
}

