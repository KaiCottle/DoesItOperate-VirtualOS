module TSOS {
    // Represents the memory of the host system
    export class Memory {
        public totalMemory;

        constructor(length: number) {
            this.totalMemory = new Array(length);
        }

        // Initializes the memory with 0x00
        init() {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0x00;
            }
        }

        // Retrieves a byte from the specified address
        public getByte(address: number) {
            return this.totalMemory[address];
        }

        // Sets a byte at the specified address with the provided data
        public setByte(address: number, data: string) {
            if (data.length == 1) {
                data = 0 + data;
            }
            this.totalMemory[address] = data;
        }

        // Returns the size of the memory
        public getSize() {
            return this.totalMemory.length;
        }

        public clearMemory() {
            for (var i = 0; i < this.totalMemory.length; i++) {
                this.totalMemory[i] = 0x00;
            }
        }

        // Clears from base to limit
        public clearRange(base: number, limit: number): void {
            for (var i = 0; i < (limit - base); i++) {
                this.totalMemory[i + base] = 0x00;
            }
        }
    }
}