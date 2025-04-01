export interface ContextMenuAdapter {
    show(xPosition: number, yPosition: number, callbacks: ContextMenuCallbacks): void;
    hide(): void;
}

export interface ContextMenuCallbacks {
    openInHorizontalSplitView: () => void;
    openInVerticalSplitView: () => void;
    onDelete: () => void;
}