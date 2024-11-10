var TSOS;
(function (TSOS) {
    //I used chat gpt for all these comments
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
        machineCode;
        cycleStart;
        cycleEnd;
        waitRun;
        turnAround;
        waitTime;
        constructor(PID = 0, // Process ID
        PC = 0, // Program Counter
        IR = "", // Instruction Register
        Acc = 0, // Accumulator
        Xreg = 0, // X Register
        Yreg = 0, // Y Register
        Zflag = 0, // Zero flag
        priority = 0, // Priority level
        state = "", // Process state
        location = "", // Location in memory
        base = 0, // Base memory address
        limit = 255, // Memory limit
        segment = 0, // Segment number
        machineCode = [], // Array of machine code
        cycleStart = 0, // Start cycle for process
        cycleEnd = 0, // End cycle for process
        waitRun = 0, // Wait/run time
        turnAround = 0, // Turnaround time
        waitTime = 0 // Wait time
        ) {
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
            this.machineCode = machineCode;
            this.cycleStart = cycleStart;
            this.cycleEnd = cycleEnd;
            this.waitRun = waitRun;
            this.turnAround = turnAround;
            this.waitTime = waitTime;
        }
        // Initialize the PCB with default values
        init() {
            this.PID = _PID; // Set PID from global _PID
            this.PC = 0; // Reset Program Counter
            this.IR = ""; // Default IR to 0
            this.Acc = 0; // Default Accumulator to 0
            this.Xreg = 0; // Default X Register to 0
            this.Yreg = 0; // Default Y Register to 0
            this.Zflag = 0; // Set Zero flag to 0
            this.priority = 0; // Default priority
            this.state = "New"; // Initial state
            this.location = "Memory"; // Default location
            this.base = 0; // Base memory address
            this.limit = 255; // Memory limit
            this.segment = 0; // Segment number
            this.cycleStart = _Cycle; // Set cycle start
            this.cycleEnd = 0; // Reset cycle end
            this.waitRun = 0; // Reset wait/run time
            this.turnAround = 0; // Reset turnaround time
            this.waitTime = 0; // Reset wait time
            // Initialize machine code to 0
            for (let i = 0; i < this.machineCode.length; i++) {
                this.machineCode[i] = "00";
            }
        }
        setBaseLimit() {
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
    TSOS.Pcb = Pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map