
module TSOS {

    export class MemoryManager {
        segment0: any;
        segment1: any;
        segment2: any;

        constructor() {
            this.segment0 = [0, 255];
            this.segment1 = [256, 511];
            this.segment2 = [512, 767];
        }
        public writeMem(inputArray: string[]) {
            console.log("Input Array: "+ inputArray);
            for(let i = 0;i<inputArray.length;i++){
                _MemoryAccessor.write(i, parseInt(inputArray[i], 16))
            }
        }
        public clearMem() {
            for (let i = 0; i < this.segment0.length; i++) {
                this.segment0[i] = 0x00;
            }
        }
    }
}
