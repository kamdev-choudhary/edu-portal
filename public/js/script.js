// for validation
(() => {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.from(forms).forEach((form) => {
    form.addEventListener(
      "submit",
      (event) => {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// search box

function myFunction() {
  // Declare variables
  var input, filter, table, tr, td, i, j, txtValue;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myTable");
  tr = table.getElementsByTagName("tr");

  // Loop through all table rows, starting from index 1 to skip the header
  for (i = 1; i < tr.length; i++) {
    // Loop through all table cells in the current row
    var rowVisible = false;
    for (j = 0; j < tr[i].cells.length; j++) {
      td = tr[i].cells[j];
      if (td) {
        txtValue = td.textContent || td.innerText;
        // Check if any cell content contains the filter string
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          rowVisible = true;
          break; // Break the inner loop if a match is found in any cell
        }
      }
    }

    // Show or hide the row based on the overall result
    if (rowVisible) {
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}

// Onclick Video Change
function changeVideo(videoUrl) {
  document.getElementById("videoBox").src = videoUrl;
  // Prevent the default behavior of the anchor tag (prevents navigating to a new page)
  event.preventDefault();
}

//Filter Lecture Table
