async function updateBook(id) {
    let incorrect =false
    let title = document.querySelector('#title')
    if (title.value ==='') {red(title);incorrect=true}
    let author = document.querySelector('#authorName')
    if (author.value ==='') {red(author);incorrect=true}
    if (isNaN(Date.parse(document.querySelector('#pubDate').value))){red(document.querySelector('#pubDate'));incorrect=true}
    let date = new Date(document.querySelector('#pubDate').value).toISOString().slice(0,10)
    let desc = document.querySelector('#description').value
    if (incorrect) return
    let data ={id:id,title:title.value,author:author.value,publication_date:date,description:desc}
    let url = new URLSearchParams({'id': id.toString()}).toString()
    let response = await fetch(
        '/api/edit?' + url,
        {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
    let res = await response.json()
    location.href="/books/"+res.id
}

function red(element) {
    element.style.background="red"
    setTimeout(()=>{element.style="background:white;transition: background 0.5s ease"},250)
}