var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        H0B;
        LOB;
        memory;
        constructor() {
        }
        init() { }
        // Read a value from the specified memory address
        read(address) {
            return _Memory.segment0[address];
        }
        // Write data to the specified memory address
        write(address, data) {
            _Memory.segment0[address] = data;
            TSOS.Control.updateMemoryDisplay(address);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map