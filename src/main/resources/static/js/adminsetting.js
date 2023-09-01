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

  const openBtn1 = document.getElementById('openBtn1');
  const closeBtn1 = document.getElementById('closeBtn1');
  const popup1 = document.getElementById('popup1');

  openBtn1.addEventListener('click', () => {
    popup1.style.display = 'block';
    overlay.style.display = 'block';
  });

  closeBtn1.addEventListener('click', () => {
    popup1.style.display = 'none';
    overlay.style.display = 'none';
  });

  async function setOwnerData() {
    const response = await fetch("http://localhost:7074/exuser/loginUser");
    const result = await response.json();
    const decryptData=JSON.parse(decryptMessage(result.data));
    document.getElementById("adminSettingBalance").innerText=decryptData.myBalance;
}
setOwnerData();


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

  const submitBtn1=document.getElementById('submitBtn1');

  async function submitForm1() {
    const  newDepositAmount= document.getElementById('field4').value;
    if(!newDepositAmount){
        alert("* Please Enter your deposit amount !");
        return;
    }
    else {
          const data={"myBalance": parseInt(newDepositAmount)};
          const encryptData=encryptMessage(JSON.stringify(data));
          const payload={"payload": encryptData};
          try {
              const response = await fetch("http://localhost:7074/exuser/depositChips", {
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
                return;
              }
            } catch (error) {
              console.error("Error:", error);
            }
        }
  };

  submitBtn1.addEventListener('click', submitForm1);