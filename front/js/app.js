$(document).ready(() => {
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
    //OVA STRANA JE ZA SIGN IN I SUGIN UP DA KUPI INFORMACIJE I STAVI U URL?
    let info;
    //SIGN UP
    $("#signUp").on("click", (e) => {
        e.preventDefault();
        let sigUpInfo = {
            userName: $("#signUpUn").val(),
            password: $("#signUpPw").val()
        }
        $("#signUpUn").val("");
        $("#signUpPw").val("");
        if (sigUpInfo.userName == "" && sigUpInfo.password == "") {
            alert("Please fill out the form");
        }
        else{
            socket.emit("signUp", sigUpInfo);
            socket.on("signUpInfo",(data)=>{
                if(data.message){
                    alert(data.message)
                }
                else if(data.redirect){
                    window.location.replace(`todoBlog.html?userName=${sigUpInfo.userName}`)
                }
            })
        }

    })
    // SIGN IN
    $("#signIn").on("click", (e) => {
        e.preventDefault();
        let sigInInfo = {
            userName: $("#signInUn").val(),
            password: $("#signInPw").val()
        }
        $("#signInUn").val("");
        $("#signInPw").val("");
        if (sigInInfo.userName == "" && sigInInfo.password == "") {
            alert("Please fill out the form");
        }
        else{
            socket.emit("signIn", sigInInfo);
            socket.on("signInInfo",(result)=>{
                console.log(result)
                if(result.message){
                    alert(result.message)
                }
                else{
                    window.location.replace(`todoBlog.html?userName=${sigInInfo.userName}`)
                }
            })
        }
    })
    $("#signUpRedir").on("click",()=>{
        location.replace("signUp.html")
    })
    $("#signInRedir").on("click",()=>{
        location.replace("signIn.html")
    })
    // //GET BLOG AND TODOS
})