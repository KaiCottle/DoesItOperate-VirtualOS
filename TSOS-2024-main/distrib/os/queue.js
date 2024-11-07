var TSOS;
(function (TSOS) {
    class Queue {
        q;
        constructor(q = new Array()) {
            this.q = q;
        }
        getSize() {
            return this.q.length;
        }
        isEmpty() {
            return (this.q.length == 0);
        }
        enqueue(element) {
            this.q.push(element);
        }
        dequeue() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.shift();
            }
            return retVal;
        }
        removeLast() {
            var retVal = null;
            if (this.q.length > 0) {
                retVal = this.q.pop();
            }
            return retVal;
        }
        toString() {
            var retVal = "";
            for (var i in this.q) {
                retVal += "[" + this.q[i] + "] ";
            }
            return retVal;
        }
        clearQueue() {
            this.q.length = 0;
        }
        removeQueue(pidRemove) {
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
    TSOS.Queue = Queue;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=queue.js.map