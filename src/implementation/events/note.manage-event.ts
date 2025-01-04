import { ManageEvent } from "src/domain/events/manage.event";
import {Note} from 'src/domain/models/note';

export class NoteManageEvent extends ManageEvent<Note> {}