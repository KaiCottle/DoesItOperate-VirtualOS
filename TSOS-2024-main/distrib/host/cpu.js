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
                const currentAddress = this.PC;
                const fetchedCode = _MemoryAccessor.read(this.PC);
                if (fetchedCode === null) {
                    this.logError("Fetch Error: Invalid memory address or missing operand.");
                    this.terminateProcess();
                    return;
                }
                this.Ir = fetchedCode.toString(16).toUpperCase();
                this.decode();
            }
            _MemoryAccessor.updateTables();
        }
        decode() {
            _PCB.state = "Running";
            switch (this.Ir) {
                case "A9":
                    this.ldaA9();
                    break; // Load Accumulator with Constant
                case "AD":
                    this.checkOperandAvailability(this.ldaAd);
                    break; // Load Accumulator from Memory
                case "8D":
                    this.checkOperandAvailability(this.sta8d);
                    break; // Store Accumulator in Memory
                case "6D":
                    this.checkOperandAvailability(this.adc6d);
                    break; // Add with Carry
                case "A2":
                    this.ldxA2();
                    break; // Load X Register with Constant
                case "AE":
                    this.checkOperandAvailability(this.ldxAe);
                    break; // Load X Register from Memory
                case "A0":
                    this.ldyA0();
                    break; // Load Y Register with Constant
                case "AC":
                    this.checkOperandAvailability(this.ldyAc);
                    break; // Load Y Register from Memory
                case "EA":
                    this.nopEa();
                    break; // No Operation
                case "0":
                    this.brk00();
                    break; // Break (System Call)
                case "EC":
                    this.checkOperandAvailability(this.cpxEc);
                    break; // Compare X Register
                case "D0":
                    this.checkOperandAvailability(this.bneD0);
                    break; // Branch if Not Equal
                case "EE":
                    this.checkOperandAvailability(this.incEe);
                    break; // Increment Value in Memory
                case "FF":
                    this.sysFf();
                    break; // System Call
                default:
                    this.logError(`Invalid Opcode: ${this.Ir} at address ${this.PC}`);
                    this.terminateProcess();
                    break;
            }
        }
        logError(message) {
            _StdOut.putText(`Error: ${message}`);
            _StdOut.advanceLine();
        }
        checkOperandAvailability(operation) {
            if (this.PC + 1 >= _MemoryAccessor.getMemorySize()) {
                this.logError("Missing Operand: Required operand is outside memory bounds.");
                this.terminateProcess();
            }
            else {
                operation.call(this);
            }
        }
        terminateProcess() {
            if (!_PCB)
                return;
            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
            _StdOut.putText(`Process terminated due to an error.`);
            _StdOut.advanceLine();
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