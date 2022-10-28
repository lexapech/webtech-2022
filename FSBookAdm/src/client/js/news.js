
let newsList=[]
let filler=`<div class="vertical-center" style="height: 100%">
<h3 style="text-align: center">Ничего не найдено</h3>
</div>`
let postTemplate = `<br>
<%list.forEach((post)=>{%>
<div class="post <%=post.available?'':'blocked'%>">
    <header class="post-header">
        <div class="post-author" >
            <img class="<%=post.authorBanned?'blocked':''%>" src="<%=post.avatar%>" onclick="location.href='<%='/users?id='+post.authorid%>'">
            <div>
                <span onclick="location.href='<%='/users?id='+post.authorid%>'" 
                class="author-span">
                <%=post.lastname+" "+post.firstname+" "+(post.authorBanned?'(Заблокирован)':'')%>
                </span>
                <span><%=new Date(post.date).toLocaleString()%></span>
            </div>
        </div>
        <div class="post-menu-container">
        <div class="post-menu">
            <img src="menu.svg">             
        </div> 
        <div class="dropdown">
            <div>
              <p class="block-menuitem" data-id="<%=post.id%>"><%=post.available?'Заблокировать':'Разблокировать'%></p>
            </div>
          </div>
        </div>
                
    </header>
    <div class="post-body">
            <div style="width: 100%">
                <div style="height: min-content);">
                    <img style = "max-height: 100%;max-width:100%"src="<%=post.content.image%>">
                </div>
            </div>
            <div style="max-width: 90%">
                <p><%=post.content.text%></p>
            </div>
    </div>
</div><%})%>`

let getNews = (all=false) =>{
    let query = location.search

    let params = new URLSearchParams(query)

    $.get(`/api/news?id=${params.get('id')}&all=${all}`,(list,resStatus)=>{
        if (resStatus!=='success') return
        list=JSON.parse(list)
        newsList=list.news
        if (list.name)
            $("#title-span").html(`Новости ${list.name}`)
        render(newsList)
    });
}

$(document).ready(function () {
    getNews(false)

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
        getNews(showall)
    })

})


function render(list) {

    if (list.length===0) {
        $(".news").html(filler)
        return
    }
    let news = ejs.render(postTemplate,{list: list})
    $(".news").html(news)
    $(".post-menu").click(function(){
        $(this).next().css("display","block").parent()
    })
    $(".post-menu-container").mouseleave(function(){
        $(this).find(".dropdown").css("display","none")

    })
    $(".block-menuitem").click(function(){
        console.log($(this).data("id"))
        let post = newsList.find((x)=>x.id===$(this).data("id").toString())
        if(post) {
            $.ajax({
                url: '/api/news/edit',
                type: 'post',
                dataType: 'json',
                contentType: 'application/json',
                success: function (data) {
                    console.log(data)
                    post.available=data.available
                    render(newsList)
                },
                data: JSON.stringify({id:post.id,available:!post.available})
            });
        }
    })
}