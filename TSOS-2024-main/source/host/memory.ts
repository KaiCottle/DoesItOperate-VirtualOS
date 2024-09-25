module TSOS {
    // Represents the memory of the host system
    export class Memory {
        totalMemory: number[];

        public memory: string[] = []

        //Only one needed for project 2
        public seg0base: number = 0;
        public seg0limit: number = 255;

        constructor(totalMemory_ = new Array(768)) {
            this.totalMemory = totalMemory_;
       }

        // Initializes the memory
        init() {
            for (let i = 0; i < 768; i++) {
                this.totalMemory[i] = 0;
            }
        }

        public hexLog(theNumber: number, theLength: number) {
            var pad = theNumber.toString(16).toUpperCase();
            while (pad.length < theLength) {
                pad = 0 + pad;
            }
        return pad;
        }
    }
}