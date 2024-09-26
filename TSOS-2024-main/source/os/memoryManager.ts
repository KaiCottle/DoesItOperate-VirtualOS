
module TSOS {

    export class MemoryManager {
        public memSegment0: any;
        public memSegment1: any;
        public memSegment2: any;
        constructor() {
        }


        public clearSegment(base: number, limit: number): void {
            for (let i = base; i < limit; i++) {
                _MemoryAccessor.write(i, 0x00);  // Clear the memory to 00
                let memoryCell = document.getElementById(`memory-cell-${i}`);
                if (memoryCell) {
                    memoryCell.textContent = "00";  // Reset the display to show memory is cleared
                }
            }
            console.log(`Cleared memory segment from ${base} to ${limit}`);
        }
        
        
        


        public allocateSegment(inputArray: string[]): void {
            // No clearing here, only writing the program to memory
            
            let w = 0;
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
        
            console.log(`Memory written to segment ${_PCB.segment} from base ${_PCB.base} to limit ${_PCB.limit}`);
        }
        
        
        
        
        public segmentAvailable(): number {
            if (!this.memSegment0) {
                return 0;
            } else if (!this.memSegment1) {
                return 1;
            } else if (!this.memSegment2) {
                return 2;
            } else {
                return -1;  // No available segments
            }
        }
    }
}
