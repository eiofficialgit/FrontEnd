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
      const encryptmessage=encryptMessage(messageValue);
      const payload={"payload": encryptmessage};
      sessionStorage.setItem("impmessage", JSON.stringify(encryptmessage));
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

function showImpMessage() {
    var em=JSON.parse(sessionStorage.getItem("impmessage"));
    var dm=decryptMessage(em);
    document.getElementById("impMessage").innerText=dm;
}
showImpMessage();