let user = {name: ""};

const participants = [
    {nome: "João"},
    {nome: "Maria"}
];

const messages = [
    {
        from: "João",
        to: "Todos",
        text: "entra na sala...",
        type: "status",
        time: "08:01:17"
    },
    {
        from: "João",
        to: "Todos",
        text: "Bom dia",
        type: "message",
        time: "08:02:50"
    }
];


let newMessageTo = "Todos";
let newMessageType = "message"; // 'message' ou 'private_message'



/* FLUXO */

refreshMessages();
loadParticipants();
loadSelectedParticipant();
loadSelectedType();




/* DECLARAÇÃO DE FUNÇÕES */


function logIn() {
    const nameInput = document.querySelector(".entry-screen > input").value
    if (nameInput !== "") {
        user.name = nameInput;
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
    
    for (let i = 0; i < messages.length; i++) {
        const messageElement = createMessageElement(messages[i]);        
        messagesElement.appendChild(messageElement);
    }
    
}

function sendMessage() {
    
    const content = document.querySelector("footer > input").value;
    document.querySelector("footer > input").value = "";    
    
    const message = {
        from: user.name,
        to: newMessageTo,
        text: content,
        type: newMessageType // "message" ou "private_message"
    }

    messages.push(message);

    refreshMessages();
}

function createMessageElement(message) {

    const messageElement = document.createElement("div");
    messageElement.classList.add("message");

    let innerHTMLContent = ""

    let messageText = "";

    if (message.type === "status") {
        messageElement.classList.add("status");
        innerHTMLContent = `<p><span class="msg-time">(${message.time})</span>  <span class="msg-user">${message.from}</span> ${message.text}</p>`;
    }
    else if (message.type === "private_message") {
        messageElement.classList.add("private");
        innerHTMLContent = `<p><span class="msg-time">(${message.time})</span>  <span class="msg-user">${message.from}</span> reservadamente para <span class="msg-user">${message.to}</span>: ${message.text}</p>`;
    }
    else {
        innerHTMLContent = `<p><span class="msg-time">(${message.time})</span>  <span class="msg-user">${message.from}</span> para <span class="msg-user">${message.to}</span>: ${message.text}</p>`;
    }

    messageElement.innerHTML = innerHTMLContent;
    
    return messageElement;
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


function pressedKeyInMessageInput(element) {
    const value = element.value;

    if (event.key === 'Enter') {
        sendMessage();
    }
}

function loadParticipants() {
    
    const options = document.querySelector(".menu-participants");

    options.innerHTML = "";

    options.innerHTML += createMenuOptionElement("Todos", "people");

    for (let i = 0; i < participants.length; i++) {
        
        options.innerHTML += createMenuOptionElement(participants[i].nome, "person-circle");
    }
}

function createMenuOptionElement(name, icon) {
    return `<div class="menu-option" onclick="selectParticipant(this)">
    <div>
        <ion-icon name="${icon}"></ion-icon>
        <p>${name}</p>    
    </div>
    <ion-icon name="checkmark-sharp"></ion-icon>
</div>`
}

function loadSelectedParticipant() {
    const participantOptions = document.querySelector(".menu-participants").children;

    for (let i=0; i<participantOptions.length; i++) {
        const optionTitle = participantOptions[i].querySelector("p").innerHTML;
        if (optionTitle === newMessageTo) {
            participantOptions[i].classList.add("selected");    
        }
        else {
            participantOptions[i].classList.remove("selected");
        }
    }
}

function loadSelectedType() {
    const typeOptions = document.querySelector(".menu-types").children;
    
    if (newMessageType === "message") {
        typeOptions[0].classList.add("selected");
        typeOptions[1].classList.remove("selected");
    }
    else {
        typeOptions[0].classList.remove("selected");
        typeOptions[1].classList.add("selected");
    }
}


function selectParticipant(element) {
    const name = element.querySelector("p").innerHTML;
    newMessageTo = name;
    loadSelectedParticipant();
}

function selectType(element) {
    const type = element.querySelector("p").innerHTML;

    if (type === "Público") {newMessageType = "message";}
    else {newMessageType = "private_message";}

    loadSelectedType();
}