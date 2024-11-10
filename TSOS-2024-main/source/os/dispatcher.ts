module TSOS {
    export class Dispatcher {
        
        constructor() {}

        public contextSwitch(currentProcess: Pcb) {

                if (_PCB.state != "Terminated") {
                _ReadyQueue.enqueue(_PCB);
                _PCB.state = "Ready";
            }
            _CPU.switch(currentProcess);

        }
        
    }
}
