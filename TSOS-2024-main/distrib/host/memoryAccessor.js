var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        highorderbyte;
        loworderbyte;
        memory;
        constructor() { }
        read(address) {
            return _Memory.totalMemory[address + _PCB.base];
        }
        write(address, data) {
            //console.log("cur state: " + _PCB.state);
            //var offSet = (Number(address) + Number(_PCB.base));
            //console.log("address: " + address );
            //console.log("base: " + _PCB.base);
            //console.log("limit: " + _PCB.limit);
            //console.log("offSet: " + offSet);
            var addy = address + _PCB.base;
            if ((_PCB.state === "Resident") || (_PCB.state === "Ready") || (_PCB.state === "Running")) {
                if ((addy >= _PCB.base) && (addy <= _PCB.limit)) {
                    _Memory.totalMemory[addy] = data;
                    TSOS.Control.memoryDisplayUpdate(addy);
                }
                else {
                    _CPU.isExecuting = false;
                    _StdOut.putText("OUT OF BOUNDS ERROR ON PID: " + (_PCB.PID));
                }
            } //if state
        }
        resetMemory() {
            for (let address = _PCB.base; address <= _PCB.limit; address++) {
                _Memory.totalMemory[address] = 0x00;
                TSOS.Control.memoryDisplayUpdate(address);
            }
        }
        tableUpdate() {
            TSOS.Control.processTableUpdate();
            TSOS.Control.cpuTableUpdate();
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map