var TSOS;
(function (TSOS) {
    class MemoryManager {
        segment0;
        segment1;
        segment2;
        constructor() {
            this.segment0 = [0, 255];
            this.segment1 = [256, 511];
            this.segment2 = [512, 767];
        }
        // Write memory using an input array of hexadecimal strings
        writeMem(inputArray) {
            for (let i = 0; i < inputArray.length; i++) {
                _MemoryAccessor.write(i, parseInt(inputArray[i], 16));
            }
        }
        // Clear the memory segment by setting each value to 0x00
        clearMem() {
            for (let i = 0; i < this.segment0.length; i++) {
                this.segment0[i] = 0x00;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map