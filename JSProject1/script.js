var istatus = document.querySelector("h5");

var addFreind = document.querySelector("#add");
var removeFriend = document.querySelector("#remove");

addFreind.addEventListener("click", function(){
    istatus.innerHTML = "Buddy"
    istatus.style.color = "rgba(142, 255, 13, 1)"
})

removeFriend.addEventListener("click", function(){
    istatus.innerHTML = "Pokemon Trainer"
    istatus.style.color = "rgba(13, 78, 255, 1)"
})