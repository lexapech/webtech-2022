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
    window.location="game.html"
}
function store(source) {
    localStorage["nt.username"] = source;
}
function readFromStorage() {
    return localStorage["nt.username"];
}
