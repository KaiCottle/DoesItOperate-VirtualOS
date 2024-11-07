module TSOS {
    export class Cpu {
        public low: number;
        public hi: number;
        public memAcc: MemoryAccessor;

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

        public connectMemoryAccessor(memoryAccessor: MemoryAccessor) {
            this.memAcc = memoryAccessor;
        }

        public cycle(): void {
            if (!_CPU.isExecuting || !_PCB) return;

            _Scheduler.scheduling();
            this.fetch();
            _MemoryAccessor.updateTables();
            _Cycle++;
            _PCB.waitRun++;

            if (_PCB.state === "Terminated") {
                this.handleTermination();
            }
        }

        private handleTermination(): void {
            if (_ReadyQueue.getSize() > 0) {
                _PCB = _ReadyQueue.dequeue();
                _PCB.state = "Executing";
                this.loadPCB(_PCB);
            } else {
                this.isExecuting = false;
                _CPU.init();
            }
        }

        public fetch(): void {
            if (!_PCB || _PCB.state === "Terminated") {
                _Dispatcher.contextSwitch();
                return;
            }

            this.Ir = _MemoryAccessor.read(this.PC).toString(16).toUpperCase();
            this.decode();
            _MemoryAccessor.updateTables();
        }

        public decode(): void {
            _PCB.state = "Running";
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
                    this.terminateProcess();
                    break;
            }
        }

        private terminateProcess(): void {
            if (!_PCB) return;

            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
        }

        public ldaA9() { this.PC++; this.Acc = _MemoryAccessor.read(this.PC); this.PC++; }
        public ldaAd() { this.PC++; this.Acc = _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        public sta8d() { this.PC++; _MemoryAccessor.write(this.littleEndian(), this.Acc); this.PC += 2; }
        public adc6d() { this.PC++; this.Acc += _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        public ldxA2() { this.PC++; this.Xreg = _MemoryAccessor.read(this.PC); this.PC++; }
        public ldxAe() { this.PC++; this.Xreg = _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        public ldyA0() { this.PC++; this.Yreg = _MemoryAccessor.read(this.PC); this.PC++; }
        public ldyAc() { this.PC++; this.Yreg = _MemoryAccessor.read(this.littleEndian()); this.PC += 2; }
        public nopEa() { this.PC++; }

        public brk00() {
            if (!_PCB) return;

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
            } else {
                this.isExecuting = false;
                _CPU.init();
            }
        }

        private displayProcessStats(): void {
            _StdOut.putText("PID: " + _PCB.PID);
            _StdOut.advanceLine();
            _StdOut.putText("Turnaround Time: " + _PCB.turnAround);
            _StdOut.advanceLine();
            _StdOut.putText("Wait Time: " + _PCB.waitTime);
            _StdOut.advanceLine();
        }

        public cpxEc() { this.PC++; this.Zflag = this.Xreg === _MemoryAccessor.read(this.littleEndian()) ? 1 : 0; this.PC += 2; }
        public bneD0() { this.PC++; this.PC += this.Zflag === 0 ? _MemoryAccessor.read(this.PC) + 1 : 1; if (this.PC > 255) this.PC -= 256; }
        public incEe() { this.PC++; _MemoryAccessor.write(this.littleEndian(), _MemoryAccessor.read(this.littleEndian()) + 1); this.PC += 2; }

        public sysFf() {
            this.PC++;
            if (this.Xreg === 1) {
                _StdOut.putText(this.Yreg.toString(16));
            } else if (this.Xreg === 2) {
                let yregHolder = this.Yreg;
                while (_MemoryAccessor.read(yregHolder) !== 0x0) {
                    _StdOut.putText(String.fromCharCode(_MemoryAccessor.read(yregHolder)));
                    yregHolder++;
                }
            }
        }

        public killProg(pid: number) { this.isExecuting = false; }

        public littleEndian(): number {
            return _MemoryAccessor.read(this.PC) + 0x100 * _MemoryAccessor.read(this.PC + 1);
        }

        public savePCB() {
            if (_PCB) {
                _PCB.PC = this.PC;
                _PCB.Acc = this.Acc;
                _PCB.IR = this.Ir;
                _PCB.Xreg = this.Xreg;
                _PCB.Yreg = this.Yreg;
                _PCB.Zflag = this.Zflag;
            }
        }

        public loadPCB(pcb: Pcb): void {
            if (pcb) {
                this.PC = pcb.PC;
                this.Acc = pcb.Acc;
                this.Ir = pcb.IR;
                this.Xreg = pcb.Xreg;
                this.Yreg = pcb.Yreg;
                this.Zflag = pcb.Zflag;
            }
        }

        public switch(newPCB: Pcb) {
            this.savePCB();
            _PCB = newPCB;
            this.loadPCB(_PCB);
        }
    }
}
