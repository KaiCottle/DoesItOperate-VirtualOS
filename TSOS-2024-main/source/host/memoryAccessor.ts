module TSOS {
    export class MemoryAccessor {
        public H0B: number;
        public LOB: number;

        public memory: Memory;

        constructor() {
        }

        init(){}

        public read(address: number): number {
            return _Memory.segment0[address];
        }
        public write(address: number, data: number) {
            _Memory.segment0[address] = data;
            TSOS.Control.updateMemoryDisplay(address);
        }
    }
}