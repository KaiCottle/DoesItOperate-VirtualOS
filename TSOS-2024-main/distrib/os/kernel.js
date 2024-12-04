/* ------------
   Kernel.ts

   Routines for the Operating System, NOT the host.

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne. ISBN 978-0-470-12872-5
------------ */
var TSOS;
(function (TSOS) {
    class Kernel {
        // OS Startup and Shutdown Routines
        krnBootstrap() {
            TSOS.Control.hostLog("bootstrap", "host");
            _KernelInterruptQueue = new TSOS.Queue();
            _KernelBuffers = new Array();
            _KernelInputQueue = new TSOS.Queue();
            _Console = new TSOS.Console();
            _Console.init();
            _ReadyQueue = new TSOS.Queue();
            _Disk = new TSOS.Disk();
            _DSDD = new TSOS.Dsdd();
            _MemoryManager = new TSOS.MemoryManager();
            _Segments = new Array();
            for (let i = 0; i < 3; i++) {
                let segment = new TSOS.Segment();
                segment.SEG = i;
                segment.ACTIVE = false;
                _Segments[i] = segment;
            }
            _StdIn = _Console;
            _StdOut = _Console;
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new TSOS.DeviceDriverKeyboard();
            _krnKeyboardDriver.driverEntry();
            this.krnTrace(_krnKeyboardDriver.status);
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new TSOS.Shell();
            _OsShell.init();
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }
        krnShutdown() {
            this.krnTrace("begin shutdown OS");
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();
            this.krnTrace("end shutdown OS");
        }
        krnOnCPUClockPulse() {
            if (_KernelInterruptQueue.getSize() > 0) {
                const interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            }
            else if (_CPU.isExecuting) {
                _CPU.cycle();
            }
            else {
                this.krnTrace("Idle");
            }
        }
        krnEnableInterrupts() {
            TSOS.Devices.hostEnableKeyboardInterrupt();
        }
        krnDisableInterrupts() {
            TSOS.Devices.hostDisableKeyboardInterrupt();
        }
        krnInterruptHandler(irq, params) {
            this.krnTrace("Handling IRQ~" + irq);
            switch (irq) {
                case TIMER_IRQ:
                    this.krnTimerISR();
                    break;
                case KEYBOARD_IRQ:
                    _krnKeyboardDriver.isr(params);
                    _StdIn.handleInput();
                    break;
                case CONTEXT_SWITCH_IRQ:
                    _Dispatcher.contextSwitch(params[0]);
                    break;
                default:
                    this.krnTrapError("Invalid Interrupt Request. irq=" + irq + " params=[" + params + "]");
            }
        }
        krnTimerISR() {
        }
        krnTrace(msg) {
            if (_Trace) {
                if (msg === "Idle" && _OSclock % 10 === 0) {
                    TSOS.Control.hostLog(msg, "OS");
                }
                else {
                    TSOS.Control.hostLog(msg, "OS");
                }
            }
        }
        krnTrapError(msg) {
            TSOS.Control.hostLog("OS ERROR - TRAP: " + msg);
            clearInterval(_hardwareClockID);
            this.krnShutdown();
        }
    }
    TSOS.Kernel = Kernel;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=kernel.js.map