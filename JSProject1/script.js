var istatus = document.querySelector("h5");

var addFreind = document.querySelector("#add");
var check = 0;

addFreind.addEventListener("click", function(){
    if(check == 0){
    istatus.innerHTML = "Buddy"
    istatus.style.color = "rgba(142, 255, 13, 1)"
    
    check = 1
    }

    else{
    istatus.innerHTML = "Pokemon Trainer"
    istatus.style.color = "rgba(13, 69, 255, 1)"
    
    check = 0
    }
})

