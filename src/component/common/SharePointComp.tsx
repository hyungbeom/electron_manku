import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {UploadOutlined} from "@ant-design/icons";
import React, {useState} from "react";
import _ from "lodash";
import Tooltip from "antd/lib/tooltip";

export function DriveUploadComp({fileList, setFileList, fileRef, numb=0, uploadType =true}) {

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

        console.log(e.button,'??')
        // Ctrl 키와 왼쪽 버튼 클릭 확인
        if (e.ctrlKey && e.button === 0 || e.metaKey && e.button === 0) { // e.button === 0 -> 왼쪽 버튼 클릭


            if (e.target.className === "ant-upload-list-item-name") {
                if (file.webUrl) {
                    window.open(file.webUrl, '_blank');

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
                if (file?.originFileObj) {
                    setEditingFileId(file.uid); // 수정 중인 파일 ID 설정

                    // 파일 이름과 확장자를 분리
                    const dotIndex = file.name.lastIndexOf(".");
                    const namePart = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
                    const extensionPart = dotIndex > 0 ? file.name.slice(dotIndex) : "";

                    setTempFileName(namePart); // 파일 이름 저장
                    setFileExtension(extensionPart); // 확장자 저장
                }else if(file?.downloadUrl){
                    const fileUrl = file?.downloadUrl;
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = 'filename.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            }
        }
    };

    function fileChange({ file, fileList }) {
        // 중복 파일 확인
        const isDuplicate = fileList.some(v => v?.uid === file?.uid);

        if (!isDuplicate) {
            // 중복이 없으면 리스트 업데이트
            setFileList(fileList);
            if (fileRef.current) {
                fileRef.current.fileList = fileList; // ref 상태 동기화
            }
            return;
        }

        // 중복 파일 처리
        const updatedFileList = fileList.map(f => {
            if (f.uid === file.uid) {
                // 현재 numb 그룹 내의 파일 이름에서 번호 추출
                const existingNumbers = fileList
                    .filter(file => file.name.startsWith(`0${numb}.`)) // 현재 numb 그룹만 필터링
                    .map(file => {
                        const match = file.name.match(/^0\d+\.(\d+)/); // 번호 추출
                        return match ? parseInt(match[1], 10) : null;
                    })
                    .filter(num => num !== null) // 유효한 번호만 필터링
                    .sort((a, b) => a - b); // 번호 정렬

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

                // 기존 이름의 나머지 부분 추출
                const match = f.name.match(/^0\d+\.\d+\s(.+)$/); // 규칙 이후의 이름 추출
                const originalName = match ? match[1] : f.name; // 기존 이름 유지

                // 이름 수정된 파일 반환 (originFileObj 유지)
                return {
                    ...f,
                    name: `0${numb}.${newNumber} ${originalName}`,
                    originFileObj: f.originFileObj, // 기존 originFileObj 유지
                };
            }
            return f; // 다른 파일은 그대로 유지
        });

        // 파일 리스트 업데이트
        setFileList(updatedFileList);

        // ref 상태 동기화
        if (fileRef.current) {
            fileRef.current.fileList = updatedFileList;
        }
    }
    return (

        <Upload

            fileList={fileList} // 상태 기반의 파일 리스트
            onChange={fileChange} // 파일 리스트 업데이트
            // onChange={({ fileList }) => setFileList(fileList)} // 파일 리스트 업데이트
            itemRender={(originNode, file:any) => {
                const linkType = file?.webUrl || file.type.startsWith("image");


                // 동적 스타일 적용
                const style = {
                    color: linkType ? "blue" : "black",
                    cursor: linkType ? "pointer" : "default",
                };


                return (
                    <div
                        style={style}
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

            {uploadType ? <Button style={{fontSize: 11}} size={'small'} icon={<UploadOutlined/>} type={'primary'}>Upload</Button> : <></>}

        </Upload>

    );
}