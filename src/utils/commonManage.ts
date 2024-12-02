export const commonManage: any = {}
export const commonFunc: any = {}


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



commonFunc.sumCalc =  function calculateTotals(rowData) {


    if(!rowData){
        return false
    }

    const unitPrice = rowData.reduce((sum, row) =>  sum + (parseFloat(row.unitPrice) || 0), 0);
    const net = rowData.reduce((sum, row) =>  sum + (parseFloat(row.net) || 0), 0);
    const receivedQuantity = rowData.reduce((sum, row) =>  sum + (parseFloat(row.receivedQuantity) || 0), 0);
    const unreceivedQuantity = rowData.reduce((sum, row) =>  sum + (parseFloat(row.unreceivedQuantity) || 0), 0);


    let amount = 0
    rowData.map((row) => {
    const sum = (parseFloat(row.net) || 0) * (parseFloat(row.quantity) || 0);
        amount+=sum;
    });





    const totalPrice = rowData.reduce((sum, row) => {
        const calculatedPrice = (parseFloat(row.unitPrice) || 0) * (parseFloat(row.quantity) || 0);
        return sum + calculatedPrice;
    }, 0);
    const totalQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.quantity) || 0), 0);
    return {
        writtenDate: 'Total',
        amount:totalPrice,
        quantity: totalQuantity,
        receivedQuantity : receivedQuantity,
        unreceivedQuantity : unreceivedQuantity,
        totalAmount : amount,
        unitPrice : unitPrice,
        net : net,
        totalPrice: totalPrice
    };
}

