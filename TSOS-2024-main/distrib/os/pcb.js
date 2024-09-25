var TSOS;
(function (TSOS) {
    class pcb {
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
        static PC;
        static Acc;
        static IR;
        constructor(PID = 0, PC = 0, IR = "", Acc = 0, Xreg = 0, Yreg = 0, Zflag = 0, priority = 0, state = "", location = "", base = 0, limit = 255, segment = 0, machineCode = [], cycleStart = 0, cycleEnd = 0, waitRun = 0, turnAround = 0, waitTime = 0) {
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
        init() {
            this.PID = _PID;
            this.PC = 0;
            this.IR = "";
            this.Acc = 0;
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.priority = 0;
            this.state = "";
            this.location = "Memory";
            this.base = 0;
            this.limit = 255;
            this.segment = 0;
            this.cycleStart = _Cycle;
            this.cycleEnd = 0;
            this.waitRun = 0;
            this.turnAround = 0;
            this.waitTime = 0;
            for (let i = 0; i < this.machineCode.length; i++) {
                this.machineCode[i] = "00";
            }
        }
    }
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map