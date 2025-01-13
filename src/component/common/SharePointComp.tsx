import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import {UploadOutlined} from "@ant-design/icons";
import React from "react";

export function DriveUploadComp({infoFileInit, fileRef}){

    function handleClick(file, e) {
        if (e.target.className === 'ant-upload-list-item-name') {
            if (file.webUrl) {
                window.open(file.webUrl)
            } else {
                if (file.type.includes('image')) {
                    const src = file.url || (file.originFileObj && URL.createObjectURL(file.originFileObj));
                    window.open(src)
                }
            }
        }
    }


    return  <Upload
        defaultFileList={
            infoFileInit.map((v, idx) => {
                return {
                    ...v,
                    name: v.fileName,
                    status: 'done',
                }
            })
        }
        itemRender={(originNode, file) => {
            // 커스텀 렌더링 - 더블클릭 이벤트 추가
            return (
                <div style={{cursor: 'pointer'}}
                     onClick={(e) => handleClick(file, e)}>
                    {originNode}
                </div>
            );
        }}
        ref={fileRef}
        beforeUpload={() => false}
        style={{overFlowY: "auto"}}
        maxCount={13}
        multiple>
        <Button icon={<UploadOutlined/>}>Upload</Button>
    </Upload>
}