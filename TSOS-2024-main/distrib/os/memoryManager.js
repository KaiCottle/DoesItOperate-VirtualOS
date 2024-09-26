var TSOS;
(function (TSOS) {
    class MemoryManager {
        memSegment0;
        memSegment1;
        memSegment2;
        constructor() {
        }
        clearSegment(base, limit) {
            for (let i = base; i < limit; i++) {
                _MemoryAccessor.write(i, 0x00); // Clear the memory to 00
                let memoryCell = document.getElementById(`memory-cell-${i}`);
                if (memoryCell) {
                    memoryCell.textContent = "00"; // Reset the display to show memory is cleared
                }
            }
            console.log(`Cleared memory segment from ${base} to ${limit}`);
        }
        allocateSegment(inputArray) {
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
        segmentAvailable() {
            if (!this.memSegment0) {
                return 0;
            }
            else if (!this.memSegment1) {
                return 1;
            }
            else if (!this.memSegment2) {
                return 2;
            }
            else {
                return -1; // No available segments
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map