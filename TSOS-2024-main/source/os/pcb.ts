module TSOS {
    // Thanks Copilot for the commenting :)
    // Somethin' Stupid -- Frank and Nancy Sinatra
    export class Pcb {
        constructor(
            public PID: number = 0,      // Process ID
            public PC: number = 0,       // Program Counter
            public IR: string = "",      // Instruction Register
            public Acc: string = "",     // Accumulator
            public Xreg: string = "",    // X Register
            public Yreg: string = "",    // Y Register
            public Zflag: number = 0,    // Zero flag
            public priority: number = 0, // Priority level
            public state: string = "",   // Process state (New, Running, Waiting, Terminated, etc.)
            public location: string = "" // Location in memory (Memory, Disk, etc.)
        ) {}

        // Initialize the PCB with default values
        public init(): void {
            this.PID = _PID;           // Set PID from global _PID variable
            this.PC = 0;               // Reset Program Counter to 0
            this.IR = "00";            // Initialize IR to default instruction
            this.Acc = "00";           // Initialize Accumulator to 0
            this.Xreg = "00";          // Initialize X Register to 0
            this.Yreg = "00";          // Initialize Y Register to 0
            this.Zflag = 0;            // Set Z flag to 0
            this.priority = 0;         // Default priority is 0
            this.state = "New";        // Initial state is "New"
            this.location = "Memory";  // Default location is "Memory"
        }
    }
}
