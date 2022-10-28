


async function loadBooks() {
    let available = document.querySelector('#available').checked
    let expired = document.querySelector('#expired').checked
    let bookList = document.querySelector('#booklist')
    let url = new URLSearchParams({'available':available.toString(),'expired':expired.toString()}).toString()
    let response = await fetch(
        '/api/books?'+url,
        {
            method: 'GET'
        });
     bookList.innerHTML = await response.text()

}



function filterLoad() {
    try {
        let filter = JSON.parse(localStorage['library.filter'])
        document.querySelector('#available').checked = filter.available
        document.querySelector('#expired').checked = filter.expired
    }
    catch (e) {}
}

function filterShow() {
    filterLoad()
    document.querySelector('#filter').style.display='block'
}

async function filterHideApply() {
    document.querySelector('#filter').style.display='none'
    let available = document.querySelector('#available').checked
    let expired = document.querySelector('#expired').checked
    localStorage['library.filter'] = JSON.stringify({available: available,expired: expired})
    await loadBooks()
}


async function filterHide() {
    document.querySelector('#filter').style.display='none'

}

