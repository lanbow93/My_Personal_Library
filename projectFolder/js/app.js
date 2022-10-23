// https://www.googleapis.com/books/v1/volumes?q={search+terms} << Find book by search terms
// https://www.googleapis.com/books/v1/volumes/YJjdtQEACAAJ << Find book by ID

// Variables that will be used later
let userInput;
let bookData;
let bookList = {};
let descriptionList= {};
let currentEventId;

//Areas I will need to grab or push data from frequently
const $frequentLocations = {
    bookSearchButton: $("#bookSearchButton"),
    shelfCatalogButton: $("#shelfCatalogButton"),
    windowStatus: $("#currentWindowStatus"),
    searchBox: $("#searchBox"),
    searchForm: $("#inputForm"),
    searchResults: $("#searchResults ul"),
    searchImage: $("#thumbnail img"),
    searchTitle: $("#titleLabel"),
    searchSubtitle: $("#subtitleLabel"),
    searchDescription: $("#descriptionLabel"),
    searchAuthor: $("#authorLabel"),
    shelfAddList: $("#addDropdown"),
    addForm: $("#addForm"),
    bookSearchScreen: $("#bookSearchMenu"),
    shelfCatalogScreen: $("#shelfCatalogMenu")
}
$frequentLocations.searchResults.append(`<li>Title: <span class='bookTitle'>Green Eggs and Ham</span><br>Author: Dr. Seuss</li>`)


// Updatting the area with full book information
function updateScreenInformation(bookObj){
    $frequentLocations.searchImage[0].src = bookObj.volumeInfo.imageLinks.smallThumbnail
    $frequentLocations.searchTitle.text(bookObj.volumeInfo.title)
    $frequentLocations.searchSubtitle.text(bookObj.volumeInfo.subtitle)
    
    $frequentLocations.searchDescription.text(descriptionList[currentEventId].split('').splice(0, 450).join('') + " ...")
    console.log()

    // If book author returns back undefined
    if (bookObj.volumeInfo.authors !== undefined) {
    $frequentLocations.searchAuthor.text(bookObj.volumeInfo.authors.join(", "))
    } else {
        $frequentLocations.searchAuthor.text("Unknown")
    }
}

// Function to grab list item clicked, and use the ID to retireve the thumbnail and description
function moreInfo(event) {

    if (event.target.id === "") {
        let selectedBookLink = bookList[event.currentTarget.id]
        const promise = $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes/${selectedBookLink}`
        })
        promise.then(
            (Data) => {
                currentEventId = event.currentTarget.id;
                updateScreenInformation(Data)
            },
            (Error) => {
                console.log(Error);
            }
        )
    } else {
        let selectedBookLink = bookList[event.target.id]
        const promise = $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes/${selectedBookLink}`
        })
        promise.then(
            (Data) => {
                currentEventId = event.currentTarget.id;
                updateScreenInformation(Data)
            },
            (Error) => {
                console.log(Error);
            }
        )
    }
}

// Iterating though list of books and adding them to screen
function listBooks(){
    // Clears out the current displayed results
    $frequentLocations.searchResults.empty();
    // Empties book array of their identifiers
    bookList = {};
    // Initializes counter that will be used to give each element a unique ID
    counter = 0;
    for (let book of bookData.items){

        if (book.volumeInfo.authors !== undefined){
            $frequentLocations.searchResults.append(`<li id="a${counter}">Title: <span class='bookTitle'>${book.volumeInfo.title}</span><br>Author: ${book.volumeInfo.authors[0]}</li>`)
        } else {
            $frequentLocations.searchResults.append(`<li id="a${counter}">Title: <span class='bookTitle'>${book.volumeInfo.title}</span><br>Author: Unknown</li>`)
        }

        //Pushing a key value pair to later access if user wants more info
        bookList["a"+counter] = book.id
        descriptionList["a"+counter] = book.volumeInfo.description
        counter++

    }
    
}
// What happens when book title is submitted
function searchBook(event) {
    event.preventDefault()
    let userInput = $frequentLocations.searchBox.val()
    $frequentLocations.searchBox.val("")

    const Promise = $.ajax({
        url: `https://www.googleapis.com/books/v1/volumes?q=${userInput}`
    })

    Promise.then(
        (data) => {
            bookData = data
            listBooks();
            $("li").on("click", moreInfo)
            console.log(data)

        },
        (error) => {
            console.log(error)
        }
    )
}

// Click listener on the search box to look up book results
$frequentLocations.searchForm.on("submit", searchBook);


// When shelf Catalog button is clicked, changes to the screen
function slideSearchMenu() {
    $frequentLocations.bookSearchScreen.slideToggle(1000)
    setTimeout(function slideShelfCatalog() {
        $frequentLocations.shelfCatalogScreen.slideToggle(1000)
    },1500)
    $frequentLocations.bookSearchButton.removeAttr("disabled")
    $frequentLocations.shelfCatalogButton.attr("disabled", true)
    $frequentLocations.windowStatus.text("Shelf Catalog")
}

// Click listener for slide toggle
$frequentLocations.shelfCatalogButton.on("click", () => {
slideSearchMenu()   
})

//Initially hide shelf menu (UNCOMMENT WHEN FINISHED WITH SECOND SCREEN)
// $frequentLocations.shelfCatalogScreen.slideToggle()







// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">The Guernsey Literary and Potato Peel Pie Society</span><br>Author: Mary Ann Shaffer
// </li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
// $("ul").append(`<li>Title: <span id="bookTitle">Roots</span><br>Author: Alex Haley</li>`)
