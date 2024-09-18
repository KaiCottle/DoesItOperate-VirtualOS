module TSOS {

    export class MemoryManager {
        highOrderByte: number;
        lowOrderByte: number;

        constructor(highOrderByte = 0x00, lowOrderByte = 0x00) {
            this.highOrderByte = highOrderByte;
            this.lowOrderByte = lowOrderByte;
        }
    }
}