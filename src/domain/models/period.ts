export interface Period {
    date: Date,
    properties: PeriodProperty
}

export interface PeriodProperty {
    hasPeriodicNote: boolean
}