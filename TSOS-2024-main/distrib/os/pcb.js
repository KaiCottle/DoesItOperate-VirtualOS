var TSOS;
(function (TSOS) {
    class pcb {
        priotrity;
        programCounter;
        acc;
        XRegister;
        YRegister;
        ZFlag;
        processID;
        processState; // Status Options: New, Ready, Resident, Executing, Terminated -> Referenced from my wonderful girlfriend
        baseRegister;
        limitRegister;
        isInMemory;
        memSegment;
        waitTime;
        turnAroundTime;
        lastSleepCycle;
        loadCycle;
    }
    TSOS.pcb = pcb;
})(TSOS || (TSOS = {}));
//# sourceMappingURL=pcb.js.map