import {DriveUploadComp} from "@/component/common/SharePointComp";
import React, {useMemo, useRef, useState} from "react";
import {gridManage} from "@/utils/commonManage";

export default function MailFile({list}){

    const [files] = useMemo(() => {
        const result = list.map(v=>{
            return {...v, name : v.fileName}
        })
        return [result]
    }, [list]);



    const  fileRef = useRef();
    const [fileList, setFileList] = useState(files)

    return   <></>
}