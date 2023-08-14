const deleteInput = document.getElementById("deleteInput");
const deleteButton = document.getElementById("deleteButton");

deleteButton.addEventListener("click", function () {
  const username = deleteInput.value;
  if (username) {
    deleteUser(username);
  }
});

function deleteUser(username) {
  fetch(`/user-deletion/${username}`, {
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
