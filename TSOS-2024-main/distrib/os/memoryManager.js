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
        writeMem(inputArray) {
            console.log("Input Array: " + inputArray);
            for (let i = 0; i < inputArray.length; i++) {
                _MemoryAccessor.write(i, parseInt(inputArray[i], 16));
            }
        }
        clearMem() {
            for (let i = 0; i < this.segment0.length; i++) {
                this.segment0[i] = 0x00;
            }
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map