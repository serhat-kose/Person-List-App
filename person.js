const form = document.querySelector("#person-form");
const personInput = document.querySelector("#person");
const personList = document.querySelector(".list-group");
const firstCardBody = document.querySelectorAll(".card-body")[0];
const secondCardBody = document.querySelectorAll(".card-body")[1];

const filter = document.querySelector("#filter");
const clearButtons = document.querySelector("#clear-persons");

eventListeners();

function eventListeners() {
    form.addEventListener("submit", addPerson);
    document.addEventListener("DOMContentLoaded", loadAllPersonsToUI);
    secondCardBody.addEventListener("click", deletePerson);
    filter.addEventListener("keyup", filterPersons);
    clearButtons.addEventListener("click", clearAllPersons);
}

function clearAllPersons() {
    if (confirm("Tümünü Silmek İstediğinizden Emin misiniz?")) {
        //Arayüzden personları silme
        // personList.innerHTML = ""; // yavaş bir yöntem

        while (personList.firstElementChild != null) {
            personList.removeChild(personList.firstElementChild);
        }
        localStorage.removeItem("persons");
    }
}

function filterPersons(e) {
    const filterValue = e.target.value.toLowerCase();

    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            //Bulunamadı ise

            listItem.setAttribute("style", "display : none !important");
        } else {
            listItem.setAttribute("style", "display : block");
        }
    });
}

function deletePerson(e) {
    if (e.target.className === "fa fa-remove") {
        e.target.parentElement.parentElement.remove();
        deletePersonFromStorage(e.target.parentElement.parentElement.textContent);
        showAlert("success", "Personel Başarıyla Silindi.");
    }
}

function deletePersonFromStorage(selected) {
    let persons = getPersonsFromStorage();

    persons.forEach(function(person, index) {
        if (person === selected) {
            persons.splice(index, 1);
        }
    });

    localStorage.setItem("persons", JSON.stringify(persons));
}

function loadAllPersonsToUI() {
    let persons = getPersonsFromStorage();

    persons.forEach(function(person) {
        addPersonToUI(person);
    });
}

function addPerson(e) {
    const newPerson = personInput.value.trim();

    if (newPerson === "") {
        showAlert("danger", "Lütfen Bir Personel giriniz");
    } else {
        let personList = document.querySelectorAll(".list-group-item");
        if (personList.length > 0 && personList != null) {
            personList.forEach(function(person) {
                if (person.textContent === newPerson) {
                    showAlert("danger", "Aynı Personeli 2.kez Ekleyemezsiniz.");
                } else {
                    addPersonToUI(newPerson);
                    addPersonToStorage(newPerson);

                    showAlert("success", "Personel Başarıyla Eklendi.");
                }
            });
        } else {
            addPersonToUI(newPerson);
            addPersonToStorage(newPerson);

            showAlert("success", "Personel Başarıyla Eklendi.");
        }
    }

    //prevent Default sayfa yenilendiğinde istediğimiz verinin ekranda kalmasını sağlıyor
    e.preventDefault();
}

function getPersonsFromStorage() {
    // Storageden bütün personları alır.
    let persons;

    if (localStorage.getItem("persons") == null) {
        persons = [];
    } else {
        persons = JSON.parse(localStorage.getItem("persons"));
    }

    return persons;
}

function addPersonToStorage(newPerson) {
    let persons = getPersonsFromStorage();

    persons.push(newPerson);

    localStorage.setItem("persons", JSON.stringify(persons));
}

function showAlert(type, message) {
    const alert = document.createElement("div");

    alert.className = `alert alert-${type}`;
    alert.textContent = message;

    firstCardBody.appendChild(alert);

    setTimeout(function() {
        alert.remove();
    }, 1000);
}

function addPersonToUI(newPerson) {
    //List Item oluşturma
    const listItem = document.createElement("li");

    //Link oluşturma
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class = 'fa fa-remove'></i>";

    listItem.className = "list-group-item d-flex justify-content-between";
    listItem.appendChild(document.createTextNode(newPerson));
    listItem.appendChild(link);

    //Liste Item ekleme
    personList.appendChild(listItem);

    personInput.value = "";

    console.log(listItem);
}