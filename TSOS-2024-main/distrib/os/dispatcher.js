var TSOS;
(function (TSOS) {
    class Dispatcher {
        constructor() { }
        contextSwitch() {
            let currentProcess = _ReadyQueue.dequeue();
            _CPU.switch(currentProcess);
            if (currentProcess.state != "Terminated") {
                _ReadyQueue.enqueue(currentProcess);
            }
        }
    }
    TSOS.Dispatcher = Dispatcher;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dispatcher.js.map