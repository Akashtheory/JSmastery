var bulb = document.querySelector("#bulb");
var btn = document.querySelector("button");
var flag = 0;

btn.addEventListener("click", function(){
    if(flag == 0){
        bulb.style.backgroundColor = "Red";
        flag = 1;
        console.log("Chalu")
        this.innerHTML = "ON"
    }
    else{
        bulb.style.backgroundColor = "Transparent";
        this.innerHTML = "OFF";
        flag = 0;
        console.log("Band");
        
    }
})