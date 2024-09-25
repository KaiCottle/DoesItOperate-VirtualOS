
module TSOS {

    export class MemoryManager {
        public memSegment0: any;
        public memSegment1: any;
        public memSegment2: any;
        constructor() {
        }


        public clearSegment(base: number, limit: number) {
            for (let i = base; i < limit; i++) {
                _Memory.totalMemory[i] = 0x00;
            }
            for (let m = base; m < limit; m++) {
                TSOS.Control.updateMemoryDisplay(m);
            }
            _MemoryAccessor.tableUpdate();
        } 


        public allocateSegment(inputArray: string[]) {
            // Segment 0
            if (_PCB.segment === 0) {
                this.clearSegment(_PCB.base, _PCB.limit);
                var w = 0;
                for (let m = _PCB.base; m < _PCB.limit && w < inputArray.length; m++) {
                    let data = parseInt(inputArray[w] ?? "00", 16);
                    console.log(`Writing to memory address: ${m}, Data: ${data}`);
                    _MemoryAccessor.write(m, data);
        
                    // Update the memory display cell corresponding to this memory address
                    let memoryCell = document.getElementById(`memory-cell-${m}`);
                    if (memoryCell) {
                        memoryCell.textContent = data.toString(16).toUpperCase().padStart(2, '0');
                    }
        
                    w++;
                }
                this.memSegment0 = true;
            }
        
            // Segment 1
            if (_PCB.segment === 1) {
                this.clearSegment(_PCB.base, _PCB.limit);
                var w = 0;
                for (let m = _PCB.base; m < _PCB.limit && w < inputArray.length; m++) {
                    let data = parseInt(inputArray[w] ?? "00", 16);
                    console.log(`Writing to memory address: ${m}, Data: ${data}`);
                    _MemoryAccessor.write(m, data);
        
                    // Update the memory display cell corresponding to this memory address
                    let memoryCell = document.getElementById(`memory-cell-${m}`);
                    if (memoryCell) {
                        memoryCell.textContent = data.toString(16).toUpperCase().padStart(2, '0');
                    }
        
                    w++;
                }
                this.memSegment0 = true;
            }
        
            // Segment 2
            if (_PCB.segment === 3) {
                this.clearSegment(_PCB.base, _PCB.limit);
                var w = 0;
                for (let m = _PCB.base; m < _PCB.limit && w < inputArray.length; m++) {
                    let data = parseInt(inputArray[w] ?? "00", 16);
                    console.log(`Writing to memory address: ${m}, Data: ${data}`);
                    _MemoryAccessor.write(m, data);
        
                    // Update the memory display cell corresponding to this memory address
                    let memoryCell = document.getElementById(`memory-cell-${m}`);
                    if (memoryCell) {
                        memoryCell.textContent = data.toString(16).toUpperCase().padStart(2, '0');
                    }
        
                    w++;
                }
                this.memSegment0 = true;
            }
        
            // Debugging output
            console.log(`CUR BASE: ${_PCB.base}, CUR LIMIT: ${_PCB.limit}, SEGMENT: ${_PCB.segment}`);
            console.log("Segment allocator memory: ", _Memory.totalMemory);
        }
        

        public segmentAvailable(): any {
            let segmentNumber = -1;
            if (_PCBList.length < 3) {
                segmentNumber = _PCBList.length;
            }
            return segmentNumber;
        }
    }
}
