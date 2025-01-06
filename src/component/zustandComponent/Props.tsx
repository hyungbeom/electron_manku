import useStore from "@/utils/api/fileStore";
import {useEffect} from "react";

export default function Props(){

    const {count, increment, decrement} = useStore();


    useEffect(()=>{

    },[count])


    return <div>
        <button onClick={increment}>증가</button>
        props
    </div>
}