export const commonManage: any = {}
export const commonFunc: any = {}
export const commonCalc: any = {}


commonManage.calcFloat = function (params, numb) {

        if (params.value == null || params.value === '') {
            return ''; // 값이 없으면 빈 문자열 반환
        }
        return parseFloat(params.value).toFixed(numb); // 소수점 두 자리로 제한

}
commonManage.onChange = function (e, setInfo) {
    let bowl = {}
    bowl[e.target.id] = e.target.value;
    setInfo(v => {
        return {...v, ...bowl}
    })
}

commonManage.openModal = function (e, setIsModalOpen) {
    let bowl = {};
    bowl[e] = true
    setIsModalOpen(v => {
        return {...v, ...bowl}
    })
}


commonManage.changeCurr = function (value) {
    switch (value) {
        case "ATI":
        case "ARC":
        case "ABP":
        case "AUD":
            return 'USD'
        case "GAW":
        case "GMT":
        case "GHY":
            return 'EUR'
        case "JTL":
        case "JEC":
        case "JDE":
        case "JAT":
        case "JSU":
            return 'JPY'
        case "ETF":
            return 'GBP'
        case "ETF":
            return 'GBP'

        case "CZY":
        case "CIN":
            return 'USD'
        case "SOK":
        case "GKN":
            return ''
        case "APF":
            return ''
        case "AHC":
        case "ADS":
            return 'USD'
        case "GDH":
        case "IAD":
        case "GFF":
        case "ART":
        case "GSW":
        case "NZR":
        case "EAM":
        case "SAA":
        case "GSS":
        case "ADO":
        case "GCM":
        case "AMC":
        case "ATT":
            return ''
        case "AKE":
        case "CMA":
        case "ACI":
        case "GFM":
        case "CLE":
        case "CVT":
        case "CHJ":
        case "DAV":
        case "CHM":
        case "MOU":
        case "AEL":
        case "JEJ":
        case "CTT":
        case "KOE":
        case "CSA":
        case "UWC":
        case "AVI":
        case "EFA":
        case "CBB":
        case "CWT":
        case "AHH":
        case "TES":
        case "CNC":
        case "AWM":
        case "GTC":
            return 'USD'
        case "ITI":
        case "GRM":
        case "GPT":
        case "GMK":
        case "AAC":
        case "ALI":
        case "WIN":
            return ''
        case "GGP":
        case "GRA":
            return 'EUR'
        case "AJL":
        case "AIM":
        case "STO":
        case "ACR":
            return 'USD'
        case "FBM":
        case "GMI":
        case "GEG":
        case "IPF":
        case "IMC":
        case "ICS":
            return 'EUR'
        case "AFU":
        case "CCH":
        case "CSE":
        case "CHT":
            return 'USD'
        default :
            return 'KRW'
    }
}


commonFunc.sumCalc = function calculateTotals(rowData) {


    if (!rowData) {
        return false
    }

    const unitPrice = rowData.reduce((sum, row) => sum + (parseFloat(row.unitPrice) || 0), 0);
    const net = rowData.reduce((sum, row) => sum + (parseFloat(row.net) || 0), 0);
    const receivedQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.receivedQuantity) || 0), 0);
    const unreceivedQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.unreceivedQuantity) || 0), 0);


    let amount = 0
    rowData.map((row) => {
        const sum = (parseFloat(row.net) || 0) * (parseFloat(row.quantity) || 0);
        amount += sum;
    });


    const totalPrice = rowData.reduce((sum, row) => {
        const calculatedPrice = (parseFloat(row.unitPrice) || 0) * (parseFloat(row.quantity) || 0);
        return sum + calculatedPrice;
    }, 0);
    const totalQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.quantity) || 0), 0);
    return {
        writtenDate: 'Total',
        amount: totalPrice,
        quantity: totalQuantity,
        receivedQuantity: receivedQuantity,
        unreceivedQuantity: unreceivedQuantity,
        totalAmount: amount,
        unitPrice: unitPrice,
        net: net,
        totalPrice: totalPrice
    };
}

