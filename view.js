const url = new URLSearchParams(document.location.search);
const id = url.get("id");
console.log("id is:", id);

async function viewDetails(id) {
  try {
    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "GET",
    });
    const employee = await response.json();
    

    console.log("Avatar URL:", employee.avatar);

    console.log(employee);

    const employeeImage = document.getElementById("imageView");
    employeeImage.src = `http://localhost:3000/employees/${id}/avatar`;

    const fullName =
      employee.salutation + " " + employee.firstName + " " + employee.lastName;
    document.getElementById("employeeName").innerHTML = fullName;
    document.getElementById("employeeEmail").innerHTML = employee.email;
    document.getElementById("employeeGender").innerHTML = employee.gender;

    const formatteddate = changeformatYMD(employee.dob);
    console.log("Formatted Date:", formatteddate);

    const age = calculateAge(formatteddate);
    document.getElementById("employeeAge").innerHTML = age;

    document.getElementById("employeeDob").innerHTML = employee.dob;
    document.getElementById("employeeNumber").innerHTML = employee.phone;
    document.getElementById("employeeQualification").innerHTML =
      employee.qualifications;
    document.getElementById("employeeAddress").innerHTML = employee.address;
    document.getElementById("employeeUsername").innerHTML = employee.username;
  } catch (error) {
    console.error("Error fetching employee details:", error);
  }
}

viewDetails(id);

function calculateAge(dateOfBirth) {
  const Dob = new Date(dateOfBirth);
  const currentDate = new Date();
  const timeDiff = currentDate - Dob;
  const age = Math.floor(timeDiff / (365.25 * 24 * 60 * 60 * 1000));
  return age;
}

function changeformatYMD(dob) {
  console.log("Original Date:", dob);
  var [date, month, year] = dob.split("-");
  var formatteddate = year + "-" + month + "-" + date;
  return formatteddate;
}

function deletEvaluation() {
  var deletEvaluation = document.getElementById("deletEvaluation");
  var overlayMain = document.getElementById("overlayMain");

  deletEvaluation.style.display = "block";
  overlayMain.style.display = "block";
}

function cancelDelet() {
  var deletEvaluation = document.getElementById("deletEvaluation");
  var overlayMain = document.getElementById("overlayMain");

  deletEvaluation.style.display = "none";
  overlayMain.style.display = "none";
}

function deleteEmployee() {
  fetch(`http://localhost:3000/employees/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Employee deleted successfully");
        window.location.href = "index.html";
      } else {
        console.error("Error deleting employee:", response.status);
        // error response
      }
    })
    .catch((error) => {
      console.error("Error deleting employee:", error);
      //  network errors
    });
}

function editEmployee() {
  var editEmployeePopup = document.getElementById("editEmployee");
  var overlayMain = document.getElementById("overlayMain");

  editEmployeePopup.style.display = "block";
  overlayMain.style.display = "block";
}

// function to hide edit employeee
var editEmployeePopup = document.getElementById("editEmployee");

document.body.addEventListener("mousedown", (event) => {
  if (!editEmployeePopup.contains(event.target)) {
    editEmployeePopup.style.display = "none";
  }
});

// function to close edit employee form

function closeForm() {
  var editEmployeePopup = document.getElementById("editEmployee");
  var overlayMain = document.getElementById("overlayMain");

  editEmployeePopup.style.display = "none";
  overlayMain.style.display = "none";
}

async function editEmployeedetails() {
  try {
    editEmployee();

    const response = await fetch(`http://localhost:3000/employees/${id}`, {
      method: "GET",
    });
    const employee = await response.json();

    document.getElementById(
      "editImage"
    ).src = `http://localhost:3000/employees/${id}/avatar`;
    document.getElementById("editSalutation").value = employee.salutation;
    document.getElementById("editFirstname").value = employee.firstName;
    document.getElementById("editLastname").value = employee.lastName;
    document.getElementById("editEmail").value = employee.email;
    document.getElementById("editMobileNumber").value = employee.phone;
    document.getElementById("editUserName").value = employee.username;

    var gender = document.getElementsByName("gender");
    var dbgender = employee.gender;

    for (var i = 0; i < gender.length; i++) {
      if (gender[i].value === dbgender) {
        gender[i].checked = true;
      }
    }

    document.getElementById("editQualification").value =
      employee.qualifications;
    document.getElementById("editAddress").value = employee.address;
    document.getElementById("editCountry").value = employee.country;
    document.getElementById("editState").value = employee.state;
    document.getElementById("editCity").value = employee.city;
    document.getElementById("editPassword").value = employee.password;
    document.getElementById("editDateOfBirth").value = changeformatYMD(
      employee.dob
    );

    const editForms = document.getElementById("saveChanges");

    editForms.addEventListener("click", async (e) => {
      e.preventDefault();

      function formatchangeedit(dob) {
        let array = dob.split("-").reverse().join("-");
        return array;
      }

      const employeeImage = document.getElementById("editImage").value;
      const editSalutation = document.getElementById("editSalutation").value;
      const editFirstname = document.getElementById("editFirstname").value;
      const editLastname = document.getElementById("editLastname").value;
      const editEmail = document.getElementById("editEmail").value;
      const editMobileNumber =
        document.getElementById("editMobileNumber").value;
      const editUserName = document.getElementById("editUserName").value;
      const editGender = document.querySelector(
        'input[name="gender"]:checked'
      ).value;
      const editQualification =
        document.getElementById("editQualification").value;
      const editAddress = document.getElementById("editAddress").value;
      const editCountry = document.getElementById("editCountry").value;
      const editState = document.getElementById("editState").value;
      const editCity = document.getElementById("editCity").value;
      const editPassword = document.getElementById("editPassword").value;

      let editdateformat = document.getElementById("editDateOfBirth").value;
      const editDateOfBirth = formatchangeedit(editdateformat);

      const editEmployeeDetails = {
        avatar: employeeImage,
        salutation: editSalutation,
        firstName: editFirstname,
        lastName: editLastname,
        email: editEmail,
        phone: editMobileNumber,
        username: editUserName,
        dob: editDateOfBirth,
        gender: editGender,
        qualifications: editQualification,
        address: editAddress,
        country: editCountry,
        state: editState,
        city: editCity,
        password: editPassword,
      };

      try {
        const response = await fetch(`http://localhost:3000/employees/${id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify(editEmployeeDetails),
        });
        const data = await response.json();
        updateViewWithEditedDetails(editEmployeeDetails);
        closeForm();
        // window.location.href = `viewform.html?id=${employee.id}`;
        console.log("successs", data);
      } catch (error) {
        console.log(error, "error");
      }
    });
  } catch (error) {
    console.error("Error:", error);
  }
}
function updateViewWithEditedDetails(employee) {
  document.getElementById("employeeName").textContent = `${employee.salutation} ${employee.firstName} ${employee.lastName}`;
  document.getElementById("employeeEmail").textContent = `Email: ${employee.email}`;
  document.getElementById("employeeGender").textContent = `Gender: ${employee.gender}`;
  document.getElementById("employeeAge").textContent = `Age: ${employee.age}`;
  document.getElementById("employeeDob").textContent = `Date of Birth: ${employee.dob}`;
  document.getElementById("employeeNumber").textContent = `Mobile Number: ${employee.phone}`;
  document.getElementById("employeeQualification").textContent = `Qualifications: ${employee.qualifications}`;
  document.getElementById("employeeAddress").textContent = `Address: ${employee.address}`;
  document.getElementById("employeeUsername").textContent = `Username: ${employee.username}`;
}



