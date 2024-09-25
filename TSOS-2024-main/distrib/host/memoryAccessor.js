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
        write(offset, data) {
            var Address = offset + _PCB.base;
            console.log(`Writing data to absolute address: ${Address}, Data: ${data}`);
            if ((_PCB.state === "Resident") || (_PCB.state === "Ready") || (_PCB.state === "Running")) {
                if ((Address >= _PCB.base) && (Address <= _PCB.limit)) {
                    _Memory.totalMemory[Address] = data;
                    TSOS.Control.updateMemoryDisplay(Address);
                }
                else {
                    _CPU.isExecuting = false;
                    _StdOut.putText("OUT OF BOUNDS: " + (_PCB.PID));
                }
            }
        }
        resetMemory() {
            for (let address = _PCB.base; address <= _PCB.limit; address++) {
                _Memory.totalMemory[address] = 0x00;
                TSOS.Control.updateMemoryDisplay(address);
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