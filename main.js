const create = (tagName, container, text=null, className=null, id=null) => {
    // return HTML element (tagName.className#id) in container with text, class and id
    let element = container.appendChild(document.createElement(tagName))
    text ? element.appendChild(document.createTextNode(text)) : element
    className ? element.classList.add(className) : element
    id ? element.id = id : element
    return element
}

const chat = document.querySelector(".chat-box-app > .chat-container")
const chatInput = document.querySelector(".chat-box-app > .chat-input")

const createBlock = (message, writer) => {
    const x = create("div",chat,null,"chat-bloc")
    x.classList.add(writer)
    return create("p",x,message,"chat-comment")
}

let data = []

let i = 0

const waitXms = (x) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve()
        },x)
    })
}

const lastBlock = () => {
    const blocs = document.querySelectorAll(".chat-bloc")
    return blocs[blocs.length - 1]
}

const lastBlockIsUser = (bloc) => {
    return bloc.classList.contains("user")
}

(async function() {

    await fetch("./services/discussion.json")
    .then(Response => Response.json())
    .then(Response => {
        data = Response
    })

    createBotResponce(data[i].messages)

    chatInput.querySelector(".send-button").addEventListener("click", handlePost)

})()

async function handlePost() {
    const message = chatInput.querySelector("input").value
    chatInput.querySelector("input").value = ""

    if (message != "") {
        lastBlockIsUser(lastBlock()) ? create("p",lastBlock(),message,"chat-comment") : createBlock(message, "user")

        // answere
        createBotResponce(data[i].messages)
    }
}

async function createBotResponce(arr) {

    for (message of arr) {
        const bloc = lastBlock()

        await waitXms(1000)
        lastBlockIsUser(bloc) ? createBlock(message, "contact") : create("p", bloc,message,"chat-comment")
    }
    i++
}