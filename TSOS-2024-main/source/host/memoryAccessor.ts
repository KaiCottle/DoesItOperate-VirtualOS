module TSOS {
    export class MemoryAccessor {
        public H0B: number;
        public LOB: number;
        public memory: Memory;

        constructor() {}

        public init(): void {}

        public read(address: number): number | null {
            const add = address + _PCB.base;
            if (this.isAddressValid(add)) {
                return _Memory.totalMemory[add];
            } else {
                this.handleMemoryViolation(add, _PCB.PID, "read");
                return null;
            }
        }

        public write(address: number, data: number): void {
            const add = address + _PCB.base;
            const { base, limit, state, PID } = _PCB;
            if (["Resident", "Ready", "Running"].includes(state)) {
                if (this.isAddressValid(add)) {
                    _Memory.totalMemory[add] = data;
                    TSOS.Control.updateMemoryDisplay(add);
                } else {
                    this.handleMemoryViolation(add, PID, "write");
                }
            }
        }

        // Within valid bounds
        private isAddressValid(address: number): boolean {
            return address >= _PCB.base && address <= _PCB.limit;
        }

        // Handle out-of-bounds
        private handleMemoryViolation(address: number, pid: number, operation: string): void {
            _CPU.isExecuting = false;
            _StdOut.putText(`Memory Access Violation: Attempted to ${operation} at address ${address}, which is out of bounds for PID ${pid}.`);
            _StdOut.advanceLine();
            _OsShell.shellKill();
        }

        public clearAll() {
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

        public updateTables() {
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }

        // Bounds checking
        public getMemorySize(): number {
            return _Memory.totalMemory.length;
        }
    }
}
