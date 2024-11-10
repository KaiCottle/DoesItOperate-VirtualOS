var TSOS;
(function (TSOS) {
    class Scheduler {
        quantumCheck = 0;
        constructor() {
        }
        scheduling() {
            let terminatedCount = 0;
            for (const pcb of _PCBList) {
                if (pcb.state === "Terminated") {
                    terminatedCount++;
                }
            }
            // Clear the queue if all processes are terminated
            if (terminatedCount === _PCBList.length) {
                _ReadyQueue.clearQueue();
            }
            // Schedule process if there are processes in the ready queue
            if (_ReadyQueue.getSize() > 0) {
                _Kernel.krnTrace(`Scheduling ${_ReadyQueue.getSize()} processes with Round Robin`);
                if (this.quantumCheck < _PRQuantum) {
                    this.quantumCheck++;
                }
                else {
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_ReadyQueue.dequeue()]));
                    this.quantumCheck = 0;
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map