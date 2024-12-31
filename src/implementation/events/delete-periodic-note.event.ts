import {Period} from 'src/domain/models/period';
import {Event} from 'src/domain/events/event';

export class DeletePeriodicNoteEvent<T extends Period> extends Event<T> {}