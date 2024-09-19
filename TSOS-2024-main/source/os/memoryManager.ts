module TSOS {
    const MEMORY_SIZE = 256; // Size of a memory block
    const numPrograms = 3;   // Maximum number of programs

    export class MemoryManager {
        public residentList: TSOS.pcb[] = [];
        public readyQueue: TSOS.Queue = new Queue();
        private allocated: number[] = new Array(numPrograms).fill(-1);

        constructor() {}

        public load(program: Array<string>, priority: number): number {
            var pcb = new pcb(priority);
            pcb.processState = "Resident";
            pcb.loadCycle = _OSclock;
            this.residentList[pcb.processID] = pcb;

            if (this.allocateMemory(pcb, program)) {
                return pcb.processID;
            } else {
                throw new Error("Memory allocation failed: no available space.");
            }
        }

        private allocateMemory(pcb: TSOS.pcb, program: Array<string>): boolean {
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
        private findFreeMemoryBlock(): number {
            return this.allocated.findIndex(slot => slot === -1);
        }

        private loadProgramIntoMemory(pcb: TSOS.pcb, program: Array<string>): void {
            for (let i = 0; i < MEMORY_SIZE; i++) {
                const code = program[i] || "00";
                _Memory.setByte(pcb.baseRegister + i, code);
            }
        }
    }
}
