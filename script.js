//Karuna Bhupathiraju(A00161135)


import { initializeApp } 
from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
import{getDatabase, ref, set, get, child, update, remove,onValue}
from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
import{getStorage, uploadBytes, ref as storageRef, getDownloadURL}
from "https://www.gstatic.com/firebasejs/9.19.1/firebase-storage.js";


const firebaseConfig = {
    apiKey: "AIzaSyBVOtKyaywhdudl3kDBQRt6AqPn-0z8xHs",
    authDomain: "firwbasewebappdemo.firebaseapp.com",
    projectId: "firwbasewebappdemo",
    storageBucket: "firwbasewebappdemo.appspot.com",
    messagingSenderId: "767803580875",
    appId: "1:767803580875:web:ace158ce7c57670932964e"
  };

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const db = getDatabase();
  const storage= getStorage(app);
  const table = document.getElementById("userList").getElementsByTagName("tbody")[0];
  var selectedRow = null;


   handleDataUpdate();

window.onFormSubmit=function(){
    if(validate()){
        var formData = readFormData();
        if(selectedRow == null){
            insertNewRecord(formData);
        }
        else{
            updateRecord(formData);
        }
        resetForm();
    }
}
window.readFormData = function(){
    var formData = {};
    formData["studentId"] = document.getElementById("studentId").value;
    formData["firstName"] = document.getElementById("firstName").value;
    formData["lastName"] = document.getElementById("lastName").value;
    formData["email"] = document.getElementById("email").value;
    formData["studentDoB"] = document.getElementById("studentDoB").value;
    formData["studentGender"] = document.getElementById("studentGender").value;
    formData["studentPicture"] = document.getElementById("studentPicture").files[0];
    return formData;
}
window.insertNewRecord=async function(data){
    var newRow = table.insertRow(table.length);
    var url = await uploadPictureAndGetURL(data.studentPicture);
    data.studentPicture = url;
    newRow.insertCell(0).innerHTML = data.studentId;
    newRow.insertCell(1).innerHTML = `<img id= "picture${data.studentId}" src = "${data.studentPicture}" width="50" height="50">`;
    newRow.insertCell(2).innerHTML = data.firstName;
    newRow.insertCell(3).innerHTML = data.lastName;
    newRow.insertCell(4).innerHTML = data.email;
    newRow.insertCell(5).innerHTML = data.studentDoB;
    newRow.insertCell(6).innerHTML = data.studentGender;
    newRow.insertCell(7).innerHTML = `<a onClick="onEdit(this)">Edit</a>
                                      <a onClick="onDelete(this)">Delete</a>`;
    
    insertData(data);
    
}
 window.resetForm = function(){
    document.getElementById("studentId").value = "";
    document.getElementById("firstName").value = "";
    document.getElementById("lastName").value = "";
    document.getElementById("email").value = "";
    document.getElementById("studentDoB").value = "";
    document.getElementById("studentGender").value = "Female";
    document.getElementById("studentPicture").value = "";
    selectedRow = null;

}
window.onDelete = function(td){
    if(confirm("Are you sure you want to delete this user?")){
       var row = td.parentElement.parentElement;
       deleteData(row.cells[0].innerHTML);
        document.getElementById("userList").deleteRow(row.rowIndex);
        resetForm();
    }
}
function deleteData(id){
    remove(ref(db, "students/"+id)).then(()=>{
        alert("Data deleted successfully");
    }).catch((error)=>{
        alert("Unsuccessful, error:" +error);
    });
}
window.onEdit = function(td){
    selectedRow = td.parentElement.parentElement;
    document.getElementById("studentId").value = selectedRow.cells[0].innerHTML;
    document.getElementById("firstName").value = selectedRow.cells[2].innerHTML;
    document.getElementById("lastName").value = selectedRow.cells[3].innerHTML;
    document.getElementById("email").value = selectedRow.cells[4].innerHTML;
    document.getElementById("studentDoB").value = selectedRow.cells[5].innerHTML;
    document.getElementById("studentGender").value = selectedRow.cells[6].innerHTML;
}
window.updateRecord = function(formData){
    selectedRow.cells[2].innerHTML = formData.firstName;
    selectedRow.cells[3].innerHTML = formData.lastName;
    selectedRow.cells[4].innerHTML = formData.email;
    selectedRow.cells[5].innerHTML = formData.studentDoB;
    selectedRow.cells[6].innerHTML = formData.studentGender;
    updateData(formData);
}
async function updateData(data){
    var file = document.getElementById("studentPicture").files[0];
    var url = "";
    if(file){
        url = await uploadPictureAndGetURL(file);
    }
    else{
        url = document.getElementById("picture" +data.studentId).src;
    }
    update(ref(db, "students/" +data.studentId),{
        studentId:data.studentId,
        firstName:data.firstName,
        lastName:data.lastName,
        email: data.email,
        studentDoB: data.studentDoB,
        studentGender: data.studentGender,
        studentPicture: url
    }).then(()=>{
        alert("Data Updated successfully");
    }).catch((error)=>{
        alert("Unsuccessful.Error:"+error);
    });

}
window.validate = function(){
    var isValid = true;
    if(document.getElementById("studentId").value == ""){
        isValid = false;
        alert("User Id cannot be empty!");
    }
    return isValid;
}

window.insertData = function(data){
    set(ref(db, "students/" + data.studentId),{
        studentId: data.studentId,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        studentDoB: data.studentDoB,
        studentGender: data.studentGender,
        studentPicture:data.studentPicture
    }).then(()=>{
        alert("Data inserted successfully");
    }).catch((error)=>{
        alert("Unsuccessful, error: " + error);
    });
}
function renderData(data){
    table.innerHTML= "";
    Object.keys(data).forEach((key)=>{
        const student = data[key];
        const newRow = table.insertRow(table.length);
        newRow.insertCell(0).innerHTML= key;
        newRow.insertCell(1).innerHTML = `<img id= "picture${student.studentId}" src = "${student.studentPicture}" width="50" height"50">`;
        newRow.insertCell(2).innerHTML= student.firstName;
        newRow.insertCell(3).innerHTML= student.lastName;
        newRow.insertCell(4).innerHTML= student.email;
        newRow.insertCell(5).innerHTML= student.studentDoB;
        newRow.insertCell(6).innerHTML= student.studentGender;
        newRow.insertCell(7).innerHTML= `<a onClick="onEdit(this)">Edit</a>
                                         <a onClick="onDelete(this)">Delete</a>`;
    });
}

function handleDataUpdate(){
    onValue(ref(db, "students"), (snapshot)=>{
        const data = snapshot.val();
        renderData(data);
    });
}
function uploadPictureAndGetURL(file){
    const storageReference = storageRef(storage, file.name);
    return new Promise((resolve, reject) => {
        const task = uploadBytes(storageReference, file);
        task.then(() => {
            getDownloadURL(storageReference).then((url) => {
                resolve(url);
            }).catch((error)=>{
                reject(error);
            });
        }).catch((error)=>{
            reject(error);
        });    

    });

}