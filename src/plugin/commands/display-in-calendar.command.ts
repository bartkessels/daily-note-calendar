import {Command} from 'obsidian';
import {ManageAction, ManageEvent} from 'src/domain/events/manage.event';
import {Day} from 'src/domain/models/day';
import {NoteAdapter} from 'src/domain/adapters/note.adapter';
import {DateRepository} from 'src/domain/repositories/date.repository';

export class DisplayInCalendarCommand implements Command {
    public id: string = 'dnc-display-in-calendar';
    public name: string = 'Display the current note in the calendar';

    constructor(
        private readonly noteAdapter: NoteAdapter,
        private readonly dateRepository: DateRepository,
        private readonly manageDayEvent: ManageEvent<Day>
    ) {

    }

    public callback: (() => any) = (): void => {
        this.noteAdapter.getActiveNote().then((note) => {
            // TODO: Check if we want the date from the file properties or from the frontmatter

            if (note) {
                const day = this.dateRepository.getDay(note?.createdOn);
                this.manageDayEvent.emitEvent(ManageAction.Preview, day);
            }
        })
    };
}