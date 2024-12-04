module TSOS {
    export class Dsdd {
        public text = "";

        constructor(public isFormatted: boolean = false) {}

        public fileFormat(): void {
            _Kernel.krnTrace("Formatting Disk.");

            const emptyBlock = this.createEmptyBlock();

            for (let t = 0; t < _Disk.track; t++) {
                for (let s = 0; s < _Disk.sector; s++) {
                    for (let b = 0; b < _Disk.block; b++) {
                        const tsb = `${t}:${s}:${b}`;
                        sessionStorage.setItem(tsb, emptyBlock.join(" "));
                    }
                }
            }

            this.isFormatted = true;
            TSOS.Control.tsbTableUpdate();
        }

        public fileCreate(fileName: string): boolean {
            _Kernel.krnTrace("DSDD Create.");

            const fileNameTSB = this.fileNametoTSB(fileName);

            if (!fileNameTSB) {
                const nameTSB = this.nextTSBname();
                const dataTSB = this.nextTSBdata();
                this.initializeBlock(nameTSB, fileName);
                this.initializeBlock(dataTSB);

                TSOS.Control.tsbTableUpdate();
                return true;
            }

            return false; // File already exists
        }

        public fileRead(fileName: string): boolean {
            _Kernel.krnTrace("DSDD Read.");
            this.text = "";

            const fileNameTSB = this.fileNametoTSB(fileName);

            if (fileNameTSB) {
                const directoryBlock = this.getBlock(fileNameTSB);
                const dataTSB = this.getTSBPointer(directoryBlock);
                this.readDataBlocks(dataTSB);

                _StdOut.putText("File contents: " + this.text);
                return true;
            }

            return false; // File not found
        }

        public fileWrite(fileName: string, fileData: string[]): boolean {
            const fileNameTSB = this.fileNametoTSB(fileName);

            if (fileNameTSB) {
                const dataTSB = this.nextTSBdata();
                this.linkDirectoryToData(fileNameTSB, dataTSB);

                const dataString = fileData.join("");
                this.writeData(dataTSB, dataString);

                TSOS.Control.tsbTableUpdate();
                return true;
            }

            return false; // File does not exist
        }

        public fileDelete(fileName: string): boolean {
            _Kernel.krnTrace("DSDD Delete.");

            const fileNameTSB = this.fileNametoTSB(fileName);

            if (fileNameTSB) {
                const directoryBlock = this.getBlock(fileNameTSB);
                const dataTSB = this.getTSBPointer(directoryBlock);

                this.deleteDataBlocks(dataTSB);
                this.clearBlock(fileNameTSB);

                TSOS.Control.tsbTableUpdate();
                return true;
            }

            return false; // File not found
        }

        public fileRename(oldFileName: string, newFileName: string): boolean {
            _Kernel.krnTrace("DSDD Rename.");

            if (this.doesFileExist(newFileName)) return false;

            const oldFileTSB = this.fileNametoTSB(oldFileName);

            if (oldFileTSB) {
                this.updateFileName(oldFileTSB, newFileName);
                TSOS.Control.tsbTableUpdate();
                return true;
            }

            return false; // Old file not found
        }

        public fileCopy(existingFileName: string, newFileName: string): boolean {
            _Kernel.krnTrace("DSDD Copy.");

            if (this.doesFileExist(newFileName)) return false;

            const existingFileTSB = this.fileNametoTSB(existingFileName);

            if (existingFileTSB) {
                this.text = "";
                const directoryBlock = this.getBlock(existingFileTSB);
                const dataTSB = this.getTSBPointer(directoryBlock);
                this.readDataBlocks(dataTSB);

                this.fileCreate(newFileName);
                this.fileWrite(newFileName, this.text.split(""));

                TSOS.Control.tsbTableUpdate();
                return true;
            }

            return false; // Existing file not found
        }

        public fileLs(): string[] {
            _Kernel.krnTrace("DSDD LS.");

            const files: string[] = [];
            for (let s = 0; s < _Disk.sector; s++) {
                for (let b = 0; b < _Disk.block; b++) {
                    const tsb = `0:${s}:${b}`;
                    const block = this.getBlock(tsb);

                    if (block[0] === "1") {
                        const fileName = this.getFileName(block);
                        if (fileName && fileName[0] !== "~" && fileName[0] !== ".") {
                            files.push(fileName);
                        }
                    }
                }
            }

            return files;
        }

        public quickFormat(): void {
            _Kernel.krnTrace("Quick Formatting Disk.");

            const emptyBlock = this.createEmptyBlock();

            for (let t = 0; t < _Disk.track; t++) {
                for (let s = 0; s < _Disk.sector; s++) {
                    for (let b = 0; b < _Disk.block; b++) {
                        const tsb = `${t}:${s}:${b}`;
                        sessionStorage.setItem(tsb, emptyBlock.join(" "));
                    }
                }
            }

            this.isFormatted = false;
            TSOS.Control.tsbTableUpdate();
        }

        // Utility functions
        private createEmptyBlock(): string[] {
            const block = new Array(64).fill("~");
            block[0] = block[1] = block[2] = block[3] = "0";
            return block;
        }

        private getBlock(tsb: string): string[] {
            return sessionStorage.getItem(tsb).split(" ");
        }

        private getTSBPointer(block: string[]): string {
            return `${block[1]}:${block[2]}:${block[3]}`;
        }

        private initializeBlock(tsb: string, fileName: string = ""): void {
            const block = this.createEmptyBlock();
            block[0] = "1"; // Mark as in use

            if (fileName) {
                for (let i = 0; i < fileName.length; i++) {
                    block[i + 4] = fileName.charCodeAt(i).toString(16);
                }
            }

            sessionStorage.setItem(tsb, block.join(" "));
        }

        private updateFileName(tsb: string, newFileName: string): void {
            const block = this.getBlock(tsb);

            for (let i = 4; i < block.length && block[i] !== "~"; i++) {
                block[i] = "~";
            }

            for (let i = 0; i < newFileName.length; i++) {
                block[i + 4] = newFileName.charCodeAt(i).toString(16);
            }

            sessionStorage.setItem(tsb, block.join(" "));
        }

        private deleteDataBlocks(tsb: string): void {
            const block = this.getBlock(tsb);
            const nextTSB = this.getTSBPointer(block);

            if (nextTSB !== "0:0:0") {
                this.deleteDataBlocks(nextTSB);
            }

            this.clearBlock(tsb);
        }

        private clearBlock(tsb: string): void {
            const block = this.createEmptyBlock();
            sessionStorage.setItem(tsb, block.join(" "));
        }

        private linkDirectoryToData(directoryTSB: string, dataTSB: string): void {
            const directoryBlock = this.getBlock(directoryTSB);
            const [t, s, b] = dataTSB.split(":");

            directoryBlock[1] = t;
            directoryBlock[2] = s;
            directoryBlock[3] = b;

            sessionStorage.setItem(directoryTSB, directoryBlock.join(" "));
        }

        private writeData(tsb: string, dataString: string): void {
            let remainingData = dataString;
            let currentTSB = tsb;

            while (remainingData.length > 0) {
                const chunk = remainingData.substring(0, 60);
                remainingData = remainingData.substring(60);

                const nextTSB = remainingData.length > 0 ? this.nextTSBdata() : "0:0:0";
                this.writeDataBlock(currentTSB, chunk, nextTSB);
                currentTSB = nextTSB;
            }
        }

        private writeDataBlock(tsb: string, data: string, nextTSB: string): void {
            const block = this.createEmptyBlock();
            block[0] = "1"; // Mark as in use

            if (nextTSB !== "0:0:0") {
                const [t, s, b] = nextTSB.split(":");
                block[1] = t;
                block[2] = s;
                block[3] = b;
            }

            for (let i = 0; i < data.length; i++) {
                block[i + 4] = data.charCodeAt(i).toString(16);
            }

            sessionStorage.setItem(tsb, block.join(" "));
        }

        private readDataBlocks(tsb: string): void {
            const block = this.getBlock(tsb);
            const nextTSB = this.getTSBPointer(block);

            for (let i = 4; i < block.length; i++) {
                if (block[i] !== "~") {
                    this.text += String.fromCharCode(parseInt(block[i], 16));
                }
            }

            if (nextTSB !== "0:0:0") {
                this.readDataBlocks(nextTSB);
            }
        }

        private nextTSBname(): string {
            for (let s = 0; s < _Disk.sector; s++) {
                for (let b = 1; b < _Disk.block; b++) {
                    const tsb = `0:${s}:${b}`;
                    const block = this.getBlock(tsb);
                    if (block[0] === "0") return tsb;
                }
            }
            throw new Error("No available directory entries.");
        }

        private nextTSBdata(): string {
            for (let t = 1; t < _Disk.track; t++) {
                for (let s = 0; s < _Disk.sector; s++) {
                    for (let b = 0; b < _Disk.block; b++) {
                        const tsb = `${t}:${s}:${b}`;
                        const block = this.getBlock(tsb);
                        if (block[0] === "0") return tsb;
                    }
                }
            }
            throw new Error("No available data blocks.");
        }

        private fileNametoTSB(fileName: string): string | null {
            for (let s = 0; s < _Disk.sector; s++) {
                for (let b = 0; b < _Disk.block; b++) {
                    const tsb = `0:${s}:${b}`;
                    const block = this.getBlock(tsb);

                    if (block[0] === "1" && this.getFileName(block) === fileName) {
                        return tsb;
                    }
                }
            }
            return null;
        }

        private getFileName(block: string[]): string {
            return block.slice(4).reduce((name, code) => {
                if (code === "~") return name;
                return name + String.fromCharCode(parseInt(code, 16));
            }, "");
        }

        public doesFileExist(fileName: string): boolean {
            return this.fileNametoTSB(fileName) !== null;
        }
    }
}
