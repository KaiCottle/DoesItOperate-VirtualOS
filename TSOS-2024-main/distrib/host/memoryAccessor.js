//<reference path="../globals.ts" />
/* MemoryAccessor
Memory Accessor is for reading and writing to memory */
var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        highorderbyte;
        loworderbyte;
        memory;
        constructor() {
            _Kernel.krnTrace("Initialized Memory");
        }
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
                    _StdOut.putText("OUT OF BOUNDS ERROR ON PID: " + (_PCB.PID));
                }
            }
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map