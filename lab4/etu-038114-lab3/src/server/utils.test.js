import {search,getUserInfo,userFriendInfo,userConverter,friendInfo,getGenitive,createUser, postConverter,getPost} from './utils.js'

test("search",()=>{
    let data=[{f1:"abc",f2:"cde"},{f1:"a",f2:"abcd"}]

    expect(data.filter((x)=>search(x,"a"))).toStrictEqual([{f1:"abc",f2:"cde"},{f1:"a",f2:"abcd"}])
})

test("userFriendInfo",()=>{
    let data={id:"12",firstname:"abc",lastname:"cde",avatar:"abc"}

    expect(userFriendInfo(data)).toStrictEqual({id:"id12",firstname:"abc",lastname:"cde",avatar:"http://localhost:3000/abc"})
})
