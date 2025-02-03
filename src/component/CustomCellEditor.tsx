import React, {forwardRef, useImperativeHandle, useState} from "react";

const CustomCellEditor = forwardRef((props: any, ref) => {
    const [value, setValue] = useState(props.value || ""); // 초기값 설정

    // getValue 메서드 정의
    React.useImperativeHandle(ref, () => ({
        getValue: () => {
            console.log("getValue 호출됨:", value); // 반환값 로그 출력
            return value;
        },
    }));

    const handleIconClick = () => {
        alert(`아이콘 클릭! 현재 값: ${value}`);
    };

    return (
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)} // 입력 값 업데이트
                style={{
                    width: "100%",
                    height: "100%",
                    paddingRight: "25px",
                    boxSizing: "border-box",
                }}
            />
            <span
                style={{
                    position: "absolute",
                    right: "5px",
                    cursor: "pointer",
                    color: "gray",
                }}
                onClick={handleIconClick} // 아이콘 클릭 이벤트
            >
        🔍
      </span>
        </div>
    );
});

export default CustomCellEditor;