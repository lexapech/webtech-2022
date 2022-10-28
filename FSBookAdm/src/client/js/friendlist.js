let filler=`<div class="vertical-center" style="height: 100%;width:100%">
<h3 style="text-align: center">Ничего не найдено</h3>
</div>`

let friendList=[]
let friendsTemplate = `<%list.forEach((user)=>{%>
    <div class="friend <%=user.banned?'blocked':''%>" onclick="location.href='<%='/users?id='+user.id%>'">
      <img src="<%=user.avatar%>">
      <span>
      <%=user.firstname%><br>
      <%=user.lastname%><br>
      <%if(user.banned){%>(Заблокирован)<%}%></span>
    </div>
    <%})%>`

let getFriends = (all) =>{
    let query = location.search
    console.log(query)
    let params = new URLSearchParams(query)
    console.log(params)
    $.get(`/api/friends?id=${params.get('id')}&all=${all}`,(list,resStatus)=>{
        if (resStatus!=='success') return
        list=JSON.parse(list)
        friendList=list.users
        if (list.name)
            $("#title-span").html(`Друзья ${list.name}`)
        render(friendList)
    });
}

$(document).ready(function () {
    getFriends(false)

    $(".title").click(function(){
        location.href="/users";
    })

    $(".filter").click(function(){
        $(this).next().css("display","block").parent()
    })
    $(".filter-container").mouseleave(function(){
        $(this).find(".dropdown").css("display","none")

    })
    $(".filter-checkbox").change(function(){
        let showall=$(".filter-checkbox").is(':checked')
        getFriends(showall)
    })

})


function render(list) {
    if (list.length===0) {
        $(".friends").html(filler)
        return
    }
    let friends = ejs.render(friendsTemplate,{list: list})
    $(".friends").html(friends)

}