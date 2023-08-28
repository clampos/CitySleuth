const deleteInput = document.getElementById("deleteInput");
const deleteButton = document.getElementById("deleteButton");
const preferenceInput = document.getElementById("preferenceInput");
const preferenceButton = document.getElementById("preferenceButton");

deleteButton.addEventListener("click", async function () {
  const username = deleteInput.value;
  if (username) {
    deleteUser(username);
  }
});

preferenceButton.addEventListener("click", async function () {
  const preference = preferenceInput.value;
  if (preference) {
    savePreference(preference);
  }
});

async function deleteUser(username) {
  await fetch(`/user-deletion/${username}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Deleted user: ", data);
    })
    .catch((error) => {
      console.log(error);
    });
}

async function savePreference(preference) {
  console.log("Running preference save");
  await fetch(`/preference-save/${preference}`, {
    method: "PATCH",
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
}
