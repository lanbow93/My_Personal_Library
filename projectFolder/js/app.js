// https://www.googleapis.com/books/v1/volumes?q={search+terms} << Find book by search terms
// https://www.googleapis.com/books/v1/volumes/YJjdtQEACAAJ << Find book by ID

// Variables that will be used later
let userInput;
let bookData;
let bookList = {};

//Areas I will need to grab or push data from frequently
const $frequentLocations = {
    searchBox: $("#searchBox"),
    searchForm: $("#inputForm"),
    searchResults: $("#searchResults ul"),
    searchImage: $("#thumbnail img"),
    searchTitle: $("#titleLabel"),
    searchDescription: $("#descriptionLabel"),
    shelfAddList: $("#addDropdown"),
    addForm: $("#addForm")
}
$frequentLocations.searchResults.append(`<li>Title: <span class='bookTitle'>Green Eggs and Ham</span><br>Author: Dr. Seuss</li>`)

// Iterating though list of books and adding them to screen
function listBooks(){
    // Clears out the current displayed results
    $frequentLocations.searchResults.empty();
    // Empties book array of their identifiers
    bookList = {};
    // Initializes counter that will be used to give each element a unique ID
    counter = 0;
    for (let book of bookData.items){
        $frequentLocations.searchResults.append(`<li id="a${counter}">Title: <span class='bookTitle'>${book.volumeInfo.title}</span><br>Author: ${book.volumeInfo.authors[0]}</li>`)
        //Pushing a key value pair to later access if user wants more info
        bookList["a"+counter] = book.id
        counter++
    }
    
}

// Function to grab list item clicked, and use the ID to retireve the thumbnail and description
function moreInfo(event) {

    if (event.target.id === "") {
        let test = event.currentTarget.id
        console.log(bookList)
    } else {
        console.log(event.target.id)
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
