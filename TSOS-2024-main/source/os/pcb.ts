module TSOS {
    //I used chat gpt for all these comments
    export class Pcb {
        constructor(
            public PID: number = 0,             // Process ID
            public PC: number = 0,              // Program Counter
            public IR: string = "",              // Instruction Register
            public Acc: number = 0,             // Accumulator
            public Xreg: number = 0,            // X Register
            public Yreg: number = 0,            // Y Register
            public Zflag: number = 0,           // Zero flag
            public priority: number = 0,        // Priority level
            public state: string = "",          // Process state
            public location: string = "",       // Location in memory
            public base: number = 0,            // Base memory address
            public limit: number = 255,         // Memory limit
            public segment: number = 0,         // Segment number
            public machineCode: Array<string> = [], // Array of machine code
            public cycleStart: number = 0,      // Start cycle for process
            public cycleEnd: number = 0,        // End cycle for process
            public waitRun: number = 0,         // Wait/run time
            public turnAround: number = 0,      // Turnaround time
            public waitTime: number = 0         // Wait time
        ) {}

        // Initialize the PCB with default values
        public init(): void {
            this.PID = _PID;                // Set PID from global _PID
            this.PC = 0;                    // Reset Program Counter
            this.IR = "";                    // Default IR to 0
            this.Acc = 0;                   // Default Accumulator to 0
            this.Xreg = 0;                  // Default X Register to 0
            this.Yreg = 0;                  // Default Y Register to 0
            this.Zflag = 0;                 // Set Zero flag to 0
            this.priority = 0;              // Default priority
            this.state = "New";             // Initial state
            this.location = "Memory";       // Default location
            this.base = 0;                  // Base memory address
            this.limit = 255;               // Memory limit
            this.segment = 0;               // Segment number
            this.cycleStart = _Cycle;       // Set cycle start
            this.cycleEnd = 0;              // Reset cycle end
            this.waitRun = 0;               // Reset wait/run time
            this.turnAround = 0;            // Reset turnaround time
            this.waitTime = 0;              // Reset wait time

            // Initialize machine code to 0
            for (let i = 0; i < this.machineCode.length; i++) {
                this.machineCode[i] = "00";
            }
        }

        public setBaseLimit() {
            if (_PCB.segment == 0) {
                _PCB.base = 0;
                _PCB.limit = 255;
            }
            if (_PCB.segment == 1) {
                _PCB.base = 256;
                _PCB.limit = 511;
            }
            if (_PCB.segment == 2) {
                _PCB.base = 512;
                _PCB.limit = 767;
            }
        }
    }
}
