module TSOS {
    export class Scheduler {
        public quantumCheck: number = 0;

        public scheduling(): void {
            let terminatedCount = 0;

            // Check terminated processes and clear the queue if all are terminated
            for (let i = 0; i < _PCBList.length; i++) {
                if (_PCBList[i].state === "Terminated") {
                    terminatedCount++;
                }
            }

            if (terminatedCount === _PCBList.length) {
                _ReadyQueue.clearQueue();
            }

            // Schedule processes if there are any in the ready queue
            if (_ReadyQueue.getSize() > 0) {
                _Kernel.krnTrace("Scheduling " + _ReadyQueue.getSize() + " with RR");

                if (this.quantumCheck < _PRQuantum) {
                    this.quantumCheck++;
                } else {
                    _Dispatcher.contextSwitch();
                    this.quantumCheck = 0;
                }
            } else {
                _CPU.isExecuting = false;
            }
        }
    }
}
