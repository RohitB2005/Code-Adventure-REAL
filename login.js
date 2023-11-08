/* Slide to the signup section from login section */
let clickSignup = () => {
  document.querySelector(".login").style = "transform:translateX(-90%);";
  document.querySelector(".signup").style = "transform:translateX(0);";
  document.querySelector("#undertab").style = "left:null;right:0;";
};

/* Slide to the login section from signup section */
let clickLogin = () => {
  document.querySelector(".login").style = "transform:translateX(0)";
  document.querySelector(".signup").style = "transform:translateX(90%);";
  document.querySelector("#undertab").style = "right:null; left:0;";
};

/* Default to login page if login navbar button is cicked, if else then signup section */
window.onload = function() {
  const fragment = window.location.hash.substring(1);

  if (fragment === 'login') {
    clickLogin();
  } else if (fragment === 'signup') {
    clickSignup();
  }
};

