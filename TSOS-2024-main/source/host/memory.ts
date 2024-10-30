module TSOS {
    // Represents the memory of the host system
    export class Memory {

        totalMemory: number[];

        public memory: string[] = [];

        public seg0Base: number = 0;
        public seg0Limit: number = 255;
        public seg1Base: number = 256;
        public seg1Limit: number = 511;
        public seg2Base: number = 512;
        public seg2Limit: number = 767;

        constructor(totalMemory_ = new Array(768)) {
            this.totalMemory = totalMemory_;
       }

        // Initialize memory segments to 0x00
        public init(): void {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0x00;
            }
        }

        // Returns a hex string of a number, padded to a given length
        public hexLog(theNumber: number, theLength: number): string {
            let pad = theNumber.toString(16).toUpperCase();
            while (pad.length < theLength) {
                pad = '0' + pad;
            }
            return pad;
        }
    }
}
