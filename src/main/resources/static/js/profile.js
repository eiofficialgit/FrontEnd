var encryptedBase64Key = "bXVzdGJlMTZieXRlc2tleQ==";
var parsedBase64Key = CryptoJS.enc.Base64.parse(encryptedBase64Key);

function encryptMessage (data){
return CryptoJS.AES.encrypt(data, parsedBase64Key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
  }).toString();
}

function decryptMessage (data){
return CryptoJS.AES.decrypt( data, parsedBase64Key, {
  mode: CryptoJS.mode.ECB,
  padding: CryptoJS.pad.Pkcs7
  } ).toString( CryptoJS.enc.Utf8 );
}

function setOwnerData(){
    let data = JSON.parse(sessionStorage?.getItem("data"));
    if(data){
        let firstName=data.firstName;
        let lastName=data.lastName;
        let emailData=data.email;
        let password=data.password;
        let timeZone=data.timeZone;
        let mobileNumber=data.mobileNumber;

        let fname=document.getElementById("fname");
        let lname=document.getElementById("lname");
        let email=document.getElementById("email");
        let ist=document.getElementById("ist");
        let number=document.getElementById("number");

        fname.innerHTML=firstName;
        lname.innerHTML=lastName;
        email.innerHTML=emailData;
        ist.innerHTML=timeZone;
        number.innerHTML=mobileNumber;

    }
}
setOwnerData();

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
                const response = await fetch("http://3.0.102.63:7074/exuser/changeCurrentPassword", {
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
