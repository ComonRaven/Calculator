//ポップアップ処理
function showPopup(){
    document.getElementById("overlay").style.display = "block";
    document.getElementById("popup").style.display = "block";
}
function hidePopup(){
    document.getElementById("overlay").style.display = "none";
    document.getElementById("popup").style.display = "none";
}

//DEG,RAD処理
function DEG_RAD(){
    const className = document.getElementById("DEG_RAD");
    if(className.textContent == "DEG"){
        className.classList.remove("DEG");
        className.classList.add("RAD");
        className.textContent = "RAD";
    }else{
        className.classList.remove("RAD");
        className.classList.add("DEG");
        className.textContent = "DEG";
    }
}