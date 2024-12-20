import {Event} from 'src/domain/events/event';
import {Period} from 'src/domain/models/period';

export class PeriodicNoteEvent<T extends Period> extends Event<T> {}
