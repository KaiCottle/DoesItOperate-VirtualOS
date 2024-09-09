/* ----------------------------------
   DeviceDriverKeyboard.ts

   The Kernel Keyboard Device Driver.
   ---------------------------------- */

   module TSOS {

    // Extends DeviceDriver
    export class DeviceDriverKeyboard extends DeviceDriver {

        constructor() {
            // Override the base method pointers.
            // The code below cannot run because "this" can only be
            // accessed after calling super.
            // super(this.krnKbdDriverEntry, this.krnKbdDispatchKeyPress);
            // So instead...
            super();
            this.driverEntry = this.krnKbdDriverEntry;
            this.isr = this.krnKbdDispatchKeyPress;
        }

        public krnKbdDriverEntry() {
            // Initialization routine for this, the kernel-mode Keyboard Device Driver.
            this.status = "loaded";
        }

        public krnKbdDispatchKeyPress(params) {
            // Parse the params.
            var keyCode = params[0];
            var isShifted = params[1];
            var isCtrled = params[2]; // Seems like a good thing to have
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);

            var chr = "";

            // Check to see if we even want to deal with the key that was pressed.
            if ((keyCode >= 65) && (keyCode <= 90)) { // letter
                chr = isShifted ? String.fromCharCode(keyCode) : String.fromCharCode(keyCode + 32); // Uppercase A-Z or Lowercase a-z
                _KernelInputQueue.enqueue(chr);
            } 
            // number key special Characters & backspace / tab call
            else if ((keyCode >= 48 && keyCode <= 57) || keyCode == 13) { // digits or enter
                chr = String.fromCharCode(keyCode);
                if (isShifted) {
                    switch (keyCode) {
                        case 48: chr = ")"; break;
                        case 49: chr = "!"; break;
                        case 50: chr = "@"; break;
                        case 51: chr = "#"; break;
                        case 52: chr = "$"; break;
                        case 53: chr = "%"; break;
                        case 54: chr = "^"; break;
                        case 55: chr = "&"; break;
                        case 56: chr = "*"; break;
                        case 57: chr = "("; break;
                    }
                }
                _KernelInputQueue.enqueue(chr);
            } 
            // backspace, tab, space, up arrow, down arrow
            else if ([8, 9, 32, 38, 40].indexOf(keyCode) !== -1) {
                switch (keyCode) {
                    case 8: _KernelInputQueue.enqueue(String.fromCharCode(8)); break; // backspace
                    case 9: _KernelInputQueue.enqueue(String.fromCharCode(9)); break; // tab
                    case 32: _KernelInputQueue.enqueue(" "); break; // space
                    case 38: _KernelInputQueue.enqueue(String.fromCharCode(0x2191)); break; // up arrow
                    case 40: _KernelInputQueue.enqueue(String.fromCharCode(0x2193)); break; // down arrow
                }
            } 
            // other special characters
            else {
                switch (keyCode) {
                    case 186: _KernelInputQueue.enqueue(isShifted ? ":" : ";"); break;
                    case 187: _KernelInputQueue.enqueue(isShifted ? "+" : "="); break;
                    case 188: _KernelInputQueue.enqueue(isShifted ? "<" : ","); break;
                    case 189: _KernelInputQueue.enqueue(isShifted ? "_" : "-"); break;
                    case 190: _KernelInputQueue.enqueue(isShifted ? ">" : "."); break;
                    case 191: _KernelInputQueue.enqueue(isShifted ? "?" : "/"); break;
                    case 192: _KernelInputQueue.enqueue(isShifted ? "~" : "`"); break;
                    case 219: _KernelInputQueue.enqueue(isShifted ? "{" : "["); break;
                    case 220: _KernelInputQueue.enqueue(isShifted ? "|" : "\\"); break;
                    case 221: _KernelInputQueue.enqueue(isShifted ? "}" : "]"); break;
                    case 222: _KernelInputQueue.enqueue(isShifted ? "\"" : "'"); break;
                }
            }
        }
    }
}
