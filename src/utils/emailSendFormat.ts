import axios from "axios";

export default function emailSendFormat(userInfo, data) {


    console.log(userInfo, 'userInfo');
    console.log(data, 'emailSendFormat');

    const modelCard = Object.values(data)
        .map((card, i) => {
            let totalQuantity = 0;
            const rowData = card
                //@ts-ignore
                .map((row, idx) => {
                    totalQuantity += row.quantity;

                    return `
                        ${!idx ? `
                            <div style="width: 100%; height:60px; font-size:22px; border-top: 1px solid #121212; border-bottom: 1px solid #A3A3A3; background-color: #EBF6F7;">
                                ${row.documentNumberFull}
                            </div>
                            <div style="width: 100%; height:60px; border-bottom: 1px solid #A3A3A3; display: flex;">
                                <div style="font-size:22px; background-color: #EBF6F7; width: 102px; height:100%; border-right: 1px solid #121212;">
                                    maker
                                </div>
                                <div style="line-height: 2; padding-left: 32px;">
                                    ${row.maker}
                                </div>
                            </div>
                            <div style="width: 100%; height:60px; display: flex;">
                                <div style="font-size:22px; background-color: #EBF6F7; width: 102px; height:100%; border-right: 1px solid #121212;">
                                    item
                                </div>
                                <div style="line-height: 2; padding-left: 32px;">
                                    ${row.item}
                                </div>
                            </div>
                        

                        <div style="line-height: 1.9; width: 100%; height:60px; font-size:30px; border-top: 1px solid #121212; border-bottom: 1px solid #A3A3A3; background-color: #EBF6F7; font-weight: 540;">
                            MODEL
                        </div>` : ""}

                        <div style="width: 100%; height:60px; border-bottom: 1px solid #A3A3A3; display: flex;">
                            <div style="font-size:22px; letter-spacing:-1; line-height: 2.5; width: 460px; height:100%; border-right: 1px solid #121212;">
                                ${row.model}
                            </div>
                            <div style="line-height: 2; padding-left: 30px;">
                                <span style="font-weight: 550">${row.quantity}</span> ${row.unit}
                            </div>
                        </div>

                        ${
                        //@ts-ignore
                        idx === card.length - 1 ? `
                            <div style="background-color: #EBF6F7; width: 100%; height:60px; display: flex; border-bottom: 1px solid #121212;">
                                <div style="font-size:22px; width: 460px; height:100%; border-right: 1px solid #121212;">
                                    total
                                </div>
                                <div style="line-height: 2; padding-left: 30px;">
                                    <span style="font-weight: 550">${totalQuantity}</span> ${row.unit}
                                </div>
                            </div>
                            <div style="background-color: #B9DCDF; width: 100%; height: 1px; margin: 25px 0;"></div>
                        ` : ""}

                    `;
                })
                .join("");

            return `
                <div style="width: 100%; height: auto;">
                    ${rowData}
                </div>
            `;
        })
        .join("");

    const emailTemplate = `
        <div style="text-align:center; font-size:28px; width: 800px; padding: 40px 102px; height: auto; box-sizing: border-box">
            <img src='/manku_ci_black_text.png' width={116} alt='manku logo'></img>
            <div style="text-align: left; font-size:30px; white-space: pre-line">
                <span style="font-weight: 550">[${
        //@ts-ignore
        Object.values(data)[0][0]?.managerName}]</span> 님<br/>
                안녕하십니까. <span style="font-weight: 550">만쿠무역 [${userInfo.name}]</span> 입니다.
                아래 견적 부탁드립니다.
            </div>
            <div style="line-height: 2.6; display: flex; flex-direction:column; flex-flow:column; margin-top: 60px">
                ${modelCard}
            </div>
        </div>
    `;

    // const newWindow = window.open("", "_blank");
    // if (newWindow) {
    //     newWindow.document.open();
    //     newWindow.document.write(`
    //         <html>
    //             <head>
    //                 <title>견적 이메일 미리보기</title>
    //                 <style>
    //                     /* 여기에 추가적인 스타일을 적용할 수 있습니다 */
    //                 </style>
    //             </head>
    //             <body>
    //                 ${emailTemplate}
    //             </body>
    //         </html>
    //     `);
    //     newWindow.document.close();
    // }
// }
    axios.post("/api/send-email", {
        emailTemplate,
        recipient: userInfo['email'], // 수신자 이메일 주소
        subject: "[만쿠] 견적서 이메일 보내드립니다.",
    })
        .then(response => {
            console.log("이메일이 성공적으로 전송되었습니다.");
        })
        .catch(error => {
            console.error("이메일 전송 실패:", error);
        });

}
