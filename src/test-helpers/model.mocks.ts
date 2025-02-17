import {Note} from 'src/domain/models/note.model';
import {Period, PeriodType} from 'src/domain/models/period.model';
import {PeriodNoteSettings} from 'src/domain/settings/period-note.settings';

export const mockDailyNoteSettings = <PeriodNoteSettings> {
    folder: 'daily-notes',
    nameTemplate: 'yyyy-MM-dd',
    templateFile: 'path'
}

export const mockPeriod = <Period> {
    date: new Date(2023, 9, 2),
    name: '2',
    type: PeriodType.Day
};

export const mockNoteWithCreatedOnProperty = <Note> {
    createdOn: <Period> {
        date: new Date(2023, 9, 2),
        name: '2',
        type: PeriodType.Day
    },
    createdOnProperty: <Period> {
        date: new Date(2023, 9, 2),
        name: '2',
        type: PeriodType.Day
    },
    name: 'How to use Github',
    path: 'notes/how-to-use-github.md',
    properties: new Map<string, string>()
};