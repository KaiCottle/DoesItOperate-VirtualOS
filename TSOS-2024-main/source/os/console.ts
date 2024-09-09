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
    
                    //Up arrow -> Referenced MarshManOS
                    else if (chr === String.fromCharCode(0x2191)) {
                        if (this.commandIndex > 0) {
                            // clear the whole line
                            this.clearLine();
                            // move curser back to the start
                            this.currentXPosition = 0;
                            // add the > or what ever the user changes it to
                            this.putText(_OsShell.promptStr);
                            // Get the previous command
                            this.commandIndex -= 1;
                            var prevCommand = this.commandHistory[this.commandIndex];
                            // Display the previous command on the console
                            this.putText(prevCommand);
                            // Update the buffer with the previous command
                            this.buffer = prevCommand;
                        }
                    } 
                
                    // Down arrow -> Referenced MarshManOS
                    else if(chr === String.fromCharCode(0x2193)){
                        if ((this.commandIndex + 1) < this.commandHistory.length) {
                            // clear the whole line
                            this.clearLine();
                            // move curser back to the start
                            this.currentXPosition = 0;
                            // add the > or what ever the user changes it to
                            this.putText(_OsShell.promptStr);
                            // Get the next command
                            this.commandIndex += 1;
                            var nextCommand = this.commandHistory[this.commandIndex];
                            // Display the next command on the console
                            this.putText(nextCommand);
                            // Update the buffer with the next command
                            this.buffer = nextCommand;
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
                // takes a string of text, draws each character one by one, advance to a new line if needed.
                if (text !== "") {
                    for (var i = 0; i < text.length; i++) {
                        var txt = text.charAt(i);
                        var Xoffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, txt);
                        if (this.currentXPosition + Xoffset > _Canvas.width) { 
                            this.advanceLine();
                        }
                        _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, txt);
                        this.currentXPosition = this.currentXPosition + Xoffset;
                    }
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
                    // Drop cursor
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

            //This section was used from MarshManOS. I needed to change logic so that my up + downarrow would clear screen properly hence why theres 2 of these
            clearLine() {
                const lineHeight = this.currentFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
                // added +1 because there was a small line left
                _DrawingContext.clearRect(0, this.currentYPosition - lineHeight + 4, _Canvas.width, lineHeight);
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
            
                _DrawingContext.fillStyle = "#0000AA";
                _DrawingContext.fillRect(0, 0, _Canvas.width, _Canvas.height);
            
                _DrawingContext.font = '20px Lucida Console, monospace';
                _DrawingContext.fillStyle = "white";
            
                _DrawingContext.fillText("A problem has been detected and Windows has been shut down to prevent", 20, 50);
                _DrawingContext.fillText("damage to your computer.", 20, 80);
            
                _DrawingContext.fillText("UNMOUNTABLE_BOOT_VOLUME", 20, 130);
            
                _DrawingContext.fillText("If this is the first time you've seen this error screen,", 20, 180);
                _DrawingContext.fillText("restart your computer. If this screen appears again, follow", 20, 210);
                _DrawingContext.fillText("these steps:", 20, 240);
            
                _DrawingContext.fillText("Check to make sure any new hardware or software is properly installed.", 20, 280);
                _DrawingContext.fillText("If this is a new installation, ask your hardware or software manufacturer", 20, 310);
                _DrawingContext.fillText("for any Windows updates you might need.", 20, 340);
            
                _DrawingContext.fillText("If problems continue, disable or remove any newly installed hardware", 20, 380);
                _DrawingContext.fillText("or software. Disable BIOS memory options such as caching or shadowing.", 20, 410);
                _DrawingContext.fillText("If you need to use Safe Mode to remove or disable components, restart", 20, 440);
                _DrawingContext.fillText("your computer, press F8 to select Advanced Startup Options, and then", 20, 470);
                _DrawingContext.fillText("select Safe Mode.", 20, 500);
            
                _DrawingContext.fillText("Technical Information:", 20, 550);
            
                _DrawingContext.fillText("*** STOP: 0x000000ED (0x80F12BD0, 0xC000009C, 0x00000000, 0x00000000)", 20, 580);
            
                _Kernel.krnShutdown();
            }
            
        }
    }