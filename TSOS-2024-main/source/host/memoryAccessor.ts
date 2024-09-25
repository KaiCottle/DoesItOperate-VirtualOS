module TSOS {
    export class MemoryAccessor {
        public highorderbyte: number;
        public loworderbyte: number;
        public memory: Memory;

        constructor() {}

        public read(address: number): number {
            return _Memory.totalMemory[address + _PCB.base];
        }

        public write(offset: number, data: number) {
            var Address = offset + _PCB.base;
            console.log(`Writing data to absolute address: ${Address}, Data: ${data}`);
        
            if ((_PCB.state === "Resident") || (_PCB.state === "Ready") || (_PCB.state === "Running")) {
                if ((Address >= _PCB.base) && (Address <= _PCB.limit)) {
                    _Memory.totalMemory[Address] = data;
                    TSOS.Control.updateMemoryDisplay(Address);
                } else {
                    _CPU.isExecuting = false;
                    _StdOut.putText("OUT OF BOUNDS: " + (_PCB.PID));
                }
            }
        }

        public resetMemory(): void {
            for (let address = _PCB.base; address <= _PCB.limit; address++) {
                _Memory.totalMemory[address] = 0x00;
                TSOS.Control.updateMemoryDisplay(address);
            }
        }

        public tableUpdate() {
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }
    }
}
