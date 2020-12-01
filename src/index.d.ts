export interface DbOption {
  url: string
  token: string
  projectID: string | number
}

export interface DbUpdateOption {
  upsert?: boolean
  multi?: boolean
}
