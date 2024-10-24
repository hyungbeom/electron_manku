import React, {useState} from "react";
import {IMAGE_URL} from "@/manage/function/api";
import arrowRight from "@/resources/image/icon/arrowRight_grey.svg"
import arrowLeft from "@/resources/image/icon/arrowLeft_grey.svg"

export default function SubCarousel({clickedIndex, setClickedIndex, imageList}){



    const [currentIndex, setCurrentIndex] = useState(0);

    const images = [
        "https://image.season-market.co.kr/SeasonMarket//1024/20241018/440599343ace4473912feb4b4c6bf2ab.png",
        "https://image.season-market.co.kr/SeasonMarket//1024/20241018/440599343ace4473912feb4b4c6bf2ab.png",
        "https://image.season-market.co.kr/SeasonMarket//1024/20241018/440599343ace4473912feb4b4c6bf2ab.png",
        "https://image.season-market.co.kr/SeasonMarket//1024/20241018/440599343ace4473912feb4b4c6bf2ab.png",
        "https://image.season-market.co.kr/SeasonMarket//1024/20241018/440599343ace4473912feb4b4c6bf2ab.png",
    ];

    const imagesToShow = 3; // 보여줄 이미지 개수
    const totalImages = imageList.length; // 전체 이미지 개수
    const imageGap = 20; // 이미지 간격

    const moveSlide = (direction) => {
        // 첫 번째 슬라이드일 때 비활성화

        const newIndex = currentIndex + direction;

        // 인덱스 범위 체크
        if (newIndex >= 0 && newIndex <= totalImages - imagesToShow) {
            setCurrentIndex(newIndex);
        }
    };

    const handleImageClick = (index) => {
        setClickedIndex(index); // 클릭한 이미지의 인덱스를 저장
    };

    return    <div
        style={{
            position: "relative",
            width: "100%", // 슬라이더의 너비
            maxWidth: "900px", // 슬라이더 최대 너비 설정
            overflow: "hidden", // 넘치는 부분 숨기기
            margin: "0 auto", // 중앙 정렬
        }}
    >
        <div
            style={{
                display: "flex",
                transition: "transform 0.5s ease-in-out",
                transform: `translateX(-${(currentIndex * (100 / imagesToShow + (imageGap / (imagesToShow - 1))))}%)`, // 슬라이드 이동 조정
            }}
        >
            {imageList.map((image, index) => (
                <div
                    key={index}
                    style={{
                        width: `calc(${100 / imagesToShow}% - ${(imageGap / imagesToShow)}px)`, // 각 이미지의 너비 설정
                        marginRight: index < totalImages - 1 ? `${imageGap}px` : "0", // 마지막 이미지에는 오른쪽 마진 제거
                        flexShrink: 0, // 크기 축소 방지
                        filter: clickedIndex !== null && clickedIndex !== index ? 'brightness(0.5)' : 'none', // 클릭한 이미지 이외는 어둡게 처리
                    }}
                >
                    <img
                        src={IMAGE_URL + '/1024' + image.productImage}
                        alt={`슬라이드 ${index + 1}`}
                        style={{
                            width: "100%",
                            height: "auto",
                            objectFit: "cover", // 이미지 비율 유지
                            cursor: 'pointer', // 클릭 가능하도록 설정
                        }}
                        onClick={() => handleImageClick(index)} // 이미지 클릭 시 인덱스 저장
                    />
                </div>
            ))}
        </div>

        {/* 왼쪽으로 슬라이드하는 버튼 */}
        <img onClick={() => moveSlide(-1)}
             style={{
                 fontSize: 24,
                 position: "absolute",
                 top: "50%",
                 left: "10px",
                 transform: "translateY(-50%)",
                 backgroundColor: currentIndex === 0 ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.5)",
                 color: "white",
                 border: "none",
                 padding: "10px",
                 cursor: currentIndex === 0 ? "default" : "pointer", // 비활성화 시 커서 기본으로 변경
                 opacity: currentIndex === 0 ? 0.5 : 1, // 비활성화 시 투명도 조정
             }} src={arrowLeft.src} alt='right'/>

        {/* 오른쪽으로 슬라이드하는 버튼 */}
        <img onClick={() => moveSlide(1)}
            style={{
                fontSize: 24,
                position: "absolute",
                top: "50%",
                right: "10px",
                transform: "translateY(-50%)",
                backgroundColor: currentIndex >= totalImages - imagesToShow ? "rgba(0, 0, 0, 0.2)" : "rgba(0, 0, 0, 0.5)",
                color: "white",
                border: "none",
                padding: "10px",
                cursor: currentIndex >= totalImages - imagesToShow ? "default" : "pointer", // 비활성화 시 커서 기본으로 변경
                opacity: currentIndex >= totalImages - imagesToShow ? 0.5 : 1, // 비활성화 시 투명도 조정
            }} src={arrowRight.src} alt='right'/>
    </div>
}