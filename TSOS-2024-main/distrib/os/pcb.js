var TSOS;
(function (TSOS) {
    // Thanks Copilot for the commenting :)
    // Somethin' Stupid -- Frank and Nancy Sinatra -> My song for Github Copilot
    class Pcb {
        PID;
        PC;
        IR;
        Acc;
        Xreg;
        Yreg;
        Zflag;
        priority;
        state;
        location;
        base;
        limit;
        segment;
        constructor(PID = 0, // Process ID
        PC = 0, // Program Counter
        IR = "", // Instruction Register
        Acc = "", // Accumulator
        Xreg = "", // X Register
        Yreg = "", // Y Register
        Zflag = 0, // Zero flag
        priority = 0, // Priority level
        state = "", // Process state (New, Running, Waiting, Terminated, etc.)
        location = "", // Location in memory (Memory, Disk, etc.)
        base = 0, limit = 255, segment = 0) {
            this.PID = PID;
            this.PC = PC;
            this.IR = IR;
            this.Acc = Acc;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.priority = priority;
            this.state = state;
            this.location = location;
            this.base = base;
            this.limit = limit;
            this.segment = segment;
        }
        // Initialize the PCB with default values
        init() {
            this.PID = _PID; // Set PID from global _PID variable
            this.PC = 0; // Reset Program Counter to 0
            this.IR = "00"; // Initialize IR to default instruction
            this.Acc = "00"; // Initialize Accumulator to 0
            this.Xreg = "00"; // Initialize X Register to 0
            this.Yreg = "00"; // Initialize Y Register to 0
            this.Zflag = 0; // Set Z flag to 0
            this.priority = 0; // Default priority is 0
            this.state = "New"; // Initial state is "New"
            this.location = "Memory"; // Default location is "Memory"
            this.base = 0;
            this.limit = 255;
            this.segment = 0;
        }
    }
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map