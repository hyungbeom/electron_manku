export default function emailSendFormat(userInfo, data) {
    console.log(userInfo, 'userInfo');
    console.log(data, 'emailSendFormat');

    const initialItem = {
        subject: "",
        content: "",
        estimateRequestDetailIdList: [],
        ccList: ['hblee@progist.co.kr'],
        email: "",
    };

    const mailList = [];
    let mailItem = { ...initialItem };

    Object.values(data).forEach((mail, i1) => {
        const documentCard = Object.values(data)
            .map((document) => {
                let totalQuantity = 0;

                // @ts-ignore
                const documents = document.length>0 && document.map((item, idx) => {
                        totalQuantity += item.quantity;
                        mailItem['estimateRequestDetailIdList'].push(item.estimateRequestDetailId);

                        if (!idx) {
                            mailItem['subject'] = `rfq ${item.documentNumberFull}`;
                            mailItem['email'] = 'kjh@progist.co.kr';
                        }

                        return `
                        ${!idx && `
                            <div style="width: 100%; height:35px; font-size:13px; border-top: 1px solid #121212; border-bottom: 1px solid #A3A3A3; background-color: #EBF6F7;">
                                ${item.documentNumberFull}
                            </div>
                            <div style="width: 100%; height:35px; border-bottom: 1px solid #A3A3A3; display: flex;">
                                <div style="font-size:13px; background-color: #EBF6F7; width: 102px; height:100%; border-right: 1px solid #121212;">
                                    maker
                                </div>
                                <div style="line-height: 2; padding-left: 32px;">
                                    ${item.maker}
                                </div>
                            </div>
                            <div style="width: 100%; height:35px; display: flex;">
                                <div style="font-size:13px; background-color: #EBF6F7; width: 102px; height:100%; border-right: 1px solid #121212;">
                                    item
                                </div>
                                <div style="line-height: 2; padding-left: 32px;">
                                    ${item.item}
                                </div>
                            </div>
                        
                        <div style="line-height: 1.9; width: 100%; height:35px; font-size:18px; border-top: 1px solid #121212; border-bottom: 1px solid #A3A3A3; background-color: #EBF6F7; font-weight: 540;">
                            MODEL
                        </div>`}
                        
                        <div style="width: 100%; height:35px; border-bottom: 1px solid #A3A3A3; display: flex;">
                            <div style="font-size:13px; letter-spacing:-1; line-height: 2.5; width: 460px; height:100%; border-right: 1px solid #121212;">
                                ${item.model}
                            </div>
                            <div style="line-height: 2; padding-left: 30px;">
                                <span style="font-weight: 550">${item.quantity}</span> ${item.unit}
                            </div>
                        </div>
                        ${//@ts-ignore
                            idx === document.length - 1 &&
                        `<div style="background-color: #EBF6F7; width: 100%; height:35px; display: flex; border-bottom: 1px solid #121212;">
                            <div style="line-height: 2.5; font-size:13px; width: 460px; height:100%; border-right: 1px solid #121212;">
                                total
                            </div>
                            <div style="line-height: 2.5; padding-left: 30px;">
                                <span style="font-weight: 550">${totalQuantity}</span> ${item.unit}
                            </div>
                        </div>
                        <div style="background-color: #B9DCDF; width: 100%; height: 1px; margin: 25px 0;"></div>`}
                    `;
                    })
                    .join("");

                return `
                <div style="line-height:2.2; text-align: center; display: flex; flex-direction: column; flex-flow: column">
                    ${documents}
                </div>`;
            })
            .join("");

        const emailCard = `
            <div style="position:relative; text-align:center; font-size:28px; width: 530px; padding: 30px 20px; height: auto; box-sizing: border-box; display:flex; flex-direction:column; justify-content:center">
                <img style="position: absolute; left:40px, top:0" src='/manku_ci_black_text.png' width={80} alt='manku logo'></img>
                
                <div style="text-align: left; font-size:18px; white-space: pre-line; width:100%; height:auto; margin:100px 0 40px 0;" >
                    <span style="font-weight: 550">[${mail[0]?.managerName}]</span> 님<br/>
                    안녕하십니까. <span style="font-weight: 550">만쿠무역 [${userInfo.name}]</span> 입니다.
                    아래 견적 부탁드립니다.
                </div>
                <div style="line-height: 2.6; display: flex; flex-direction:column; flex-flow:column; margin-top: 60px">
                    ${documentCard}
                </div>
                <div>감사합니다.</div>
            </div>`;

        mailItem['content'] = emailCard;
        mailList.push({ ...mailItem });
        mailItem = { ...initialItem };
    });

    async function sendEmail() {
        console.log(mailList, "mailList~~~~");

        // await getData.post('estimate/sendMailEstimateRequests', {
        //     mailList: mailList
        // }).then(v => {
        //     if (v.data.code === 1) {
        //         message.success('메일이 발송되었습니다.');
        //     } else {
        //         message.error('메일 발송에 실패하였습니다.');
        //     }
        // });
        mailList.forEach((mail) => {
            const newWindow = window.open("", "_blank");
            newWindow?.document.write(`
            <html>
                <head>
                    <title>Email Preview</title>
                    <style>
                        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
                        .email-container { width: 530px; margin: 0 auto; padding: 30px 20px; box-sizing: border-box; }
                        .header { text-align: center; margin-bottom: 20px; }
                    </style>
                </head>
                <body>
                    <div class="email-container">
                        ${mail.content}
                    </div>
                </body>
            </html>
        `);
            newWindow.document.close();

        })


    }

    sendEmail();
}
