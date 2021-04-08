// This code sample uses the 'node-fetch' library:
// https://www.npmjs.com/package/node-fetch
// const fetch = require('node-fetch');
selectedBoard = ""
let cardssssss = ""
// const load = document.addEventListener("DOMContentLoaded", () => {
//     fetchLists(selectedBoard);
// })
// const input = document.querySelector(".addTxt")

let inp;
function inputTag() {
    inp = document.getElementsByClassName("addTxt")
    for (let index = 0; index < inp.length; index++) {
        inp[index].addEventListener("keyup", function (event) {
            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {
                console.log(event.target.value, event.target.id)
                addElement(event.target.value, event.target.id)
            }
        });
    }
}

//global 
let cardList = [];
let boardList = [];

//adds the cards into the list in the red board
function addElement(list = "", id = "") {
    if (list) {
        // cardList.push({
        //     name: list,
        //     id: '',
        //     complete: false
        // })
        // console.log(todoList[0].text)
        fetch(`https://api.trello.com/1/cards?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a&idList=${id}&name=${list}`, {
            method: "POST"
        })
        fetchLists(selectedBoard)
        displayList()

    }
}

async function fetchLists(boardId) {
    document.querySelector(".trello-data").style.display = "none"
    document.querySelector(".boardlist").style.display = "block"
    //board Red gives all the lists in it.
    selectedBoard = boardId
    await fetch(`https://api.trello.com/1/boards/${boardId}/lists?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
        method: 'GET'
    })
        .then(response => response.json())
        .then(async boardList => {
            console.log('board list ', boardList)
            cardList = []
            for (let index = 0; index < boardList.length; index++)
                //gives the cards in each list.
                await fetch(`https://api.trello.com/1/lists/${boardList[index].id}/cards?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
                    method: 'GET'
                })
                    .then(response => response.json()).
                    then(responseText => {
                        let cards = []
                        for (let i = 0; i < responseText.length; i++) {
                            console.log(responseText)
                            cards.push({
                                id: responseText[i].id,
                                name: responseText[i].name,
                                complete: false,

                            })
                        }
                        // console.log("cards", cards)
                        cardList.push({
                            id: boardList[index].id,
                            name: boardList[index].name,
                            cards: cards
                        })
                        console.log(responseText)
                        console.log('list is :', cardList)
                    })
            // .catch(err => console.error(err));
            displayList()
        })

    console.log('card list is :', cardList)
}


function deleteCard(listIndex, cardIndex) {
    console.log(listIndex, cardList[listIndex].cards[cardIndex])
    fetch(`https://api.trello.com/1/cards/${cardList[listIndex].cards[cardIndex].id}?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
        method: 'DELETE'
    })
    cardList[listIndex].cards.splice(cardIndex, 1);
    displayList()
}


function displayList() {
    document.querySelector(".lists").innerHTML = ""
    let list_template = document.createElement("div")
    list_template.classList.add("listTemplate")

    for (let index = 0; index < cardList.length; index++) {
        const template = document.createElement("div")
        template.classList.add("cards-data")
        cards = cardList[index].cards
        for (let i = 0; i < cards.length; i++) {
            let cardDiv = document.createElement("div")
            cardDiv.className = "cardName-close"

            let cardName = document.createElement("span")
            cardName.style.width = "80%"
            cardName.style.cursor = "pointer"
            cardName.innerText = " " + cards[i].name
            console.log(cards[i].name)
            cardName.id = cards[i].id
            cardName.addEventListener("click", (event) => {
                // console.log(event.target);
                displayChecklist(cardName.id, event)
                // console.log(cards)
                console.log(cards)
                console.log(i)
                console.log(cardName.id)
                displayChecklistInCards(cardName.id)
                displayTheItemsInChecklist(cardName.id)
                // zinga()
                // displayChecklistInCards()
            })
            let closeBtn = document.createElement("img")

            closeBtn.src = "../images/x-circle.svg"
            closeBtn.style.cursor = "pointer"

            // closeBtn.innerText = "close"
            closeBtn.addEventListener("click", () => deleteCard(index, i))
            cardDiv.appendChild(cardName)
            cardDiv.appendChild(closeBtn)
            template.appendChild(cardDiv)
            // template += "<div class='data d-flex justify-content-between'>" +

            //     `<span> ${cards[i].name} </span>` +
            //     `<button onclick='deleteCard(${index},${i})'>Close</button></div>`;
        }
        //template double
        let listDiv = document.createElement("div")
        listDiv.classList.add("list-data")
        let listName = document.createElement("h1")
        listName.innerText = cardList[index].name

        let delList = document.createElement("img")
        delList.src = "../images/trash-2.svg"
        delList.style.cursor = "pointer"
        delList.addEventListener("click", () => deleteList(cardList[index].id))
        listName.appendChild(delList)
        let inputDiv = document.createElement("div")
        let addCardsInp = document.createElement("input")
        addCardsInp.style.backgroundColor = "transparent"
        addCardsInp.style.border = "none"

        addCardsInp.setAttribute("placeholder", "  + Add Cards")
        addCardsInp.setAttribute("id", `${cardList[index].id}`)
        addCardsInp.classList.add("addTxt")
        inputDiv.appendChild(addCardsInp)
        listDiv.appendChild(listName)
        listDiv.appendChild(template)
        listDiv.appendChild(inputDiv)
        list_template.appendChild(listDiv)
        // list_template += `<div class='list-data'> "//listDiv"
        //                 <h1>${cardList[index].name} <img src='../images/trash-2.svg' onclick="deleteList('${cardList[index].id}')" style="cursor:pointer">
        //                 </h1><hr>${template}
        //             <div><input id="${cardList[index].id}" class='addTxt' type='text' placeholder='Add cards'></div>
        //                 </div>`
    }

    // document.querySelector(".lists").innerHTML += `<div class='list-box'>${list_template}</div>`
    console.log(list_template)
    document.querySelector(".lists").appendChild(list_template)
    inputTag()
}
// 




const addList = document.getElementById("addList")
if (addList) {
    addList.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            createLists(event.target.value)
        }
    })
}


async function createLists(name) {


    await fetch(`https://api.trello.com/1/lists?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a&name=${name}&idBoard=${selectedBoard}`, {
        method: 'POST'
    })
    document.getElementById("addList").value = ""
    fetchLists(selectedBoard)
}


function deleteList(listId) {

    // console.log(id)
    fetch(`https://api.trello.com/1/lists/${listId}?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a&closed=true`,
        {
            method: 'PUT'
        }).then(resp => fetchLists(selectedBoard))

}


//checklist section

function displayChecklist(cardId, event) {
    // console.log("data", index)
    console.log(cardId, "cardid")
    // console.log(event.target)
    // console.log("event", event.target.innerText)
    document.querySelector(".checklist").style.display = "block"
    //card name and the close img
    // template double
    let cardNameClose = document.createElement("div")
    cardNameClose.className = "name-x"
    cardNameClose.style.display = "absolute"
    // let cardImg = document.createElement("img")
    // cardImg.src = "../images/credit-card.svg"
    // cardNameClose.appendChild(cardImg)
    let nameOfCard = document.createElement("span")
    nameOfCard.style.marginLeft = "30%"
    nameOfCard.style.fontSize = "30px"
    console.log(event.target)
    nameOfCard.innerText = event.target.innerText
    let closeImg = document.createElement("img")
    closeImg.src = "../images/x.svg"
    closeImg.style.cursor = "pointer"
    closeImg.addEventListener("click", () => {
        document.querySelector(".checklistForCard").innerHTML = ""
        document.querySelector(".checklist").style.display = "none"
    })
    cardNameClose.appendChild(nameOfCard)
    cardNameClose.appendChild(closeImg)
    document.querySelector(".checklistForCard").appendChild(cardNameClose)
    // inside the checklistForCard we need two div one for checklist data
    // another one for buttons
    let divs = document.createElement("div")
    divs.className = "twoDivs"
    let dataOfChecklist = document.createElement("div")
    dataOfChecklist.className = "divOne"
    let buttonsOfChecklist = document.createElement("div")
    buttonsOfChecklist.className = "divTwo"
    buttonsOfChecklist.innerText = "+ Checklist"
    buttonsOfChecklist.setAttribute("id", `${cardId}`)

    divs.appendChild(dataOfChecklist)
    divs.appendChild(buttonsOfChecklist)
    document.querySelector(".checklistForCard").appendChild(divs)

    //divTwo
    let divTwoData = document.querySelector(".divTwo")
    divTwoData.addEventListener("click", (event) => {
        console.log(event.target.id)
        document.querySelector(".checklist-input").setAttribute("id", `${event.target.id}`)
        // document.querySelector(".checklist-input").removeEventListener("keyup")
        document.querySelector(".popup").style.display = "flex"

    })
}
// const checklistInput = document.querySelector(".checklist-input")
// if (checklistInput) {
//     checklistInput.addEventListener("keyup", function (event) {
//         // Number 13 is the "Enter" key on the keyboard
//         if (event.keyCode === 13) {
//             displayChecklistPopup(event.target.value, event.target)
//             console.log(event.target.value, event.target)
//             displayChecklist(event.target.id, event);
//         }
//     })
// }

function displayChecklistPopup(text, da) {
    //we have cardid and the checklist name
    // cardssssss = da.id
    // console.log(cardssssss)
    console.log(text, da.id)
    document.querySelector(".popup").style.display = "none"
    document.querySelector(".checklist-input").value = ""



    fetch(`https://api.trello.com/1/checklists?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a&idCard=${da.id}&name=${text}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            let checklistDiv = document.querySelector(".divOne")
            let list = document.createElement("div")
            list.className = `dataOfChecklist`
            list.setAttribute("id", `${res.id}`)
            //template
            let checklistName_trash = document.createElement("div")
            checklistName_trash.className = "listName-trash"
            let checklistName = document.createElement("span")
            checklistName.innerText = text
            let checkImage = document.createElement("img")
            checkImage.src = "../images/check-square.svg"
            checkImage.style.width = "15px"
            checkImage.style.height = "15px"
            checklistName.insertAdjacentElement("afterbegin", checkImage)
            // checklistName.innerText = text
            let deleteChecklist = document.createElement("img")
            deleteChecklist.src = "../images/trash-2.svg"
            checklistName_trash.appendChild(checklistName)
            checklistName_trash.appendChild(deleteChecklist)
            // list.appendChild(checklistName)
            // list.appendChild(deleteChecklist)
            list.appendChild(checklistName_trash)
            let addItems = document.createElement("div")
            let addBtn = document.createElement("button")
            addBtn.className = "addItems"
            addBtn.classList.add("btn", "btn-primary", "btn-sm")
            addBtn.innerText = "+ Add items"
            addBtn.addEventListener("click", (e) => addTheCheckItem(e))
            addItems.appendChild(addBtn)
            list.appendChild(addItems)
            checklistDiv.appendChild(list)
            deleteChecklist.addEventListener("click", () => deleteTheChecklist(res.idCard, res.id))
        })
    // .then(displayChecklistInCards())

}
let totalId = []
function displayChecklistInCards(id) {
    console.log(id)
    fetch(`https://api.trello.com/1/cards/${id}/checklists?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(checklistsInCard => {

            console.log(checklistsInCard)
            checklistsInCard.forEach((ele, i) => {
                const idOfCard = checklistsInCard[i].idOfCard
                // name of the checklist
                const name = checklistsInCard[i].name
                //ids of the checklist
                const id = checklistsInCard[i].id

                totalId.push({
                    checklistId: checklistsInCard[i].id,
                    cardId: checklistsInCard[i].idCard


                }

                )
                console.log(id)
                let checklistDiv = document.querySelector(".divOne")
                let list = document.createElement("div")
                // it has the trash icon,checklist name,add item btn
                list.className = `dataOfChecklist`
                list.setAttribute("id", `${totalId[i].checklistId}`)
                //template
                let checklistName_trash = document.createElement("div")
                checklistName_trash.className = "listName-trash"

                let checklistName = document.createElement("span")
                checklistName.innerText = name
                let checkImage = document.createElement("img")
                checkImage.src = "../images/check-square.svg"
                checkImage.style.width = "15px"
                checkImage.style.height = "15px"
                checklistName.insertAdjacentElement("afterbegin", checkImage)
                let deleteChecklist = document.createElement("img")
                deleteChecklist.src = "../images/trash-2.svg"
                checklistName_trash.appendChild(checklistName)
                checklistName_trash.appendChild(deleteChecklist)
                // list.appendChild(checklistName)
                // list.appendChild(deleteChecklist)
                list.appendChild(checklistName_trash)
                let addItems = document.createElement("div")
                let addBtn = document.createElement("button")
                addBtn.className = "addItems"
                addBtn.classList.add("btn", "btn-primary", "btn-sm")
                addBtn.innerText = "+ Add items"
                addBtn.addEventListener("click", (e) => addTheCheckItem(e))
                addItems.appendChild(addBtn)
                list.appendChild(addItems)

                checklistDiv.appendChild(list)
                // console.log(totalId[i].cardId, totalId[i].checklistId)
                // to delete the checklist
                deleteChecklist.addEventListener("click", () => deleteTheChecklist(totalId[i].cardId, totalId[i].checklistId))
            })
            // for (let i = 0; i < checklistsInCard.length; i++) {
            // }
            console.log(totalId)
            // for (let i = 0; i < totalId.length; i++) {
            //     fetch(`https://api.trello.com/1/checklists/${totalId[i].checklistId}/checkItems?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
            //         method: 'GET'
            //     })
            //         .then(res => res.json())
            //         .then(res => {
            //             console.log(res)
            //         })

            // }

        })



}

// 
document.querySelector(".popupbutton1").addEventListener("click", (e) => close(e))
document.querySelector(".popupbutton2").addEventListener("click", () => closepopup())
function close(e) {
    // let th = document.getElementById("thing")

    // console.log(th)
    // console.log(e.target.parentNode.parentNode.children[0].id)
    console.log(e.target.parentNode.parentNode.children[0].value, e.target.parentNode.parentNode.children[0])
    displayChecklistPopup(e.target.parentNode.parentNode.children[0].value, e.target.parentNode.parentNode.children[0])
    document.querySelector(".popup").style.display = "none"
}
function closepopup() {
    document.querySelector(".popup").style.display = "none"
}
// //
function deleteTheChecklist(card, id) {
    console.log(card, id)
    // console.log(checklistId)
    fetch(`https://api.trello.com/1/cards/${card}/checklists/${id}?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
        method: 'DELETE'
    })
        .then(res => {
            document.getElementById(`${id}`).remove()
        })

}



//checklist items section


// function displayChecklistItems(e) {
//     // fetch(`https://api.trello.com/1/checklists/${id}/checkItems??key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a&name=${name}`, {
//     //     method: 'POST'
//     // })
//     // .then()
//     document.querySelector(".checkItemsPopup").style.display = "block"
//     console.log(e.target)

// }
document.querySelector(".checkitemsSubmit").addEventListener("click", (e) => displayTheCheckItems(e))
document.querySelector(".checkitemsClose").addEventListener("click", () => closeTheCheckitemsPopup())
function closeTheCheckitemsPopup() {
    document.querySelector(".checkItemsPopup").style.display = "none"
    document.querySelector(".input").value = ""
}
function displayTheCheckItems(e) {

    //listId
    // console.log(e.target.parentNode.parentNode)
    console.log(e.target.parentNode.parentNode.children[0].value)
    console.log(e.target.parentNode.parentNode.children[0].id)
    const checklistId = e.target.parentNode.parentNode.children[0].id
    const checkItemName = e.target.parentNode.parentNode.children[0].value


    fetch(`https://api.trello.com/1/checklists/${checklistId}/checkItems?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a&name=${checkItemName}`, {
        method: 'POST'
    })
        .then(res => res.json())
        .then(res => {
            console.log(res)
            document.querySelector(".checkItemsPopup").style.display = "none"
            //to display the checklistItems
            checklistItems(`${res.idChecklist}`, `${res.name}`)

        })
    // 


}
function checklistItems(checklistid, name) {
    let checklistDiv = document.getElementById(checklistid)
    // console.log(checklistDiv.id)
    let checkItemsDiv = document.createElement("div")
    let checkBox = document.createElement("input")
    checkBox.style.marginRight = "5px"
    checkBox.setAttribute("type", "checkbox")
    let checklistName = document.createElement("span")
    checklistName.innerText = name
    checkItemsDiv.appendChild(checkBox)
    checkItemsDiv.appendChild(checklistName)

    checklistDiv.appendChild(checkItemsDiv)
}
function addTheCheckItem(e) {
    console.log(e.target)
    console.log(e.target.parentNode.parentNode.id)
    document.querySelector(".checkItemsPopup").style.display = "block"
    document.querySelector(".input").setAttribute("id", `${e.target.parentNode.parentNode.id}`)
}

function displayTheItemsInChecklist(id) {
    console.log(id)
    fetch(`https://api.trello.com/1/cards/${id}/checklists?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
        method: 'GET'
    })
        .then(res => res.json())
        .then(res => {
            console.log(res, "res")
            for (let i = 0; i < res.length; i++) {
                fetch(`https://api.trello.com/1/checklists/${res[i].id}/checkItems?key=d71118bbc2a871363416ddebdde1f69b&token=f01c685ff3583f725a159937a5add47553bef672fc1df6e5f49dda5e1854340a`, {
                    method: 'GET'
                })
                    .then(res => res.json())
                    .then(res => {
                        console.log(res, "res1")
                        document.querySelector(".checkItemsPopup").style.display = "none"
                        // if (res.length != 0) {
                        res.forEach((res, i) => {
                            checklistItems(`${res[i].idChecklist}`, `${res[i].name}`)
                        })
                        // for (let i = 0; i < res.length; i++) {
                        // console.log("hiiii")
                        // checklistItems(`${res[i].idChecklist}`, `${res[i].name}`)
                        // let checklistDiv = document.getElementById(`${res[i].idChecklist}`)
                        // // console.log(checklistDiv.id)
                        // let checkItemsDiv = document.createElement("div")
                        // let checkBox = document.createElement("input")
                        // checkBox.style.marginRight = "5px"
                        // checkBox.setAttribute("type", "checkbox")
                        // let checklistName = document.createElement("span")
                        // checklistName.innerText = `${res[i].name}`
                        // checkItemsDiv.appendChild(checkBox)
                        // checkItemsDiv.appendChild(checklistName)

                        // checklistDiv.appendChild(checkItemsDiv)
                        // }
                    }
                    )
            }


        })
}