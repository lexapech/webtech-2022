let giveId
async function ret(id) {
    let url = new URLSearchParams({'id': id.toString()}).toString()
    let response = await fetch(
        '/api/return?' + url,
        {
            method: 'PUT'
        });
    location.reload()
}
function showGiveModal(id) {
    giveId=id
    document.querySelector('#giveDialog').showModal()
    //document.querySelector('#giveDialog').style.display='block'
}
function hideGiveModal() {
    document.querySelector('#giveDialog').close()
   // document.querySelector('#giveDialog').style.display='none'
}
async function give() {
    let name = document.querySelector('#readerName')
    let date = document.querySelector('#returnDate')
    let regexpName = /^[a-zA-Zа-яА-Я]*\s(([a-zA-Zа-яА-Я]*)|([a-zA-Zа-яА-Я]\.))\s(([a-zA-Zа-яА-Я]*)|([a-zA-Zа-яА-Я]\.))$/u
    let t=0
    let namestr = name.value.trim()
    if(regexpName.test(namestr)) {
        t++
    }
    else {
        name.style.background="red"
        setTimeout(()=>{name.style="background:white;transition: background 0.5s ease"},250)
    }
    if(!isNaN(Date.parse(date.value)) && Date.parse(date.value) > Date.now()) {
        t++
    }
    else {
        date.style.background="red"
        setTimeout(()=>{date.style="background:white;transition: background 0.5s ease"},250)
    }
    if (giveId && t===2) {
        hideGiveModal()
        let url = new URLSearchParams({'id': giveId.toString()}).toString()
        let date2 = new Date(date.value)
        date2 = date2.toISOString().slice(0,10)
        let response = await fetch(
            '/api/give?' + url,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name:namestr,return_date: date2})
            });
        giveId=undefined
        location.reload()
    }

}


