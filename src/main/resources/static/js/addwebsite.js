async function getAllWebsites(){
 const response = await fetch("http://localhost:7074/exuser/allWebsite");
  const websites = await response.json();
 const encryptedData = websites.data;
 var decryptData = JSON.parse(decryptMessage(encryptedData));
 var stage = JSON.parse(decryptData.payload);
  var data = JSON.parse(stage.data);
  console.log(data);
    showAllWebsites(data);
  }

  function showAllWebsites(data) {
    let content = document.getElementById("content");
    content.innerHTML="";
    for (let i = 0; i < data.length; i++) {
    let child = data[i];
    content.innerHTML+=`<tr>
                          <td>${child.name}</td>
                          <td>${child.isUsed}</td>
                          <td>${child.usedBy}</td>
                        </tr>`;
    }
  }

  getAllWebsites();

  document.getElementById("websiteAdd").addEventListener("click", async function(){
    let websiteValue=document.getElementById("websiteValue").value;
    if(!websiteValue){
      alert("Please enter ur website name!");
    }
    else{
      const data={"name": websiteValue};
      const encryptData=encryptMessage(JSON.stringify(data));
      const payload={"payload": encryptData};
      try {
          const response = await fetch("http://localhost:7074/exuser/addWebsite", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
          const result = await response.json();
          if(result.status === "Success") {
            alert(result.data);
            location.reload();
          }
          else{
            alert(result.data);
          }
        } catch (error) {
          console.error("Error:", error);
        }
    }
  });