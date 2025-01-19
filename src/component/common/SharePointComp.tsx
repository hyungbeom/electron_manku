import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {UploadOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import _ from "lodash";

export function DriveUploadComp({infoFileInit, fileRef, numb=0}) {
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
    const [fileExtension, setFileExtension] = useState(""); // 파일 확장자 저장


    // 파일 이름 수정 중
    const handleInputChange = (e) => {
        setTempFileName(e.target.value); // 임시 이름 업데이트
    };

    // 파일 이름 수정 완료
    const handleInputBlur = (file) => {
        setFileList((prevList) =>
            prevList.map((item) =>
                item.uid === file.uid
                    ? {...item, name: `${tempFileName}${fileExtension}`}
                    : item
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
        } else {
            if (e.target.className === "ant-upload-list-item-name") {
                setEditingFileId(file.uid); // 수정 중인 파일 ID 설정

                // 파일 이름과 확장자를 분리
                const dotIndex = file.name.lastIndexOf(".");
                const namePart = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
                const extensionPart = dotIndex > 0 ? file.name.slice(dotIndex) : "";

                setTempFileName(namePart); // 파일 이름 저장
                setFileExtension(extensionPart); // 확장자 저장
            }
        }
    };

    function fileChange({ file, fileList }) {
        // 중복 파일 확인
        const isDuplicate = fileList.some(v => v?.uid === file?.uid);

        if (!isDuplicate) {
            // 중복이 없으면 리스트 업데이트
            setFileList(fileList);
            return;
        }

        // 중복 파일 처리
        const duplicateFile = fileList.find(v => v?.uid === file?.uid);

        if (duplicateFile) {
            // 파일 이름에서 기존 번호 추출
            const existingNumbers = fileList
                .map(f => {
                    const match = f.name.match(/^0\d+\.(\d+)/);
                    return match ? parseInt(match[1], 10) : null;
                })
                .filter(num => num !== null) // 유효한 숫자만 필터링
                .sort((a, b) => a - b); // 숫자 정렬

            // 첫 번째 빈 번호 찾기
            let newNumber = 1;
            for (let i = 0; i < existingNumbers.length; i++) {
                if (existingNumbers[i] !== i + 1) {
                    newNumber = i + 1;
                    break;
                } else {
                    newNumber = existingNumbers.length + 1;
                }
            }

            // 새로운 파일 생성
            const newFile = {
                ...duplicateFile,
                name: `0${numb}.${newNumber} ${duplicateFile.name}`,
                originFileObj: {
                    ...duplicateFile.originFileObj,
                    name: `0${numb}.${newNumber} ${duplicateFile.name}`,
                },
            };

            // 파일 리스트 업데이트
            setFileList(prevList => [...prevList, newFile]);
        }
    }
    return (
        <Upload
            fileList={fileList} // 상태 기반의 파일 리스트
            onChange={fileChange} // 파일 리스트 업데이트
            // onChange={({ fileList }) => setFileList(fileList)} // 파일 리스트 업데이트
            itemRender={(originNode, file) => {
                return (
                    <div
                        style={{cursor: "pointer"}}
                        onClick={(e) => handleClick(file, e)} // 기존 클릭 이벤트
                    >
                        {editingFileId === file.uid ? (
                            <div style={{display: "flex", alignItems: "center"}}>
                                <Input
                                    style={{paddingLeft: 20, flex: 1}}
                                    size="small"
                                    value={tempFileName}
                                    autoFocus
                                    onChange={handleInputChange}
                                    onBlur={() => handleInputBlur(file)} // 수정 완료
                                    onPressEnter={() => handleInputBlur(file)} // Enter 키로 수정 완료
                                />
                                <span style={{marginLeft: 5}}>{fileExtension}</span>
                            </div>
                        ) : (
                            originNode
                        )}
                    </div>
                );
            }}
            ref={fileRef}
            beforeUpload={() => false}
            maxCount={13}
        >
            <Button icon={<UploadOutlined/>}>Upload</Button>
        </Upload>
    );
}