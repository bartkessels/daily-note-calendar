import { findCalendarLeafIds } from 'src/presentation/workspace/calendar-leaf-recovery';

describe('findCalendarLeafIds', () => {
    it('finds calendar leaves in nested splits and tabs', () => {
        const layout = {
            main: {
                type: 'split',
                children: [
                    {type: 'leaf', id: 'keep', state: {type: 'daily-note-calendar'}},
                    {
                        type: 'tabs',
                        children: [
                            {type: 'leaf', id: 'ignore', state: {type: 'markdown'}},
                            {type: 'leaf', id: 'duplicate', state: {type: 'daily-note-calendar'}},
                        ],
                    },
                ],
            },
            right: {
                type: 'split',
                children: [{type: 'leaf', id: 'right-calendar', state: {type: 'daily-note-calendar'}}],
            },
        };

        expect(findCalendarLeafIds(layout, 'daily-note-calendar')).toEqual([
            'keep',
            'duplicate',
            'right-calendar',
        ]);
    });

    it('ignores missing and malformed nodes', () => {
        expect(findCalendarLeafIds(null, 'daily-note-calendar')).toEqual([]);
        expect(findCalendarLeafIds({main: {type: 'split', children: [null, 'leaf']}}, 'daily-note-calendar')).toEqual([]);
    });

    it('does not treat a leaf with another view type as a calendar leaf', () => {
        const layout = {type: 'leaf', id: 'other', state: {type: 'calendar-hub'}};

        expect(findCalendarLeafIds(layout, 'daily-note-calendar')).toEqual([]);
    });
});
