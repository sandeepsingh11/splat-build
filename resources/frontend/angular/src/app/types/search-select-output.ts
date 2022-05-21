export interface SearchSelectOutput {
    selectedItem: string,
    type: 'gear' | 'weapon',
    displayName: string,
    subName?: string,
    specialName?: string
}