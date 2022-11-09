export default interface Message {
    content:any,
    from:string,
    to:string,
    read:boolean
    timestamp: string|null
    id:string|null
}