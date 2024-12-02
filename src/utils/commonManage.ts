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
    // const amount = rowData.reduce((sum, row) => sum + (row.amount || 0), 0);
    const totalPrice = rowData.reduce((sum, row) => sum + (row.totalPrice || 0), 0);
    const totalQuantity = rowData.reduce((sum, row) => sum + (parseFloat(row.quantity) || 0), 0);
    return {
        model: 'Total',
        // amount: totalQuantity*,
        quantity: totalQuantity,
        receivedQuantity : receivedQuantity,
        unreceivedQuantity : unreceivedQuantity,
        unitPrice : unitPrice,
        totalPrice: totalPrice.toLocaleString(),
    };
}