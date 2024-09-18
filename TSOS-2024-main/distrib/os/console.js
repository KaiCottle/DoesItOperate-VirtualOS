/* ------------
  Console.ts

  The OS Console - stdIn and stdOut by default.
  Note: This is not the Shell. The Shell is the "command line interface" (CLI) or interpreter for this console.
  ------------ */
var TSOS;
(function (TSOS) {
    class Console {
        currentFont;
        currentFontSize;
        currentXPosition;
        currentYPosition;
        buffer;
        commandHistory = [];
        commandIndex = 0;
        constructor(currentFont = _DefaultFontFamily, currentFontSize = _DefaultFontSize, currentXPosition = 0, currentYPosition = _DefaultFontSize, buffer = "") {
            this.currentFont = currentFont;
            this.currentFontSize = currentFontSize;
            this.currentXPosition = currentXPosition;
            this.currentYPosition = currentYPosition;
            this.buffer = buffer;
        }
        init() {
            this.clearScreen();
            this.resetXY();
        }
        clearScreen() {
            _DrawingContext.clearRect(0, 0, _Canvas.width, _Canvas.height);
        }
        resetXY() {
            this.currentXPosition = 0;
            this.currentYPosition = this.currentFontSize;
        }
        handleInput() {
            while (_KernelInputQueue.getSize() > 0) {
                var chr = _KernelInputQueue.dequeue();
                if (chr === String.fromCharCode(13)) { // Enter key
                    _OsShell.handleInput(this.buffer);
                    this.commandHistory.push(this.buffer);
                    this.commandIndex = this.commandHistory.length;
                    this.buffer = "";
                }
                else if (chr === String.fromCharCode(8)) { // Backspace
                    this.backspace();
                }
                else if (chr === String.fromCharCode(9)) { // Tab key
                    this.handleTabCompletion();
                }
                else if (chr === String.fromCharCode(0x2191)) { // Up arrow
                    this.handleUpArrow();
                }
                else if (chr === String.fromCharCode(0x2193)) { // Down arrow
                    this.handleDownArrow();
                }
                else {
                    this.putText(chr);
                    this.buffer += chr;
                }
            }
        }
        handleTabCompletion() {
            if (this.buffer.length > 0) {
                var match = [];
                for (var i = 0; i < _OsShell.commandList.length; i++) {
                    if (this.buffer === _OsShell.commandList[i].command.substr(0, this.buffer.length)) {
                        match.push(_OsShell.commandList[i].command);
                    }
                }
                if (match.length === 0) {
                    _StdOut.putText("Its not me, it's you. No matches found.");
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
        //Referenced from MarshManOS
        handleUpArrow() {
            if (this.commandIndex > 0) {
                this.clearLine();
                this.currentXPosition = 0;
                this.putText(_OsShell.promptStr);
                this.commandIndex -= 1;
                var prevCommand = this.commandHistory[this.commandIndex];
                this.putText(prevCommand);
                this.buffer = prevCommand;
            }
        }
        //Referenced from MarshManOS
        handleDownArrow() {
            if ((this.commandIndex + 1) < this.commandHistory.length) {
                this.clearLine();
                this.currentXPosition = 0;
                this.putText(_OsShell.promptStr);
                this.commandIndex += 1;
                var nextCommand = this.commandHistory[this.commandIndex];
                this.putText(nextCommand);
                this.buffer = nextCommand;
            }
        }
        // Takes a string of text, draws each character one by one, advance to a new line if needed. -> Rapper Logic (not a typo, just funny)
        putText(text) {
            if (text !== "") {
                for (var i = 0; i < text.length; i++) {
                    var txt = text.charAt(i);
                    var Xoffset = _DrawingContext.measureText(this.currentFont, this.currentFontSize, txt);
                    if (this.currentXPosition + Xoffset > _Canvas.width) {
                        this.advanceLine();
                    }
                    _DrawingContext.drawText(this.currentFont, this.currentFontSize, this.currentXPosition, this.currentYPosition, txt);
                    this.currentXPosition += Xoffset;
                }
            }
        }
        advanceLine() {
            this.currentXPosition = 0;
            this.currentYPosition += _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
            if (this.currentYPosition > _Canvas.height) {
                var CLILine = this.currentYPosition - _Canvas.height + _FontHeightMargin;
                var BMSnip = _DrawingContext.getImageData(0, 0, _Canvas.width, this.currentYPosition + _FontHeightMargin);
                this.clearScreen();
                _DrawingContext.putImageData(BMSnip, 0, -CLILine);
                this.currentYPosition -= CLILine;
            }
        }
        clearCurrentLine() {
            if (this.buffer) {
                const lineWidth = _DrawingContext.measureText(this.currentFont, this.currentFontSize, this.buffer);
                _DrawingContext.clearRect(this.currentXPosition - lineWidth, this.currentYPosition - _DefaultFontSize, this.currentXPosition, this.currentYPosition + _FontHeightMargin);
                this.buffer = "";
            }
        }
        //Referenced from MarshManOS -> Needed this to work for up + down arrow, hence why there are two clear line functions.
        clearLine() {
            const lineHeight = this.currentFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize);
            _DrawingContext.clearRect(0, this.currentYPosition - lineHeight + 4, _Canvas.width, lineHeight);
        }
        backspace() {
            if (this.buffer.length > 0) {
                var delChar = this.buffer[this.buffer.length - 1];
                var XOffSet = _DrawingContext.measureText(this.currentFont, this.currentFontSize, delChar);
                var YOffset = this.currentYPosition + _DefaultFontSize + _DrawingContext.fontDescent(this.currentFont, this.currentFontSize) + _FontHeightMargin;
                this.currentXPosition -= XOffSet;
                _DrawingContext.clearRect(this.currentXPosition, this.currentYPosition - _DefaultFontSize, this.currentXPosition + XOffSet, YOffset);
                this.buffer = this.buffer.slice(0, -1);
            }
        }
        BSOD() {
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
    TSOS.Console = Console;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=console.js.map