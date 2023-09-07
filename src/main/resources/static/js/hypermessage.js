let isEditing = false;
let editMessageId = null;

document.getElementById("saveHypMessage").addEventListener("click", async function(){
    let titleField=document.getElementById("titleField").value;
    let dateField=document.getElementById("dateField").value;
    let messageField=document.getElementById("messageField").value;
    if(!titleField){
      alert("Please enter ur title !");
    }
    else if(!dateField){
        alert("Please enter ur date !");
    }
    else if(!messageField){
      alert("Please enter ur hyper message !");
    }
    else{
      const data={"title": titleField, "message": messageField, "date": dateField, "isLock":"false"};
      if (!isEditing) {
        saveMessage(data);
    } else {
        data.id = editMessageId;
        saveMessage(data);
    }
    }
  });

  var data;

 async function getHypMessage() {
    const response = await fetch(`http://3.0.102.63:7074/exuser/allHyperMessage`);
  const result = await response.json();
  const encryptedData = result.data;
  var decryptData = JSON.parse(decryptMessage(encryptedData));
  var stage = JSON.parse(decryptData.payload);
  data=JSON.parse(stage.data);
  showHypMessage(data);
}
getHypMessage();

function showHypMessage(data){
    let content = document.getElementById("content");
            content.innerHTML="";
                for (let i = 0; i < data.length; i++) {
                let child = data[i];
                content.innerHTML+=`<tr>
                                        <td>${i+1}</td>
                                        <td>${child.id}</td>
                                        <td>${child.title}</td>
                                        <td>${child.date}</td>
                                        <td>${child.isLock}</td>
                                        <td><button onclick="editUser(${i})" class="saveMessage">Edit</button></td>
                                    </tr>`;
                }
}

function editUser(index) {
  let titleField = document.getElementById("titleField");
  let dateField = document.getElementById("dateField");
  let messageField = document.getElementById("messageField");
  let userData = data[index];
  titleField.value = userData.title;
  dateField.value = userData.date;
  messageField.value = userData.message;
  isEditing = true;
  editMessageId = userData.id;
}

async function saveMessage(data) {
  const encryptmessage=encryptMessage(JSON.stringify(data));
  const payload={"payload": encryptmessage};
  try {
    if(!data.id){
      const response = await fetch("http://3.0.102.63:7074/exuser/saveHyperMessage", {
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
        alert("Something went wrong !");
      }
    }
    else {
    const response = await fetch("http://3.0.102.63:7074/exuser/updateHyperMessage", {
      method: "PUT",
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
      alert("Something went wrong !");
    }
    }
  } catch (error) {
    console.error("Error:", error);
  }
  isEditing = false;
  editMessageId = null;
}