let user = "Estevam";

let to = "Maria";
let msgVisibility = "public";


function logIn() {
    const nameInput = document.querySelector(".entry-screen > input").value
    console.log(nameInput);
    if (nameInput !== "") {
        user = nameInput;
        console.log(user);
        console.log(document.querySelector(".entry-screen").classList.add("hidden"));
    }
}

function showMenu() {
    document.querySelector(".menu-screen").classList.remove("hidden");
    document.querySelector(".menu-screen > nav").classList.remove("hide-nav");
}

function closeMenu() {
    document.querySelector(".menu-screen").classList.add("hidden");
    document.querySelector(".menu-screen > nav").classList.add("hide-nav");
}