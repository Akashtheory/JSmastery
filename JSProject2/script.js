var con = document.querySelector("#container");
var con1 = document.querySelector("#container1");
var icon = document.querySelector("i");
var love = document.querySelector("#emoji");

con.addEventListener("dblclick", function(){
    icon.style.transform = 'translate(-50%, -50%) scale(1)';
    icon.style.opacity = 0.8;

    setTimeout(function(){
     icon.style.opacity =0;   
    }, 1000)
    
    setTimeout(function(){
     icon.style.transform = 'translate(-50%, -50%) scale(0)';   
    }, 2000)
    
})

con1.addEventListener("dblclick", function(){
    emoji.style.transform = 'translate(-50%, -50%) scale(1)';
    emoji.style.opacity = 0.8;

    setTimeout(function(){
     emoji.style.opacity =0;   
    }, 1000)
    
    setTimeout(function(){
     emoji.style.transform = 'translate(-50%, -50%) scale(0)';   
    }, 2000)
    
})




