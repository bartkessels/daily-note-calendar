import {Note} from 'src/domain/models/note.model';

/* eslint-disable no-restricted-globals */
self.onmessage = async function (e: MessageEvent<() => Promise<Note[]>>): Promise<void> {
    const notes = await e.data();
    self.postMessage(notes);
}

export {}