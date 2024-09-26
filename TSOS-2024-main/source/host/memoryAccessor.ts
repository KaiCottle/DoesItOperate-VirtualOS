module TSOS {
    export class MemoryAccessor {
        public highorderbyte: number;
        public loworderbyte: number;
        public memory: Memory;

        constructor() {}

        public read(address: number): number {
            return _Memory.totalMemory[address + _PCB.base];
        }

        public write(address: number, data: number) {
            //console.log("cur state: " + _PCB.state);
            //var offSet = (Number(address) + Number(_PCB.base));
            //console.log("address: " + address );
            //console.log("base: " + _PCB.base);
            //console.log("limit: " + _PCB.limit);
            //console.log("offSet: " + offSet);
            var addy = address + _PCB.base;
            if ((_PCB.state === "Resident") || (_PCB.state === "Ready") || (_PCB.state === "Running")) {
                if ((addy >= _PCB.base) && (addy <= _PCB.limit)) {
                    _Memory.totalMemory[addy] = data;
                    TSOS.Control.memoryDisplayUpdate(addy);
                }
                else {
                    _CPU.isExecuting = false;
                    _StdOut.putText("OUT OF BOUNDS ERROR ON PID: " + (_PCB.PID));
                }
            }//if state
        }

        public resetMemory(): void {
            for (let address = _PCB.base; address <= _PCB.limit; address++) {
                _Memory.totalMemory[address] = 0x00;
                TSOS.Control.memoryDisplayUpdate(address);
            }
        }

        public tableUpdate() {
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }
    }
}
