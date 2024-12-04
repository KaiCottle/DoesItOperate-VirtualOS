module TSOS {
    export class Dispatcher {
        constructor() {}
        public contextSwitch(currentProcess: Pcb): void {
            if (_PCB.state !== "Terminated") {
                _ReadyQueue.enqueue(_PCB);
                _PCB.state = "Ready";
            }
            if (currentProcess.location === "Disk") {
                this.rollOut();
                this.rollIn(currentProcess);
            }
            _CPU.switch(currentProcess);
        }
        public rollIn(currentProcess: Pcb): void {
            currentProcess.location = "Memory";
            const fileName = `~${currentProcess.PID.toString()}`;
            _DSDD.fileDelete(fileName);
        }
        public rollOut(): void {
            _PCB.location = "Disk";
            const fileName = `~${_PCB.PID.toString()}`;
            _DSDD.fileCreate(fileName);
            _DSDD.fileWrite(fileName, _PCB.machineCode);
        }
    }
}
