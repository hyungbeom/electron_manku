import {getData} from "@/manage/function/api";
import message from "antd/lib/message";

export default function emailSendFormat(userInfo, data) {
    console.log(userInfo, 'userInfo');
    console.log(data, 'emailSendFormat');


    // let mailList = [];
    //
    //
    // data.forEach((mail, i1) => {
    //
    //     let totalQuantity = 0;
    //
    //     const email= "kjh@progist.co.kr"
    //     const ccList = []
    //     const estimateRequestDetailIdList = []
    //     const subject = `rfq ${Object.values(mail)?.[0]?.documentNumberFull}`;
    //
    //     const mailContent = `<div style="
    //         position: relative;
    //         width: 100%;
    //         height: auto;
    //         display: flex;
    //         flex-direction: column;
    //         justify-content: center;
    //         margin-bottom: 30px;
    //     ">
    //         <img style="position: absolute; left: 40%; top: 20px;" src="https://image.season-market.co.kr/SeasonMarket/manku_ci_black_text.png" width="80" alt="manku logo"/>
    //         <div style="
    //             width: 100%;
    //             height: auto;
    //             margin: 100px 0 40px 0;
    //             text-align: left;
    //             font-size: 18px;
    //             white-space: pre-line;
    //         ">
    //             <span style="font-weight: 550">[${Object.values(mail)?.[0].managerName}]</span> 님<br><br>
    //             안녕하십니까. <span style="font-weight: 550">만쿠무역 [${userInfo.name}]</span> 입니다.<br>
    //             아래 견적 부탁드립니다.
    //         </div>
    //
    //         <div style="
    //             text-align: center;
    //             line-height: 2.2;
    //             display: flex;
    //             flex-direction: column;
    //             flex-flow: column;
    //         ">
    //             ${//@ts-ignore
    //         mail.map((item, idx) => {
    //             totalQuantity += item.quantity;
    //             return `
    //                     ${!idx ? `
    //                         <div style="
    //                             width: 100%;
    //                             height: 35px;
    //                             font-size: 15px;
    //                             border-top: 1px solid #121212;
    //                             border-bottom: 1px solid #A3A3A3;
    //                             background-color: #EBF6F7;
    //                         ">
    //                             ${item.documentNumberFull}
    //                         </div>
    //                         <div style="
    //                             width: 100%;
    //                             height: 35px;
    //                             border-bottom: 1px solid #A3A3A3;
    //                             display: flex;
    //                         ">
    //                             <div style="
    //                                 font-size: 13px;
    //                                 background-color: #EBF6F7;
    //                                 width: 102px;
    //                                 height: 100%;
    //                                 border-right: 1px solid #121212;
    //                             ">
    //                                 maker
    //                             </div>
    //                             <div style="line-height: 2; padding-left: 32px;">
    //                                 ${item.maker}
    //                             </div>
    //                         </div>
    //                         <div style="
    //                             width: 100%;
    //                             height: 35px;
    //                             display: flex;
    //                         ">
    //                             <div style="
    //                                 font-size: 13px;
    //                                 background-color: #EBF6F7;
    //                                 width: 102px;
    //                                 height: 100%;
    //                                 border-right: 1px solid #121212;
    //                             ">
    //                                 item
    //                             </div>
    //                             <div style="line-height: 2; padding-left: 32px;">
    //                                 ${item.item}
    //                             </div>
    //                         </div>
    //                         <div style="
    //                             line-height: 1.9;
    //                             width: 100%;
    //                             height: 35px;
    //                             font-size: 18px;
    //                             border-top: 1px solid #121212;
    //                             border-bottom: 1px solid #A3A3A3;
    //                             background-color: #EBF6F7;
    //                             font-weight: 540;
    //                         ">
    //                             MODEL
    //                         </div>
    //                     ` : ''}
    //
    //                     <div style="
    //                         width: 100%;
    //                         height: 35px;
    //                         border-bottom: 1px solid #A3A3A3;
    //                         display: flex;
    //                     ">
    //                         <div style="
    //                             font-size: 13px;
    //                             letter-spacing: -1px;
    //                             line-height: 2.5;
    //                             width: 360px;
    //                             height: 100%;
    //                             border-right: 1px solid #121212;
    //                         ">
    //                             ${item.model}
    //                         </div>
    //                         <div style="line-height: 2; padding-left: 30px;">
    //                             <span style="font-weight: 550">${item.quantity}</span> ${item.unit}
    //                         </div>
    //                     </div>
    //
    //                     ${//@ts-ignore
    //                 idx === mail.length - 1 ? `
    //                         <div style="
    //                             background-color: #EBF6F7;
    //                             width: 100%;
    //                             height: 35px;
    //                             display: flex;
    //                             line-height: 2.5;
    //                             border-bottom: 1px solid #121212;
    //                         ">
    //                             <div style="
    //                                 font-size: 13px;
    //                                 width: 360px;
    //                                 height: 100%;
    //                                 border-right: 1px solid #121212;
    //                             ">
    //                                 total
    //                             </div>
    //                             <div style="line-height: 2.5; padding-left: 30px;">
    //                                 <span style="font-weight: 550">${totalQuantity}</span> ${item.unit}
    //                             </div>
    //                         </div>
    //                     ` : ''}
    //                 `;
    //         }).join('')}
    //         </div>
    //
    //         <div style="margin-top: 50px;"> 감사합니다.</div>
    //     </div>
    //
    // `;
    //
    //     mailList.push({
    //         subject: subject,
    //         content: mailContent,
    //         email: email,
    //         ccList: ccList,
    //         estimateRequestDetailIdList: estimateRequestDetailIdList
    //     });
    // });
    //
    // console.log(mailList);
    //
    //
    // async function sendEmail() {
    //     console.log(mailList, "mailList~~~~");
    //
    //     // await getData.post('estimate/sendMailEstimateRequests', {
    //     //     mailList: mailList
    //     // }).then(v => {
    //     //     if (v.data.code === 1) {
    //     //         message.success('메일이 발송되었습니다.');
    //     //     } else {
    //     //         message.error('메일 발송에 실패하였습니다.');
    //     //     }
    //     // });
    //
    //
    //     mailList.forEach((mail) => {
    //         const newWindow = window.open("", "_blank");
    //         if (newWindow) {
    //             newWindow.document.write(`
    //             <html lang="en">
    //                 <head>
    //                     <title>Email Preview</title>
    //                     <style>
    //                         body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
    //                         .email-container { width: 520px; margin: 0 auto; padding: 30px 20px; box-sizing: border-box; }
    //                     </style>
    //                 </head>
    //                 <body>
    //                     <div class="email-container">
    //                         ${mail.content}
    //                     </div>
    //                 </body>
    //             </html>
    //         `);
    //             newWindow.document.close();
    //         }
    //     });
    //
    // }
    //
    // sendEmail();
}
