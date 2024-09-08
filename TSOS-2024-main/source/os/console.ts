/* ------------
     Console.ts

     The OS Console - stdIn and stdOut by default.
     Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
     ------------ */

module TSOS {

    export class Console {
        public commandHistory = [];
        public commandIndex = 0;

        constructor(public currentFont = _DefaultFontFamily,
                    public currentFontSize = _DefaultFontSize,
                    public currentXPosition = 0,
                    public currentYPosition = _DefaultFontSize,
                    public buffer = "") {
        }

        public init(): void {
            this.clearScreen();
            this.resetXY();
        }

        public clearScreen(): void {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }

        public resetXY(): void {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }

        public handleInput(): void {
            while (_KernelInputQueue.getSize() > 0) {
                // Get the next character from the kernel input queue.
                var chr = _KernelInputQueue.dequeue();
                // Check to see if it's "special" (enter or ctrl-c) or "normal" (anything else that the keyboard device driver gave us).
                if (chr === String.fromCharCode(13)) { // the Enter key
                    _OsShell.handleInput(this.buffer);
                    this.commandHistory.push(this.buffer);
                    this.commandIndex = this.commandHistory.length;
                    this.buffer = "";

                //Backspace
                } else if(chr === String.fromCharCode(8)){
                    this.backspace();
                }

                //Tab key completion
                else if(chr === String.fromCharCode(9)){
                    if (this.buffer.length > 0) {
                        var match = [];
                        for (var i = 0; i < _OsShell.commandList.length; i++) {
                            if (this.buffer == _OsShell.commandList[i].command.substr(0, this.buffer.length)) {
                                match.push(_OsShell.commandList[i].command);
                            }
                        }
                        if (match.length === 0) {
                            _StdOut.putText("Its not me its you. No matches found.");
                        }
                        else if (match.length === 1) {
                            this.buffer = match[0];
                            this.advanceLine();
                            _StdOut.putText(this.buffer);
                        }
                        else {
                            for (var index = 0; index < match.length; index++) {
                                this.advanceLine();
                                this.putText(match[index]);
                            }
                            this.advanceLine();
                            _StdOut.putText(this.buffer);
                        }
                    }
                }

                //Up arrow
                else if (chr === String.fromCharCode(38)) {
                    if (this.commandIndex > 0) {
                        this.commandIndex -= 1;
                        this.clearCurrentLine();
                        _StdOut.putText(this.commandHistory[this.commandIndex]);
                    } else if (this.commandIndex === 0) {
                        this.clearCurrentLine();
                        _StdOut.putText(this.commandHistory[this.commandIndex]);
                        _StdOut.putText("---End of the line pal---");
                    } else {
                        _StdOut.putText("No command history.");
                    }
                } 
            
                // Down arrow
                else if(chr === String.fromCharCode(40)){
                    if (this.commandIndex < this.commandHistory.length-1){
                        this.commandIndex += 1; 
                        // Clear line
                        while (this.buffer != ""){
                            this.backspace();
                        }
                        _StdOut.putText(this.commandHistory[this.commandIndex]);       
                    }
                    else{
                        _StdOut.putText("You have to go up first, this is embarrassing");
                    }
                }
                else {
                    // This is a "normal" character, so ...
                    // ... draw it on the screen...
                    this.putText(chr);
                    // ... and add it to our buffer.
                    this.buffer += chr;
                }
                // TODO: Add a case for Ctrl-C that would allow the user to break the current program.
            }
        }

        public putText(text): void {
            /*  My first inclination here was to write two functions: putChar() and putString().
                Then I remembered that JavaScript is (sadly) untyped and it won't differentiate
                between the two. (Although TypeScript would. But we're compiling to JavaScipt anyway.)
                So rather than be like PHP and write two (or more) functions that
                do the same thing, thereby encouraging confusion and decreasing readability, I
                decided to write one function and use the term "text" to connote string or char.
            */
            if (text !== "") {
                // Draw the text at the current X and Y coordinates.
                _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, text);
                // Move the current X position.
                var offset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, text);
                this.currentXPosition = this.currentXPosition + offset;
            }
         }

         public advanceLine(): void {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + 
                                     _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                     _FontHeightMargin;
            // Scroll
            if (this.currentYPosition > _Canvas.height){
                // Get CLI size and take screenshot
                var CLILine = this.currentYPosition - _Canvas.height + _FontHeightMargin;
                var BMSnip = _DrawingContext.getImageData(0,0,_Canvas.width,this.currentYPosition + _FontHeightMargin);
                this.clearScreen();
                // Drop cursor to bottom of screen
                _DrawingContext.putImageData(BMSnip,0,-CLILine);
                this.currentYPosition -= CLILine
            }
        }

        clearCurrentLine() {
            if (this.buffer) {
                // Calculate the width of the current line
                const lineWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);

                // Clear the current line by drawing a rectangle over it
                _DrawingContext.clearRect(this.currentXPosition - lineWidth, this.currentYPosition - _DefaultFontSize, this.currentXPosition, this.currentYPosition + _FontHeightMargin);

                // Reset the buffer
                this.buffer = "";
            }
        }

        public backspace(): void{
            if (this.buffer.length > 0){
                var delChar = this.buffer[this.buffer.length - 1];
                var XOffSet = _DrawingContext.measureText(this.currentFont, this.currentFontSize, delChar);
                var YOffset = this.currentYPosition + _DefaultFontSize + 
                                                    _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) +
                                                    _FontHeightMargin;
                this.currentXPosition = this.currentXPosition - XOffSet;                                    
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, this.currentXPosition + XOffSet, YOffset);
                this.buffer = this.buffer.slice(0, -1);
            }
        }

        public BSOD(): void {
            this.clearScreen();
            // Set the background to a deep blue color
            _DrawingContext.fillStyle = "#001f3f"; 
            _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            
            _DrawingContext.font = '120px serif';
            _DrawingContext.fillStyle = "#FF4136";
            _DrawingContext.fillText("💀", _Canvas.width / 2 - 60, 180);
            _DrawingContext.font = '40px serif';
            _DrawingContext.fillStyle = "white";
            _DrawingContext.font = '25px serif';
            _DrawingContext.fillText("SYSTEM FAILURE", 50, 320);
            _DrawingContext.fillText("All processes terminated.", 50, 360);
            _DrawingContext.font = '20px serif';
            _DrawingContext.fillText("Press Ctrl+Alt+Del to attempt a restart.", 50, 420);
            
            _Kernel.krnShutdown();
        }
    }
}