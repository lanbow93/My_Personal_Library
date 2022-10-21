// https://www.googleapis.com/books/v1/volumes?q={search+terms} << Find book by search terms
// https://www.googleapis.com/books/v1/volumes/YJjdtQEACAAJ << Find book by ID

// Variables that will be used later
let userInput;
let bookData;

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
$frequentLocations.searchResults.append(`<li>Title: <span id='bookTitle'>Green Eggs and Ham</span><br>Author: Dr. Seuss</li>`)

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
