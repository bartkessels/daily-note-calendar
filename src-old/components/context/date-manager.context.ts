import {createContext, useContext} from 'react';
import {DateManager} from 'src-old/domain/managers/date.manager';

export const DateManagerContext = createContext<DateManager | null>(null);
export const useDateManager = (): DateManager | null => {
    return useContext(DateManagerContext);
}
