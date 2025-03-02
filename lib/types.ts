// added by hawon
// represent variable types of each json
export interface ScoreData {
    date: string
    score: number
}
export interface KidData {
    id: string
    name: string
    scores: ScoreData[]
}
