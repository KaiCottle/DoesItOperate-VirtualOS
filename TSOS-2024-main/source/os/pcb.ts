module TSOS {

    export class pcb {
        static PC: number;
        static Acc: number;
        static IR: any;
        constructor(
            public PID: number = 0,
            public PC: number = 0,
            public IR: string = "",
            public Acc: number = 0,
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public priority: number = 0,
            public state: String = "",
            public location: string = "",
            public base: number = 0,
            public limit: number = 255,
            public segment: number = 0,
            public machineCode: Array<string> = [],
            public cycleStart: number = 0,
            public cycleEnd: number = 0,
            public waitRun: number = 0,
            public turnAround: number = 0,
            public waitTime: number = 0) {
        }

        public init(): void {
            this.PID = _PID;
            this.PC = 0;
            this.IR = "";
            this.Acc= 0;
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
}

