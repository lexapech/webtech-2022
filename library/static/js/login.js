function load(){
    try {
        document.querySelector('#username').value = JSON.parse(localStorage['library.login'])
    } catch (e) {}}
function save() { localStorage['library.login']=JSON.stringify(document.querySelector('#username').value) }

async function login(url){
    document.querySelector('#message').style.display='none'

    let incorrect = false
    let username = document.querySelector('#username')
    if (username.value==='') {red(username);incorrect=true}
    let password = document.querySelector('#current-password')
    if (password.value==='') {red(password);incorrect=true}
    if (incorrect) return
    let response = await fetch(
        url, {
        method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
        body: JSON.stringify({username:username.value,password:password.value})
    })
    let resjson = await response.json()
    if(url === '/signup') {
        if (resjson.success) location.href="/"
        else message('Пользователь с таким именем уже зарегистрирован')
        return
    }
    if (resjson.user===true && resjson.password===true) location.href="/"
    else if (resjson.user===true) {
        message('Неверный пароль')
    }
    else {
        message('Пользователь не найден')
    }
}

function message(msg) {

    document.querySelector('#message').innerHTML = msg
    setTimeout( ()=>document.querySelector('#message').style.display='block',100)
}



function red(element) {
    element.style.background="red"
    setTimeout(()=>{element.style="background:white;transition: background 0.5s ease"},250)
}