importScripts('./math.js');


self.onmessage = function (e) {
    // let {motionData, kinematicsInfo, robotName, lastTime = 0} = e.data[0];

    self.postMessage({resultData: [1,1,1,1,1,1,1]});
    self.close();
}