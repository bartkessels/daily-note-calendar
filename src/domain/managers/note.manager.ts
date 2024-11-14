export interface NoteManager<T> {
    tryOpenNote(note: T): Promise<void>;
}