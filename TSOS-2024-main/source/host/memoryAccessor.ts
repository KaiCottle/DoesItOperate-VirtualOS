module TSOS {
    export class MemoryAccessor {
        public H0B: number;
        public LOB: number;
        public memory: Memory;

        constructor() {
        }

        public init(): void {}

        // Read a value from the specified memory address
        public read(address: number): number {
            return _Memory.totalMemory[address + _PCB.base];
        }

        // Write data to the specified memory address
        public write(address: number, data: number) {
            var addy = address + _PCB.base;
            if ((_PCB.state === "Resident") || (_PCB.state === "Ready") || (_PCB.state === "Running")) {
                if ((addy >= _PCB.base) && (addy <= _PCB.limit)) {
                    _Memory.totalMemory[addy] = data;
                    TSOS.Control.updateMemoryDisplay(addy);
                }
                else {
                    _CPU.isExecuting = false;
                    _StdOut.putText("OUT OF BOUNDS ERROR ON PID: " + (_PCB.PID));
                    _OsShell.shellKill();
                }
            }//if state
        }

        public clearAll() {
            for (let i = 0; i < _Memory.totalMemory.length; i++) {
                _Memory.totalMemory[i] = 0x00;
            }
            for (let m = 0; m < _Memory.totalMemory.length; m++) {
                TSOS.Control.updateMemoryDisplay(m);
            }
            for (let j = 0; j < _PCBList.length; j++) {
                console.log(_PCBList[j]);
                _PCBList[j].state = "Terminated";
                console.log(_PCBList[j]);
                _Segments[_PCBList[j].segment].ACTIVE = false;
                _MemoryManager.clearSegment(_PCBList[j].base, _PCBList[j].limit);
            }
            Control.cpuTableUpdate;
            Control.processTableUpdate;
        }

        public updateTables() {
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }
    }
}
