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
        low;
        hi; //for little endian
        memAcc;
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
        connectMemoryAccessor(MemoryAccessor) {
            this.memAcc = MemoryAccessor;
        }
        cycle() {
            if (_CPU.isExecuting) {
                this.fetch();
                _MemoryAccessor.updateTables();
                _Cycle++;
                _PCB.waitRun++;
            }
        }
        fetch() {
            if (_PCB.state != "Terminated") {
                this.Ir = _MemoryAccessor.read(this.PC).toString(16).toUpperCase();
                this.decode();
            }
            _MemoryAccessor.updateTables();
        }
        decode() {
            _PCB.state = "Running";
            switch (this.Ir) {
                case "A9":
                    this.ldaA9();
                    break;
                case "AD":
                    this.ldaAd();
                    break;
                case "8D":
                    this.sta8d();
                    break;
                case "6D":
                    this.adc6d();
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
                case "EA":
                    this.nopEa();
                    break;
                case "0":
                    this.brk00();
                    break;
                case "EC":
                    this.cpxEc();
                    break;
                case "D0":
                    this.bneD0();
                    break;
                case "EE":
                    this.incEe();
                    break;
                case "FF":
                    this.sysFf();
                    break;
                default:
                    _PCB.state = "Terminated";
                    _Segments[_PCB.segment].ACTIVE = false;
                    _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
                    break;
            }
        }
        ldaA9() {
            this.PC++;
            this.Acc = _MemoryAccessor.read(this.PC);
            this.PC++;
        }
        ldaAd() {
            this.PC++;
            var hexinstert = _MemoryAccessor.read(this.littleEndian());
            this.Acc = hexinstert;
            this.PC += 2;
        }
        sta8d() {
            this.PC++;
            var accVal = this.Acc;
            _MemoryAccessor.write(this.littleEndian(), accVal);
            this.PC += 2;
        }
        adc6d() {
            this.PC++;
            var adder = _MemoryAccessor.read(this.littleEndian());
            this.Acc += adder;
            this.PC += 2;
        }
        ldxA2() {
            this.PC++;
            this.Xreg = _MemoryAccessor.read(this.PC);
            this.PC++;
        }
        ldxAe() {
            this.PC++;
            var hexinstert = _MemoryAccessor.read(this.littleEndian());
            this.Xreg = hexinstert;
            this.PC += 2;
        }
        ldyA0() {
            this.PC++;
            this.Yreg = _MemoryAccessor.read(this.PC);
            this.PC++;
        }
        ldyAc() {
            this.PC++;
            var hexinstert = _MemoryAccessor.read(this.littleEndian());
            this.Yreg = hexinstert;
            this.PC += 2;
        }
        nopEa() {
            this.PC++;
        }
        brk00() {
            _PCB.cycleEnd = _Cycle;
            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
            let turnaround = _PCB.cycleEnd - _PCB.cycleStart;
            let waittime = turnaround - _PCB.waitRun;
            _PCB.turnAround = turnaround;
            _PCB.waitTime = waittime;
            if (_ReadyQueue.getSize() <= 1) {
                for (let i = 0; i < _PCBList.length; i++) {
                    if (_PCBList[i].state === "Terminated") {
                        _StdOut.putText("PID: " + _PCBList[i].PID);
                        _StdOut.advanceLine();
                        _StdOut.putText("Turnaround Time: " + _PCBList[i].turnAround);
                        _StdOut.advanceLine();
                        _StdOut.putText("Wait Time: " + _PCBList[i].waitTime);
                        _StdOut.advanceLine();
                    }
                }
                _StdOut.advanceLine();
                _StdOut.putText(">");
                this.isExecuting = false;
                _CPU.init();
            }
        }
        cpxEc() {
            this.PC++;
            var compare = _MemoryAccessor.read(this.littleEndian());
            this.Zflag = this.Xreg == compare ? 1 : 0;
            this.PC += 2;
        }
        bneD0() {
            this.PC++;
            if (this.Zflag === 0) {
                this.PC += _MemoryAccessor.read(this.PC) + 1;
                if (this.PC > 255) {
                    this.PC -= 256;
                }
            }
            else {
                this.PC++;
            }
        }
        incEe() {
            this.PC++;
            let address = this.littleEndian();
            let value = _MemoryAccessor.read(address);
            _MemoryAccessor.write(address, value + 1);
            this.PC += 2;
        }
        sysFf() {
            this.PC++;
            if (this.Xreg == 1) {
                _StdOut.putText(this.Yreg.toString(16));
            }
            if (this.Xreg == 2) {
                let yregHolder = this.Yreg;
                while (_MemoryAccessor.read(yregHolder) != 0x0) {
                    _StdOut.putText(String.fromCharCode(_MemoryAccessor.read(yregHolder)));
                    yregHolder += 1;
                }
            }
        }
        killProg(pid) {
            this.isExecuting = false;
        }
        littleEndian() {
            let hexNum = _MemoryAccessor.read(this.PC);
            hexNum += 0x100 * _MemoryAccessor.read(this.PC + 1);
            return hexNum;
        }
        savePCB() {
            _PCB.PC = this.PC;
            _PCB.Acc = this.Acc;
            _PCB.IR = this.Ir;
            _PCB.Xreg = this.Xreg;
            _PCB.Yreg = this.Yreg;
            _PCB.Zflag = this.Zflag;
        }
        switch(newPCB) {
            this.savePCB();
            _PCB = newPCB;
            this.PC = newPCB.PC;
            this.Acc = newPCB.Acc;
            this.Ir = newPCB.IR;
            this.Xreg = newPCB.Xreg;
            this.Yreg = newPCB.Yreg;
            this.Zflag = newPCB.Zflag;
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map