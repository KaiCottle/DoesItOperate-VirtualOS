var TSOS;
(function (TSOS) {
    class Memory {
        totalMemory;
        memoryArray = [];
        init() {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0x00;
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map