import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {UploadOutlined} from "@ant-design/icons";
import React, {useEffect, useRef, useState} from "react";

export function DriveUploadComp({
                                    fileList,
                                    setFileList,
                                    fileRef,
                                    infoRef = null,
                                    uploadType = 0
                                }) {
    const fileInputRef = useRef(null);

    const uploadTypeRef = useRef(null);
    const [editingFileId, setEditingFileId] = useState(null); // 수정 중인 파일 ID
    const [tempFileName, setTempFileName] = useState(""); // 임시 파일 이름 저장
    const [fileExtension, setFileExtension] = useState(""); // 파일 확장자 저장


    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0); // 드래그 이벤트 수를 추적

    useEffect(() => {
        const handleDragEnter = (event) => {
            event.preventDefault();
            setDragCounter((prev) => prev + 1);
            setIsDragging(true);
        };

        const handleDragLeave = (event) => {
            event.preventDefault();
            setDragCounter((prev) => {
                if (prev === 1) {
                    setIsDragging(false);
                }
                return prev - 1;
            });
        };

        const handleDragOver = (event) => {
            event.preventDefault();
        };

        const handleDrop = (event) => {
            event.preventDefault();
            setIsDragging(false);
            setDragCounter(0);
        };

        if (uploadType !== 0)

        window.addEventListener("dragenter", handleDragEnter);
        window.addEventListener("dragleave", handleDragLeave);
        window.addEventListener("dragover", handleDragOver);
        window.addEventListener("drop", handleDrop);

        return () => {
            window.removeEventListener("dragenter", handleDragEnter);
            window.removeEventListener("dragleave", handleDragLeave);
            window.removeEventListener("dragover", handleDragOver);
            window.removeEventListener("drop", handleDrop);
        };
    }, []);


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
                } else if (file?.downloadUrl) {
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

    function fileChange({file, fileList}) {

        // 중복 파일 확인

        const updatedFileList = fileList.map(f => {

            //내가 올린 파일
            if (f.uid === file.uid) {
                // 현재 numb 그룹 내의 파일 이름에서 번호 추출
                const existingNumbers = fileList
                    .filter(file => file.name.startsWith(`0${uploadTypeRef.current.value}.`)) // 현재 numb 그룹만 필터링
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

                const dom = infoRef.current.querySelector('#documentNumberFull');
                const dom3 = infoRef.current.querySelector('#agencyName');
                const extension = originalName.split('.').pop().toLowerCase();

                const numberType = parseInt(uploadTypeRef.current.value);

                let result = ''
                switch (numberType) {
                    case 0 :
                        result =  `0${numberType}.${newNumber} ${dom?.value ? dom?.value : originalName}_RFQ.${extension}`
                        break;
                    case 1 :
                        result =  `0${numberType}.${newNumber} ${dom?.value ? dom?.value : originalName}_Received.${extension}`
                        break;
                    case 2 :
                        result =  `0${numberType}.${newNumber} ${dom?.value ? dom?.value : originalName}_Datasheet.${extension}`
                        break;
                    case 3 :
                        result =  `0${numberType}.${newNumber} ${dom?.value ? dom?.value : originalName}_${dom3.value}_Quote.${extension}`
                        break;
                    case 4 :
                        result =  `0${numberType}.${newNumber} ${dom?.value ? dom?.value : originalName}_PO.${extension}`
                        break;
                    default :
                        result =  `0${numberType}.${newNumber} ${dom?.value ? dom?.value : originalName}.${extension}`
                }

                // 이름 수정된 파일 반환 (originFileObj 유지)
                return {
                    ...f,
                    name: result,
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




    const handleDrop = (event) => {
        event.preventDefault();
        setIsDragging(false);
        setDragCounter(0);


        // 파일 읽기
        const droppedFiles = Array.from(event.dataTransfer.files);
        if (droppedFiles.length > 1) {
            alert("파일은 1개씩만 업로드할 수 있어요!");
            return;
        }
        if (droppedFiles.length > 0) {
            const file = droppedFiles.map((file: any) => ({
                ...file,
                uid: file.name + "_" + Date.now(),
                name: file.name,
                originFileObj: file,
                type: file.type,
            }))
            const newFileList = [
                ...fileList,
                ...file,
            ];

            fileChange({file :file[0], fileList :  newFileList})

            if (fileRef.current) {
                fileRef.current.fileList = newFileList;
            }
        }
    };


    return (
        <div style={{
            overflowY: "auto",   // 세로 스크롤 추가
        }}>

            <input
                type="file"
                multiple
                style={{display: 'none'}}

                ref={fileInputRef}

            />

            {isDragging ? <div
                    style={{
                        position: 'absolute',
                        height: '100%',
                        zIndex : 999999,
                        border: isDragging ? `2px solid #1677FF` : '',
                        backgroundColor: isDragging ? `#1890ffb5` : '',
                        top: 0,
                        left: 0,
                        width: '100%'
                    }}
                    onDrop={(e) => {
                        e.preventDefault();
                        handleDrop(e)
                    }}
                >
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        zIndex : 999999,
                        alignItems: "center",
                        height: '100%',
                        color: 'white',
                        fontSize: 18,
                        fontWeight: 600
                    }}>파일을 올려주세요
                    </div>
                </div>
                : <></>}
            <Upload


                fileList={fileList} // 상태 기반의 파일 리스트
                onChange={fileChange} // 파일 리스트 업데이트
                // onChange={({ fileList }) => setFileList(fileList)} // 파일 리스트 업데이트
                itemRender={(originNode, file: any) => {
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
                                        style={{paddingLeft: 20,}}
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

                <div style={{
                    width: '100%',
                    display: 'flex',
                    backgroundColor: 'white',
                    height: 25,
                    position: 'absolute',
                    justifyContent: 'space-between',
                    top: 45,
                    left: 0,
                    zIndex: 10
                }}>
                    <Button style={{fontSize: 11, left: 10}} size={'small'}
                            icon={<UploadOutlined/>} type={'primary'}>Upload</Button>
                    <select ref={uploadTypeRef} onClick={e => {
                        e.preventDefault();
                        e.stopPropagation()
                    }} name="languages" id="uploadType" value={uploadType}
                            style={{
                                outline: 'none',
                                border: '1px solid lightGray',
                                height: 25,
                                fontSize: 12,
                                position: "absolute",
                                right: 15,
                                float: 'right',
                                width: '40%'
                            }}>
                        <option value={0}>{'요청자료'}</option>
                        <option value={1}>{'업체회신자료'}</option>
                        <option value={2}>{'첨부파일'}</option>
                        <option value={3}>{'견적서자료'}</option>
                        <option value={4}>{'발주서자료'}</option>
                        <option value={5}>{'프로젝트자료'}</option>
                        <option value={6}>{'매입자료'}</option>
                        <option value={7}>{'매출자료'}</option>
                        <option value={8}>{'기타'}</option>
                    </select>
                </div>

            </Upload>
        </div>
    );
}