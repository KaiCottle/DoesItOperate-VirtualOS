module TSOS {
    export class MemoryAccessor {
        public H0B: number;
        public LOB: number;
        public memory: Memory;

        constructor() {
        }

        public init(): void {}

        // Read a value from the specified memory address
        public read(address: number): number {
            return _Memory.segment0[address];
        }

        // Write data to the specified memory address
        public write(address: number, data: number): void {
            _Memory.segment0[address] = data;
            TSOS.Control.updateMemoryDisplay(address);
        }
    }
}
