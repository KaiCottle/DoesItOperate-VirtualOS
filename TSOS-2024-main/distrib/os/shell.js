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
            //clearmem
            sc = new TSOS.ShellCommand(this.shellClearMem, "clearmem", "<clearmem> - Clear all memory segments.");
            this.commandList[this.commandList.length] = sc;
            //runall
            sc = new TSOS.ShellCommand(this.shellRunAll, "runall", "<runall> - Execute all programs at once.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellPs, "ps", "<ps> - Display the PID and state of all processes.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKillOne, "killone", "<int> - Kill one process.");
            this.commandList[this.commandList.length] = sc;
            sc = new TSOS.ShellCommand(this.shellKillAll, "killall", "<killall> - Kill all processes.");
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
            // Check if CPU is executing
            if (_CPU.isExecuting) {
                _StdOut.putText("Unable to load programs while CPU is executing.");
                return;
            }
            // Retrieve and sanitize input
            const text = document.getElementById("taProgramInput")
                .value.replace(/\s/g, '');
            // Validate input using regex and even length check
            const isValidHex = /^[A-Fa-f0-9]+$/.test(text);
            const isEvenLength = text.length % 2 === 0;
            if (!isValidHex || !isEvenLength) {
                _StdOut.putText("Invalid input.");
                _StdOut.advanceLine();
                return;
            }
            _StdOut.putText("Valid input.");
            _StdOut.advanceLine();
            // Convert input into an array of bytes
            const userInputArray = [];
            for (let i = 0; i < text.length; i += 2) {
                userInputArray.push(text[i] + text[i + 1]);
            }
            // Initialize a new PCB
            _PCB = new TSOS.Pcb();
            _PCB.init();
            // Create a new MemoryManager and find an available segment
            _MemoryManager = new TSOS.MemoryManager();
            const availableSegment = _MemoryManager.segmentAvailable();
            if (availableSegment === -1) {
                _StdOut.putText("No available memory.");
                _StdOut.advanceLine();
                return;
            }
            // Set up the PCB
            _PCB.PID = _PID++;
            _PCB.priority = 5;
            _PCB.location = "Memory";
            _PCB.state = "Resident";
            _PCB.segment = availableSegment;
            _PCB.machineCode = userInputArray;
            _PCB.setBaseLimit();
            // Add the PCB to the PCB list
            _PCBList.push(_PCB);
            // Allocate memory for the process
            _MemoryManager.allocateSegment(userInputArray);
            // Update process table
            TSOS.Control.processTableUpdate();
            // Display success message
            _StdOut.putText(`PID: ${_PCB.PID.toString()} loaded successfully.`);
            _StdOut.advanceLine();
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
        shellClearMem() {
            if (_CPU.isExecuting) {
                _StdOut.putText("Cannot clear memory while CPU is executing.");
            }
            else {
                _MemoryAccessor.clearAll();
            }
        }
        shellRunAll() {
            if (_CPU.isExecuting) {
                _StdOut.putText("Unable to run task while CPU is in execution.");
                _StdOut.advanceLine();
            }
            else {
                _ReadyQueue.clearQueue();
                // Set all "Resident" processes to "Ready" state and enqueue them
                for (let pcb of _PCBList) {
                    if (pcb.state === "Resident") {
                        pcb.state = "Ready";
                        _ReadyQueue.enqueue(pcb); // Enqueue each ready process directly
                    }
                }
                if (_ReadyQueue.getSize() > 0) {
                    _PCB = _ReadyQueue.dequeue();
                    _CPU.isExecuting = true;
                    _PCB.state = "Executing";
                }
                _MemoryAccessor.updateTables();
            }
        }
        shellPs() {
            if (_PCBList.length > 0) {
                _PCBList.forEach(pcb => {
                    _StdOut.putText(`PID: ${pcb.PID} | STATE: ${pcb.state}`);
                    _StdOut.advanceLine();
                });
            }
            else {
                _StdOut.putText("No processes currently loaded.");
                _StdOut.advanceLine();
            }
        }
        shellKillOne(args) {
            const pidInput = Number(args[0]);
            const pcb = _PCBList.find(p => p.PID === pidInput);
            if (pcb) {
                // Only terminate if the process is not already terminated
                if (pcb.state === "Ready" || pcb.state === "Running" || pcb.state === "Resident") {
                    pcb.state = "Terminated";
                    _Segments[pcb.segment].ACTIVE = false;
                    _MemoryManager.clearSegment(pcb.base, pcb.limit);
                    _StdOut.putText(`TERMINATED PROCESS: ${pcb.PID}`);
                    _StdOut.advanceLine();
                    // Calculate turnaround and wait times
                    pcb.turnAround = pcb.cycleEnd - pcb.cycleStart;
                    pcb.waitTime = Math.max(0, pcb.turnAround - pcb.waitRun);
                    if (_CPU.isExecuting && _PCB === pcb) {
                        _CPU.isExecuting = false;
                        _CPU.init();
                        _StdOut.putText("CPU execution stopped as the current process was terminated.");
                        _StdOut.advanceLine();
                    }
                }
                else {
                    _StdOut.putText(`Process ${pidInput} is already terminated.`);
                    _StdOut.advanceLine();
                }
            }
            else {
                _StdOut.putText("ERROR - INVALID PID");
                _StdOut.advanceLine();
            }
            _MemoryAccessor.updateTables();
        }
        shellKillAll() {
            if (_CPU.isExecuting) {
                _CPU.isExecuting = false;
                _CPU.init();
                _StdOut.putText("CPU execution stopped.");
                _StdOut.advanceLine();
            }
            for (let i = 0; i < _PCBList.length; i++) {
                const pcb = _PCBList[i];
                // Only terminate processes that are not already terminated
                if (pcb.state !== "Terminated") {
                    pcb.state = "Terminated";
                    _Segments[pcb.segment].ACTIVE = false;
                    _MemoryManager.clearSegment(pcb.base, pcb.limit);
                    _StdOut.putText(`PROCESS ${pcb.PID} terminated.`);
                    _StdOut.advanceLine();
                }
            }
            _MemoryAccessor.updateTables();
            _StdOut.putText("All processes have been terminated.");
            _StdOut.advanceLine();
        }
        shellKill() {
            var curPid = _PCB.PID;
            _CPU.killProg(curPid);
            _PCB.state = "Terminated";
            _Segments[_PCB.segment].ACTIVE = false;
            _MemoryManager.clearSegment(_PCB.base, _PCB.limit);
            _MemoryAccessor.updateTables();
            _StdOut.advanceLine();
            _OsShell.putPrompt();
        }
        shellStatus(args) {
            if (args.length > 0) {
                const status = args.join(' ');
                const statusElement = document.getElementById("status");
                if (statusElement) {
                    statusElement.innerHTML = "Status: " + status;
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
                    case "run":
                        _StdOut.putText("<pid> - Run a program already in memory.");
                        break;
                    case "clearmem":
                        _StdOut.putText("<clearMem> - Clear all memory partitions.");
                        break;
                    case "runall":
                        _StdOut.putText("<runAll> - Execute all programs at once.");
                        break;
                    case "ps":
                        _StdOut.putText("<ps> - Display the PID and state of all processes.");
                        break;
                    case "killone":
                        _StdOut.putText("<int> - Kill one process.");
                        break;
                    case "killall":
                        _StdOut.putText("<killAll> - Kill all processes.");
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