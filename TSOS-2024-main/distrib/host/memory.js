var TSOS;
(function (TSOS) {
    // Represents the memory of the host system
    class Memory {
        totalMemory;
        memory = [];
        //Only one needed for project 2
        seg0base = 0;
        seg0limit = 255;
        constructor(totalMemory_ = new Array(768)) {
            this.totalMemory = totalMemory_;
        }
        // Initializes the memory with 0x00
        init() {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0;
            }
        }
        hexLog(theNumber, theLength) {
            var pad = theNumber.toString(16).toUpperCase();
            while (pad.length < theLength) {
                pad = 0 + pad;
            }
            return pad;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map