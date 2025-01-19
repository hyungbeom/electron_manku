import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {UploadOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import _ from "lodash";
import Tooltip from "antd/lib/tooltip";

export function ExcelUpload() {

    return (
        <Tooltip placement={'leftTop'} title="SHARE_POINT에 업로드합니다." color={'cyan'} key={'cyan'}>
            <Upload>
                <Button icon={<UploadOutlined/>}>Upload</Button>
            </Upload>
        </Tooltip>
    );
}