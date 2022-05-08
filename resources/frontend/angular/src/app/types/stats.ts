export interface Stats {
    name: string,
    displayName: string,
    effects: Effect[]
}

export interface Effect {
    name: string,
    value: number,
    percent: number
}