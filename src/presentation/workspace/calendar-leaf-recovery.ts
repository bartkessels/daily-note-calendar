export type WorkspaceLayoutNode = {
    id?: string;
    type?: string;
    state?: {
        type?: string;
    };
    children?: WorkspaceLayoutNode[];
    [key: string]: unknown;
};

/**
 * Find saved leaves that belong to the calendar view. Obsidian keeps these
 * leaves in the workspace layout even while the view type is not registered,
 * which is what happens when a plugin manager delays this plugin's onload.
 */
export function findCalendarLeafIds(layout: unknown, viewType: string): string[] {
    const ids = new Set<string>();

    const visit = (node: unknown): void => {
        if (node === null || typeof node !== 'object') {
            return;
        }

        const candidate = node as WorkspaceLayoutNode;
        if (
            candidate.type === 'leaf' &&
            typeof candidate.id === 'string' &&
            candidate.state?.type === viewType
        ) {
            ids.add(candidate.id);
        }

        for (const value of Object.values(candidate)) {
            if (Array.isArray(value)) {
                value.forEach(visit);
            } else if (value !== null && typeof value === 'object') {
                visit(value);
            }
        }
    };

    visit(layout);
    return [...ids];
}
