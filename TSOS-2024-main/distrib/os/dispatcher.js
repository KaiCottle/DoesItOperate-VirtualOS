var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() { }
        contextSwitch(currentProcess) {
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
        rollIn(currentProcess) {
            currentProcess.location = "Memory";
            const fileName = `~${currentProcess.PID.toString()}`;
            _DSDD.fileDelete(fileName);
        }
        rollOut() {
            _PCB.location = "Disk";
            const fileName = `~${_PCB.PID.toString()}`;
            _DSDD.fileCreate(fileName);
            _DSDD.fileWrite(fileName, _PCB.machineCode);
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map