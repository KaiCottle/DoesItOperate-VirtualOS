/*
 * The Scheduler class manages the CPU scheduling in a Round Robin fashion.
 * It determines which process should be executed next, based on the state of the process queue
 * and the configured time quantum (_PRQuantum). The scheduler also handles context switching
 * when the quantum limit is reached, and ensures terminated processes are removed from the queue.
 */
var TSOS;
(function (TSOS) {
    class Scheduler {
        // Tracks the number of cycles the current process has been executing
        quantumCheck = 0;
        constructor() { }
        // Main scheduling method to determine and switch the active process
        scheduling() {
            let terminatedCount = 0;
            // Count terminated processes in the PCB list
            for (const pcb of _PCBList) {
                if (pcb.state === "Terminated") {
                    terminatedCount++;
                }
            }
            // Clear the ready queue if all processes have been terminated
            if (terminatedCount === _PCBList.length) {
                _ReadyQueue.clearQueue();
            }
            // Proceed with scheduling if there are active processes in the ready queue
            if (_ReadyQueue.getSize() > 0) {
                _Kernel.krnTrace(`Scheduling ${_ReadyQueue.getSize()} processes with Round Robin`);
                // Increment the quantum check counter until it reaches the process quantum limit
                if (this.quantumCheck < _PRQuantum) {
                    this.quantumCheck++;
                }
                else {
                    // Enqueue a context switch interrupt if the quantum limit is reached
                    _KernelInterruptQueue.enqueue(new TSOS.Interrupt(CONTEXT_SWITCH_IRQ, [_ReadyQueue.dequeue()]));
                    this.quantumCheck = 0; // Reset the quantum counter for the next process
                }
            }
        }
    }
    TSOS.Scheduler = Scheduler;
    // I used chatgpt for the comments and summary... wanted to test it out
})(TSOS || (TSOS = {}));
//# sourceMappingURL=scheduler.js.map