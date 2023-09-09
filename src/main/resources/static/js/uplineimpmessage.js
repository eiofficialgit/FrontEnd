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

document.getElementById("saveImpMessage").addEventListener("click", async function(){
    let messageValue=document.getElementById("messageValue").value;
    if(!messageValue){
      alert("Please enter ur imp message !");
    }
    else{
      const message={"payload": messageValue};
      const encryptMessageData=encryptMessage(JSON.stringify(message));
      const payload={"payload": encryptMessageData};
      
      try {
          const response = await fetch("http://3.0.102.63:7074/exuser/importantMessage", {
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
  });

async function showImpMessage() {
  const response = await fetch("http://3.0.102.63:7074/exuser/currentImportantMessage");
  const result = await response.json();
  const data=JSON.parse(decryptMessage(result.data));
  const payload=JSON.parse(data.payload);
  const decryptData=JSON.parse(payload.data);
  document.getElementById("impMessage").innerText=decryptData.message;
}
showImpMessage();