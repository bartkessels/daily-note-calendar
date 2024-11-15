import {Event} from 'src/domain/events/event';
import {Month} from 'src/domain/models/month';

export class MonthlyNoteEvent extends Event<Month>  {
}