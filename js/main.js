
// Document ready function
$(() => {
  // Ready contact form
  submitForm();
  // Hide contact form success message
  $("#contactFormSuccess").hide();
  // Hide MailChimp Success Message
  $("#subSuccess").hide();
  // Hide Search Progress Spinner
  $("#searchSpinner").hide();
  // Form submit function
  $('#searchForm').on('submit', (e) => {
    let searchText = $('#searchText').val();
    if (searchText == "") {
      toastr.error("Please Enter a Movie to Search");
      e.preventDefault();
    } else {
      getMovies(searchText);
      toastr.clear()
      e.preventDefault();
    }
  });

  $('#searchBtn').on('click', (e) => {
    let searchText = $('#searchText').val();
    if (searchText == "") {
      toastr.error("Please Enter a Movie to Search");
      e.preventDefault();
    } else {
      getMovies(searchText);
      toastr.clear()
      e.preventDefault();
    }
  });
});

function getMovies(searchText) {
  // API request
  // Variables
  let URL = 'https://www.omdbapi.com/?';
  let API = 'apikey=d11397c3&s=';
  axios.get(URL + API + searchText)
    .then((response) => {
      console.log(response);
      // Check if movie has been found
      let responseText = (response.data.Response);
      console.log(responseText);
      // Create Error Message
      let errorMessage = (response.data.Error);
      console.log(errorMessage);
      // User feedback >> Errors
      if (responseText == "False") {
        toastr.error(errorMessage);
        return false;
      } else {
        // Run output function if response successful
        let movies = response.data.Search;
        let output = '';
        // Looping through each movie in the response
        $.each(movies, (index, movie) => {
          // Appending each movie to output div
          output += `
        <div class="col-12 col-sm-6 col-md-6 col-lg-3 mb-5">
        <div class="card grey lighten-4 text-center">
            <div class="view overlay">
                <img src='${movie.Poster}' class="img-fluid">
                <a onclick="movieSelected('${movie.imdbID}')" href="#">
                    <div class="mask rgba-white-slight"></div>
                </a>
            </div>
            <div class="card-body">
                <h4 class="card-title mt-3">${movie.Title}</h4>
                <a onclick="movieSelected('${movie.imdbID}')" href="#" class="btn btn-custom waves-effect">Movie Details</a>
            </div>
        </div>
        </div>
        `;
        });
        // User Feedback >> Show Search Spinner
        $("#searchSpinner").show();
        // Display Output
        $('#movies').html(output);
        // Scroll to results
        $('html, body').animate({
          scrollTop: $("#movies").offset().top - 100
        }, 1000);
        // Empty Form Input
        $('#searchText').val("");
        // User Feedback >> Hide Search Spinner
        $("#searchSpinner").hide();
      }
    })
    // Error handling
    .catch((err) => {
      console.log(err);
    });
}

function movieSelected(id) {
  // Display individual movies on click using session storage
  sessionStorage.setItem('movieId', id);
  // Navigates to individual movie page
  window.location = 'movie.html';
  return false;
}

function getMovie() {
  let movieId = sessionStorage.getItem('movieId');
  // run if movieId exists, otherwise redirect back to home
  if (movieId == null) {
    // Alerts user to select a movie
    alert("Please select a movie!");
    // Hides progress bar
    $("#progressBar").hide();
    // Hides card
    $(".card").hide();
    // Hides footer
    $("footer").hide();
    // Navigates back to home
    window.location = 'index.html';
  } else {
    // Show user feedback >> Progress Bar
    $("#progressBar").show();
    // Hides card
    $(".card").hide();
    // Hides footer
    $("footer").hide();
    // Calls API for individual movie details >> now searching ID
    console.log(movieId);
    // API request
    // Variables
    let URL = 'https://www.omdbapi.com/?';
    let API = 'apikey=d11397c3&i=';
    axios.get(URL + API + movieId)
      .then((response) => {
        let movie = response.data;
        let output = `
        <div class="row">
            <div class="col-md-4 offset-md-1 mx-3 my-3">
                <div class="view overlay">
                    <img src='${movie.Poster}' class="img-fluid">
                </div>
            </div>
            <div class="col-md-7 text-left ml-3 mt-3">
                <span class="indigo-text">
                    <h6 class="font-bold pb-1"><i class="fa fa-video-camera"></i> ${movie.Genre}</h6>
                </span>
                <h4 class="mb-4"><strong>${movie.Title}</strong></h4>
                <p class="lead">${movie.Plot}</p>
                <div class="row mb-3">
                <div class="col-12 col-sm-12 col-md-12 col-lg-6 mb-2">
                <ul class="list-group mt-3">
                <li class="list-group-item grey lighten-3"><strong>Rated:</strong> ${movie.Rated}</li>
                <li class="list-group-item grey lighten-3"><strong>Released:</strong> ${movie.Released}</li>
                <li class="list-group-item grey lighten-3"><strong>Director:</strong> ${movie.Director}</li>
              </ul>
              </div>
              <div class="col-12 col-sm-12 col-md-12 col-lg-6 mb-2">
              <ul class="list-group mt-3">
              <li class="list-group-item grey lighten-3"><strong>Runtime:</strong> ${movie.Runtime}</li>
              <li class="list-group-item grey lighten-3"><strong>IMDB Rating:</strong> ${movie.imdbRating}</li>
              <li class="list-group-item grey lighten-3"><strong>IMDB Votes:</strong> ${movie.imdbVotes}</li>
            </ul>
            </div>
            </div>
              <div class="row">
              <div class="col-12">
              <p><strong>Actors: </strong>${movie.Actors}</p>
              <p><strong>Awards: </strong>${movie.Awards}</p>
              </div>
             </div>
             <div class="my-2">
                <a class="btn btn-custom ml-0 mb-4" href='https://imdb.com/title/${movie.imdbID}' target='_blank' >View IMDB</a>
                <a class="btn btn-dark ml-0 mb-4" href='index.html' >Return to Search</a>
                </div>
            </div>
        </div>
    </div>
      `;
        // Hide user feedback >> Progress Bar
        $("#progressBar").hide();
        $('#movie').html(output);
        // Shows card
        $(".card").show();
        // Shows footer
        $("footer").show();
      })
      // Error handling
      .catch((err) => {
        console.log(err);
      });
  }
}

// Toaster Options
toastr.options = {
  "closeButton": true,
  "preventDuplicates": true,
  "hideDuration": "100",
}

// MailChimp Sub Form
function addSubscriber() {
let subscriberEmail = $("#mce-EMAIL").val();
if (subscriberEmail =="") {
  toastr.error("Please Enter an Email Address");
} else {
$("#subscribeForm").submit();
$("#mce-EMAIL").val("");
$("#subSuccess").show();
}
}

// Contact Form
function submitForm() {
  $("#contactFormSubmitBtn").click(function(e) {
    var name = $("#form-contact-name").val();
    var email = $("#form-contact-email").val();
    var phone = $("#form-contact-phone").val();
    var company = $("#form-contact-company").val();
    var message = $("#form-contact-message").val();
// Basic Form Validation
    if (name == "" || email == "" ) {
      toastr["error"]("Please fill in your name & email address!");
      return false;
    } else {
      $.ajax({
        url: "https://formspree.io/bobdempsey83@gmail.com",
        method: "POST",
        data: {
          Form: "OMDb Movie Search App",
          Name: name,
          Email: email,
          Phone: phone,
          Company: company,
          Message: message
        },
        dataType: "json"
      });
      // display success confirmations
      toastr["success"]("Form submission successful!");
      $("#contactFormSuccess").show();
      // clear form fields
      $("#form-contact-name").val("");
      $("#form-contact-email").val("");
      $("#form-contact-phone").val("");
      $("#form-contact-company").val("");
      $("#form-contact-message").val("");
      // do not reload page
      e.preventDefault();
    }
  });
}