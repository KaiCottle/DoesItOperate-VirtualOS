module TSOS {
    export class pcb {
            constructor(
                public PID: number = 0,
                public PC: number = 0,
                public IR: string = "",
                public Acc: string = "",
                public Xreg: string = "",
                public Yreg: string = "",
                public Zflag: number = 0,
                public priority: number = 0,
                public state: string = "",
                public location: string = "") {
            }
    
            public init(): void {
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
}

