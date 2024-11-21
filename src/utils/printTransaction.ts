export default function printTransaction(data, customerData, setModalData) {


    console.log(data, 'data');
    console.log(customerData, 'customerData');

    const {orderDetailList}=data;

    let totalAmount = 0;
    let totalVat = 0;
    let total = totalAmount * 1.1;

    const sheetContent = `
    <div style="width: 595px; height: 842px;padding: 40px 24px">
<!--header-->
<div style="font-size: 24px; text-align: center">
  거 래 명 세 표<br/>
  <span style="font-size: 14px; text-decoration: underline; text-align: center">거 래 일 자 :  2024-11-21</span>
</div>

  <div style="text-align: right; margin-top: 15px; font-size: 11px">(공급받는자 보관용)</div>
<div style="display: grid; grid-template-columns: 1fr 1fr; border:1px solid #121212;">

  <!--공급자 정보-->
  <div style="display: grid; grid-template-columns: 0.5fr 2fr 10fr;">
    <div style="font-size: 14px; display: flex; align-items: center; border-right: 1px solid #A3A3A3; padding: 0 3px">
      공 급 자
    </div>
    <div style="font-size: 14px; display: grid; grid-template-rows: repeat(5, 1fr); text-align: center">
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; line-height: 2.2">등록번호</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; line-height: 2.2">상호</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; display: flex; align-items: center; justify-content: center">주소</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; line-height: 2.2">업태</div>
      <div style="font-size: 11px; line-height: 2.2; border-right: 1px solid #A3A3A3;">담당자</div>
    </div>
    <div style="font-size: 14px; display: grid; grid-template-rows: repeat(5, 1fr); text-align: center">
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 2.2;">714-87-01453</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 2.2; display: grid; grid-template-columns: 4fr 1.5fr 2.5fr">
        <div style="border-right: 1px solid #A3A3A3; ">주식회사 만쿠무역</div><div style="border-right: 1px solid #A3A3A3;">대표자</div><div style="padding-left: 3px; text-align: left">김민국</div></div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 1.1; white-space: pre-wrap">서울 송파구 충민로 52, 2층 비211, 비212호<br/>(문정동, 가든파이브웍스)</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 2.2; display: grid; grid-template-columns: 2.2fr 0.7fr 2.8fr">
        <div style="border-right: 1px solid #A3A3A3; ">도매, 도소매</div><div style="border-right: 1px solid #A3A3A3;">종목</div><div>무역, 기계자재</div></div>
      <div style="font-size: 11px; line-height: 2.2; display: grid; grid-template-columns: 2.2fr 1.2fr 2.3fr">
        <div style="border-right: 1px solid #A3A3A3; ">신단비</div><div style="border-right: 1px solid #A3A3A3;">전화번호</div><div>02-465-7838</div></div>
    </div>
  </div>

  <!--공급받는자 정보-->
  <div style="display: grid; grid-template-columns: 0.5fr 2fr 10fr; ">
    <div style="font-size: 14px; display: flex; align-items: center; border-right: 1px solid #A3A3A3; border-left: 1px solid #121212; padding: 0 3px">
      공 급 받 는 자
    </div>
    <div style="font-size: 14px; display: grid; grid-template-rows: repeat(5, 1fr); text-align: center">
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; line-height: 2.2">등록번호</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; line-height: 2.2">상호</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; display: flex; align-items: center; justify-content: center">주소</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; border-right: 1px solid #A3A3A3; line-height: 2.2">업태</div>
      <div style="font-size: 11px; line-height: 2.2; border-right: 1px solid #A3A3A3;">담당자</div>
    </div>
    <div style="font-size: 14px; display: grid; grid-template-rows: repeat(5, 1fr); text-align: center">
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 2.2;">${customerData.businessRegistrationNumber}</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 2.2; display: grid; grid-template-columns: 4fr 1.5fr 2.5fr">
        <div style="border-right: 1px solid #A3A3A3; ">${customerData.customerName}</div><div style="border-right: 1px solid #A3A3A3;">대표자</div><div style="padding-left: 3px; text-align: left">${customerData.representative}</div></div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 1.1; white-space: pre-wrap">${customerData.address}</div>
      <div style="font-size: 11px; border-bottom: 1px solid #A3A3A3; line-height: 2.2; display: grid; grid-template-columns: 2.2fr 0.7fr 2.8fr">
        <div style="border-right: 1px solid #A3A3A3; ">${customerData.businessType}</div><div style="border-right: 1px solid #A3A3A3;">종목</div><div>${customerData.businessItem}</div></div>
      <div style="font-size: 11px; line-height: 2.2; display: grid; grid-template-columns: 2.2fr 1.2fr 2.3fr">
        <div style="border-right: 1px solid #A3A3A3; ">${customerData.manager}</div><div style="border-right: 1px solid #A3A3A3;">전화번호</div><div>${customerData.customerTel}</div></div>
    </div>
  </div>

  </div>


<!--하단 리스트-->
  <div style="border-bottom: 1px solid #121212; border-left: 1px solid #121212; border-right: 1px solid #121212 ">

      <div style="font-size: 11px; display: grid; border-bottom: 1px solid #A3A3A3; grid-template-columns: 0.3fr 1fr 3fr 0.6fr 0.5fr 0.9fr 0.9fr 0.9fr 1.2fr;">
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">No</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">날짜</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">품목</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">규격</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">수량</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">단가</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">공급가액</div>
        <div style="border-right: 1px solid #A3A3A3; text-align: center; padding: 3px 0; ">세액</div>
        <div style="text-align: center; padding: 3px 0; ">비고</div>
      </div>

      <div style="display: flex; flex-direction: column">

${orderDetailList.map((model, i)=>{
        totalAmount+=model.amount
        totalVat+=model.amount
        
    return`
    <div style="font-size: 11px; display: grid; grid-template-columns: 0.3fr 1fr 3fr 0.6fr 0.5fr 0.9fr 0.9fr 0.9fr 1.2fr;">
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 0; display: flex; align-items: center; justify-content: center">${i+1}</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 0; display: flex; align-items: center; justify-content: center">${i+1}</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px;  display: flex; align-items: center; white-space: pre-wrap ">${model.model}</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: center">${model.model}<</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: center">${model.unit}</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: end">${model.quantity}</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: end">${model.unitPrice}</div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: end">${model.amount}</div>
        <div style="text-align: left; padding: 3px 3px; border-bottom: 1px solid #A3A3A3; white-space: pre-wrap; display: flex; align-items: center;">${model.amount*0.1}</div>
      </div>`
    })}
      
      <div style="font-size: 11px; display: grid; grid-template-columns: 0.3fr 1fr 3fr 0.6fr 0.5fr 0.9fr 0.9fr 0.9fr 1.2fr;">
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 0; display: flex; align-items: center; justify-content: center"> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 0; display: flex; align-items: center; justify-content: center"> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px;  display: flex; align-items: center; white-space: pre-wrap "> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: center"> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: center"> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: end"> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: end"> </div>
        <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 3px 3px; display: flex; align-items: center; justify-content: end"> </div>
        <div style="text-align: left; padding: 3px 3px; border-bottom: 1px solid #A3A3A3; white-space: pre-wrap; display: flex; align-items: center;"> </div>
      </div>

  </div>

<!--합계-->
    <div style="font-size: 11px; display: grid; grid-template-columns: 0.6fr 1fr 0.4fr 1fr 0.5fr 1fr 0.5fr 1fr 0.5fr 1fr;">
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 0; display: flex; align-items: center; justify-content: center">공급가액</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 3px; display: flex; align-items: center; justify-content: end">${totalAmount}</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 0; display: flex; align-items: center; justify-content: center">세액</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 3px; display: flex; align-items: center; justify-content: end">${totalVat}</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 0; display: flex; align-items: center; justify-content: center">합계</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 3px; display: flex; align-items: center; justify-content: end">${total}</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 0; display: flex; align-items: center; justify-content: center">미수금</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 3px; display: flex; align-items: center; justify-content: end"> </div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 0; display: flex; align-items: center; justify-content: center">인수자</div>
      <div style="border-right: 1px solid #A3A3A3; border-bottom: 1px solid #A3A3A3; padding: 8px 3px; display: flex; align-items: center; justify-content: center"> </div>
    </div>
  </div>

</div>
    `
    setModalData(sheetContent)

}