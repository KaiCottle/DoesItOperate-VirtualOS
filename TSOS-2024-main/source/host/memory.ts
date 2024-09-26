module TSOS {
    // Represents the memory of the host system
    export class Memory {

        segment0: any[];
        segment1: any[];
        segment2: any[];

        public memory: string[] = [];

        constructor(
            segment0_ = new Array(256),
            segment1_ = new Array(256),
            segment2_ = new Array(256)
        ) {
            this.segment0 = segment0_;
            this.segment1 = segment1_;
            this.segment2 = segment2_;
            this.init();
        }

        // Initialize memory segments to 0x00
        public init(): void {
            for (let i = 0; i < 256; i++) {
                this.segment0[i] = 0x00;
                this.segment1[i] = 0x00;
                this.segment2[i] = 0x00;
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
