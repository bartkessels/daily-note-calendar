import {NoteManager} from "src/domain/managers/note.manager";
import {Event} from "src/domain/events/Event";
import {Day} from "src/domain/models/Day";
import {SettingsRepository} from "src/domain/repositories/settings.repository";

export class DailyNoteManager implements NoteManager<Day> {
    constructor(
        readonly event: Event<Day>,
        private readonly settingsRepository: SettingsRepository
    ) {
        event.onEvent(async (day) => await this.tryOpenNote(day));
    }

    public async tryOpenNote(day: Day) : Promise<void> {
        console.log(`Opening note for ${day.date}`);
    }
}