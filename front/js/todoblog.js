$(document).ready(() => {
    //day night ciklus
    const dayOrNight = new Date().getHours();
    console.log(dayOrNight)
    if(dayOrNight > 19 || dayOrNight < 6){
        console.log(222)
        $("header").css({'background-image':'url(../../slike/bgNight.png)',"background-color":"#164066"});
        $(".tabPick").css({"background-color":"#164066"})
    }
    else{
        $("header").css({'background-image':'url(../../slike/bgDay.png)',"background-color":"#cff1ff"})    
        $(".tabPick").css({"background-color":"#cff1ff"})
    }
    //OVDE SE RESAVAJU DODAVANJA BRISANJA I KUPLJENJA IZ BAZE KADA SE UCITA STRANICA 
       // //GET BLOG AND TODOS
       const queryString = window.location.search;
       const urlParams = new URLSearchParams(queryString);
       const userName = urlParams.get('userName')
       console.log(userName)
       socket.emit("signInAsAdmin", userName);
       socket.on("notAdmin",()=>{
           $("#getUsers").css({"display":"none"});
       })
       socket.emit("blogReq",userName);
       socket.on("blogRes", (data) => {
           $.each(data, (index, item) => {
               $("#blogHolder").append(
                   `
                          <div class="dataFromTable">
                          <p>${item.blogId}</p>
                          <h3>${item.blogTitle}</h3>
                          <p class="content">${item.blogContent}</p>
                          <p>${item.userName}</p>
                          <button class="remove">Delete blog</button>
                          </div>
                          `
               )
           })
           $(".remove").on("click", (e) => {
               let blog = e.target.parentElement.firstElementChild.textContent;
               socket.emit("removeBlog", data={blog:blog,userName:userName});
               location.reload()
           })
       })
       socket.emit("todoReq",userName);
       socket.on("todoRes", (data) => {
           $.each(data, (index, item) => {
               $("#todoHolder").append(
                   `
                          <div class="dataFromTable">
                          <p>${item.todoId}</p>
                          <h3>${item.title}</h3>
                          <p class="content">${item.content}</p>
                          <p>${item.userName}</p>
                          <button class="remove">Delete todo</button>
                          </div>
                          `
               )
           })
        //REMOVE TODOS
           $(".remove").on("click", (e) => {
               console.log($("#addTodo"))
               let todo = e.target.parentElement.firstElementChild.textContent
               console.log(todo)
               socket.emit("removeTodo", data={todo:todo,userName:userName});
               location.reload()
           })
       })
    $("#todoPick").on("click", () => {
        $("#blog").css({
            "display": "none"
        });
        $("#todo").css({
            "display": "block"
        });
        $("#formTodo").css({
            "display": "none"
        });
        $("#formBlog").css({
            "display": "none"
        });
        $(".users").css({
            "display": "none"
        });
    })
    $("#blogPick").on("click", () => {
        $("#blog").css({
            "display": "block"
        });
        $("#todo").css({
            "display": "none"
        });
        $("#formTodo").css({
            "display": "none"
        });
        $("#formBlog").css({
            "display": "none"
        });
        $(".users").css({
            "display": "none"
        });
    })
    $("#addTodoPick").on("click", () => {
        $("#blog").css({
            "display": "none"
        });
        $("#todo").css({
            "display": "none"
        });
        $("#formTodo").css({
            "display": "block"
        });
        $("#formBlog").css({
            "display": "none"
        });
        $(".users").css({
            "display": "none"
        });
    })
    $("#addBlogPick").on("click", () => {
        $("#blog").css({
            "display": "none"
        });
        $("#todo").css({
            "display": "none"
        });
        $("#formTodo").css({
            "display": "none"
        });
        $("#formBlog").css({
            "display": "block"
        });$("#blog").css({
            "display": "none"
        });
        $("#todo").css({
            "display": "none"
        });
        $(".users").css({
            "display": "none"
        });
    })
    $("#addBlog").on("click", (e) => {
        e.preventDefault();
        let blogInfo = {
            title: $("#blogTitle").val(),
            blog: $("#blogInput").val(),
            name: userName
        }
        console.log(blogInfo)
        socket.emit("addblog", blogInfo);
        location.reload();
    })
    $("#addTodo").on("click", (e) => {
        e.preventDefault();
        let todoInfo = {
            title: $("#title").val(),
            todo: $("#todoInput").val(),
            name: userName
        }
        socket.emit("addTodo", todoInfo);
        location.reload();
    })
    //------------------
    $("#getUsers").on("click",()=>{
        socket.emit("getUsers");
               //set everything to display none
               $("#blog").css({
                "display": "none"
            });
            $("#todo").css({
                "display": "none"
            });
            $("#formTodo").css({
                "display": "none"
            });
            $("#formBlog").css({
                "display": "none"
            });$("#blog").css({
                "display": "none"
            });
            $("#todo").css({
                "display": "none"
            });
            $(".users").css({
                "display": "block"
            });
    })
    $("#signOut").on("click",()=>{
        location.replace("signIn.html");
    })
    socket.on("userInfo",data=>{
           //set everything to display none
        data.forEach(item=>{
            $(".users").append(
                `
                <div class="user">
                <p>${item.userName}</p>
                <button class="deleteUser">Delete user!</button>
                </div>
                `
            )
        })
        $(".deleteUser").on("click",(e)=>{
            let user = e.target.previousElementSibling.textContent;
            socket.emit("deleteUser",user)
            socket.on("userDeleted",data=>{
                alert(data.message);
                location.reload();
            })
        })
    })
})