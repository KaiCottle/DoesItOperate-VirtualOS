/* ------------
     Control.ts

     Routines for the hardware simulation, NOT for our client OS itself.
     These are static because we are never going to instantiate them, because they represent the hardware.
     In this manner, it's A LITTLE BIT like a hypervisor, in that the Document environment inside a browser
     is the "bare metal" (so to speak) for which we write code that hosts our client OS.
     But that analogy only goes so far, and the lines are blurred, because we are using TypeScript/JavaScript
     in both the host and client environments.

     This (and other host/simulation scripts) is the only place that we should see "web" code, such as
     DOM manipulation and event handling, and so on.  (Index.html is -- obviously -- the only place for markup.)

     This code references page numbers in the text book:
     Operating System Concepts 8th edition by Silberschatz, Galvin, and Gagne.  ISBN 978-0-470-12872-5
     ------------ */

//
// Control Services
//
module TSOS {
    export class Control {
        public static hostInit(): void {
            // This is called from index.html's onLoad event via the onDocumentLoad function pointer.

            // Get a global reference to the canvas.
            _Canvas = <HTMLCanvasElement>document.getElementById('display');
            _DrawingContext = _Canvas.getContext("2d");

            // Enable the added-in canvas text functions.
            CanvasTextFunctions.enable(_DrawingContext);

            // Clear the log text box and set focus on the start button.
            (<HTMLInputElement>document.getElementById("taHostLog")).value = "";
            (<HTMLInputElement>document.getElementById("btnStartOS")).focus();

            // Check for Glados initialization.
            if (typeof Glados === "function") {
                _GLaDOS = new Glados();
                _GLaDOS.init();
            }

            // Initialize memory display.
            this.initMemoryDisplay();
        }

        public static initMemoryDisplay(): void {
            const memoryDisplay = <HTMLTableElement>document.getElementById("memoryTable");

            // Create rows for memory addresses and values.
            for (let i = 0; i < 256; i += 8) {
                const row = memoryDisplay.insertRow();
                const formattedAddress = `0x${i.toString(16).toUpperCase().padStart(3, '0')}`;

                // Set the first cell as the address in hex.
                row.insertCell(0).textContent = formattedAddress;

                // Initialize 8 memory values in each row.
                for (let j = 0; j < 8; j++) {
                    const cell = row.insertCell(j + 1);
                    const memoryCellId = `memory-cell-${i + j}`;
                    cell.setAttribute('id', memoryCellId);
                    cell.textContent = "00";
                }
            }
        }

        public static memoryDisplayUpdate(address: number): void {
            var Address = address.toString(16);
            if (Address.length == 1) {
                Address = "0" + (Address.toUpperCase());
            }
            else {
                Address = Address.toUpperCase();
            }

            var mem = document.getElementById(Address);
            if (mem != null) {
                var addressInsert = _Memory.totalMemory[address];
                mem.innerText = addressInsert.toString(16).padStart(2, '0').toUpperCase();
            }
        }

        public static hostLog(msg: string, source: string = "?"): void {
            const clock = _OSclock;
            const now = new Date().getTime();

            const logMessage = `({ clock: ${clock}, source: ${source}, msg: ${msg}, now: ${now} })\n`;

            const taLog = <HTMLInputElement>document.getElementById("taHostLog");
            taLog.value = logMessage + taLog.value;
        }

        public static hostBtnStartOS_click(btn: HTMLButtonElement): void {
            // Disable start button and enable other buttons.
            btn.disabled = true;
            (<HTMLButtonElement>document.getElementById("btnHaltOS")).disabled = false;
            (<HTMLButtonElement>document.getElementById("btnReset")).disabled = false;

            // Set focus on the display.
            document.getElementById("display")?.focus();

            // Initialize CPU and memory.
            _CPU = new Cpu();
            _CPU.init();
            _Memory = new Memory();
            _Memory.init();
            _MemoryAccessor = new MemoryAccessor();

            // Set the host clock pulse and start the kernel.
            _hardwareClockID = setInterval(Devices.hostClockPulse, CPU_CLOCK_INTERVAL);
            _Kernel = new Kernel();
            _Kernel.krnBootstrap();
        }

        public static hostBtnHaltOS_click(): void {
            Control.hostLog("Emergency halt", "host");
            Control.hostLog("Attempting Kernel shutdown.", "host");

            // Shutdown OS and stop the hardware clock.
            _Kernel.krnShutdown();
            clearInterval(_hardwareClockID);
        }

        //Update the process table
        public static processTableUpdate(): void {
            const processTable = document.getElementById("processTable");
            if (!processTable) return;
        
            const newRows = _PCBList.map(pcb => {
                return `
                    <tr>
                        <td>${pcb.PID.toString(16)}</td>
                        <td>${_CPU.PC.toString(16)}</td>
                        <td>${_CPU.Ir.toString()}</td>
                        <td>${_CPU.Acc.toString(16)}</td>
                        <td>${_CPU.Xreg.toString(16)}</td>
                        <td>${_CPU.Yreg.toString(16)}</td>
                        <td>${_CPU.Zflag.toString(16)}</td>
                        <td>${pcb.priority.toString(16)}</td>
                        <td>${pcb.state}</td>
                        <td>${pcb.location.toString(16)}</td>
                    </tr>
                `;
            }).join('');  // Join all rows into a single string
        
            processTable.innerHTML = newRows;
        }
        

        //Update the CPU table
        public static cpuTableUpdate(): void {
            if (!_CPU.isExecuting) return;

            const cpuTable = document.getElementById("cpuTable") as HTMLTableElement;

            if (!cpuTable) {
                console.error("CPU table element not found.");
                return;
            }
        
            // Clear the CPU table's current content
            cpuTable.innerHTML = '';
        
            // Get the current values of the CPU registers
            const registerValues = [
                _CPU.PC.toString(16), 
                _CPU.Ir.toString(),
                _CPU.Acc.toString(16),
                _CPU.Xreg.toString(16), 
                _CPU.Yreg.toString(16),
                _CPU.Zflag.toString(16)
            ];
        
            // Create a new table row
            const row = document.createElement('tr');
        
            // For each register value, create a new table cell, set its text content to the register value, and append it to the row
            registerValues.forEach((value) => {
                const cell = document.createElement('td');
                cell.textContent = value;
                row.appendChild(cell);
            });
            cpuTable.appendChild(row);
        }

        public static hostBtnReset_click(): void {
            location.reload();
        }
    }
}

