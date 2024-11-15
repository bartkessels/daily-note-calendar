import {Event} from 'src/domain/events/event';
import {Year} from 'src/domain/models/year';

export class YearlyNoteEvent extends Event<Year>  {
}