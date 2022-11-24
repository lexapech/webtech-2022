
function load() {
    try {
    let records = JSON.parse(localStorage['nt.records'])
    let string = ""

    for (let i = 0; i < Math.min(records.length, 10); i++) {
        let time =new Date(records[i].time)
        if (time !== undefined){
            let minutes = time.getMinutes()
            let seconds = time.getSeconds()
            string += "<tr><td>" + (i + 1) + "</td><td>" +(minutes < 10 ? "0" + minutes : minutes) +":"+(seconds < 10 ? "0" + seconds : seconds) + "</td>" + "<td>" + records[i].playerName + "</td>" + "<td>" + records[i].playerScore + "</td></tr>"

        }
        else string += "<tr><td>" + (i + 1) + "</td><td>-</td><td>" + records[i].playerName + "</td>" + "<td>" + records[i].playerScore + "</td></tr>"
    }
    document.getElementById("table").insertAdjacentHTML("beforeend", string)
    }
    catch(e) {
        console.log("no records")
    }
}