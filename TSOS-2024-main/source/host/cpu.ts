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
                case "A9": this.ldaA9(); break;
                case "AD": this.ldaAd(); break;
                case "8D": this.sta8d(); break;
                case "6D": this.adc6d(); break;
                case "A2": this.ldxA2(); break;
                case "AE": this.ldxAe(); break;
                case "A0": this.ldyA0(); break;
                case "AC": this.ldyAc(); break;
                case "EA": this.nopEa(); break;
                case "0": this.brk00(); break;
                case "EC": this.cpxEc(); break;
                case "D0": this.bneD0(); break;
                case "EE": this.incEe(); break;
                case "FF": this.sysFf(); break;
                default:
                    _Kernel.krnTrace("Invalid instruction, terminating execution.");
                    _PCB.state = "Terminated";
                    break;
            }
        }

        // CPU Operations
        // Load Accumulator with a constant
        public ldaA9(): void {
            this.PC++;
            this.Acc = _MemoryAccessor.read(this.PC);
            this.PC++;
        }

        // Load Accumulator from memory
        public ldaAd(): void {
            this.PC++;
            this.Acc = _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }

        // Store Accumulator in memory
        public sta8d(): void {
            this.PC++;
            _MemoryAccessor.write(this.littleEndian(), this.Acc);
            this.PC += 2;
        }

        // Add with carry
        public adc6d(): void {
            this.PC++;
            this.Acc += _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }

        // Load X register with a constant
        public ldxA2(): void {
            this.PC++;
            this.Xreg = _MemoryAccessor.read(this.PC);
            this.PC++;
        }

        // Load X register from memory
        public ldxAe(): void {
            this.PC++;
            this.Xreg = _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }

        // Load Y register with a constant
        public ldyA0(): void {
            this.PC++;
            this.Yreg = _MemoryAccessor.read(this.PC);
            this.PC++;
        }

        // Load Y register from memory
        public ldyAc(): void {
            this.PC++;
            this.Yreg = _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }

        // No operation
        public nopEa(): void {
            this.PC++;
        }

        // Break (halt execution)
        public brk00(): void {
            this.isExecuting = false;
            _StdOut.advanceLine();
            _StdOut.putText(">");
            _CPU.init();
        }

        // Compare memory to X register, set Z flag if equal
        public cpxEc(): void {
            this.PC++;
            const compare = _MemoryAccessor.read(this.littleEndian());
            this.Zflag = this.Xreg === compare ? 1 : 0;
            this.PC += 2;
        }

        // Branch if Z flag is 0
        public bneD0(): void {
            this.PC++;
            if (this.Zflag === 0) {
                this.PC += _MemoryAccessor.read(this.PC) + 1;
                if (this.PC > 255) this.PC -= 256;
            } else {
                this.PC++;
            }
        }

        // Increment value in memory
        public incEe(): void {
            this.PC++;
            const address = this.littleEndian();
            const value = _MemoryAccessor.read(address);
            _MemoryAccessor.write(address, value + 1);
            this.PC += 2;
        }

        // System call (print integer or string based on X register)
        public sysFf(): void {
            this.PC++;
            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString(16));
            } else if (this.Xreg === 2) {
                let address = this.Yreg;
                while (_MemoryAccessor.read(address) !== 0x0) {
                    _StdOut.putText(String.fromCharCode(_MemoryAccessor.read(address)));
                    address++;
                }
            }
        }

        // Helper Methods
        public littleEndian(): number {
            let address = _MemoryAccessor.read(this.PC);
            address += 0x100 * _MemoryAccessor.read(this.PC + 1);
            return address;
        }

        public killProg(pid: number): void {
            this.isExecuting = false;
        }
    }
}
