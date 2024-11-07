module TSOS {
    export class Dispatcher {
        
        constructor() {}

        public contextSwitch() {
            let currentProcess = _ReadyQueue.dequeue();
            _CPU.switch(currentProcess);

            if (currentProcess.state != "Terminated") {
                _ReadyQueue.enqueue(currentProcess);
            }
        }
    }
}
