import axios from "axios";
import {getData} from "@/manage/function/api";
import message from "antd/lib/message";
import moment from "moment/moment";
import {orderWriteInitial} from "@/utils/initialList";

export default function emailSendFormat(userInfo, data) {


    console.log(userInfo, 'userInfo');
    console.log(data, 'emailSendFormat');


    const documentNumberList = []
    const detailIdList = []

    const modelCard = Object.values(data)
        .map((card, i) => {
            let totalQuantity = 0;
            const rowData = card
                //@ts-ignore
                .map((row, idx) => {
                    totalQuantity += row.quantity;

                    detailIdList.push(row.estimateRequestDetailId)

                    if(!idx)
                        documentNumberList.push(row.documentNumberFull)


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
            <div>감사합니다.</div>
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


    const documentNumberString = documentNumberList.join(", ");

    console.log(`rfq ${documentNumberString}`, 'rfq 제목')

    async function sendEmail() {

        const mailList={
            subject:`rfq ${documentNumberString}`,
            content:emailTemplate,
            estimateRequestDetailIdList:detailIdList,
            ccList:['hblee@progist.co.kr'],
            // email:userInfo['email'],
            email:'kjh@progist.co.kr',
        }

        console.log(mailList, 'mailList~~~')

        await getData.post('estimate/sendMailEstimateRequests', mailList).then(v => {
            if (v.data.code === 1) {
                message.success('메일이 발송되었습니다.')
            }else{
                message.error('메일 발송에 실패하였습니다.')
            }
        });
    }

    sendEmail()

}
