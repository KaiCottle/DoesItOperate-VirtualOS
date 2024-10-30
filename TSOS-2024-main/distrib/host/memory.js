var TSOS;
(function (TSOS) {
    // Represents the memory of the host system
    class Memory {
        totalMemory;
        memory = [];
        seg0Base = 0;
        seg0Limit = 255;
        seg1Base = 256;
        seg1Limit = 511;
        seg2Base = 512;
        seg2Limit = 767;
        constructor(totalMemory_ = new Array(768)) {
            this.totalMemory = totalMemory_;
        }
        // Initialize memory segments to 0x00
        init() {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0x00;
            }
        }
        // Returns a hex string of a number, padded to a given length
        hexLog(theNumber, theLength) {
            let pad = theNumber.toString(16).toUpperCase();
            while (pad.length < theLength) {
                pad = '0' + pad;
            }
            return pad;
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map