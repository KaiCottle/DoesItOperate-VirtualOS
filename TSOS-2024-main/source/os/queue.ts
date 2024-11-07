module TSOS {
    export class Queue {
        constructor(public q = new Array()) {
        }

        public getSize() {
            return this.q.length;
        }

        public isEmpty(){
            return (this.q.length == 0);
        }

        public enqueue(element) {
            this.q.push(element);
        }

        public dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }

        public removeLast() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.pop();
            }
            return retVal;
        }

        public toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }

        public clearQueue() {
            this.q.length = 0;
        }

        public removeQueue(pidRemove) : void {
            var tempQueue = new Queue();
            var tempItem;

            for (let i = 0; i < _ReadyQueue.getSize(); i++) {
                tempItem = _ReadyQueue.dequeue;
                if (tempItem.pid == pidRemove) {
                    _Kernel.krnTrace("Process removed by queue class");
                }
                else {
                    tempQueue.enqueue(tempItem);
                }
            }
            _ReadyQueue = tempQueue; 
        }
    }
}
