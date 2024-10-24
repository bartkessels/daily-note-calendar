import { createContext, useContext } from 'react';
import { DateRepository } from 'src/domain/repositories/DateRepository';

export const DateRepositoryContext = createContext<DateRepository | null>(null);
export const UseDateRepository = (): DateRepository | null => {
    return useContext(DateRepositoryContext);
};
