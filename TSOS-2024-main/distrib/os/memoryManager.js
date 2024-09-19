var TSOS;
(function (TSOS) {
    const MEMORY_SIZE = 256; // Size of a memory block
    const numPrograms = 3; // Maximum number of programs
    class MemoryManager {
        residentList = [];
        readyQueue = new TSOS.Queue();
        allocated = new Array(numPrograms).fill(-1);
        constructor() {
            this.residentList = [];
            this.readyQueue = new TSOS.Queue();
            this.allocated = new Array(numPrograms);
            for (var i = 0; i < this.allocated.length; i++) {
                this.allocated[i] = -1;
            }
        }
        load(program, priority) {
            var pcb = new pcb(priority);
            pcb.processState = "Resident";
            pcb.loadCycle = _OSclock;
            this.residentList[pcb.processID] = pcb;
            if (this.allocateMemory(pcb, program)) {
                return pcb.processID;
            }
            else {
                throw new Error("Memory allocation failed: no available space.");
            }
        }
        allocateMemory(pcb, program) {
            const freeIndex = this.findFreeMemoryBlock();
            if (freeIndex === -1) {
                return false; // No available memory block
            }
            this.allocated[freeIndex] = pcb.processID;
            pcb.baseRegister = freeIndex * MEMORY_SIZE;
            pcb.limitRegister = pcb.baseRegister + MEMORY_SIZE - 1;
            pcb.isInMemory = true;
            this.loadProgramIntoMemory(pcb, program);
            TSOS.Control.updateMemoryDisplay();
            return true;
        }
        //Seperated this logic from the allocateMemory function to make it easier to test
        findFreeMemoryBlock() {
            return this.allocated.findIndex(slot => slot === -1);
        }
        loadProgramIntoMemory(pcb, program) {
            for (let i = 0; i < MEMORY_SIZE; i++) {
                const code = program[i] || "00";
                _Memory.setByte(pcb.baseRegister + i, code);
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map