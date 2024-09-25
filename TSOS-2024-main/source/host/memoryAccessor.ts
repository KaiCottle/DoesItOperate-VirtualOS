//<reference path="../globals.ts" />
/* MemoryAccessor
Memory Accessor is for reading and writing to memory */

module TSOS {

    export class MemoryAccessor {
        public highorderbyte: number;
        public loworderbyte: number;

        public memory: Memory;

        constructor() {
            _Kernel.krnTrace("Initialized Memory");
        }

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
                    _StdOut.putText("OUT OF BOUNDS ERROR ON PID: " + (_PCB.PID));
                }
            }
        }
        /*public tableUpdate() {
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }*/
    }
}