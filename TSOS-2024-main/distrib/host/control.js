/* ------------
   Control.ts

   Routines for the hardware simulation, NOT for our client OS itself.
   These are static because we are never going to instantiate them, as they represent the hardware.
   In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
   is the "bare metal" (so to speak) for which we write code that hosts our client OS.
   But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
   in both the host and client environments.

   This (and other host/simulation scripts) is the only place that we should see "web" code, such as
   DOM manipulation and event handling, and so on. (Index.html is -- obviously -- the only place for markup.)

   This code references page numbers in the textbook:
   Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne. ISBN 978-0-470-12872-5
------------ */
//
// Control Services
//
var TSOS;
(function (TSOS) {
    class Control {
        static hostInit() {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.
            // Get a global reference to the canvas.
            _Canvas = document.getElementById('display');
            _DrawingContext = _Canvas.getContext("2d");
            // Enable the added-in canvas text functions.
            TSOS.CanvasTextFunctions.enable(_DrawingContext);
            // Clear the log text box and set focus on the start button.
            document.getElementById("taHostLog").value = "";
            document.getElementById("btnStartOS").focus();
            // Check for GLaDOS initialization.
            if (typeof Glados === "function") {
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }
        }
        static updateMemoryDisplay(address) {
            let Address = address.toString(16).toUpperCase();
            if (Address.length === 1) {
                Address = "0" + Address;
            }
            const mem = document.getElementById(Address);
            if (mem) {
                const addressInsert = _Memory.segment0[address];
                mem.innerText = addressInsert.toString(16).padStart(2, '0').toUpperCase();
            }
        }
        static hostLog(msg, source = "?") {
            const clock = _OSclock;
            const now = new Date().getTime();
            const logMessage = `({ clock: ${clock}, source: ${source}, msg: ${msg}, now: ${now} })\n`;
            const taLog = document.getElementById("taHostLog");
            taLog.value = logMessage + taLog.value;
        }
        static hostBtnStartOS_click(btn) {
            // Disable start button and enable other buttons.
            btn.disabled = true;
            document.getElementById("btnHaltOS").disabled = false;
            document.getElementById("btnReset").disabled = false;
            // Set focus on the display.
            document.getElementById("display")?.focus();
            // Initialize CPU and memory.
            _CPU = new TSOS.Cpu();
            _CPU.init();
            _Memory = new TSOS.Memory();
            _Memory.init();
            _MemoryAccessor = new TSOS.MemoryAccessor();
            // Set the host clock pulse and start the kernel.
            _hardwareClockID = setInterval(TSOS.Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            _Kernel = new TSOS.Kernel();
            _Kernel.krnBootstrap();
        }
        static hostBtnHaltOS_click() {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");
            // Shutdown OS and stop the hardware clock.
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
        }
        // Update the process table
        static processTableUpdate() {
            const { PC, Ir, Acc, Xreg, Yreg, Zflag } = _CPU;
            const pcb = _PCBList[_PID - 1];
            const { PID, priority, state, location } = pcb;
            // Check if processTable element exists
            const processTable = document.getElementById("processTable");
            if (!processTable)
                return;
            // Clear the table and update with new values
            processTable.innerHTML = "";
            const row = document.createElement("tr");
            // List of values to update
            const values = [
                PID, PC, Ir, Acc, Xreg, Yreg, Zflag,
                priority, state, location
            ].map(v => v.toString());
            values.forEach(value => {
                const td = document.createElement("td");
                td.innerHTML = value;
                row.appendChild(td);
            });
            processTable.appendChild(row);
        }
        // Update the CPU table, same logic as process table but for CPU
        static cpuTableUpdate() {
            const { PC, Ir, Acc, Xreg, Yreg, Zflag } = _CPU;
            const cpuTable = document.getElementById("cpuTable");
            if (!cpuTable)
                return;
            // Clear the table and update with new values
            cpuTable.innerHTML = "";
            const row = document.createElement("tr");
            // List of CPU registers to update
            const values = [PC, Ir, Acc, Xreg, Yreg, Zflag].map(v => v.toString());
            values.forEach(value => {
                const td = document.createElement("td");
                td.innerHTML = value;
                row.appendChild(td);
            });
            cpuTable.appendChild(row);
        }
        static hostBtnReset_click() {
            location.reload();
        }
    }
    TSOS.Control = Control;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=control.js.map