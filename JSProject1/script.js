var istatus = document.querySelector("h5");

var btn = document.querySelector("#add");
var check = 0;

btn.addEventListener("click", function(){
    if(check == 0){
    istatus.innerHTML = "Buddy"
    istatus.style.color = "rgba(142, 255, 13, 1)"
    btn.innerHTML = "Remove"
    btn.style.backgroundColor = "#dadada"
    check = 1
    }

    else{
    istatus.innerHTML = "Pokemon Trainer"
    istatus.style.color = "rgba(13, 69, 255, 1)"
    btn.innerHTML = "Add Freind"
    btn.style.backgroundColor = "#4db8ffff"
    check = 0
    }
})

