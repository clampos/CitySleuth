const deleteInput = document.getElementById("deleteInput");
const deleteButton = document.getElementById("deleteButton");
const preferenceInput = document.getElementById("preferenceInput");
const preferenceButton = document.getElementById("preferenceButton");

// ----------------------------------------------------
// EventListeners added for account deletion and search preferences update functionalities
// ----------------------------------------------------

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

// ----------------------------------------------------
// deleteUser() function makes a fetch() call, sending username to the DELETE /users/:username endpoint
// ----------------------------------------------------

async function deleteUser(username) {
  await fetch(`/users/${username}`, {
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

// ----------------------------------------------------
// savePreference() function makes a fetch() call, sending search keyword to the PATCH /users/:preference endpoint
// ----------------------------------------------------

async function savePreference(preference) {
  console.log("Running preference save");
  await fetch(`/users/${preference}`, {
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
