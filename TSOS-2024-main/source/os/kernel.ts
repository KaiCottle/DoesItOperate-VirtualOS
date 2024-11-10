/* ------------
   Kernel.ts

   Routines for the Operating System, NOT the host.

   This code references page numbers in the text book:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne. ISBN 978-0-470-12872-5
------------ */

module TSOS {
    export class Kernel {

        // OS Startup and Shutdown Routines
        public krnBootstrap(): void {
            Control.hostLog("bootstrap", "host");  // Log OS bootstrap

            // Initialize global queues and buffers
            _KernelInterruptQueue = new Queue();
            _KernelBuffers = new Array();
            _KernelInputQueue = new Queue();

            // Initialize console
            _Console = new Console();
            _Console.init();
            _ReadyQueue = new Queue();

            // Initialize memory segments
            _Segments = new Array();
            for (let i = 0; i < 3; i++) {
                let segment = new Segment();
                segment.SEG = i;
                segment.ACTIVE = false;
                _Segments[i] = segment;
            }

            // Set standard input and output
            _StdIn = _Console;
            _StdOut = _Console;

            // Initialize memory manager
            _MemoryManager = new MemoryManager();

            // Load the keyboard device driver
            this.krnTrace("Loading the keyboard device driver.");
            _krnKeyboardDriver = new DeviceDriverKeyboard();
            _krnKeyboardDriver.driverEntry();
            this.krnTrace(_krnKeyboardDriver.status);

            // Enable OS interrupts
            this.krnTrace("Enabling the interrupts.");
            this.krnEnableInterrupts();

            // Launch the shell
            this.krnTrace("Creating and Launching the shell.");
            _OsShell = new Shell();
            _OsShell.init();

            // Initiate student testing protocol if available
            if (_GLaDOS) {
                _GLaDOS.afterStartup();
            }
        }

        public krnShutdown(): void {
            this.krnTrace("begin shutdown OS");

            // Disable interrupts
            this.krnTrace("Disabling the interrupts.");
            this.krnDisableInterrupts();

            this.krnTrace("end shutdown OS");
        }

        public krnOnCPUClockPulse(): void {
            // Check for interrupts and process them if present
            if (_KernelInterruptQueue.getSize() > 0) {
                const interrupt = _KernelInterruptQueue.dequeue();
                this.krnInterruptHandler(interrupt.irq, interrupt.params);
            } else if (_CPU.isExecuting) {
                _CPU.cycle();
            } else {
                this.krnTrace("Idle");
            }
        }

        // Interrupt Handling
        public krnEnableInterrupts(): void {
            Devices.hostEnableKeyboardInterrupt();
        }

        public krnDisableInterrupts(): void {
            Devices.hostDisableKeyboardInterrupt();
        }

        public krnInterruptHandler(irq: number, params: any[]): void {
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

        public krnTimerISR(): void {
            // Placeholder for timer ISR logic, if needed
        }

        // OS Utility Routines
        public krnTrace(msg: string): void {
            if (_Trace) {
                if (msg === "Idle" && _OSclock % 10 === 0) {
                    Control.hostLog(msg, "OS");
                } else {
                    Control.hostLog(msg, "OS");
                }
            }
        }

        public krnTrapError(msg: string): void {
            Control.hostLog("OS ERROR - TRAP: " + msg);
            clearInterval(_hardwareClockID);
            this.krnShutdown();
        }
    }
}
