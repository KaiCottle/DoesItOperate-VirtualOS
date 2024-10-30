module TSOS {

    export class Segment {
        constructor(
            public SEG: number = 0,
            public ACTIVE: boolean = null
            )
             {
        }
        
        public init(): void {
            this.SEG = 0;
            this.ACTIVE = false;
         
        }

    }
}