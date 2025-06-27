export type Session = {
  "_id": string,
  "pdfs": PDF[],
  "created_at": string,
  "name": string
}

export interface PDF{
  name:string,
  url:string,
  id:string
}