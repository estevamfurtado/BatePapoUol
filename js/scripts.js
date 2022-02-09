let from = "Estevam";
let to = "Maria";
let msgVisibility = "public";



class Message {

    constructor(from, to, visibility, content, time) {
        this.from = from;
        this.to = to;
        this.visibility = visibility;
        this.content = content;
        this.time = time;
    }

    createElement() {

        const timeStamp = this.time.toLocaleTimeString();
        console.log(timeStamp);

        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        let text = "";

        if (this.visibility === "status") {
            messageElement.classList.add("status");
            text = `${this.content} na sala...`;
        }
        else if (this.visibility === "private") {
            messageElement.classList.add("private");
            text = `reservadamente para <span class="msg-user">${this.to}</span>: ${this.content}`;
        }
        else {
            text = `para <span class="msg-user">${this.to}</span>: ${this.content}`;
        }

        messageElement.innerHTML = `<p><span class="msg-time">(${timeStamp})</span>  <span class="msg-user">${this.from}</span> ${text}</p>`;
        return messageElement;
    } 

}


const listOfMessages = [
    new Message("Maria", "João", "public", "Hey man", new Date()),
    new Message("João", "Maria", "public", "eai maria", new Date()),
    new Message("Maria", "João", "private", "Vamos nos ver?", new Date()),
    new Message("Maria", null, "status", "entra", new Date())
]

/* FLUXO */

refreshMessages();





/* DECLARAÇÃO DE FUNÇÕES */



function logIn() {
    const nameInput = document.querySelector(".entry-screen > input").value
    console.log(nameInput);
    if (nameInput !== "") {
        from = nameInput;
        document.querySelector(".entry-screen").classList.add("hidden");
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


function refreshMessages() {
    const messagesElement = document.querySelector(".messages");
    messagesElement.innerHTML = "";
    
    for (let i = 0; i < listOfMessages.length; i++) {
        const messageElement = listOfMessages[i].createElement();
        console.log(messageElement);
        
        messagesElement.appendChild(messageElement);
    }
}

function sendMessage() {
    const content = document.querySelector("footer > input").value;
    document.querySelector("footer > input").value = "";    

    listOfMessages.push(new Message(from, to, msgVisibility, content, new Date()));
    refreshMessages();
}

function pressedKeyInNameInput(element) {
    const button = document.querySelector(".entry-screen > button")
    const value = element.value;

    if (event.key === 'Enter') {
        logIn();
    }

    if (value !== "") {
        button.disabled = false;
    }
    else {
        button.disabled = true;
    }
}