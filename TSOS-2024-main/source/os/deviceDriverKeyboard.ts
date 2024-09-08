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
            var isCtrled = params[2]; //Seems like a good thing to have
            _Kernel.krnTrace("Key code:" + keyCode + " shifted:" + isShifted);
            var chr = "";
            // Check to see if we even want to deal with the key that was pressed.
            if (((keyCode >= 65) && (keyCode <= 90))) { // letter
                if (isShifted === true) { 
                    chr = String.fromCharCode(keyCode); // Uppercase A-Z
                } else {
                    chr = String.fromCharCode(keyCode + 32); // Lowercase a-z
                }
                _KernelInputQueue.enqueue(chr);
            } 
            // number key special Characters & backspace / tab call
            else if (((keyCode >= 48) && (keyCode <= 57))   ||   // digits
                        (keyCode == 13)){                        // enter
                            chr = String.fromCharCode(keyCode);
                            if (isShifted){
                                switch(keyCode){
                                    case 48:
                                        chr = ")";
                                        break;
                                    case 49:
                                        chr = "!";
                                        break;
                                    case 50:
                                        chr = "@";
                                        break;
                                    case 51:
                                        chr = "#";
                                        break;
                                    case 52:
                                        chr = "$";
                                        break;
                                    case 53:
                                        chr = "%";
                                        break;
                                    case 54:
                                        chr = "^";
                                        break;
                                    case 55:
                                        chr = "&";
                                        break; 
                                    case 56:
                                        chr = "*";
                                        break; 
                                    case 57:
                                        chr = "(";
                                        break;
                                }
                            }
                            _KernelInputQueue.enqueue(chr);
                        }
            else if ((keyCode == 8)      || // backspace
                    (keyCode == 9)       || // tab
                    (keyCode == 32)      || // space
                    (keyCode == 38)      || // up arrow
                    (keyCode == 40)){       // down arrow
                switch(keyCode){
                    case 8: { // backspace
                        _KernelInputQueue.enqueue(String.fromCharCode(8));
                        break;
                    }
                    case 9: { // Tab
                        _KernelInputQueue.enqueue(String.fromCharCode(9));
                        break;
                    }
                    case 32: { // space
                        _KernelInputQueue.enqueue(" ");
                        break;
                    }
                    case 38: { // up arrow
                        _KernelInputQueue.enqueue(String.fromCharCode(38));
                        break;
                    }
                    case 40: { // down arrow
                        _KernelInputQueue.enqueue(String.fromCharCode(40));
                        break;
                    }   
                }
            }
            else{
                switch(keyCode){
                    case 186: {
                        if(isShifted){
                            _KernelInputQueue.enqueue(":")
                        }
                        else{
                            _KernelInputQueue.enqueue(";")
                        }
                        break;
                    }
                    case 187: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("+")
                        }
                        else{
                            _KernelInputQueue.enqueue("=")
                        }
                        break;
                    }
                    case 188: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("<")
                        }
                        else{
                            _KernelInputQueue.enqueue(",")
                        }
                        break;
                    }
                    case 189: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("_")
                        }
                        else{
                            _KernelInputQueue.enqueue("-")
                        }
                        break;
                    }
                    case 190: {
                        if(isShifted){
                            _KernelInputQueue.enqueue(">")
                        }
                        else{
                            _KernelInputQueue.enqueue("/")
                        }
                        break;
                    }
                    case 191: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("?")
                        }
                        else{
                            _KernelInputQueue.enqueue("/")
                        }
                        break;
                    }
                    case 192: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("~")
                        }
                        else{
                            _KernelInputQueue.enqueue("`")
                        }
                        break;
                    }
                    case 219: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("{")
                        }
                        else{
                            _KernelInputQueue.enqueue("[")
                        }
                        break;
                    }
                    case 220: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("|")
                        }
                        else{
                            _KernelInputQueue.enqueue("\\")
                        }
                        break;
                    }
                    case 221: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("}")
                        }
                        else{
                            _KernelInputQueue.enqueue("]")
                        }
                        break;
                    }
                    case 222: {
                        if(isShifted){
                            _KernelInputQueue.enqueue("\"")
                        }
                        else{
                            _KernelInputQueue.enqueue("'")
                        }
                        break;
                    }
                }
            }
        }
    }
}
