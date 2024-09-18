var TSOS;
(function (TSOS) {
    class MemoryManager {
        highOrderByte;
        lowOrderByte;
        constructor(highOrderByte = 0x00, lowOrderByte = 0x00) {
            this.highOrderByte = highOrderByte;
            this.lowOrderByte = lowOrderByte;
        }
    }
    TSOS.MemoryManager = MemoryManager;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryManager.js.map