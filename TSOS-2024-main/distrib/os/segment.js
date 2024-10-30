var TSOS;
(function (TSOS) {
    class Segment {
        SEG;
        ACTIVE;
        constructor(SEG = 0, ACTIVE = null) {
            this.SEG = SEG;
            this.ACTIVE = ACTIVE;
        }
        init() {
            this.SEG = 0;
            this.ACTIVE = false;
        }
    }
    TSOS.Segment = Segment;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=segment.js.map