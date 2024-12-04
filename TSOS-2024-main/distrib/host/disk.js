var TSOS;
(function (TSOS) {
    class Disk {
        track;
        sector;
        block;
        blockMemory;
        constructor(track = 4, sector = 8, block = 8, blockMemory = 64) {
            this.track = track;
            this.sector = sector;
            this.block = block;
            this.blockMemory = blockMemory;
        }
    }
    TSOS.Disk = Disk;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=disk.js.map