import Upload from "antd/lib/upload";
import Button from "antd/lib/button";
import Input from "antd/lib/input";
import {UploadOutlined} from "@ant-design/icons";
import React, {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import message from "antd/lib/message";
import {getData, getFormData} from "@/manage/function/api";
import Spin from "antd/lib/spin";

// export function DriveUploadComp({
//                                     fileList,
//                                     setFileList,
//                                     fileRef,
//                                     info = {} as any,
//                                     type = '',
//                                 }) {

export const DriveUploadComp = forwardRef(function DriveUploadComp({
                                                                       fileList,
                                                                       setFileList,
                                                                       fileRef,
                                                                       info = {} as any,
                                                                       type = '',
                                                                   }: any, ref) {

    useImperativeHandle(ref, () => ({
        fileChange: (file) => test(file),
        getUploadType: () => uploadTypeRef.current?.value,
    }));

    function test(file) {
        console.log(file, 'file:::')
        fileChange({file: file, fileList: fileList, isEstimate: true});
    }

    const fileInputRef = useRef(null);

    const uploadTypeRef = useRef(null);
    const [editingFileId, setEditingFileId] = useState(null); // 수정 중인 파일 ID
    const [tempFileName, setTempFileName] = useState(""); // 임시 파일 이름 저장
    const [fileExtension, setFileExtension] = useState(""); // 파일 확장자 저장


    const [isDragging, setIsDragging] = useState(false);
    const [dragCounter, setDragCounter] = useState(0); // 드래그 이벤트 수를 추적

    const [isLoad, setIsLoad] = useState(false);
    const [loading, setLoading] = useState(false);

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
    // const handleClick = (file, e) => {
    //     // Ctrl 키와 왼쪽 버튼 클릭 확인
    //     if (e.ctrlKey && e.button === 0 || e.metaKey && e.button === 0) { // e.button === 0 -> 왼쪽 버튼 클릭
    //         if (e.target.className === "ant-upload-list-item-name") {
    //             console.log(file)
    //             if (file?.webUrl) {
    //                 window.open(file.webUrl, '_blank');
    //             } else {
    //                 if (file?.originFileObj?.type.includes("image")) {
    //                     const src =
    //                         file.url ||
    //                         (file.originFileObj && URL.createObjectURL(file.originFileObj));
    //                     window.open(src);
    //                 }
    //             }
    //         }
    //     } else {
    //         if (e.target.className === "ant-upload-list-item-name") {
    //             if (file?.originFileObj) {
    //                 setEditingFileId(file.uid); // 수정 중인 파일 ID 설정
    //
    //                 // 파일 이름과 확장자를 분리
    //                 const dotIndex = file.name.lastIndexOf(".");
    //                 const namePart = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
    //                 const extensionPart = dotIndex > 0 ? file.name.slice(dotIndex) : "";
    //
    //                 setTempFileName(namePart); // 파일 이름 저장
    //                 setFileExtension(extensionPart); // 확장자 저장
    //             } else if (file?.downloadUrl) {
    //
    //                 const fileUrl = file?.downloadUrl;
    //                 const link = document.createElement('a');
    //                 link.href = fileUrl;
    //                 link.download = 'filename.pdf';
    //                 document.body.appendChild(link);
    //                 link.click();
    //                 document.body.removeChild(link);

    //             }
    //         }
    //     }
    // };

    const handleClick = async (file, e) => {

        if (e.target.className !== "ant-upload-list-item-name") return;

        // Ctrl 키와 왼쪽 버튼 클릭 (새창 미리 보기)
        if (e.ctrlKey && e.button === 0 || e.metaKey && e.button === 0) { // e.button === 0 -> 왼쪽 버튼 클릭
            console.log(file)
            if (file?.webUrl) {
                window.open(file?.webUrl, '_blank');
            } else {
                // if (file?.originFileObj?.type.includes("image")) {
                //     const src = file.url || (file.originFileObj && URL.createObjectURL(file.originFileObj));
                //     window.open(src);
                // }

                if (!file?.originFileObj) return;
                const mime = file?.originFileObj?.type?.toLowerCase();
                if (!mime) return;
                if (
                    mime.startsWith('image/') ||
                    mime === 'application/pdf' ||
                    mime === 'text/plain' ||
                    mime === 'text/csv' ||
                    mime === 'application/json' ||
                    mime === 'text/html' ||
                    mime.startsWith('audio/') ||
                    mime.startsWith('video/') && !mime.includes('spreadsheetml')
                ) {
                    const url = URL.createObjectURL(file.originFileObj);
                    window.open(url);
                    URL.revokeObjectURL(url);
                }
            }
        // Shift 키와 왼쪽 버튼 (이름 변경)
        } else if (e.shiftKey && e.button === 0) {
            // 쉐어포인트에 업로드 되지 않은 파일 이름 변경 (등록 페이지)
            if (file?.originFileObj && !file?.driveId) {
                setEditingFileId(file.uid); // 수정 중인 파일 ID 설정

                // 파일 이름과 확장자를 분리
                const dotIndex = file.name.lastIndexOf(".");
                const namePart = dotIndex > 0 ? file.name.slice(0, dotIndex) : file.name;
                const extensionPart = dotIndex > 0 ? file.name.slice(dotIndex) : "";

                setTempFileName(namePart); // 파일 이름 저장
                setFileExtension(extensionPart); // 확장자 저장
            }
        // 왼쪽 버튼만 (파일 다운로드)
        } else {
            let blob = null;
            let fileName = '';
            if (file?.downloadUrl) {
                fileName = file?.fileName;
                const lastDotIndex = fileName.lastIndexOf('.');
                const extension = lastDotIndex !== -1 ? fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase() : '';
                if (file?.fileName?.includes('QUOTE')) {
                    fileName = `${info?.documentNumberFull}_${info?.customerName}_견적서.${extension}`;
                } else if (file?.fileName?.includes('ORDER')) {
                    fileName = `PO_${info?.documentNumberFull}.${extension}`;
                }
                const fileUrl = file?.downloadUrl ?? '';
                const res = await fetch(fileUrl);
                blob = await res.blob();
            } else {
                if (file?.originFileObj) {
                    fileName = file?.name;
                    blob = file?.originFileObj ?? null;
                }
            }
            if (blob instanceof Blob) {
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = fileName;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(blobUrl); // 메모리 해제
            }
        }
    };

    /**
     * 업로드 파일 넘버링 붙은 파일명 생성
     * @param targetFileName
     * @param targetFileList
     */
    function generateFileName(targetFileName, targetFileList, isEstimate = false) {
        const uploadType = isEstimate ? '3' : uploadTypeRef?.current?.value ?? '0';

        // fileList에서 현재 선택된 uploadType의 이름을 가지고 있는 것만 필터
        // 예) uploadType이 3(견적서 자료) 이면 아래 목록 이름만 필터링 됨
        // 03 sample.ext
        // 03.1 sample.ext
        // 03.2 sample.ext
        const filterFiles = targetFileList.filter(file =>
            file.name.match(new RegExp(`^0${uploadType}(\\.\\d+)?\\s`))
        );

        // 03.1, 03.2 처럼 숫자가 붙은 파일 중에서 숫자만 추출 ( [1,2] )
        const existingNumbers = filterFiles
            .map(file => {
                const match = file.name.match(/^0\d+\.(\d+)\s/); // 03.1, 03.2 처럼 .붙은 숫자만 추출
                return match ? parseInt(match[1], 10) : null;         // 추출된 숫자 03.1 이면 1 리턴 (없으면 null 리턴)
            })
            .filter(num => num !== null)                         // null 제외
            .sort((a, b) => a - b);               // 숫자 오름차순 정렬

        // 03 sample.ext 처럼 03공백 파일이 있는지 체크 (기본 파일 체크)
        const hasBaseFile = filterFiles.some(file => {
            return file.name.match(new RegExp(`^0${uploadType}\\s`)) &&   // 03공백 이름만 true
                !file.name.match(/^0\d+\.\d+\s/);                                          // 03.1, 03.2 처럼 서브 이름은 제외
        });

        let newNumber = 1;                                   // 기본 넘버링 1부터

        // 서브 숫자 추출한 배열을 돌면서 새로운 번호 생성 (중간에 비어있으면 중간 채워짐)
        // for (let i = 0; i < existingNumbers.length; i++) {   // [1,2] 배열을 순회하면서 번호 찾기
        //     if (existingNumbers[i] !== i + 1) {                       // 배열번호와 현재 넘버링 번호가 다른지
        //         newNumber = i + 1;                                    // 다르면 중간 번호 채우고 종료
        //         break;
        //     } else {
        //         newNumber = existingNumbers.length + 1;               // 배열번호와 넘버링 배열이 같으면 그 다음 번호 생성
        //     }
        // }

        // 서브 숫자 중 제일 큰 번호 생성 (중간 안채우고 제일 큰 번호)
        if (existingNumbers.length > 0) {                             // .1, .2 처럼 서브 번호가 있으면
            newNumber = Math.max(...existingNumbers) + 1;             // 서브 번호중에 제일 큰수 다음 번호로
        }

        // 파일 이름 정규식으로 체크
        // 03 sample.ext
        // 03.1 sample.ext
        // 이런 파일은 뒤에 이름만 추출, 없으면 전체 이름 사용
        const match = targetFileName.match(/^0\d+(?:\.\d+)?\s(.+)$/);
        const originalName = match ? match[1] : targetFileName;

        // 확장자 추출
        // const extension = originalName.split('.').pop().toLowerCase();
        const lastDotIndex = originalName.lastIndexOf('.');
        const extension = lastDotIndex !== -1 ? originalName.slice(originalName.lastIndexOf('.') + 1).toLowerCase() : '';

        // 실제 파일 이름 추출
        // const baseFileName = originalName.slice(0, originalName.lastIndexOf('.'));
        const baseFileName = lastDotIndex !== -1 ? originalName.slice(0, lastDotIndex) : originalName;

        // 넘버링 생성
        let prefix = `0${uploadType}`;   // 선택된 업로드 타입
        // if (hasBaseFile) prefix += `.${newNumber}`;              // 기본 파일 03 sample.ext 같은게 있으면 서브 숫자 붙임
        if (hasBaseFile || existingNumbers.length > 0) {         // 기본 파일 03 sample.ext 같은게 있거나 서브 숫자배열이 있으면 다음 서브 숫자 붙임
            prefix += `.${newNumber}`;
        }
        prefix += ' ';                                           // 넘버링 이후 공백 붙임

        // 현재 선택된 업로드 타입, 넘버링, 정보들을 가지고 파일명 생성
        const numberType = parseInt(uploadType);
        let result = '';
        switch (numberType) {
            case 0:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_RFQ.${extension}`;
                break;
            case 1:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_OFFER.${extension}`;
                break;
            case 2:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_REF.${extension}`;
                break;
            case 3:
                result = `${prefix}${info?.documentNumberFull || baseFileName}${info?.customerName ? '_' + info?.customerName : ''}_QUOTE.${extension}`;
                break;
            case 4:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_ORDER.${extension}`;
                break;
            case 5:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_매입_.${extension}`;
                break;
            case 6:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_매출_.${extension}`;
                break;
            case 7:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_PROJECT.${extension}`;
                break;
            case 8:
                result = `${prefix}${info?.documentNumberFull || baseFileName}_ETC.${extension}`;
                break;
            default:
                result = `${prefix}${info?.documentNumberFull || baseFileName}.${extension}`;
        }
        return result;
    }

    /**
     * 파일 업로드 영역 > 휴지통 버튼
     * Upload 컴포넌트 onRemove 이벤트
     * @param file
     */
    async function fileRemove(file): Promise<boolean> {
        // 수정페이지이고 folderId 가 있으면 쉐어포인트 직접삭제
        if (type && info?.folderId) {
            setLoading(true);
            try {
                const res = await getData.post('common/fileDelete', file);
                if (res?.data?.code === 1) {
                    setFileList(prev => prev.filter(f => f.uid !== file.uid));
                    return true;
                } else {
                    message.error('SharePoint 파일 삭제 중 오류가 발생했습니다.');
                    return false;
                }
            } catch (err) {
                console.error('오류 : ', err);
                return false;
            } finally {
                setLoading(false);
            }
        } else {
            setFileList(prev => prev.filter(f => f.uid !== file.uid));
        }
    }

    /**
     * 파일 업로드 영역 > 파일 변경 이벤트
     * Upload 컴포넌트 beforeUpload 이벤트
     * (다른 함수에서도 사용중이라 Dom에서 fileChange 호출)
     * @param file
     * @param fileList
     */
    async function fileChange({file, fileList, isEstimate = false}) {
        // 쉐어포인트에 문제가 생기는 특수문자 제외
        const forbiddenChars = /[\\/:*?"<>|#]/;
        if (forbiddenChars.test(file.name)) {
            message.error("파일 이름에 사용할 수 없는 문자가 포함되어 있습니다. ( \\ / : * ? \" < > | # )");
            return;
        }

        const existFileIndex = fileList.findIndex(f => f.uid === file.uid);
        if (existFileIndex !== -1) return;

        setLoading(true);
        const fileName = generateFileName(file?.name, fileList, isEstimate);
        let uploadedInfo = {
            ...file,
            name: fileName,
            originFileObj: file?.originFileObj || file
        };
        if (type && info?.folderId) {
            const formData = new FormData();
            formData.append('folderId', info?.folderId);
            formData.append('file', file?.originFileObj || file);
            formData.append('fileName', fileName);

            try {
                const uploadRes = await getFormData.post('common/fileAdd', formData);
                if (uploadRes?.data?.code === 1) {
                    console.log(uploadRes, '드라이브 직접 업로드 (수정페이지만) ::::')
                    uploadedInfo = {
                        ...uploadedInfo,
                        ...uploadRes?.data?.entity
                    };
                } else {
                    message.error('SharePoint 파일 삭제 중 오류가 발생했습니다.');
                }
            } catch (err) {
                console.error('오류 : ', err);
            }
        }
        const updateFileList = [...fileList, uploadedInfo];
        const sortedFileList = sortFileList(updateFileList);
        setFileList(sortedFileList);
        console.log(fileList, 'fileList:::')

        if (fileRef.current) {
            fileRef.current.fileList = sortedFileList;
        }
        setLoading(false);
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

            // const newFileList = [
            //     ...fileList,
            //     ...file,
            // ];
            // fileChange({file :file[0], fileList :  newFileList})

            fileChange({file: file[0], fileList: fileList})

            // if (fileRef.current) {
            //     fileRef.current.fileList = newFileList;
            // }
        }
    };


    /**
     * @description 파일 업로드 컴포넌트 > 파일 이름 추출
     * @param name
     */
    const extractNumbers = (name: string) => {
        const match = name.match(/^(\d{2})(?:\.(\d+))?/); // 예: 01.2 → ['01.2', '01', '2']
        const main = match ? parseInt(match[1], 10) : -1;
        const sub = match && match[2] ? parseInt(match[2], 10) : -1;
        return {main, sub};
    };

    /**
     * @description 파일 업로드 컴포넌트 > 넘버링 내림차순
     * @param list
     */
    function sortFileList(list) {
        let targetList = list;

        switch (type) {
            case 'rfq':
            case 'estimate':
            case 'order':
            case 'remittance':
                targetList = targetList.filter(item => !item.fileName?.includes('PROJECT'));
                break;
            case 'project':
                targetList = targetList.filter(item => item.fileName?.includes('PROJECT'));
                break;
            default:
                break;
        }
        ;

        const sortedList = [...targetList]
            .sort((a, b) => {
                const aNum = extractNumbers(a.name);
                const bNum = extractNumbers(b.name);

                // 메인 넘버 기준 내림차순, 같으면 서브 넘버 기준 내림차순
                if (bNum.main !== aNum.main) return bNum.main - aNum.main;
                return bNum.sub - aNum.sub;
            });

        return sortedList;
    }

    /**
     * @description 파일 업로드 컴포넌트 > 03 이후는 최신것만 보이기
     * @param list
     */
    function filterLatestFileList(list) {
        const seen = new Set();
        const filteredList = list.filter(item => {
            const {main, sub} = extractNumbers(item.name);

            if (main <= 2) return true; // 00, 01, 02는 다 포함

            // 이미 본 main이면 skip
            if (seen.has(main)) return false;

            seen.add(main); // 최초만 허용 (정렬되어 있기 때문에 제일 큰 sub임)
            return true;
        });
        return filteredList;
    }

    useEffect(() => {
        if (!isLoad && fileList?.length) {
            const sortedList = sortFileList(fileList);
            setFileList(filterLatestFileList(sortedList));
            console.log(fileList, 'fileList:::')
            setIsLoad(true);
        }
    }, [fileList]);

    return (
        <Spin spinning={loading}>
            <div style={{
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                paddingTop: '5px',
                height: '278px'
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
                            zIndex: 999999,
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
                            zIndex: 999999,
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
                    beforeUpload={async (file) => {
                        await fileChange({file, fileList});
                        // return Upload.LIST_IGNORE;
                    }}
                    onRemove={async (file) => {
                        return await fileRemove(file);
                    }}
                    // onChange={fileChange} // 파일 리스트 업데이트
                    itemRender={(originNode, file: any) => {
                        // const linkType = file?.webUrl || file?.originFileObj?.type.startsWith("image");
                        // 동적 스타일 적용
                        const style = {
                            color: file?.originFileObj ? "black" : "blue",
                            cursor: "pointer"
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
                    // maxCount={13}
                >

                    <div style={{
                        width: '100%',
                        display: 'flex',
                        backgroundColor: 'white',
                        height: 25,
                        position: 'absolute',
                        justifyContent: 'space-between',
                        top: 0,
                        left: 0,
                        zIndex: 10
                    }} key={info?.uploadType}>
                        <Button style={{fontSize: 11, left: 10}} size={'small'}
                                icon={<UploadOutlined/>} type={'primary'}>Upload</Button>
                        <select ref={uploadTypeRef} onClick={e => {
                            e.preventDefault();
                            e.stopPropagation()
                        }} name="languages" id="uploadType" defaultValue={info?.uploadType}
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
                            <option value={5}>{'매입자료'}</option>
                            <option value={6}>{'매출자료'}</option>
                            <option value={7}>{'프로젝트자료'}</option>
                            <option value={8}>{'기타'}</option>
                        </select>
                    </div>

                </Upload>
            </div>
        </Spin>
    );
});