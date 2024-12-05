export interface Period<P extends PeriodProperty> {
    date: Date,
    properties: P[]
}

export interface PeriodProperty {}