let filler=`<div class="vertical-center" style="height: 100%">
<h3 style="text-align: center">Ничего не найдено</h3>
</div>`

let userList=[]
let usersTemplate
let options
let changed=false
let editedUser=null;
let sorts={
    "fn": (a,b)=>a.firstname.localeCompare(b.firstname),
    "mn": (a,b)=>a.midname.localeCompare(b.midname),
    "ln": (a,b)=>a.lastname.localeCompare(b.lastname),
    "bd": (a,b)=>new Date(a.birthday) -new Date( b.birthday),
    "em": (a,b)=>a.email.localeCompare(b.email),
    "rl": (a,b)=>a.role.localeCompare(b.role),
    "st": (a,b)=>a.status.localeCompare(b.status)
}
let dir={
    "fn": 0,
    "mn": 0,
    "ln": 0,
    "bd": 0,
    "em": 0,
    "rl": 0,
    "st": 0
}


let getUsers = (search) =>{
    let query = location.search
    console.log(query)
    let params = new URLSearchParams(query)
    if (params.get('id')) {
        $.get("/api/users?id=" + params.get('id'), (list, resStatus) => {
            if (resStatus !== 'success') return
            list = JSON.parse(list)
            userList = list.users
            render(userList)
        });
    }
    else {
        if(search!=="") {
            search = "?search=" + search
        }
        $.get("/api/users" + search, (list, resStatus) => {
            if (resStatus !== 'success') return
            list = JSON.parse(list)
            userList = list.users
            render(userList)
        });
    }

}


let getOptions = () => {
    return $.get("/api/users/options");
}
let getTemplate = () => {
    return $.get("/api/users/template");
}

$(document).ready(async function () {


    let query = location.search
    let params = new URLSearchParams(query)
    if(params.get('id')) {
        $(".search-container").css("visibility","hidden")
        $(".title").click(function(){
            location.href="/users";
        })
    }

    usersTemplate = await getTemplate()
    options = JSON.parse(await getOptions())
    getUsers("")
    let showHideTimeout = null
    $(".search-btn").click(function () {
        if (showHideTimeout) clearTimeout(showHideTimeout)
        let text = $(".search-text")
        text.css("visibility", "visible")
        text.css("transition", "width 0.5s ease, padding 0.5s ease")

        text.css("width", "min(300px, calc(100vw - 100px))")
        text.css("padding", "6px 12px");
        text.focus()
        //showHideTimeout=setTimeout(()=>{},500)
    });

    $(".dropdown").mouseleave(function () {
        $(".dropdown").css("display", "none");
    })
    $(".dropdown > div > #edit").click(function (event) {
        let drop = $(".dropdown")
        drop.css("display", "none");
        let rowid = drop.data("row")
        $("#" + rowid).addClass("edit")
        $("#" + rowid + "> td > span").css("visibility", "hidden")
        $("#" + rowid + "> td > .editdiv").css("display", "block")
        event.stopPropagation();
        $("#" + rowid).click(function (e) {
            console.log("stop")
            e.stopPropagation()
        })

    })
    $(".dropdown > div > #friends").click(function (event) {
        let userid = $(".dropdown").data("row").replace("row", "")
        location.href = "/friends?id=" + userid
        console.log("friends")
    })
    $(".dropdown > div > #news").click(function (event) {
        let userid = $(".dropdown").data("row").replace("row", "")
        location.href = "/news?id=" + userid
        console.log("news")
    })
    let text = $(".search-text")
    text.blur(function () {
        if (showHideTimeout) clearTimeout(showHideTimeout)
        if (text.val() === "") {
            text.css("transition", "width 0.5s ease 0.2s, padding 0.5s ease 0.2s")
            text.css("width", "0")
            text.css("padding", "0")
            showHideTimeout = setTimeout(() => {
                text.css("visibility", "collapse")

            }, 500)
        }
    });
    let inputTimeout = null
    text.on('input', function () {
        if (inputTimeout) clearTimeout(inputTimeout);
        inputTimeout = setTimeout(() => {
            let textval = text.val()
            getUsers(textval)
        }, 300)
    });

    $("body").bind("click keydown", function (event) {
        if (event.key !== "Enter" && event.key !== "Escape" && event.type !== "click") return
        let row = $(".edit")
        if (event.target.classList.contains("ui-menu-item-wrapper")) return
        if (!row.get(0)) return
        if (event.target.parentNode.id !== row.get(0).id && row.hasClass("edit")) {

            $(".edit > td > span").css("visibility", "visible")
            $(".edit > td > .editdiv").css("display", "none")
            let arr = []
            $(".edit > td > .editdiv > input,.edit > td > .editdiv > select").each(function () {
                arr[arr.length] = $(this).val()
            })

            let attrList = ["lastname", "firstname", "midname", "birthday", "email", "role", "status"]
            let user = userList.find((r) => r.id === row.get(0).id.replace("row", ""))
            let newuser = {id: user.id}
            console.log(newuser)
            console.log(user)
            for (let i = 0; i < attrList.length; i++) {
                if (arr[i] !== user[attrList[i]]) {
                    newuser[attrList[i]] = arr[i]
                    console.log(i)
                    changed = true
                }
            }
            console.log(arr)
            row.off('click')
            addRowEvent(".edit")
            row.removeClass("edit")
            if (changed) {
                changed = false
                editedUser = newuser
                $('#saveModal').modal('show');
            }

        }



    })

    $("#saveBtn").click(function () {
        console.log("save");
        $('#saveModal').modal('hide');

        if (editedUser) {
            $.ajax({
                url: '/api/users/edit',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                success: function (res) {
                    //return
                    let updatedUser=res.user
                    userList = userList.map((r)=>r.id===updatedUser.id?updatedUser:r)
                    console.log(userList)
                    render(userList)
                },
                data: JSON.stringify(editedUser)
            });
        }
    })
});



function render(list) {
    if (list.length===0) {
        $(".users").html(filler)
        return
    }

    let users = ejs.render(usersTemplate,{users: list,options:options})
    $(".users").html(users)
    $(".sort").click(function(){
        let mode =$(this).get(0).id
        let sorted = Array.from(userList)
        sorted.sort(sorts[mode])
        dir[mode]=(dir[mode]+1)%2
        if(dir[mode]===1) sorted.reverse()

        render(sorted)
    });
    /*$(".editdiv >select").each(function () {
        $(this).selectmenu();
        $(this).addClass("select")
    })*/

    addRowEvent(".row")

}

function addRowEvent(row) {
    $(row).click(function(event){
        let drop = $(".dropdown")
        let rowid =drop.data("row")
        if($(".edit").get(0) && changed) return
        if($(this).hasClass("edit")) return

        drop.css({"left":Math.min(event.pageX-10,window.innerWidth-130),
            "top":Math.min(event.pageY-10,window.innerHeight-100),"display": "block"});
        drop.data("row",$(this).get(0).id)
        //event.stopPropagation();
    });

}
