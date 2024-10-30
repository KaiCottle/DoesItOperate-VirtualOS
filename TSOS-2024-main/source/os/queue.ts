/* ------------
   Queue.ts

   A simple Queue, which is really just a dressed-up JavaScript Array.
   See the JavaScript Array documentation at
   https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array
   Look at the push and shift methods, as they are the least obvious here.

   ------------ */

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
                retVal = this.q.pop(); // Removes the last item -> ChatGPT suggested this... my stack knowledge is rusty
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
            this.q.length = 0; //empty queue
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
