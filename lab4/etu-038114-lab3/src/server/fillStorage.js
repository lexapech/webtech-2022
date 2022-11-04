import Storage from './storage.js'

let storage = new Storage()
storage.delete(()=>true,storage.users)
storage.delete(()=>true,storage.friends)
storage.delete(()=>true,storage.news)
storage.insert({firstname:"Алексей", midname:"Сергеевич",lastname:"Печеркин",birthday:null,email:"lexa.pech@yandex.ru",role:"admin",status:"active",avatar:"https://sun9-6.userapi.com/s/v1/ig2/uZm621aJXpySeIsZD7JwCjs2LG2Q12ctGiozOg6-i70QoziU_L6s38vrlKe34uQp66Vs_KSxFrsEXyKbvuH4ZLQt.jpg?size=200x200&quality=96&crop=224,1,764,764&ava=1"},storage.users)
storage.insert({firstname:"Наталья", midname:"Сергеевна",lastname:"Странникова",birthday:"2002-06-05",email:"nsstrannikova@mail.ru",role:"admin",status:"active",avatar:"https://sun9-26.userapi.com/s/v1/ig2/nqX6rAx1Jwl6IHPByzEMDt01XCi0t2XaCGUWCHhxTl9Aq9htphmA6uyfXjAM5LLW_1Ma-q8U2TiyoQAdY29gGCOs.jpg?size=200x200&quality=95&crop=202,186,603,603&ava=1"},storage.users)
storage.insert({firstname:"Николай", midname:"Эдуардович",lastname:"Ибатов",birthday:"2002-04-28",email:"nikolaieduardovich@yandex.ru",role:"user",status:"unverified",avatar:"IMG_1209.jpg"},storage.users)
storage.insert({firstname:"Никита", midname:"Дмитриевич",lastname:"Ефимов",birthday:"2002-08-23",email:"nikitaef2002@gmail.com",role:"user",status:"banned",avatar:"CF96EAF0-6EEF-4BE1-B573-1D56AB447F5C.jpg"},storage.users)
storage.insert({firstname:"Анатолий", midname:"Евгеньевич",lastname:"Хмарский",birthday:"2002-04-05",email:"tucha.989@gmail.com",role:"user",status:"active",avatar:"https://sun9-44.userapi.com/s/v1/if1/psbQvU0NzSFX5e8A3VVKn0UfFN-XS9tsG3r8tfQHLtYoX73VH8wSTsJ1iDBVKtKS07uoGqOT.jpg?size=200x200&quality=96&crop=28,0,954,954&ava=1"},storage.users)
storage.insert({firstname:"Екатерина", midname:"Михайловна",lastname:"Степанова",birthday:"2002-05-15",email:"stepkate125@gmail.com",role:"user",status:"active"},storage.users)

for(let i=0;i<6;i++) {
    for(let j=i+1;j<6;j++) {
        storage.insert({user1:(i+1).toString(),user2:(j+1).toString()},storage.friends)
    }
}
storage.insert({id:"1",authorid:"4",available:"true",date:"2022-10-17T14:06:00",content:{image:"https://psv4.userapi.com/c235031/u288340440/docs/d25/e1c132f341fe/venom-treasure-island.gif?extra=tbwsFrzbLpCNGtUSFMtrxUjrExen0Hw13dV08C4u9k6fku25b7AXFWYjU9ZZhn4TFjD2Bxv1hAZuJHgOmq2T7wjHmIK2H-uJzUUYAyle3ksRRymdwyunp9cyZQnhWLXu-sMlASuyGIc7h5sej2ZTsZdw",text:"Шагаем к балтрашевичу"}},storage.news);
storage.insert({id:"2",authorid:"1",available:"true",date:"2022-10-17T14:19:00",content:{image:"https://psv4.userapi.com/c237331/u69100864/docs/d45/f05a966ef8f4/14-16-44-long-john-silver-long-john.gif?extra=lMRwbADLUav5Qv-wwXPpdsoFAgyAD1RQ68oGQDMvR9o1q4AzCKOFBBmiL1lpA8Cm-7oEWCSWj2KY1mQBr8mLDP9RqP2OhsyIVzDGQ5wB9ZD1eE-N1lE7mSIHPf0NeKw3BNar_cFCU-7QuA",text:"А вот и балтрашевич идет"}},storage.news);


