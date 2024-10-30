module TSOS {
    export class MemoryManager {
        public memSegment0: boolean = false;
        public memSegment1: boolean = false;
        public memSegment2: boolean = false;

        constructor() {
            // Initialize segment availability
            this.resetSegments();
        }

        // Resets segment availability
        private resetSegments(): void {
            this.memSegment0 = false;
            this.memSegment1 = false;
            this.memSegment2 = false;
        }

        // Clears a memory segment within the given base and limit
        public clearSegment(base: number, limit: number): void {
            for (let i = base; i < limit; i++) {
                _Memory.totalMemory[i] = 0x00;
                TSOS.Control.updateMemoryDisplay(i);
            }
            _MemoryAccessor.updateTables();
        }

        // Allocates a memory segment with the given input array
        public allocateSegment(inputArray: string[]){
            const segmentSize = 256;
            let segmentAllocated = false;

            if (inputArray.length >= _PCB.limit) return;

            // Clear and allocate the appropriate segment
            this.clearSegment(_PCB.base, _PCB.limit);
            for (let m = 0; m < segmentSize; m++) {
                _MemoryAccessor.write(m, parseInt(inputArray[m] ?? "00", 16));
            }

            // Set the appropriate segment flag
            switch (_PCB.segment) {
                case 0:
                    this.memSegment0 = true;
                    segmentAllocated = true;
                    break;
                case 1:
                    this.memSegment1 = true;
                    segmentAllocated = true;
                    break;
                case 2:
                    this.memSegment2 = true;
                    segmentAllocated = true;
                    break;
            }

            if (!segmentAllocated) {
                _StdOut.putText("Segment allocation failed.");
            }
        }

        // Determines if any segments are available and returns the segment number
        public segmentAvailable(): number {
            if (_PCBList.length < 3) {
                _Segments[_PCBList.length].ACTIVE = true;
                return _PCBList.length;
            }

            for (let i = 0; i < 3; i++) {
                if (!_Segments[i].ACTIVE) {
                    _Segments[i].ACTIVE = true;
                    return i;
                }
            }
            return -1; // No segments available
        }
    }
}
