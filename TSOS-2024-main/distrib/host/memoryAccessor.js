var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        H0B;
        LOB;
        memory;
        constructor() { }
        init() { }
        read(address) {
            const add = address + _PCB.base;
            if (this.isAddressValid(add)) {
                return _Memory.totalMemory[add];
            }
            else {
                this.handleMemoryViolation(add, _PCB.PID, "read");
                return null;
            }
        }
        write(address, data) {
            const add = address + _PCB.base;
            const { base, limit, state, PID } = _PCB;
            if (["Resident", "Ready", "Running"].includes(state)) {
                if (this.isAddressValid(add)) {
                    _Memory.totalMemory[add] = data;
                    TSOS.Control.updateMemoryDisplay(add);
                }
                else {
                    this.handleMemoryViolation(add, PID, "write");
                }
            }
        }
        // Within valid bounds
        isAddressValid(address) {
            return address >= _PCB.base && address <= _PCB.limit;
        }
        // Handle out-of-bounds
        handleMemoryViolation(address, pid, operation) {
            _CPU.isExecuting = false;
            _StdOut.putText(`Memory Access Violation: Attempted to ${operation} at address ${address}, which is out of bounds for PID ${pid}.`);
            _StdOut.advanceLine();
            _OsShell.shellKill();
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
        // Bounds checking
        getMemorySize() {
            return _Memory.totalMemory.length;
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map