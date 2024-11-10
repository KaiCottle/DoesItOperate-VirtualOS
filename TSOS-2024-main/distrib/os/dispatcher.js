var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() { }
        contextSwitch(currentProcess) {
            if (_PCB.state != "Terminated") {
                _ReadyQueue.enqueue(_PCB);
                _PCB.state = "Ready";
            }
            _CPU.switch(currentProcess);
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map