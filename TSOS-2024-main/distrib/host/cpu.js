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
        hi;
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
        connectMemoryAccessor(memoryAccessor) {
            this.memAcc = memoryAccessor;
        }
        cycle() {
            if (!_CPU.isExecuting || !_PCB)
                return;
            _Scheduler.scheduling();
            this.fetch();
            _MemoryAccessor.updateTables();
            _Cycle++;
            _PCB.waitRun++;
            if (_PCB.state === "Terminated") {
                this.handleTermination();
            }
        }
        handleTermination() {
            if (_ReadyQueue.getSize() > 0) {
                _PCB = _ReadyQueue.dequeue();
                _PCB.state = "Executing";
                this.loadPCB(_PCB);
            }
            else {
                this.isExecuting = false;
                _CPU.init();
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
                    this.terminateProcess();
                    break;
            }
        }
        terminateProcess() {
            if (!_PCB)
                return;
            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
        }
        ldaA9() { this.PC++; this.Acc = _MemoryAccessor.read(this.PC); this.PC++; }
        ldaAd() { this.PC++; this.Acc = _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        sta8d() { this.PC++; _MemoryAccessor.write(this.littleEndian(), this.Acc); this.PC += 2; }
        adc6d() { this.PC++; this.Acc += _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        ldxA2() { this.PC++; this.Xreg = _MemoryAccessor.read(this.PC); this.PC++; }
        ldxAe() { this.PC++; this.Xreg = _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        ldyA0() { this.PC++; this.Yreg = _MemoryAccessor.read(this.PC); this.PC++; }
        ldyAc() { this.PC++; this.Yreg = _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        nopEa() { this.PC++; }
        brk00() {
            if (!_PCB)
                return;
            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
            _PCB.turnAround = _Cycle - _PCB.cycleStart;
            _PCB.waitTime = _PCB.turnAround - _PCB.waitRun;
            this.displayProcessStats();
            if (_ReadyQueue.getSize() > 0) {
                _PCB = _ReadyQueue.dequeue();
                _PCB.state = "Executing";
                this.loadPCB(_PCB);
            }
            else {
                this.isExecuting = false;
                _CPU.init();
            }
        }
        displayProcessStats() {
            _StdOut.putText("PID: " + _PCB.PID);
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time: " + _PCB.turnAround);
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time: " + _PCB.waitTime);
            _StdOut.advanceLine();
        }
        cpxEc() { this.PC++; this.Zflag = this.Xreg === _MemoryAccessor.read(this.littleEndian()) ? 1 : 0; this.PC += 2; }
        bneD0() { this.PC++; this.PC += this.Zflag === 0 ? _MemoryAccessor.read(this.PC) + 1 : 1; if (this.PC > 255)
            this.PC -= 256; }
        incEe() { this.PC++; _MemoryAccessor.write(this.littleEndian(), _MemoryAccessor.read(this.littleEndian()) + 1); this.PC += 2; }
        sysFf() {
            this.PC++;
            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString(16));
            }
            else if (this.Xreg === 2) {
                let yregHolder = this.Yreg;
                while (_MemoryAccessor.read(yregHolder) !== 0x0) {
                    _StdOut.putText(String.fromCharCode(_MemoryAccessor.read(yregHolder)));
                    yregHolder++;
                }
            }
        }
        killProg(pid) { this.isExecuting = false; }
        littleEndian() {
            return _MemoryAccessor.read(this.PC) + 0x100 * _MemoryAccessor.read(this.PC + 1);
        }
        savePCB() {
            if (_PCB) {
                _PCB.PC = this.PC;
                _PCB.Acc = this.Acc;
                _PCB.IR = this.Ir;
                _PCB.Xreg = this.Xreg;
                _PCB.Yreg = this.Yreg;
                _PCB.Zflag = this.Zflag;
            }
        }
        loadPCB(pcb) {
            if (pcb) {
                this.PC = pcb.PC;
                this.Acc = pcb.Acc;
                this.Ir = pcb.IR;
                this.Xreg = pcb.Xreg;
                this.Yreg = pcb.Yreg;
                this.Zflag = pcb.Zflag;
            }
        }
        switch(newPCB) {
            this.savePCB();
            _PCB = newPCB;
            this.loadPCB(_PCB);
        }
    }
    TSOS.Cpu = Cpu;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=cpu.js.map