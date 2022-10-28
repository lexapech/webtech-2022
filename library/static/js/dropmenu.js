let deleteId

function bookDropMenuShow(i) {
    let x = document.getElementById("bookDropMenu"+i);
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    }
}
function bookDropMenuHide(i) {
    let x = document.getElementById("bookDropMenu"+i);
    if (x.className.indexOf("w3-show") != -1) {
        x.className = x.className.replace(" w3-show", "");
    }
}

function userDropMenuShow() {
    let x = document.getElementById("userDropMenu");
    if (x.className.indexOf("w3-show") == -1) {
        x.className += " w3-show";
    }
}
function userDropMenuHide() {
    let x = document.getElementById("userDropMenu");
    if (x.className.indexOf("w3-show") != -1) {
        x.className = x.className.replace(" w3-show", "");
    }
}


function deleteShow(i) {
    bookDropMenuHide(i)
    document.querySelector('#deleteModal').style.display='block'
    deleteId=i
}
function deleteHide() {
    document.querySelector('#deleteModal').style.display='none'

}

async function deleteBook() {
    if(deleteId) {
        let url = new URLSearchParams({'id': deleteId.toString()}).toString()
        let response = await fetch(
            '/api/books?' + url,
            {
                method: 'DELETE'
            });
        deleteId=undefined
        if (location !=='/' ) location ='/'
        await loadBooks()
    }
}