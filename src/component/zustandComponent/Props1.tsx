import {useEffect} from "react";
import useStore from '@/utils/api/fileStore'
export default function Props1(){

    const {count, increment, decrement} = useStore();


    useEffect(()=>{
        console.log(count)
    },[count])

    return <div>
        <button onClick={decrement}>감소</button>
        count : {count}
    </div>
}