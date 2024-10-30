var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        H0B;
        LOB;
        memory;
        constructor() {
        }
        init() { }
        // Read a value from the specified memory address
        read(address) {
            return _Memory.totalMemory[address + _PCB.base];
        }
        // Write data to the specified memory address
        write(address, data) {
            const add = address + _PCB.base;
            const { base, limit, state, PID } = _PCB;
            if (["Resident", "Ready", "Running"].includes(state)) {
                if (add >= base && add <= limit) {
                    _Memory.totalMemory[add] = data;
                    TSOS.Control.updateMemoryDisplay(add);
                }
                else {
                    _CPU.isExecuting = false;
                    _StdOut.putText(`OUT OF BOUNDS ERROR ON PID: ${PID}`);
                    _OsShell.shellKill();
                }
            }
        }
        clearAll() {
            for (let i = 0; i < _Memory.totalMemory.length; i++) {
                _Memory.totalMemory[i] = 0x00;
            }
            for (let m = 0; m < _Memory.totalMemory.length; m++) {
                TSOS.Control.updateMemoryDisplay(m);
            }
            for (let j = 0; j < _PCBList.length; j++) {
                _PCBList[j].state = "Terminated";
                _Segments[_PCBList[j].segment].ACTIVE = false;
                _MemoryManager.clearSegment(_PCBList[j].base, _PCBList[j].limit);
            }
            this.updateTables();
        }
        updateTables() {
            TSOS.Control.processTableUpdate();
            TSOS.Control.cpuTableUpdate();
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map