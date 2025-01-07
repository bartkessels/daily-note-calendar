import {createContext, useContext} from 'react';
import {Note} from 'src/domain/models/note';
import {ManageEvent} from 'src/domain/events/manage.event';

export const ManageNoteEventContext = createContext<ManageEvent<Note> | null>(null);
export const getManageNoteEvent = (): ManageEvent<Note> | null => {
    return useContext(ManageNoteEventContext);
}
