/* ------------
   CPU.ts

   Routines for the host CPU simulation, NOT for the OS itself.
   In this manner, it's A LITTLE BIT like a hypervisor,
   in that the Document environment inside a browser is the "bare metal" (so to speak) for which we write code
   that hosts our client OS. But that analogy only goes so far, and the lines are blurred, because we are using
   TypeScript/JavaScript in both the host and client environments.

   This code references page numbers in the textbook:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne. ISBN 978-0-470-12872-5
------------ */

module TSOS {
    export class Cpu {
        public HOB: number;
        public LOB: number;
        public memoryAccessor: MemoryAccessor;

        constructor(
            public PC: number = 0,
            public Acc: number = 0,
            public Ir: string = "",
            public Xreg: number = 0,
            public Yreg: number = 0,
            public Zflag: number = 0,
            public isExecuting: boolean = false
        ) {}

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
            _Kernel.krnTrace("CPU cycle");

            if (_CPU.isExecuting) {
                this.fetch();
                Control.processTableUpdate();
                Control.cpuTableUpdate();
            }
        }

        public connectMemoryAccessor(MemoryAccessor: MemoryAccessor) {
            this.memoryAccessor = MemoryAccessor;
        }

        public fetch(): void {
            this.Ir = _MemoryAccessor.read(this.PC).toString(16).toUpperCase();
            this.decode();
            Control.processTableUpdate();
            Control.cpuTableUpdate();
        }

        public decode(): void {
            switch (this.Ir) {
                case "8D": this.sta8d(); break;
                case "6D": this.adc6d(); break;
                case "A9": this.ldaA9(); break;
                case "AD": this.ldaAd(); break;
                case "A2": this.ldxA2(); break;
                case "AE": this.ldxAe(); break;
                case "A0": this.ldyA0(); break;
                case "AC": this.ldyAc(); break;
                case "D0": this.bneD0(); break;
                case "EA": this.nopEa(); break;
                case "EE": this.incEe(); break;
                case "EC": this.cpxEc(); break;
                case "FF": this.sysFf(); break;
                case "0": this.brk00(); break;
                default:
                    _Kernel.krnTrace("Invalid, Terminating.");
                    _PCB.state = "Terminated";
                    break;
            }
        }
        // CPU Operations
        // Load Accumulator with a constant
    }
}
