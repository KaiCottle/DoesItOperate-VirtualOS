module TSOS {
    export class pcb {
        public priotrity : number;
        public programCounter : number;
        public acc : number;
        public XRegister : number;
        public YRegister : number;
        public ZFlag : number;
        public processID : number;
        public processState : string; // Status Options: New, Ready, Resident, Executing, Terminated -> Referenced from my wonderful girlfriend
        public baseRegister : number;
        public limitRegister : number;
        public isInMemory : boolean;
        public memSegment: number;
        public waitTime: number;
        public turnAroundTime: number;
        public lastSleepCycle: number;
        public loadCycle: number;
    }
}