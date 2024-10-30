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
var TSOS;
(function (TSOS) {
    class Cpu {
        PC;
        Acc;
        Ir;
        Xreg;
        Yreg;
        Zflag;
        isExecuting;
        HOB;
        LOB;
        memoryAccessor;
        constructor(PC = 0, Acc = 0, Ir = "", Xreg = 0, Yreg = 0, Zflag = 0, isExecuting = false) {
            this.PC = PC;
            this.Acc = Acc;
            this.Ir = Ir;
            this.Xreg = Xreg;
            this.Yreg = Yreg;
            this.Zflag = Zflag;
            this.isExecuting = isExecuting;
        }
        init() {
            this.PC = 0;
            this.Acc = 0;
            this.Ir = "";
            this.Xreg = 0;
            this.Yreg = 0;
            this.Zflag = 0;
            this.isExecuting = false;
        }
        cycle() {
            _Kernel.krnTrace("CPU cycle");
            if (_CPU.isExecuting) {
                this.fetch();
                TSOS.Control.processTableUpdate();
                TSOS.Control.cpuTableUpdate();
            }
        }
        connectMemoryAccessor(MemoryAccessor) {
            this.memoryAccessor = MemoryAccessor;
        }
        fetch() {
            this.Ir = _MemoryAccessor.read(this.PC).toString(16).toUpperCase();
            this.decode();
            TSOS.Control.processTableUpdate();
            TSOS.Control.cpuTableUpdate();
        }
        decode() {
            switch (this.Ir) {
                case "8D":
                    this.sta8d();
                    break;
                case "6D":
                    this.adc6d();
                    break;
                case "A9":
                    this.ldaA9();
                    break;
                case "AD":
                    this.ldaAd();
                    break;
                case "A2":
                    this.ldxA2();
                    break;
                case "AE":
                    this.ldxAe();
                    break;
                case "A0":
                    this.ldyA0();
                    break;
                case "AC":
                    this.ldyAc();
                    break;
                case "D0":
                    this.bneD0();
                    break;
                case "EA":
                    this.nopEa();
                    break;
                case "EE":
                    this.incEe();
                    break;
                case "EC":
                    this.cpxEc();
                    break;
                case "FF":
                    this.sysFf();
                    break;
                case "0":
                    this.brk00();
                    break;
                default:
                    _Kernel.krnTrace("Invalid, Terminating.");
                    _PCB.state = "Terminated";
                    break;
            }
        }
        // CPU Operations
        // Load Accumulator with a constant
        ldaA9() {
            this.PC++;
            this.Acc = _MemoryAccessor.read(this.PC);
            this.PC++;
        }
        // Load Accumulator from memory
        ldaAd() {
            this.PC++;
            this.Acc = _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }
        // Store Accumulator in memory
        sta8d() {
            this.PC++;
            _MemoryAccessor.write(this.littleEndian(), this.Acc);
            this.PC += 2;
        }
        // Add with carry
        adc6d() {
            this.PC++;
            this.Acc += _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }
        // Load X register with a constant
        ldxA2() {
            this.PC++;
            this.Xreg = _MemoryAccessor.read(this.PC);
            this.PC++;
        }
        // Load X register from memory
        ldxAe() {
            this.PC++;
            this.Xreg = _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }
        // Load Y register with a constant
        ldyA0() {
            this.PC++;
            this.Yreg = _MemoryAccessor.read(this.PC);
            this.PC++;
        }
        // Load Y register from memory
        ldyAc() {
            this.PC++;
            this.Yreg = _MemoryAccessor.read(this.littleEndian());
            this.PC += 2;
        }
        // No operation
        nopEa() {
            this.PC++;
        }
        // Break (halt execution)
        brk00() {
            this.isExecuting = false;
            _StdOut.advanceLine();
            _StdOut.putText(">");
            _CPU.init();
            _PCB.state = "Terminated";
        }
        // Compare memory to X register, set Z flag if equal
        cpxEc() {
            this.PC++;
            const compare = _MemoryAccessor.read(this.littleEndian());
            this.Zflag = this.Xreg === compare ? 1 : 0;
            this.PC += 2;
        }
        // Branch if Z flag is 0
        bneD0() {
            this.PC++;
            if (this.Zflag === 0) {
                this.PC += _MemoryAccessor.read(this.PC) + 1;
                if (this.PC > 255)
                    this.PC -= 256;
            }
            else {
                this.PC++;
            }
        }
        // Increment value in memory
        incEe() {
            this.PC++;
            const address = this.littleEndian();
            const value = _MemoryAccessor.read(address);
            _MemoryAccessor.write(address, value + 1);
            this.PC += 2;
        }
        // System call (print integer or string based on X register)
        sysFf() {
            this.PC++;
            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString(16));
            }
            else if (this.Xreg === 2) {
                let address = this.Yreg;
                while (_MemoryAccessor.read(address) !== 0x0) {
                    _StdOut.putText(String.fromCharCode(_MemoryAccessor.read(address)));
                    address++;
                }
            }
        }
        littleEndian() {
            let address = _MemoryAccessor.read(this.PC);
            address += 0x100 * _MemoryAccessor.read(this.PC + 1);
            return address;
        }
        killProg(pid) {
            this.isExecuting = false;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map