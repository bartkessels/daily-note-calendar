import {EventEmitter} from "node:events";
import {FileManager} from "src/domain/managers/file.manager";
import {OpenEvent} from "src/domain/events/open.event";

export abstract class NoteRepository {
    selectedDate: EventEmitter<OpenEvent>;

    constructor(
        private readonly fileManager: FileManager
    ) {

    }

    openDailyNote(date?: Date): Promise<void> {
        this.selectedDate.emit<Date>("note", date);

        return this.fileManager.tryOpenDailyNote(date);
    }
    abstract openWeeklyNote(date?: Date): Promise<void>;
}