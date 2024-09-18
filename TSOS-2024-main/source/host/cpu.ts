/* ------------
     CPU.ts

     Routines for the host CPU simulation, NOT for the OS itself.
     In this manner, it's A LITTLE BIT like a hypervisor,
     in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
     that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
     TypeScript/JavaScript in both the host and client environments.

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

module TSOS {

    export class Cpu {

        constructor(public PC: number = 0,
            public Acc: number = 0,
            public Ir: string = "",
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public isExecuting: boolean = false,
            public currentPCB: TSOS.pcb = null)
             {

        }

        public init(): void {
            this.PC = 0;
            this.Acc = 0;
            this.Ir = "";
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;

        }

        public cycle(): void {
            _Kernel.krnTrace('CPU cycle');
            // TODO: Accumulate CPU usage and profiling statistics here.
            // Do the real work here. Be sure to set this.isExecuting appropriately.
        }

        public loadNewProcess(pcb: TSOS.pcb): void {
            if (pcb.processState !== "Terminated") {
                this.currentPCB = pcb;
                this.PC = this.currentPCB.programCounter;
                this.Acc = this.currentPCB.acc;
                this.Xreg = this.currentPCB.XRegister;
                this.Yreg = this.currentPCB.YRegister;
                this.Zflag = this.currentPCB.ZFlag;
                this.runNewProcess();
            }
        }

        public runNewProcess() {
            this.currentPCB.processState = "Executing";
            this.isExecuting = true;
        }

        public runProcess(pid: number): void {
            // first load the process info into the CPU's registers
            this.currentPCB = _MemoryManager.residentList[pid];
            // then run it
            this.currentPCB.processState = "Executing";
            this.isExecuting = true;
        }
    }
}
