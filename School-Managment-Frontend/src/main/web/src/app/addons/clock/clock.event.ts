import { Time } from "@angular/common";

export interface ClockEvent {
    time: Time;
    message: string;
}

export const clockEvents: ClockEvent[] = (() => {
    const firstHoure = { time: { hours: 8, minutes: 10 } as Time, message: "1 Stunde" } as ClockEvent;
    const secondHoure = { time: { hours: 8, minutes: 55 } as Time, message: "2 Stunde" } as ClockEvent;

    const firstBreak = { time: { hours: 9, minutes: 40 } as Time, message: "1 Pause" } as ClockEvent;

    const thirdHoure = { time: { hours: 10, minutes: 0 } as Time, message: "3 Stunde" } as ClockEvent;
    const fourthHoure = { time: { hours: 10, minutes: 45 } as Time, message: "4 Stunde" } as ClockEvent;

    const secondBreak = { time: { hours: 11, minutes: 30 } as Time, message: "2 Pause" } as ClockEvent;

    const fithHoure = { time: { hours: 11, minutes: 45 } as Time, message: "5 Stunde" } as ClockEvent;
    const sixthHoure = { time: { hours: 12, minutes: 30 } as Time, message: "6 Stunde" } as ClockEvent;

    const thirdBreak = { time: { hours: 13, minutes: 15 } as Time, message: "3 Pause" } as ClockEvent;

    const seventhHoure = { time: { hours: 13, minutes: 35 } as Time, message: "7 Stunde" } as ClockEvent;
    const aigthHoure = { time: { hours: 14, minutes: 20 } as Time, message: "8 Stunde" } as ClockEvent;

    const fouthBreak = { time: { hours: 15, minutes: 5 } as Time, message: "4 Pause" } as ClockEvent;

    return [
        firstHoure,
        secondHoure,
        firstBreak,
        thirdHoure,
        fourthHoure,
        secondBreak,
        fithHoure,
        sixthHoure,
        thirdBreak,
        seventhHoure,
        aigthHoure,
        fouthBreak,
    ];
})();
