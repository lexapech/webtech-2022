
function load() {
    try {
    let records = JSON.parse(localStorage['nt.records'])
    let string = ""

    for (let i = 0; i < Math.min(records.length, 10); i++) {
        let time =new Date(records[i].time)
        if (time !== undefined)
            string += "<tr><td>" + (i + 1) + "</td><td>" + time.getMinutes()+":"+time.getSeconds() + "</td>" + "<td>" + records[i].playerName + "</td>" + "<td>" + records[i].playerScore + "</td></tr>"
        else string += "<tr><td>" + (i + 1) + "</td><td>-</td><td>" + records[i].playerName + "</td>" + "<td>" + records[i].playerScore + "</td></tr>"
    }
    document.getElementById("table").insertAdjacentHTML("beforeend", string)
    }
    catch(e) {
        console.log("no records")
    }
}