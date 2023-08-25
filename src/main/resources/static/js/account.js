function setOwnerData(){
    let data = JSON.parse(sessionStorage?.getItem("data"));
    if(data){
        let myBalance=data.myBalance;

        let yourBalance=document.getElementById("yourBalance");

        yourBalance.innerText=myBalance;
    }
}
setOwnerData();
