const deleteInput = document.getElementById("deleteInput");
const deleteButton = document.getElementById("deleteButton");

deleteButton.addEventListener("click", async function () {
  const username = deleteInput.value;
  if (username) {
    deleteUser(username);
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
