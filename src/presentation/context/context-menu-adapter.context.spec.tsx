import {mockContextMenuAdapter} from 'src/test-helpers/context-menu.mocks';
import React, {ReactNode} from 'react';
import {ContextMenuAdapterContext, getContextMenuAdapter} from 'src/presentation/context/context-menu-adapter.context';
import {renderHook} from '@testing-library/react';

describe('ContextMenuAdapterContext', () => {
    const contextMenuAdapter = mockContextMenuAdapter;

    it('provides the ContextMenuAdapter instance', () => {
        // Arrange
        const wrapper = ({children}: { children: ReactNode }) => (
            <ContextMenuAdapterContext.Provider value={contextMenuAdapter}>
                {children}
            </ContextMenuAdapterContext.Provider>
        );

        // Act
        const { result } = renderHook(() => getContextMenuAdapter(), {wrapper});

        // Assert
        expect(result.current).toBe(contextMenuAdapter);
    });

    it('returns null when no ContextMenuAdapter is provided', () => {
        // Act
        const { result } = renderHook(() => getContextMenuAdapter());

        // Assert
        expect(result.current).toBeNull();
    });
});