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

    const unitPrice = rowData.reduce((sum, row) =>  sum + (parseFloat(row.unitPrice) || 0), 0);
    const receivedQuantity = rowData.reduce((sum, row) =>  sum + (parseFloat(row.receivedQuantity) || 0), 0);
    const unreceivedQuantity = rowData.reduce((sum, row) =>  sum + (parseFloat(row.unreceivedQuantity) || 0), 0);
    let amount = 0
    rowData.map((row) => {
    const sum = (parseFloat(row.net) || 0) * (parseFloat(row.quantity) || 0);
        amount+=sum;
        console.log(sum, 'sum')
        console.log(amount, 'amount~~')
    });
    const totalPrice = rowData.reduce((sum, row) => {
        const calculatedPrice = (parseFloat(row.unitPrice) || 0) * (parseFloat(row.quantity) || 0);
        return sum + calculatedPrice;
    }, 0);
    // let totalPrice = 0
    // rowData.map((row) => {
    //     const sum = (parseFloat(row.unitPrice) || 0) * (parseFloat(row.quantity) || 0);
    //     totalPrice+=sum;
    //     console.log(sum, 'sum')
    //     console.log(totalPrice, 'totalPrice~~')
    // });
    const totalQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.quantity) || 0), 0);
    return {
        model: 'Total',
        amount:amount,
        quantity: totalQuantity,
        receivedQuantity : receivedQuantity,
        unreceivedQuantity : unreceivedQuantity,
        unitPrice : unitPrice,
        totalPrice: totalPrice
    };
}