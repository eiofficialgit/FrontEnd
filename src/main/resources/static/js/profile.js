const openBtn = document.getElementById('openBtn');
  const closeBtn = document.getElementById('closeBtn');
  const popup = document.getElementById('popup');
  const overlay = document.getElementById('overlayBankingPage');

  openBtn.addEventListener('click', () => {
    popup.style.display = 'block';
    overlay.style.display = 'block';
  });

  closeBtn.addEventListener('click', () => {
    popup.style.display = 'none';
    overlay.style.display = 'none';
  });


  const submitBtn=document.getElementById('submitBtn');

  async function submitForm() {
    const newPassword = document.getElementById('field1').value;
    const confirmNewPassword = document.getElementById('field2').value;
    const oldPassword = document.getElementById('field3').value;
    if(newPassword === "" || confirmNewPassword === "" || oldPassword === ""){
        alert("* All fields are required !");
        return;
    }
    else {
        if(newPassword !== confirmNewPassword){
            alert("Password doesn't matched !");
            return;
        }
        else{
            const data={"newPassword": newPassword, "password": oldPassword};
            const encryptData=encryptMessage(JSON.stringify(data));
            const payload={"payload": encryptData};
            try {
                const response = await fetch("http://localhost:7074/exuser/changeCurrentPassword", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                });
                const result = await response.json();
                if(result.status === "success") {
                  alert(result.message);
                  location.reload();
                }
                else{
                  alert(result.message);
                }
              } catch (error) {
                console.error("Error:", error);
              }
        }
    }
  };

  submitBtn.addEventListener('click', submitForm);

async function setOwnerData() {
  const response = await fetch("http://localhost:7074/exuser/loginUser");
  const result = await response.json();
  const decryptData=JSON.parse(decryptMessage(result.data));
  console.log(decryptData);
  document.getElementById("profileOwner").innerText = decryptData.userid;
  var sub=document.getElementById("profileSub");
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
  document.getElementById("fname").innerText=decryptData.firstName;
  document.getElementById("lname").innerText=decryptData.lastName;
  document.getElementById("email").innerText=decryptData.email;
  document.getElementById("ist").innerText=decryptData.timeZone;
  document.getElementById("number").innerText=decryptData.mobileNumber;
}
setOwnerData();
