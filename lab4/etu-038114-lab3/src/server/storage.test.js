import Storage from './storage.js'
let storage = new Storage()

test("insert",()=>{
    storage.delete(x=>true,storage.test)
    storage.insert({f1:"1",f2:"2"},storage.test)
    expect(storage.select(x=>true,storage.test)).toStrictEqual([{id:"1",f1:"1",f2:"2"}])
})

test("update",()=>{
    storage.delete(x=>true,storage.test)
    storage.insert({f1:"1",f2:"2"},storage.test)
    storage.update({f1:"2",f2:"3"},(x)=>x.f1==="1",storage.test)
    expect(storage.select(x=>true,storage.test)).toStrictEqual([{id:"1",f1:"2",f2:"3"}])
})

test("delete",()=>{
    storage.delete(x=>true,storage.test)
    storage.insert({f1:"1",f2:"2"},storage.test)
    storage.delete((x)=>x.f1==="1",storage.test)
    expect(storage.select(x=>true,storage.test)).toStrictEqual([])
})