async function setOwnerData() {
    const response = await fetch("http://localhost:7074/exuser/loginUser");
    const result = await response.json();
    const decryptData=JSON.parse(decryptMessage(result.data));
    document.getElementById("yourBalance").innerText=decryptData.myBalance;
    document.getElementById("accountOwner").innerText = decryptData.userid;
    var sub=document.getElementById("sub");
    if(decryptData.usertype === 0){
        sub.innerText="O";
    }
    else if(decryptData.usertype === 1){
        sub.innerText="SUA";
    }
    else if(decryptData.usertype === 2){
        sub.innerText="MIA";
    }
    else if(decryptData.usertype === 3){
        sub.innerText="SUS";
    }
    else if(decryptData.usertype === 4){
        sub.innerText="SUM";
    }
    else if(decryptData.usertype === 5){
        sub.innerText="M";
    }
    else if(decryptData.usertype === 6){
        sub.innerText="U";
    }
}
setOwnerData();