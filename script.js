let itemsPerPage = 7;
let currentPage = 1;
var rowCount = 0;
let allEmployees;

addFetch();

async function addFetch() {
  try {
      const response = await fetch("http://localhost:3000/employees");
      const employees = await response.json();
      
      allEmployees = employees;
      
      const selectPage = document.getElementById("page-limit");
      selectPage.addEventListener("change", () => {
          itemsPerPage = parseInt(selectPage.value);
         
      });
      
      employeePagination(currentPage);
      pagination();
  } catch (error) {
      console.error("fetch error:", error);
  }
}


function employeePagination(page) {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const data = allEmployees.slice(start, end);
    const paginateData = data.reverse();

    let placeholder = document.querySelector("#data-output");
    let out = "";
    let count = start + 1;

    for (let employee of paginateData) {
        const id = employee.id;
        out += `
            <tr>
                <td>#${count}</td>
                <td><img class="img-details" src="http://localhost:3000/employees/${employee.id}/avatar" height="30px"  width="30px">
                ${employee.salutation}. ${employee.firstName} ${employee.lastName}</td>
                <td>${employee.email}</td>
                <td>${employee.phone}</td>
                <td>${employee.gender}</td>
                <td>${employee.dob}</td>
                <td>${employee.country}</td>  
                <td>
                    <div class="edit-form">
                        <button class="edit-form" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" a ria-expanded="false" onclick="getIndex(${count})"><i class="fa-solid fa-ellipsis "></i></button>
                        <ul class="dropdown-menu edit-buttons" aria-labelledby="dropdownMenuButton1">
                            <li class="view"><i class="fa-regular fa-eye eye"></i><a class="edit-text" href="viewform.html?id=${employee.id}">View Details</a></li>
                            <li class="view edit"><i class="fa-solid fa-pencil"></i><a class="edit-text" href="#" onclick="editEmp('${employee.id}')">Edit</a></li>
                            <li class="view edit"><i class="fa-solid fa-trash"></i><a class="edit-text" href="#" onclick="delete_emp('${employee.id}')">Delete</a></li>
                        </ul>  
                    </div>
                </td>
            </tr>
        `;
        count++;
    }

    placeholder.innerHTML = out;
}

function pagination() {
    let pagination = document.getElementById("pagination");

    pagination.innerHTML = "";

    let totalPage = Math.ceil(allEmployees.length / itemsPerPage);

    const leftSkip = document.createElement("li");
    pagination.appendChild(leftSkip);
    leftSkip.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

    leftSkip.addEventListener("click", () => {
        if (currentPage >= 2) {
            currentPage = currentPage - 1;
        } else {
            currentPage = 1;
        }
        employeePagination(currentPage);
    });

    for (let i = 1; i <= totalPage; i++) {
        const pageitems = document.createElement("li");

        pageitems.textContent = i;
        pagination.appendChild(pageitems);

        if (i === currentPage) {
            pageitems.classList.add("current-page");
        }

        pageitems.addEventListener("click", () => {
            currentPage = i;
            employeePagination(currentPage);
            const paginationItems = document.querySelectorAll(".pagination li");
            paginationItems.forEach((item) => {
                item.classList.remove("current-page");
            });

            pageitems.classList.add("current-page");
        });
    }

    const rightSkip = document.createElement("li");
    pagination.appendChild(rightSkip);
    rightSkip.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

    rightSkip.addEventListener("click", () => {
        if (currentPage <= totalPage - 1) {
            currentPage++;
        } else {
            currentPage = totalPage;
        }
        employeePagination(currentPage);
    });
}
function addEmployee() {
  var addEmployeePopup = document.getElementById("addEmployee");
  var overlay = document.getElementById("overlay");

  addEmployeePopup.style.display = "block";
  overlay.style.display = "block";
}

// function to close add employee

function closeEmployee() {
  var addEmployeePopup = document.getElementById("addEmployee");
  var overlay = document.getElementById("overlay");

  addEmployeePopup.style.display = "none";
  overlay.style.display = "none";
}

//fetching data end

const submit = document.getElementById("addemployee");

submit.addEventListener("click", async () => {
  if (FormValidation() == true) {
    const salutation = document.getElementById("salutation");
    const firstname = document.getElementById("firstname");
    const lastname = document.getElementById("lastname");
    const email = document.getElementById("email");
    const mobilenumber = document.getElementById("mobilenumber");
    const username = document.getElementById("username");
    const password = document.getElementById("password");
    const qualification = document.getElementById("qualification");
    const address = document.getElementById("address");
    const country = document.getElementById("countrySelector");
    const state = document.getElementById("stateSelector");
    const city = document.getElementById("citySelector");
    const zip = document.getElementById("pincode");
    const dob = document.getElementById("dateOfBirth").value;

    //dob format change

    var newDate = formatchange(dob);
    function formatchange(dob) {
      const array = dob.split("-");
      let day = array[0];
      let month = array[1];
      let year = array[2];

      let dateformat = year + "-" + month + "-" + day;
      return dateformat;
    }

    //gender function

    var gender = document.querySelector('input[name="gender"]:checked').value;

    let newUser = {
      salutation: salutation.value,
      firstName: firstname.value,
      lastName: lastname.value,
      email: email.value,
      phone: mobilenumber.value,
      username: username.value,
      password: password.value,
      dob: newDate,
      gender: gender,
      qualifications: qualification.value,
      address: address.value,
      country: country.value,
      state: state.value,
      city: city.value,
      pincode: zip.value,
    };
    console.log("after fetch", newUser);
    try {
      const response = await fetch("http://localhost:3000/employees", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify(newUser),
      });
      const data = await response.json();
      console.log("after fetch", data);

      appendEmployee(newUser, data.id);

      const uploadImage = document.getElementById("input-file");
      const formData = new FormData();
      formData.append("avatar", uploadImage.files[0]);

      await fetch(`http://localhost:3000/employees/${data.id}/avatar`, {
        method: "POST",
        body: formData,
      });

      const result = await Swal.fire({
        icon: "success",
        title: "Employee Added Successfully!",
        confirmButtonText: "OK",
      });

      if (result.isConfirmed) {
        Swal.close();
        closeEmployee();
        clearFormDetails();
      }
    } catch (error) {
      console.log("error", error);
    }
  }
});

//adding employee information end

// Append employee information

function appendEmployee(employee, id) {
  console.log("Data received:", employee);

  if (
    employee &&
    employee.salutation &&
    employee.firstName &&
    employee.lastName &&
    employee.email &&
    employee.phone &&
    employee.gender &&
    employee.dob &&
    employee.country
  ) {
    var newRow = document.createElement("tr");
    let count = 1;
    newRow.innerHTML = `
      <td>#${zero(rowCount + 1)}</td>
      <td><img class="img-details" src="http://localhost:3000/employees/${id}/avatar" height="30px"  width="30px">
      ${employee?.salutation}. ${employee?.firstName} ${employee?.lastName}</td>
      <td>${employee?.email}</td>
      <td>${employee?.phone}</td>
      <td>${employee?.gender}</td>
      <td>${employee?.dob}</td>
      <td>${employee?.country}</td>
   

      <td>   <div class="edit-form">
      <button class="edit-form" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" a ria-expanded="false" onclick="getIndex(${count})"><i class="fa-solid fa-ellipsis "></i>
      </button>
      <ul class="dropdown-menu edit-buttons" aria-labelledby="dropdownMenuButton1">
        <li class="view"><i class="fa-regular fa-eye eye"></i><a class="edit-text" href="viewform.html?id=${id}">View Details</a></li>
        <li class="view edit"><i class="fa-solid fa-pencil"></i><a class="edit-text" href="#" onclick=" editEmp('${id}')">Edit</a></li>
        <li class="view edit"><i class="fa-solid fa-trash"></i><a class="edit-text" href="#" onclick="delete_emp('${id}')">Delete</a>
        </li>
      </ul>  
    </div></i></td>
      </tr>
    `;

    var tableBody = document.getElementById("data-output");
    tableBody.insertBefore(newRow, tableBody.firstChild);
    updateSerialNumbers(); 
  } else {
    console.error("Invalid data format or missing properties:", employee);
  }
}

// Update serial numbers
function updateSerialNumbers() {
  var tableBody = document.getElementById("data-output");
  var rows = tableBody.rows;
  for (var i = 0; i < rows.length; i++) {
    rows[i].getElementsByTagName("td")[0].textContent = "#" + zero(i + 1);
  }
}

// Add leading zero if number is less than 10
function zero(num) {
  return (num < 10 ? "0" : "") + num;
}

//append employee information

//edit employee information start

async function editEmp(id) {
  try {
    editEmployee();
    const response = await fetch(`http://localhost:3000/employees/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch employee data (status ${response.status})`);
    }
    const employee = await response.json();
    function formatDate(date) {
      return date.split("-").reverse().join("-");
    }

    document.getElementById("editImage").src = `http://localhost:3000/employees/${id}/avatar`;
    document.getElementById("editSalutation").value = employee.salutation;
    document.getElementById("editFirstname").value = employee.firstName;
    document.getElementById("editLastname").value = employee.lastName;
    document.getElementById("editEmail").value = employee.email;
    document.getElementById("editMobileNumber").value = employee.phone;
    document.getElementById("editUserName").value = employee.username;
    document.getElementById("editPassword").value = employee.password;
    document.getElementById(`edit${employee.gender}`).checked = true;
    document.getElementById("editQualification").value = employee.qualifications;
    document.getElementById("editAddress").value = employee.address;
    document.getElementById("editCountry").value = employee.country;
    document.getElementById("editState").value = employee.state;
    document.getElementById("editCity").value = employee.city;
    document.getElementById("editPincode").value = employee.pincode;
    document.getElementById("editDateOfBirth").value = formatDate(employee.dob);

    document.getElementById("saveChange").addEventListener("click", async (event) => {
      event.preventDefault();
    
      if (FormValidationEdit()) {
        const editEmployeeDetails = {
          salutation: document.getElementById("editSalutation").value,
          firstName: document.getElementById("editFirstname").value,
          lastName: document.getElementById("editLastname").value,
          email: document.getElementById("editEmail").value,
          phone: document.getElementById("editMobileNumber").value,
          username: document.getElementById("editUserName").value,
          password: document.getElementById("editPassword").value,
          dob: formatDate(document.getElementById("editDateOfBirth").value),
          gender: document.querySelector('input[name="editgender"]:checked').value,
          qualifications: document.getElementById("editQualification").value,
          address: document.getElementById("editAddress").value,
          country: document.getElementById("editCountry").value,
          state: document.getElementById("editState").value,
          city: document.getElementById("editCity").value,
          pincode: document.getElementById("editPincode").value,
        };
        try {
          const response = await fetch(`http://localhost:3000/employees/${id}`, {
            method: "PUT",
            headers: { "content-type": "application/json" },
            body: JSON.stringify(editEmployeeDetails),
          });
          console.log(editEmployeeDetails);
          updateTableRow(id, editEmployeeDetails);

          Swal.fire({
            title: "Success!",
            text: "Employee details updated successfully.",
            icon: "success",
            confirmButtonText: "OK",
          });
          closeForm();
        } catch (error) {
          console.error("Error updating employee details:", error);
        }
      }
    });

    let editInputFile = document.getElementById("input-file");

    editInputFile.onchange = function (event) {
      const uploadImage = this.files[0];
      const editProfilePicture = document.getElementById("editImage");
      editProfilePicture.src = URL.createObjectURL(uploadImage);
    };
    document.getElementById("saveChange").addEventListener("click", function (event) {
      event.preventDefault();
      const uploadImage = editInputFile.files[0];
      if (uploadImage) {
        const formData = new FormData();
        formData.append("avatar", uploadImage);
        fetch(`http://localhost:3000/employees/${id}/avatar`, {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to upload image");
            }
            console.log("Image uploaded successfully");
          })
          .catch((error) => {
            console.error("Error uploading image:", error);
          });
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

let trIndex ;
const getIndex = (index) => {
  trIndex = index;
  
}
function updateTableRow(id, employee) {
 
  
  const tableRow = document.getElementsByTagName('tr')[trIndex];

  if (tableRow) {
    const properties = [
      `<img class="img-details" src="http://localhost:3000/employees/${id}/avatar" height="30px"  width="30px">${employee.salutation}. ${employee.firstName} ${employee.lastName}`,
      employee.email,
      employee.phone,
      employee.gender,
      employee.dob,
      employee.country
    ];

    for (let i = 1; i <= 6; i++) {
      tableRow.cells[i].innerHTML = properties[i - 1];
    }
  } else {
    console.error("Table row not found for employee ID:", id);
  }
}

//edit employee information end

function clearFormDetails() {
  var image = (document.getElementById("input-file").value = "");
  var salutation = (document.getElementById("salutation").value = "");
  var firstname = (document.getElementById("firstname").value = "");
  var lastname = (document.getElementById("lastname").value = "");
  var email = (document.getElementById("email").value = "");
  var mobile = (document.getElementById("mobilenumber").value = "");
  var username = (document.getElementById("username").value = "");
  var password = (document.getElementById("password").value = "");
  var dob = (document.getElementById("dateOfBirth").value = "");
  var gender = (document.querySelector('input[name="gender"]:checked').value ="");
  var qualification = (document.getElementById("qualification").value = "");
  var adress = (document.getElementById("address").value = "");
  var country = (document.getElementById("countrySelector").value = "");
  var state = (document.getElementById("stateSelector").value = "");
  var city = (document.getElementById("citySelector").value = "");
  var pin = (document.getElementById("pincode").value = "");
}
// // function to popup add employee

//function to edit employee
function editEmployee() {
  var editEmployeePopup = document.getElementById("editEmployee");
  var overlay = document.getElementById("overlay");

  editEmployeePopup.style.display = "block";
  overlay.style.display = "block";
}

// function to hide edit employeee
var editEmployeePopup = document.getElementById("editEmployee");

document.body.addEventListener("mousedown", (event) => {
  if (!editEmployeePopup.contains(event.target)) {
    editEmployeePopup.style.display = "none";
  }
});

//delet function confirmation to employe

function deletEvaluation() {
  var deletEvaluation = document.getElementById("deletEvaluation");
  var overlayMain = document.getElementById("overlayMain");

  deletEvaluation.style.display = "block";
  overlayMain.style.display = "block";
}

// //delet cancel function to employe

function cancelDelet() {
  var deletEvaluation = document.getElementById("deletEvaluation");
  var overlayMain = document.getElementById("overlayMain");

  deletEvaluation.style.display = "none";
  overlayMain.style.display = "none";
}

// function to close edit employee form

function closeForm() {
  var editEmployeePopup = document.getElementById("editEmployee");
  var overlay = document.getElementById("overlay");

  editEmployeePopup.style.display = "none";
  overlay.style.display = "none";
}
// Function to delete employee
function delete_emp(id) {
  document.getElementById("deletBtn").addEventListener("click", function (event) {
      event.preventDefault();

      fetch(`http://localhost:3000/employees/${id}`, {
        method: "DELETE",
      })
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log("Employee deleted successfully:", data);
          addFetch();
          cancelDelet();
          Swal.fire({
            title: "Deleted!",
            text: "Data has been deleted.",
            icon: "success",
            confirmButtonText: "OK",
          })
        })
        .catch((error) => {
          console.error("Error deleting employee:", error);
        });
    });
  deletEvaluation();
}

//delet employee

//form validation

function FormValidation() {
  const salutation = document.getElementById("salutation").value.trim();
  const firstname = document.getElementById("firstname").value.trim();
  const lastname = document.getElementById("lastname").value.trim();
  const email = document.getElementById("email").value.trim();
  const mobilenumber = document.getElementById("mobilenumber").value.trim();
  const username = document.getElementById("username");
  const password = document.getElementById("password").value.trim();
  const qualification = document.getElementById("qualification");
  const address = document.getElementById("address");
  const country = document.getElementById("countrySelector");
  const state = document.getElementById("stateSelector");
  const city = document.getElementById("citySelector");
  const zip = document.getElementById("pincode").value.trim();

  const gender = document.querySelector('input[name="gender"]:checked');
  const maleRadioButton = document.getElementById("male");
  const femaleRadioButton = document.getElementById("female");
  const errorGender = document.getElementById("genderError");

  const dob = document.getElementById("dateOfBirth");
  const dobError = document.getElementById("dobError");
  const dobvalue = dob.value;

  const emailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const phoneNumberValidation = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
  const pincodeValidation = /^(\d{4}|\d{6})$/;
  const passwordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

  let isValid = true;

  if (salutation === "select") {
    document.getElementById("salutationError").textContent = "* Required";
    const element = document.getElementById("salutation");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }

  if (firstname === "") {
    document.getElementById("firstnameError").textContent = "* Name Required";
    const element = document.getElementById("firstname");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }

  if (lastname === "") {
    document.getElementById("lastnameError").textContent = "* Name Required";
    const element = document.getElementById("lastname");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (!emailValidation.test(email)) {
    document.getElementById("emailError").textContent = "* Enter A Valid Email";
    const element = document.getElementById("email");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (!phoneNumberValidation.test(mobilenumber)) {
    document.getElementById("mobilenumberError").textContent =
      "* Valid Phone Number Required ";
    const element = document.getElementById("mobilenumber");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (username.value.trim() === "") {
    document.getElementById("usernameError").textContent =
      "* Enter A Strong Username";
    const element = document.getElementById("username");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (password === "") {
    document.getElementById("passwordError").textContent =
      "* Enter A Strong Password";
    const element = document.getElementById("password");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  } else if (!passwordValidation.test(password)) {
    document.getElementById("passwordError").textContent =
      "* Password must be at least 8 characters long";
    const element = document.getElementById("password");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  } else if (!passwordValidation.test(password)) {
    document.getElementById("passwordError").textContent =
      "* Password must contain at least one uppercase letter";
    const element = document.getElementById("password");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  } else if (!passwordValidation.test(password)) {
    document.getElementById("passwordError").textContent =
      "* Password must contain at least one digit";
    const element = document.getElementById("password");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (dobvalue === "") {
    dobError.textContent = "* Date Of Birth Required";
    const element = document.getElementById("dateOfBirth");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 500, behavior: "smooth" });
    isValid = false;
  }
  if (!maleRadioButton.checked && !femaleRadioButton.checked) {
    errorGender.textContent = "* Please select a gender";
    const container = document.getElementById("addEmployee");
    container.scrollTo({ top: container.scrollTop - 500, behavior: "smooth" });
    isValid = false;
  } else {
    errorGender.textContent = "";
  }

  if (qualification.value.trim() === "") {
    document.getElementById("qualificationError").textContent =
      "* Qualification Required";
    const element = document.getElementById("qualification");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollBy(0, -50);
    isValid = false;
  }

  if (address.value.trim() === "") {
    document.getElementById("addressError").textContent =
      "* Enter A Valid Address";
    const element = document.getElementById("address");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollBy(0, -50);
    isValid = false;
  }
  if (country.value.trim() === "select") {
    document.getElementById("countrySelectorError").textContent =
      "* Enter Country";
    const element = document.getElementById("countrySelector");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollBy(0, -50);
    isValid = false;
  }

  if (state.value.trim() === "select") {
    document.getElementById("stateSelectorError").textContent = "* Enter State";
    const element = document.getElementById("stateSelector");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollBy(0, -50);
    isValid = false;
  }
  if (city.value.trim() === "") {
    document.getElementById("citySelectorError").textContent = "* Enter city";
    const element = document.getElementById("citySelector");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollBy(0, -50);
    isValid = false;
  }
  if (zip === "") {
    document.getElementById("pincodeError").textContent = "* pincode requird";
    const element = document.getElementById("pincode");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("addEmployee");
    container.scrollBy(0, -50);
    isValid = false;
  } else if (!pincodeValidation.test(zip)) {
    document.getElementById("pincodeError").textContent = "* Incorrect Format ";
    isValid = false;
  }

  //function to hide error message when i add text in input field

  const inputFields = document.querySelectorAll(
    "input, select, textarea, radio button"
  );
  inputFields.forEach((inputField) => {
    inputField.addEventListener("input", () => {
      const dataName = inputField.id;
      const errorId = `${dataName}Error`;
      const errorMessageElement = document.getElementById(errorId);
      if (errorMessageElement) {
        errorMessageElement.textContent = "";
        inputField.style.border = "1px solid green";
      }
      if (
        inputField.tagName.toLowerCase() === "input" ||
        inputField.tagName.toLowerCase() === "select" ||
        inputField.tagName.toLowerCase() === "textarea"
      ) {
        inputField.style.border = "1px solid green";
      }
    });
  });

  //function to hide error message when i add text in input field

  if (isValid == false) {
    return false;
  } else {
    return true;
  }
}

//gender validation
const maleRadioButton = document.getElementById("male");
const femaleRadioButton = document.getElementById("female");
const errorGender = document.getElementById("genderError");

maleRadioButton.addEventListener("change", () => {
  if (errorGender.textContent !== "") {
    errorGender.textContent = "";
  }
});

femaleRadioButton.addEventListener("change", () => {
  if (errorGender.textContent !== "") { 
    errorGender.textContent = "";
  }
});

//gender validation

function clearValidation() {
  const errorId = "dobError";
  document.getElementById(errorId).textContent = "";
}
//form validation

//form validation edit
function FormValidationEdit() {
  const editSalutation = document.getElementById("editSalutation").value.trim();
  const editFirstname = document.getElementById("editFirstname").value.trim();
  const editLastname = document.getElementById("editLastname").value.trim();
  const editEmail = document.getElementById("editEmail").value.trim();
  const editMobilenumber = document
    .getElementById("editMobileNumber")
    .value.trim();
  const editUsername = document.getElementById("editUserName");
  const editPassword = document.getElementById("editPassword");
  const editQualification = document.getElementById("editQualification");
  const editAddress = document.getElementById("editAddress");
  const editCountry = document.getElementById("editCountry");
  const editState = document.getElementById("editState");
  const editCity = document.getElementById("editCity");
  const editZip = document.getElementById("editPincode").value.trim();
  var editGender = document.querySelector(
    'input[name="editgender"]:checked'
  ).value;

  const editDob = document.getElementById("editDateOfBirth");
  const editDobError = document.getElementById("editDateofbirthError");
  const editDobvalue = editDob.value;

  const editEmailValidation = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
  const editPhoneNumberValidation = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
  const editPincodeValidation = /^(\d{4}|\d{6})$/;
  const editPasswordValidation = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
  let isValid = true;

  if (editSalutation === "select") {
    document.getElementById("editSalutationError").textContent = "* Required";
    const element = document.getElementById("editSalutation");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (editFirstname === "") {
    document.getElementById("editFirstnameError").textContent =
      "* Name Required";
    const element = document.getElementById("editFirstname");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (editLastname === "") {
    document.getElementById("editLastnameError").textContent =
      "* Name Required";
    const element = document.getElementById("editLastname");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (!editEmailValidation.test(editEmail)) {
    document.getElementById("editEmailError").textContent =
      "* Enter A Valid Email";
    const element = document.getElementById("editEmail");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (!editPhoneNumberValidation.test(editMobilenumber)) {
    document.getElementById("editMobileNumberError").textContent =
      "* Valid Phone Number Required ";
    const element = document.getElementById("editMobileNumber");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (editUsername.value.trim() === "") {
    document.getElementById("editUserNameError").textContent =
      "* Enter A Strong Username";
    const element = document.getElementById("editUserName");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (editPassword.value.trim() === "") {
    document.getElementById("editPasswordError").textContent =
      "* Enter A Strong Password";
    const element = document.getElementById("editPassword");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  } else if (editPasswordValidation.test(editPassword)) {
    document.getElementById("editPasswordError").textContent =
      "* one upercase required";
    const element = document.getElementById("editPassword");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }
  if (editDobvalue === "") {
    editDobError.textContent = "* Date Of Birth Required";
    const element = document.getElementById("editDateOfBirth");
    element.style.border = "1px solid red";
    element.focus();
    element.scrollIntoView({ behavior: "smooth" });
    const container = document.getElementById("editEmployee");
    container.scrollTo({ top: container.scrollTop - 600, behavior: "smooth" });
    isValid = false;
  }

  if (editGender == "") {
    document.getElementById("editGenderError").textContent =
      "* Please select a gender";
    isValid = false;
  }
  if (editQualification.value.trim() === "") {
    document.getElementById("editQualificationError").textContent =
      "* qualification Required";
    isValid = false;
  }
  if (editAddress.value.trim() === "") {
    document.getElementById("editAddressError").textContent =
      "* Enter A Valid Address";
    isValid = false;
  }
  if (editCountry.value.trim() === "select") {
    document.getElementById("editCountrySelectorError").textContent =
      "* Enter Country";
    isValid = false;
  }
  if (editState.value.trim() === "select") {
    document.getElementById("editStateSelectorError").textContent =
      "* Enter State";
    isValid = false;
  }
  if (editCity.value.trim() === "") {
    document.getElementById("editCitySelectorError").textContent =
      "* Enter city";
    isValid = false;
  }

  if (!editPincodeValidation.test(editZip)) {
    document.getElementById("editPincodeError").textContent =
      "* Incorrect pin ";
    isValid = false;
  }

  const editField = document.querySelectorAll("input, select, textarea");
  editField.forEach((editField) => {
    editField.addEventListener("input", () => {
      const dataName = editField.id;
      const errorId = `${dataName}Error`;
      const errorMessage = document.getElementById(errorId);
      if (errorMessage) {
        errorMessage.textContent = "";
        editField.style.border = "1px solid green";
      }
      if (
        editField.tagName.toLowerCase() === "input" ||
        editField.tagName.toLowerCase() === "select" ||
        editField.tagName.toLowerCase() === "textarea"
      ) {
        editField.style.border = "1px solid green";
      }
    });
  });
  if (isValid == false) {
    return false;
  } else {
    return true;
  }
}
function clearMessage() {
  const errorId = "editDateofbirthError";
  document.getElementById(errorId).textContent = "";
}
// employee image adding drag and drop

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imageView = document.getElementById("img-view");

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
  let imgLink = URL.createObjectURL(inputFile.files[0]);
  imageView.style.backgroundImage = `url(${imgLink})`;
  imageView.textContent = "";

  imageView.style.border = 0;
}

dropArea.addEventListener("dragover", function (e) {
  e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
  e.preventDefault();
  inputFile.files = e.dataTransfer.files;
  uploadImage();
});

// employee image adding drag and drop

//search employee information
function searchInput() {
  const searchValue = document.getElementById("searchInput").value.toLowerCase();
  const searchEmployee = allEmployees.filter(employee => employee.firstName.toLowerCase().includes(searchValue));
  display(searchEmployee);
}

function display(employeeArray) {
  const placeholder = document.querySelector("#data-output");
  let count = 1;
  const out = employeeArray.map(employee => `
    <tr>
      <td>#${count++}</td>
      <td>
        <img class="img-details" src="http://localhost:3000/employees/${employee.id}/avatar" height="30px" width="30px">
        ${employee.salutation}. ${employee.firstName} ${employee.lastName}
      </td>
      <td>${employee.email}</td>
      <td>${employee.phone}</td>
      <td>${employee.gender}</td>
      <td>${employee.dob}</td>
      <td>${employee.country}</td>
      <td>
        <div class="edit-form">
          <button class="edit-form" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false" onclick="getIndex(${count})"><i class="fa-solid fa-ellipsis "></i></button>
          <ul class="dropdown-menu edit-buttons" aria-labelledby="dropdownMenuButton1">
            <li class="view"><i class="fa-regular fa-eye eye"></i><a class="edit-text" href="viewform.html?id=${employee.id}">View Details</a></li>
            <li class="view edit"><i class="fa-solid fa-pencil"></i><a class="edit-text" href="#" onclick="editEmp('${employee.id}')">Edit</a></li>
            <li class="view edit"><i class="fa-solid fa-trash"></i><a class="edit-text" href="#" onclick="delete_emp('${employee.id}')">Delete</a></li>
          </ul>  
        </div>
      </td>
    </tr>
  `).join('');

  placeholder.innerHTML = out;
}
//search employee information
