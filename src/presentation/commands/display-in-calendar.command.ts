import {Command} from 'obsidian';
import {NoteManager} from 'src/business/contracts/note.manager';
import {CalendarViewModel} from 'src/presentation/view-models/calendar.view-model';

export class DisplayInCalendarCommand implements Command {
    public id: string = 'dnc-display-in-calendar';
    public name: string = 'Display the current note in the calendar';

    constructor(
        private readonly noteManager: NoteManager,
        private readonly calenderViewModel: CalendarViewModel
    ) {

    }

    public callback: (() => any) = (): void => {
        this.noteManager.getActiveNote().then((note) => {
           // TODO:
        });

        // TODO: Get the current note and display it in the calendar
    };
}