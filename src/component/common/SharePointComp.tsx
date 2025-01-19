import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import { UploadOutlined } from "@ant-design/icons";
import React, { useState } from "react";

export function DriveUploadComp({ infoFileInit, fileRef }) {
    const [fileList, setFileList] = useState(
        infoFileInit.map((v) => ({
            ...v,
            uid: v.uid || Math.random().toString(36).substr(2, 9), // 고유 UID 생성
            name: v.fileName,
            status: "done",
        }))
    );
    const [editingFileId, setEditingFileId] = useState(null); // 수정 중인 파일 ID
    const [tempFileName, setTempFileName] = useState(""); // 임시 파일 이름 저장


    // 파일 이름 수정 시작
    const handleDoubleClick = (file) => {
        setEditingFileId(file.uid); // 수정 중인 파일 ID 설정
        setTempFileName(file.name); // 기존 이름을 임시 저장
    };

    // 파일 이름 수정 중
    const handleInputChange = (e) => {
        setTempFileName(e.target.value); // 임시 이름 업데이트
    };

    // 파일 이름 수정 완료
    const handleInputBlur = (file) => {
        setFileList((prevList) =>
            prevList.map((item) =>
                item.uid === file.uid ? { ...item, name: tempFileName } : item
            )
        );
        setEditingFileId(null); // 수정 상태 종료
    };

    // 파일 클릭 이벤트 처리 (기존 로직 유지)
    const handleClick = (file, e) => {
        // Ctrl 키와 왼쪽 버튼 클릭 확인
        if (e.ctrlKey && e.button === 0) { // e.button === 0 -> 왼쪽 버튼 클릭
            if (e.target.className === "ant-upload-list-item-name") {
                if (file.webUrl) {
                    window.open(file.webUrl);
                } else {
                    if (file.type.includes("image")) {
                        const src =
                            file.url ||
                            (file.originFileObj && URL.createObjectURL(file.originFileObj));
                        window.open(src);
                    }
                }
            }
        }else{
            if (e.target.className === "ant-upload-list-item-name") {
                setEditingFileId(file.uid); // 수정 중인 파일 ID 설정
                setTempFileName(file.name); // 기존 이름을 임시 저장
            }
        }
    };

    return (
        <Upload
            fileList={fileList} // 상태 기반의 파일 리스트
            onChange={({ fileList }) => setFileList(fileList)} // 파일 리스트 업데이트
            itemRender={(originNode, file) => {
                return (
                    <div
                        style={{ cursor: "pointer" }}
                        onDoubleClick={() => handleDoubleClick(file)} // 더블 클릭 이벤트
                        onClick={(e) => handleClick(file, e)} // 기존 클릭 이벤트
                    >
                        {editingFileId === file.uid ? (
                            <Input
                                style={{paddingLeft : 20}}
                                size={'small'}
                                value={tempFileName}
                                autoFocus
                                onChange={handleInputChange}
                                onBlur={() => handleInputBlur(file)} // 수정 완료
                                onPressEnter={() => handleInputBlur(file)} // Enter 키로 수정 완료
                            />
                        ) : (
                            originNode
                        )}
                    </div>
                );
            }}
            ref={fileRef}
            beforeUpload={() => false}
            maxCount={13}
            multiple
        >
            <Button icon={<UploadOutlined />}>Upload</Button>
        </Upload>
    );
}