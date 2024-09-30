/* ------------
   Shell.ts

   The OS Shell - The "command line interface" (CLI) for the console.

    Note: While fun and learning are the primary goals of all enrichment center activities,
          serious injuries may occur when trying to write your own Operating System.
   ------------ */
// TODO: Write a base class / prototype for system services and let Shell inherit from it.
var TSOS;
(function (TSOS) {
    class Shell {
        // Properties
        promptStr = ">";
        commandList = [];
        curses = "[fuvg],[cvff],[shpx],[phag],[pbpxfhpxre],[zbgureshpxre],[gvgf]";
        apologies = "[sorry]";
        constructor() {
        }
        init() {
            var sc;
            //
            // Load the command list.
            // ver
            sc = new TSOS.ShellCommand(this.shellVer, "ver", "- Displays the current version data.");
            this.commandList[this.commandList.length] = sc;
            // date
            sc = new TSOS.ShellCommand(this.shellDate, "date", "- Displays the current date.");
            this.commandList[this.commandList.length] = sc;
            // whereami
            sc = new TSOS.ShellCommand(this.shellWhereAmI, "whereami", "- Displays the current location.");
            this.commandList[this.commandList.length] = sc;
            // days2live
            sc = new TSOS.ShellCommand(this.shellDays2Live, "days2live", "- Tells user how long they have until they die.");
            this.commandList[this.commandList.length] = sc;
            // status
            sc = new TSOS.ShellCommand(this.shellStatus, "status", "<string> - Sets the status.");
            this.commandList[this.commandList.length] = sc;
            // help
            sc = new TSOS.ShellCommand(this.shellHelp, "help", "- This is the help command. Seek help.");
            this.commandList[this.commandList.length] = sc;
            // bsod
            sc = new TSOS.ShellCommand(this.shellBsod, "bsod", "Displays the Blue Screen of Death.");
            this.commandList[this.commandList.length] = sc;
            // load
            sc = new TSOS.ShellCommand(this.shellLoad, "load", "<load>- Validates previous input, only hex digits and spaces are valid.");
            this.commandList[this.commandList.length] = sc;
            // run
            sc = new TSOS.ShellCommand(this.shellRun, "run", "run <pid>, runs the specified program.");
            this.commandList[this.commandList.length] = sc;
            // shutdown
            sc = new TSOS.ShellCommand(this.shellShutdown, "shutdown", "- Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
            this.commandList[this.commandList.length] = sc;
            // cls
            sc = new TSOS.ShellCommand(this.shellCls, "cls", "- Clears the screen and resets the cursor position.");
            this.commandList[this.commandList.length] = sc;
            // man <topic>
            sc = new TSOS.ShellCommand(this.shellMan, "man", "<topic> - Displays the MANual page for <topic>.");
            this.commandList[this.commandList.length] = sc;
            // trace <on | off>
            sc = new TSOS.ShellCommand(this.shellTrace, "trace", "<on | off> - Turns the OS trace on or off.");
            this.commandList[this.commandList.length] = sc;
            // rot13 <string>
            sc = new TSOS.ShellCommand(this.shellRot13, "rot13", "<string> - Does rot13 obfuscation on <string>.");
            this.commandList[this.commandList.length] = sc;
            // prompt <string>
            sc = new TSOS.ShellCommand(this.shellPrompt, "prompt", "<string> - Sets the prompt.");
            this.commandList[this.commandList.length] = sc;
            // ps  - list the running processes and their IDs
            // kill <id> - kills the specified process id.
            // Display the initial prompt.
            this.putPrompt();
        }
        putPrompt() {
            _StdOut.putText(this.promptStr);
        }
        handleInput(buffer) {
            _Kernel.krnTrace("Shell Command~" + buffer);
            //
            // Parse the input...
            //
            var userCommand = this.parseInput(buffer);
            // ... and assign the command and args to local variables.
            var cmd = userCommand.command;
            var args = userCommand.args;
            //
            // Determine the command and execute it.
            //
            // TypeScript/JavaScript may not support associative arrays in all browsers so we have to iterate over the
            // command list in attempt to find a match. 
            // TODO: Is there a better way? Probably. Someone work it out and tell me in class.
            var index = 0;
            var found = false;
            var fn = undefined;
            while (!found && index < this.commandList.length) {
                if (this.commandList[index].command === cmd) {
                    found = true;
                    fn = this.commandList[index].func;
                }
                else {
                    ++index;
                }
            }
            if (found) {
                this.execute(fn, args); // Note that args is always supplied, though it might be empty.
            }
            else {
                // It's not found, so check for curses and apologies before declaring the command invalid.
                if (this.curses.indexOf("[" + TSOS.Utils.rot13(cmd) + "]") >= 0) { // Check for curses.
                    this.execute(this.shellCurse);
                }
                else if (this.apologies.indexOf("[" + cmd + "]") >= 0) { // Check for apologies.
                    this.execute(this.shellApology);
                }
                else { // It's just a bad command. {
                    this.execute(this.shellInvalidCommand);
                }
            }
        }
        // Note: args is an optional parameter, ergo the ? which allows TypeScript to understand that.
        execute(fn, args) {
            // We just got a command, so advance the line...
            _StdOut.advanceLine();
            // ... call the command function passing in the args with some über-cool functional programming ...
            fn(args);
            // Check to see if we need to advance the line again
            if (_StdOut.currentXPosition > 0) {
                _StdOut.advanceLine();
            }
            // ... and finally write the prompt again.
            this.putPrompt();
        }
        parseInput(buffer) {
            var retVal = new TSOS.UserCommand();
            // 1. Remove leading and trailing spaces.
            buffer = TSOS.Utils.trim(buffer);
            // 2. Lower-case it.
            buffer = buffer.toLowerCase();
            // 3. Separate on spaces so we can determine the command and command-line args, if any.
            var tempList = buffer.split(" ");
            // 4. Take the first (zeroth) element and use that as the command.
            var cmd = tempList.shift(); // Yes, you can do that to an array in JavaScript. See the Queue class.
            // 4.1 Remove any left-over spaces.
            cmd = TSOS.Utils.trim(cmd);
            // 4.2 Record it in the return value.
            retVal.command = cmd;
            // 5. Now create the args array from what's left.
            for (var i in tempList) {
                var arg = TSOS.Utils.trim(tempList[i]);
                if (arg != "") {
                    retVal.args[retVal.args.length] = tempList[i];
                }
            }
            return retVal;
        }
        //
        // Shell Command Functions. Kinda not part of Shell() class exactly, but
        // called from here, so kept here to avoid violating the law of least astonishment.
        //
        shellInvalidCommand() {
            _StdOut.putText("Invalid Command. ");
            if (_SarcasticMode) {
                _StdOut.putText("Unbelievable. You, [subject name here],");
                _StdOut.advanceLine();
                _StdOut.putText("must be the pride of [subject hometown here].");
            }
            else {
                _StdOut.putText("Type 'help' for, well... help.");
            }
        }
        shellCurse() {
            _StdOut.putText("Oh, so that's how it's going to be, eh? Fine.");
            _StdOut.advanceLine();
            _StdOut.putText("Bitch.");
            _SarcasticMode = true;
        }
        shellApology() {
            if (_SarcasticMode) {
                _StdOut.putText("I think we can put our differences behind us.");
                _StdOut.advanceLine();
                _StdOut.putText("For science . . . You monster.");
                _SarcasticMode = false;
            }
            else {
                _StdOut.putText("For what?");
            }
        }
        // Although args is unused in some of these functions, it is always provided in the 
        // actual parameter list when this function is called, so I feel like we need it.
        shellVer(args) {
            _StdOut.putText(APP_NAME + " version " + APP_VERSION);
        }
        shellDate(args) {
            _StdOut.putText("Todays Date: " + Date());
        }
        shellWhereAmI(args) {
            _StdOut.putText("Look behind you ;)");
        }
        shellDays2Live(args) {
            let daysLeft = Math.floor(Math.random() * 100) + 1;
            _StdOut.putText(`You have: ${daysLeft} days left.`);
        }
        shellBsod(args) {
            _Console.BSOD();
        }
        shellLoad(args) {
            let even = false;
            var evenCheck = -1;
            let valid = false;
            var text = document.getElementById("taProgramInput").value;
            let regexp = /^[A-Fa-f0-9]+$/;
            text = text.replace(/\s/g, '');
            evenCheck = text.length;
            if (evenCheck % 2 == 0) {
                even = true;
            }
            if (regexp.test(text) && even) {
                _StdOut.putText("Valid input.");
                valid = true;
                _StdOut.advanceLine();
            }
            else {
                _StdOut.putText("Invalid input.");
                _StdOut.advanceLine();
                _StdOut.putText(">");
                _StdOut.advanceLine();
                valid = false;
            }
            if (_PID > 2) {
                _StdOut.putText("Memory full, please clear memory to load more programs.");
                _StdOut.advanceLine();
                _StdOut.putText(">");
                _StdOut.advanceLine();
                valid = false;
            }
            if (valid) {
                let userInputArray = [];
                for (let m = 0; m < text.length; m += 2) {
                    userInputArray.push(text[m] + text[m + 1]);
                }
                console.log("shell log test: " + userInputArray);
                _PCB = new TSOS.Pcb();
                _PCB.init();
                _PCB.PID = _PID;
                _StdOut.putText("PID: " + _PID.toString());
                _StdOut.advanceLine();
                _PID++;
                _PCB.priority = 5;
                _PCB.location = "Memory";
                _PCB.state = "Ready";
                _MemoryManager = new TSOS.MemoryManager();
                _MemoryManager.clearMem();
                _MemoryManager.writeMem(userInputArray);
                _PCBList[_PCBList.length] = _PCB;
                TSOS.Control.processTableUpdate();
            }
            else {
                _PCB.state = "Resident";
                TSOS.Control.processTableUpdate();
                TSOS.Control.cpuTableUpdate();
            }
        }
        shellRun(args) {
            var pidCheck = Number(args[0]);
            if (pidCheck <= _PCBList.length - 1) {
                if (_PCBList[pidCheck].PID === pidCheck) {
                    _PCBList[pidCheck].state = "Executing";
                    _CPU.isExecuting = true;
                }
            }
            else {
                _StdOut.putText("ERROR- INVALID PID");
                _CPU.isExecuting = false;
            }
            TSOS.Control.processTableUpdate();
            TSOS.Control.cpuTableUpdate();
        }
        shellStatus(args) {
            if (args.length > 0) {
                const status = args.join(' ');
                const statusElement = document.getElementById("status");
                if (statusElement) {
                    statusElement.innerHTML = "Status: " + status; // Updates the HTML
                    _StdOut.putText("Status set to: " + status);
                }
                else {
                    _StdOut.putText("Error: Status element not found.");
                }
            }
            else {
                _StdOut.putText("Usage: status <string>  Please supply a string.");
            }
        }
        shellHelp(args) {
            _StdOut.putText("Commands:");
            for (var i in _OsShell.commandList) {
                _StdOut.advanceLine();
                _StdOut.putText("  " + _OsShell.commandList[i].command + " " + _OsShell.commandList[i].description);
            }
        }
        shellShutdown(args) {
            _StdOut.putText("Shutting down...");
            // Call Kernel shutdown routine.
            _Kernel.krnShutdown();
            // TODO: Stop the final prompt from being displayed. If possible. Not a high priority. (Damn OCD!)
        }
        shellCls(args) {
            _StdOut.clearScreen();
            _StdOut.resetXY();
        }
        shellMan(args) {
            if (args.length > 0) {
                var topic = args[0];
                switch (topic) {
                    case "help":
                        _StdOut.putText("Help displays a list of (hopefully) valid commands.");
                        break;
                    // TODO: Make descriptive MANual page entries for the rest of the shell commands here.
                    case "ver":
                        _StdOut.putText("Displays the current version data.");
                        break;
                    case "date":
                        _StdOut.putText("Displays the current date.");
                        break;
                    case "whereami":
                        _StdOut.putText("Displays your current location.");
                        break;
                    case "days2live":
                        _StdOut.putText("Tells the user how long they have until they die.");
                        break;
                    case "status":
                        _StdOut.putText("Sets the status. Usage: status <string>");
                        break;
                    case "bsod":
                        _StdOut.putText("Displays the Blue Screen of Death.");
                        break;
                    case "load":
                        _StdOut.putText("<load> - Validates previous input, only hex digits and spaces allowed.");
                        break;
                    case "help":
                        _StdOut.putText("Displays a list of available commands.");
                        break;
                    case "shutdown":
                        _StdOut.putText("Shuts down the virtual OS but leaves the underlying host / hardware simulation running.");
                        break;
                    case "cls":
                        _StdOut.putText("Clears the screen and resets the cursor position.");
                        break;
                    case "man":
                        _StdOut.putText("Displays the manual page for a specific command. Usage: man <command>");
                        break;
                    case "trace":
                        _StdOut.putText("Turns the OS trace on or off. Usage: trace <on | off>");
                        break;
                    case "rot13":
                        _StdOut.putText("Does rot13 obfuscation on a string. Usage: rot13 <string>");
                        break;
                    case "prompt":
                        _StdOut.putText("Sets the prompt. Usage: prompt <string>");
                        break;
                    default:
                        _StdOut.putText("No manual entry for " + args[0] + ".");
                }
            }
            else {
                _StdOut.putText("Usage: man <topic>  Please supply a topic.");
            }
        }
        shellTrace(args) {
            if (args.length > 0) {
                var setting = args[0];
                switch (setting) {
                    case "on":
                        if (_Trace && _SarcasticMode) {
                            _StdOut.putText("Trace is already on, doofus.");
                        }
                        else {
                            _Trace = true;
                            _StdOut.putText("Trace ON");
                        }
                        break;
                    case "off":
                        _Trace = false;
                        _StdOut.putText("Trace OFF");
                        break;
                    default:
                        _StdOut.putText("Invalid arguement.  Usage: trace <on | off>.");
                }
            }
            else {
                _StdOut.putText("Usage: trace <on | off>");
            }
        }
        shellRot13(args) {
            if (args.length > 0) {
                // Requires Utils.ts for rot13() function.
                _StdOut.putText(args.join(' ') + " = '" + TSOS.Utils.rot13(args.join(' ')) + "'");
            }
            else {
                _StdOut.putText("Usage: rot13 <string>  Please supply a string.");
            }
        }
        shellPrompt(args) {
            if (args.length > 0) {
                _OsShell.promptStr = args[0];
            }
            else {
                _StdOut.putText("Usage: prompt <string>  Please supply a string.");
            }
        }
    }
    TSOS.Shell = Shell;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=shell.js.map