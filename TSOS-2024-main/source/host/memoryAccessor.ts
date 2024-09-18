module TSOS{
    export class MemoryAccessor {
        public memory: Memory;
        constructor(){
            _Kernel.krnTrace("Memory Accessor loaded");
        }
    }
}