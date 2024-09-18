module TSOS{
    export class Memory {
        public totalMemory: number[];
        public memoryArray: string[] = [];

        init(){
            for(let i = 0; i < 768; i++){
                this.totalMemory[i] = 0x00;
            }
        }
    }
}