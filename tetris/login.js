function load() {
    let name=readFromStorage()
    console.log("load")
    document.getElementById('name').value = name
    console.log(name)
}
function login() {
    console.log("login")
    let name = document.getElementById('name').value
    if(name==="") return
    console.log(name)
    store(name)
    window.location="main.html"
}
function store(source) {
    localStorage["tetris.username"] = source;
}
function readFromStorage() {
    return localStorage["tetris.username"];
}
