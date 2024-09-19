var TSOS;
(function (TSOS) {
    // Represents the memory of the host system
    class Memory {
        totalMemory;
        constructor(length) {
            this.totalMemory = new Array(length);
        }
        // Initializes the memory with 0x00
        init() {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0x00;
            }
        }
        // Retrieves a byte from the specified address
        getByte(address) {
            return this.totalMemory[address];
        }
        // Sets a byte at the specified address with the provided data
        setByte(address, data) {
            if (data.length == 1) {
                data = 0 + data;
            }
            this.totalMemory[address] = data;
        }
        // Returns the size of the memory
        getSize() {
            return this.totalMemory.length;
        }
        clearMemory() {
            for (var i = 0; i < this.totalMemory.length; i++) {
                this.totalMemory[i] = 0x00;
            }
        }
        // Clears from base to limit
        clearRange(base, limit) {
            for (var i = 0; i < (limit - base); i++) {
                this.totalMemory[i + base] = 0x00;
            }
        }
    }
    TSOS.Memory = Memory;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memory.js.map