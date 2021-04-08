let checklistDiv = document.querySelector(".divOne")
let list = document.createElement("div")
list.className = `dataOfChecklist`
list.setAttribute("id", `${totalId[i].checklistId}`)
let checklistName_trash = document.createElement("div")
checklistName_trash.cardName = "listName-trash"
let checklistName = document.createElement("span")
checklistName.innerText = text
let deleteChecklist = document.createElement("img")
deleteChecklist.src = "../images/trash-2.svg"
checklistName_trash.appendChild(checklistName)
checklistName_trash.appendChild(deleteChecklist)
// list.appendChild(checklistName)
// list.appendChild(deleteChecklist)
list.appendChild(checklistName_trash)
let addItems = document.createElement("div")
let addBtn = document.createElement("button")
addBtn.innerText = "+ Add items"
addItems.appendChild(addBtn)
list.appendChild(addItems)
checklistDiv.appendChild(list)


//get the chekitems in the checklist

fetch('https://api.trello.com/1/checklists/{id}/checkItems?key=0471642aefef5fa1fa76530ce1ba4c85&token=9eb76d9a9d02b8dd40c2f3e5df18556c831d4d1fadbe2c45f8310e6c93b5c548&name={name}', {
    method: 'POST'
})
