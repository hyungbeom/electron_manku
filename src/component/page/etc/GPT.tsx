import React, {memo, useEffect, useState} from "react";
import Button from "antd/lib/button";
import _ from "lodash";
import Drawer from "antd/lib/drawer";
import {getData} from "@/manage/function/api";
import {Timeline} from "antd";
import {useAppDispatch, useAppSelector} from "@/utils/common/function/reduxHooks";
import {setHistoryList} from "@/store/history/historySlice";
import moment from "moment";
import TextArea from "antd/lib/input/TextArea";
import {getCookie} from "@/manage/function/cookie";


function streamOllama(prompt, onChunk) {
    fetch("http://localhost:3002/api/chat", {
        method: "POST",
        headers: {
            authorization: `Bearer ${getCookie(null, 'token')}`,
            "Content-Type": "application/json"
        },


        body: JSON.stringify({prompt})
    }).then(response => {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        function read() {
            reader.read().then(({done, value}) => {
                if (done) return;

                buffer += decoder.decode(value, {stream: true});
                let lines = buffer.split("\n");
                buffer = lines.pop(); // incomplete line 보존

                for (let line of lines) {
                    if (line.startsWith("data:")) {
                        const content = line.replace(/^data:\s*/, "");
                        if (content !== "") {
                            onChunk(content); // → UI에 추가
                        }
                    }
                }

                read(); // 재귀 호출
            });
        }

        read();
    });
}


function GPT({open, setOpen}) {

    useEffect(() => {

    }, []);

    const [message, setMessage] = useState('')
    const [output, setOutput] = useState("");

    function sendQuest() {
        setMessage('')
        setOutput(""); // 초기화
        streamOllama(message, (rawChunk) => {

            const chunk = rawChunk.trim(); // "data: Hello" → "Hello"
            if (!chunk) return;
            setOutput(prev => {
                const needsSpace =
                    prev.length > 0 &&
                    !prev.endsWith(" ") &&
                    !chunk.startsWith(" ") &&
                    ![".", ",", "!", "?", ":", ";", "'s", "'re"].some(p => chunk.startsWith(p));

                return prev + (needsSpace ? " " : "") + chunk;
            });
        });
    }

    return <Drawer title={'학습요청'} open={open} onClose={() => setOpen(false)} width={400}>
        <>

            <TextArea autoSize={{minRows: 6, maxRows: 10}} value={message}  onKeyDown={e => {
                if (e.key === 'Enter') {
                    if (e.shiftKey) {
                        // 줄바꿈: 기본 동작 허용 (do nothing)
                        return;
                    } else {
                        e.preventDefault(); // 기본 줄바꿈 막기
                        sendQuest();        // 전송 함수 호출
                        setMessage('')
                    }
                }
            }} onChange={e => {
                setMessage(e.target.value)
            }}></TextArea>

            <Button size={'small'} style={{fontSize: 11, float: 'right', marginTop: 10}} type={'primary'}
                    onClick={sendQuest}>질문</Button>

        </>
        <div style={{width: '100%', paddingTop: 50}}>{output}</div>
    </Drawer>
}


export default memo(GPT, (prevProps, nextProps) => {
    return _.isEqual(prevProps, nextProps);
});