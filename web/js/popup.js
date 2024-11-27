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
    const className = document.getElementById("DEG_RAD"); //要素を取得
    if(className.textContent == "DEG"){ //DEGの場合
        className.classList.remove("DEG"); //クラスを削除
        className.classList.add("RAD"); //クラスを追加
        className.textContent = "RAD"; //テキストを変更
    }else{ //RADの場合
        className.classList.remove("RAD"); // クラスを削除
        className.classList.add("DEG"); // クラスを追加
        className.textContent = "DEG";  //テキストを変更
    }
}