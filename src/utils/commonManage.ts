export const commonManage: any = {}


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
