import {EventEmitter} from "events";
import {FileManager} from "src/domain/managers/file.manager";
import {Day} from "src/domain/models/Day";
import {Week} from "src/domain/models/Week";
import {Month} from "src/domain/models/Month";

export abstract class NoteRepository extends EventEmitter {

    constructor(
        private readonly fileManager: FileManager
    ) {
        super();
    }

    public onDayClicked(day?: Day): void {
        if (day) {
            this.emit("day", day);
        }
    }

    public onWeekClicked(week?: Week): void {
        if (week) {
            this.emit("week", week);
        }
    }

    public onMonthClicked(month?: Month): void {
        if (month) {
            this.emit("month", month);
        }
    }
}