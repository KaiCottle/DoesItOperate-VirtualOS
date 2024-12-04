var TSOS;
(function (TSOS) {
    class Dsdd {
        isFormatted;
        text = "";
        constructor(isFormatted = false) {
            this.isFormatted = isFormatted;
        }
        fileFormat() {
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
        fileCreate(fileName) {
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
        fileRead(fileName) {
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
        fileWrite(fileName, fileData) {
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
        fileDelete(fileName) {
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
        fileRename(oldFileName, newFileName) {
            _Kernel.krnTrace("DSDD Rename.");
            if (this.doesFileExist(newFileName))
                return false;
            const oldFileTSB = this.fileNametoTSB(oldFileName);
            if (oldFileTSB) {
                this.updateFileName(oldFileTSB, newFileName);
                TSOS.Control.tsbTableUpdate();
                return true;
            }
            return false; // Old file not found
        }
        fileCopy(existingFileName, newFileName) {
            _Kernel.krnTrace("DSDD Copy.");
            if (this.doesFileExist(newFileName))
                return false;
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
        fileLs() {
            _Kernel.krnTrace("DSDD LS.");
            const files = [];
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
        quickFormat() {
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
        createEmptyBlock() {
            const block = new Array(64).fill("~");
            block[0] = block[1] = block[2] = block[3] = "0";
            return block;
        }
        getBlock(tsb) {
            return sessionStorage.getItem(tsb).split(" ");
        }
        getTSBPointer(block) {
            return `${block[1]}:${block[2]}:${block[3]}`;
        }
        initializeBlock(tsb, fileName = "") {
            const block = this.createEmptyBlock();
            block[0] = "1"; // Mark as in use
            if (fileName) {
                for (let i = 0; i < fileName.length; i++) {
                    block[i + 4] = fileName.charCodeAt(i).toString(16);
                }
            }
            sessionStorage.setItem(tsb, block.join(" "));
        }
        updateFileName(tsb, newFileName) {
            const block = this.getBlock(tsb);
            for (let i = 4; i < block.length && block[i] !== "~"; i++) {
                block[i] = "~";
            }
            for (let i = 0; i < newFileName.length; i++) {
                block[i + 4] = newFileName.charCodeAt(i).toString(16);
            }
            sessionStorage.setItem(tsb, block.join(" "));
        }
        deleteDataBlocks(tsb) {
            const block = this.getBlock(tsb);
            const nextTSB = this.getTSBPointer(block);
            if (nextTSB !== "0:0:0") {
                this.deleteDataBlocks(nextTSB);
            }
            this.clearBlock(tsb);
        }
        clearBlock(tsb) {
            const block = this.createEmptyBlock();
            sessionStorage.setItem(tsb, block.join(" "));
        }
        linkDirectoryToData(directoryTSB, dataTSB) {
            const directoryBlock = this.getBlock(directoryTSB);
            const [t, s, b] = dataTSB.split(":");
            directoryBlock[1] = t;
            directoryBlock[2] = s;
            directoryBlock[3] = b;
            sessionStorage.setItem(directoryTSB, directoryBlock.join(" "));
        }
        writeData(tsb, dataString) {
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
        writeDataBlock(tsb, data, nextTSB) {
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
        readDataBlocks(tsb) {
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
        nextTSBname() {
            for (let s = 0; s < _Disk.sector; s++) {
                for (let b = 1; b < _Disk.block; b++) {
                    const tsb = `0:${s}:${b}`;
                    const block = this.getBlock(tsb);
                    if (block[0] === "0")
                        return tsb;
                }
            }
            throw new Error("No available directory entries.");
        }
        nextTSBdata() {
            for (let t = 1; t < _Disk.track; t++) {
                for (let s = 0; s < _Disk.sector; s++) {
                    for (let b = 0; b < _Disk.block; b++) {
                        const tsb = `${t}:${s}:${b}`;
                        const block = this.getBlock(tsb);
                        if (block[0] === "0")
                            return tsb;
                    }
                }
            }
            throw new Error("No available data blocks.");
        }
        fileNametoTSB(fileName) {
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
        getFileName(block) {
            return block.slice(4).reduce((name, code) => {
                if (code === "~")
                    return name;
                return name + String.fromCharCode(parseInt(code, 16));
            }, "");
        }
        doesFileExist(fileName) {
            return this.fileNametoTSB(fileName) !== null;
        }
    }
    TSOS.Dsdd = Dsdd;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=dsdd.js.map