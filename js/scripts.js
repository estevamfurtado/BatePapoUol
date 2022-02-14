function resize(){
    var heights = window.innerHeight;
    document.querySelector("body").style.height = heights + "px";
}
resize();
window.onresize = function() {
    resize();
};





const STATUS_LINK =         "https://mock-api.driven.com.br/api/v4/uol/status";
const MESSAGES_LINK =       "https://mock-api.driven.com.br/api/v4/uol/messages";
const PARTICIPANTS_LINK =   "https://mock-api.driven.com.br/api/v4/uol/participants";

let user = {name: ""};
let participants = [];
let messages = [];

let newMessageTo = "Todos";
let newMessageType = "message"; // 'message' ou 'private_message'

let refreshToLastMessage = true;


const seeLastButton = document.querySelector(".seeLast-button");
const msgConfigText = document.querySelector(".msgConfig");




/* FLUXO */

refreshWebsite(); // inicio
setInterval(refreshWebsite, 3000); // de 3 em 3s




/* DECLARAÇÃO DE FUNÇÕES */


// Atualização geral

function refreshWebsite() {
    getParticipants();
    getMessages();
    refreshSelectedTypeView();
    loadMsgConfigText();
}



// Atualização dos participantes

function getParticipants() {
    const resposta = axios.get(PARTICIPANTS_LINK);
    resposta.then(loadParticipants);
}
function loadParticipants(participantsRec) {
    participants = participantsRec.data;
    refreshParticipantsView();
    refreshSelectedParticipantView();
}

function refreshParticipantsView() {
    const options = document.querySelector(".menu-participants");
    options.innerHTML = "";
    options.innerHTML += createMenuOptionElement("Todos", "people");

    for (let i = 0; i < participants.length; i++) {
        options.innerHTML += createMenuOptionElement(participants[i].name, "person-circle");
    }
}

function refreshSelectedParticipantView() {
    const participantOptions = document.querySelector(".menu-participants").children;

    let selectedWasNotFound = true;

    for (let i=0; i<participantOptions.length; i++) {
        const optionTitle = participantOptions[i].querySelector("p").innerHTML;
        if (optionTitle === newMessageTo) {
            participantOptions[i].classList.add("selected");
            selectedWasNotFound = false;
        }
        else {
            participantOptions[i].classList.remove("selected");
        }
    }

    if (selectedWasNotFound) {
        participantOptions[0].classList.add("selected");
        newMessageTo = participantOptions[0].querySelector("p").innerHTML;
    }
}






// Atualização das mensagens

function getMessages() {
    const resposta = axios.get(MESSAGES_LINK);
    resposta.then(loadMessages);
}

function loadMessages(messagesRec) {
    messages = messagesRec.data;
    refreshMessagesView();
}

function refreshMessagesView() {
    
    const messagesElement = document.querySelector(".messages");
    messagesElement.innerHTML = "";
    
    for (let i = 0; i < messages.length; i++) {
        const messageElement = createMessageElement(messages[i]);
        if (messages[i].type === "private_message" && messages[i].from !== user.name && messages[i].to !== user.name) {
            //do nothing. dont show
        }      
        else {
            messagesElement.appendChild(messageElement);
        }
    }

    if (refreshToLastMessage) {
        scrollToLastMessage();
    }
}




// Cria elementos a serem adicionados no DOM

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

function createMenuOptionElement(name, icon) {
    return `<div class="menu-option" onclick="selectParticipant(this)">
    <div>
        <ion-icon name="${icon}"></ion-icon>
        <p>${name}</p>    
    </div>
    <ion-icon name="checkmark-sharp"></ion-icon>
</div>`
}







// INTERATIVIDADE DO SITE

// Faz Log In

function pressedKeyInNameInput(element) {
    const button = document.querySelector(".entry-screen > button")
    const value = element.value;

    document.querySelector(".entry-screen > p").classList.add("hidden");

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

function logIn() {
    const nameInput = document.querySelector(".entry-screen > input").value;

    if (nameInput !== "") {
        const resposta = axios.post(PARTICIPANTS_LINK, {name: nameInput});
        resposta.then(
            function validateUsername (userRec) {
                if (userRec.status === 200) {
                    user.name = nameInput;
                    document.querySelector(".entry-screen").classList.add("hidden");
                }
                setInterval(postUserStatus, 5000);
            }        
        ).catch(
            function askNewUser (erro) {
                console.log(erro)
                document.querySelector(".entry-screen > p").classList.remove("hidden");
                document.querySelector(".entry-screen > input").value = "";
            }
        )
    }
}

function postUserStatus() {
    axios.post(STATUS_LINK, user).then();
}




// Abre e Fecha Menu

function showMenu() {
    document.querySelector(".menu-screen").classList.remove("hidden");
    document.querySelector(".menu-screen > nav").classList.remove("hide-nav");
}

function closeMenu() {
    document.querySelector(".menu-screen").classList.add("hidden");
    document.querySelector(".menu-screen > nav").classList.add("hide-nav");
}



// ENVIA MENSAGEM

function sendMessage() {
    const content = document.querySelector(".msgInput").value;
    document.querySelector(".msgInput").value = "";    
    
    const message = {
        from: user.name,
        to: newMessageTo,
        text: content,
        type: newMessageType // "message" ou "private_message"
    }

    axios.post(MESSAGES_LINK, message)
    .then(getMessages)
    .catch(erro => {
        console.log(erro)
    });
    refreshToLastMessage = true;
}

function pressedKeyInMessageInput(element) {
    const value = element.value;
    if (event.key === 'Enter') {
        sendMessage();
    }
}



// Selecionar config de msg


function selectParticipant(element) {
    const name = element.querySelector("p").innerHTML;
    newMessageTo = name;
    refreshSelectedParticipantView();

    loadMsgConfigText();
}

function selectType(element) {
    const type = element.querySelector("p").innerHTML;

    if (type === "Público") {newMessageType = "message";}
    else {newMessageType = "private_message";}

    refreshSelectedTypeView();
    
    loadMsgConfigText();
}

function refreshSelectedTypeView() {
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



// Funções para controlar ultima mensagem na tela

const lastMessageIsInViewport = () => {

    const messagesElement = document.querySelector(".messages");

    const messagesRect = messagesElement.getBoundingClientRect();
    const lastMsgRect = messagesElement.children[messagesElement.children.length - 1].getBoundingClientRect();

    return (messagesRect.bottom > lastMsgRect.top);
};



const controlMessagesScroll = () => {
    if (!lastMessageIsInViewport()) {
        seeLastButton.classList.add("show");
        refreshToLastMessage = false;
    } else {
        seeLastButton.classList.remove("show");
    }
}

const scrollToLastMessage = () => {
    refreshToLastMessage = true;
    const messagesElement = document.querySelector(".messages");
    messagesElement.children[messagesElement.children.length - 1].scrollIntoView();
}


// mostrar configuração da msg

function loadMsgConfigText () {

    let printType = "";
    if (newMessageType === "private_message") {
        printType = "reservada ";
    }

    msgConfigText.innerHTML = `Mensagem <strong>${printType}</strong>para <strong>${newMessageTo}</strong>`;
}