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
        constructor(PID = 0, PC = 0, IR = "", Acc = "", Xreg = "", Yreg = "", Zflag = 0, priority = 0, state = "", location = "") {
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
        }
        init() {
            this.PID = _PID;
            this.PC = 0;
            this.IR = "00";
            this.Acc = "00";
            this.Xreg = "00";
            this.Yreg = "00";
            this.Zflag = 0;
            this.priority = 0;
            this.state = "New";
            this.location = "Memory";
        }
    }
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map