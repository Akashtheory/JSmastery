let bulb= document.querySelector("#bulb");

let btn = document.querySelector("button");

let flag = 0;
let flaga = 0;


btn.addEventListener("click", function(){
    if(flag == 0){
        bulb.style.backgroundColor = "Blue";
        flag = 1;
    }else{
        bulb.style.backgroundColor = "pink";
        flag = 0;
    };

    
    if(flaga == 0){
        this.style.backgroundColor = "Violet";
        flaga = 1;
    }else{
        this.style.backgroundColor = "Orenge";
        flaga = 0;
    }

})