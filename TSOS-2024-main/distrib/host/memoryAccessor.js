var TSOS;
(function (TSOS) {
    class MemoryAccessor {
        H0B;
        LOB;
        memory;
        constructor() {
        }
        init() { }
        read(address) {
            return _Memory.segment0[address];
        }
        write(address, data) {
            _Memory.segment0[address] = data;
            TSOS.Control.updateMemoryDisplay(address);
        }
    }
    TSOS.MemoryAccessor = MemoryAccessor;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=memoryAccessor.js.map