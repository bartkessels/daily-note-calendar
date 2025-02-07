import { ManageEvent } from "src-old/domain/events/manage.event";
import {Note} from 'src-old/domain/models/note';

export class NoteManageEvent extends ManageEvent<Note> {}