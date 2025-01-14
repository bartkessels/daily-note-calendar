export interface OpenNoteManager<T> {
    tryOpenNote(note: T): Promise<void>;
}