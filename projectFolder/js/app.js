/* ~~~~~~~~~~~~~~~~~~~~ Bugs Discovered - To Fix ~~~~~~~~~~~~~~~~~~~~ */
// Sometimes no thumbnail (Search results & shelf display)
// Sometimes description is short and doesn't need ... (Search results & shelf display)
// After deleting still needs to auto refresh on the screen

/* ~~~~~~~~~~~~~~~~~~~~ Nice to add  ~~~~~~~~~~~~~~~~~~~~ */
// Adding modal popup window for full description
// Adding in local storage to store books
// Separate AJAX request from putting information on shelf display screen


// https://www.googleapis.com/books/v1/volumes?q={search+terms} << Find book by search terms
// https://www.googleapis.com/books/v1/volumes/YJjdtQEACAAJ << Find book by ID

/* ~~~~~~~~~~~~~~~~~~~~ Needed Global Variables ~~~~~~~~~~~~~~~~~~~~ */
let userInput;
let bookData;
let bookList = {};
let descriptionList= {};
let bookShelf;
let currentEventId;
let currentSelfLink;
let currentAuthor;
let shelfBookID;
let shelfObjects = {
    defaultName: {"kLAoswEACAAJ": ["Harry Potter and the Cursed Child", "J. K. Rowling", `The official playscript of the original West End production of Harry Potter and the Cursed Child. It was always difficult being Harry Potter and it isn't much easier now that he is an overworked employee of the Ministry of Magic, a husband, and father of three school-age children. While Harry grapples with a past that refuses to stay where it belongs, his youngest son Albus must struggle with the weight of a family legacy he never wanted. As past and present fuse ominously, both father and son learn the uncomfortable truth: sometimes, darkness comes from unexpected places. The playscript for Harry Potter and the Cursed Child was originally released as a 'special rehearsal edition' alongside the opening of Jack Thorne's play in London's West End in summer 2016. Based on an original story by J.K. Rowling, John Tiffany and Jack Thorne, the play opened to rapturous reviews from theatregoers and critics alike, while the official playscript became an immediate global bestseller. This revised paperback edition updates the 'special rehearsal edition' with the conclusive and final dialogue from the play, which has subtly changed since its rehearsals, as well as a conversation piece between director John Tiffany and writer Jack Thorne, who share stories and insights about reading playscripts. This edition also includes useful background information including the Potter family tree and a timeline of events from the wizarding world prior to the beginning of Harry Potter and the Cursed Child.`]},

    testName: {"1IleAgAAQBAJ": ["The Giving Tree", "Shel Silverstein", `As The Giving Tree turns fifty, this timeless classic is available for the first time ever in ebook format. This digital edition allows young readers and lifelong fans to continue the legacy and love of a classic that will now reach an even wider audience. "Once there was a tree...and she loved a little boy." So begins a story of unforgettable perception, beautifully written and illustrated by the gifted and versatile Shel Silverstein. This moving parable for all ages offers a touching interpretation of the gift of giving and a serene acceptance of another's capacity to love in return. Every day the boy would come to the tree to eat her apples, swing from her branches, or slide down her trunk...and the tree was happy. But as the boy grew older he began to want more from the tree, and the tree gave and gave and gave. This is a tender story, touched with sadness, aglow with consolation. Shel Silverstein's incomparable career as a bestselling children's book author and illustrator began with Lafcadio, the Lion Who Shot Back. He is also the creator of picture books including A Giraffe and a Half, Who Wants a Cheap Rhinoceros?, The Missing Piece, The Missing Piece Meets the Big O, and the perennial favorite The Giving Tree, and of classic poetry collections such as Where the Sidewalk Ends, A Light in the Attic, Falling Up, Every Thing On It, Don't Bump the Glump!, and Runny Babbit. And don't miss the other Shel Silverstein ebooks, Where the Sidewalk Ends and A Light in the Attic!`]}

}

/* ~~~~~~~~~~~~~~~~~~~~ Areas To Input or Extract Information From DOM ~~~~~~~~~~~~~~~~~~~~ */
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
    shelfCatalogScreen: $("#shelfCatalogMenu"),
    shelfCreationBox: $("#shelfCreateBox"),
    shelfCreationForm: $("#shelfForm"),
    shelfResults: $("#shelfResults ul"),
    shelfSelectionForm: $("#shelfSelectionForm"),
    shelfAddDropdown: $("#addDropdown"),
    listShelfDropdown: $("#addShelfDropdown"),
    catalogThumbnail: $("#catalogThumbnail"),
    shelfTitleLabel: $("#shelfTitleLabel"),
    shelfSubtitleLabel: $("#shelfSubtitleLabel"),
    shelfAuthorLabel: $("#shelfAuthorLabel"),
    shelfDescriptionLabel: $("#shelfDescriptionLabel"),
    removeButton: $("#removeButton")
}

/* ~~~~~~~~~~~~~~~~~~~~ Functions To Control Data & Change Screen ~~~~~~~~~~~~~~~~~~~~ */
// Iterating through shelfs created and added shelves to dropDown
function updateDropdownList () {
    $("select").empty();
    for (let shelf in shelfObjects) { // Loops though the shelf names/keys
        $("select").append(`<option value="${shelf}">${shelf}</option>`)
    }
}

// Updating the area with full book information
function updateScreenInformation(bookObj){
    $frequentLocations.searchImage[0].src = bookObj.volumeInfo.imageLinks.smallThumbnail
    $frequentLocations.searchTitle.text(bookObj.volumeInfo.title)
    $frequentLocations.searchDescription.text(descriptionList[currentEventId].split('').splice(0, 450).join('') + " ...") // Cutting down the description
    // If subtitle returns undefined
    if(bookObj.volumeInfo.subtitle !== undefined) {
        $frequentLocations.searchSubtitle.text(bookObj.volumeInfo.subtitle)
    } else {
        $frequentLocations.searchSubtitle.text("")
    }
    // If book author returns undefined
    if (bookObj.volumeInfo.authors !== undefined) {
    $frequentLocations.searchAuthor.text(bookObj.volumeInfo.authors.join(", "))
    currentAuthor = bookObj.volumeInfo.authors
    console.log(currentAuthor);
    } else {
        $frequentLocations.searchAuthor.text("Unknown")
        currentAuthor = "Unknown"
    }
}

// Creating a new shelf
function createShelf(event) {
    event.preventDefault();
    let shelfName = $frequentLocations.shelfCreationBox.val()
    shelfObjects[`${shelfName}`] = {};
    updateDropdownList()
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

// Adding book to Shelf
function addBookToShelf(event) {
    event.preventDefault();
    let shelfToStore = $frequentLocations.shelfAddDropdown.val()
    shelfObjects[`${shelfToStore}`][`${currentSelfLink}`] = [$frequentLocations.searchTitle.text(), currentAuthor, descriptionList[currentEventId]];
    console.log(shelfObjects); // Test To Remove /////////////////////////////////////////////////
    
}

// Displaying books in specific shelf
function listBookStored(event){
    event.preventDefault();
    // Clears out the current displayed results
    $frequentLocations.shelfResults.empty();
    
    // Grabbing shelf name from dropdown and accessing its book objects
    let selectedShelf = shelfObjects[`${$frequentLocations.listShelfDropdown.val()}`]
    // Initializes counter that will be used to give each element a unique ID
    counter = 0;
    
     for (let bookID in selectedShelf) {
        let bookInformation = selectedShelf[`${bookID}`]
        let strBookID = `${bookID}`;
        if (typeof(bookInformation[1]) === "string") {
            $frequentLocations.shelfResults.append(`<li id="s${strBookID}">Title: <span class='bookTitle'>${bookInformation[0]}</span><br>Author: ${bookInformation[1]}</li>`)
        } else {
            $frequentLocations.shelfResults.append(`<li id="s${strBookID}">Title: <span class='bookTitle'>${bookInformation[0]}</span><br>Author: ${bookInformation[1][0]}</li>`)
        }
        counter++
    }
    $("li").on("click", bookBreakdown)
}

// Displaying book information from shelf
function updateShelfDisplay(bookArray, bookCall) {
    $frequentLocations.catalogThumbnail[0].src = bookCall.volumeInfo.imageLinks.smallThumbnail;
    $frequentLocations.shelfTitleLabel.text(bookArray[0])
    if (bookCall.volumeInfo.authors !== undefined) {
         $frequentLocations.shelfAuthorLabel.text(bookCall.volumeInfo.authors.join(", "));
    } else {
        $frequentLocations.shelfAuthorLabel.text("Unknown")
    }

    if(bookCall.volumeInfo.subtitle === undefined) {
        $frequentLocations.shelfSubtitleLabel.text("")
    } else {
        $frequentLocations.shelfSubtitleLabel.text(bookCall.volumeInfo.subtitle)
    }
    $frequentLocations.shelfDescriptionLabel.text(bookArray[2].split('').splice(0, 450).join('') + " ...")
}

/* ~~~~~~~~~~~~~~~~~~~~ AJAX Calls ~~~~~~~~~~~~~~~~~~~~ */
// When using a specific url ID on search screen
function moreInfo(event) {
    if (event.target.id === "") {
        let selectedBookLink = bookList[event.currentTarget.id]
        const promise = $.ajax({
            url: `https://www.googleapis.com/books/v1/volumes/${selectedBookLink}`
        })
        promise.then(
            (Data) => {
                currentEventId = event.currentTarget.id;
                currentSelfLink = selectedBookLink
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
                currentSelfLink = selectedBookLink
                updateScreenInformation(Data)
            },
            (Error) => {
                console.log(Error);
            }
        )
    }
}

// When using search button with terms
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
        },
        (error) => {
            console.log(error)
        }
    )
}

// Using specifc url from shelf menu
function bookBreakdown(event) {
    bookShelf = `${$frequentLocations.listShelfDropdown.val()}`
    let selectedShelf = shelfObjects[`${$frequentLocations.listShelfDropdown.val()}`];
    let selectedBook = event.currentTarget.id;
    let infoArray = selectedShelf[selectedBook.slice(1)]
    shelfBookID = selectedBook.slice(1)
    shelfPromise = $.ajax({
        url: `https://www.googleapis.com/books/v1/volumes/${selectedBook.slice(1)}`
    });    
    shelfPromise.then(
        (data) => {
            console.log(data);
            console.log(infoArray)
            updateShelfDisplay(infoArray, data);
            
        },
        (error) => {
            console.log(error);
        }
    )
}
/* ~~~~~~~~~~~~~~~~~~~~ Timing and Effect of Screen Transitions ~~~~~~~~~~~~~~~~~~~~ */

// When shelf Catalog button is clicked, changes to the screen
function revealCatalogMenu() {
    $frequentLocations.bookSearchScreen.slideToggle(1000)
    setTimeout(function slideShelfCatalog() {
        $frequentLocations.shelfCatalogScreen.slideToggle(1000)
    },1500)
    $frequentLocations.bookSearchButton.removeAttr("disabled")
    $frequentLocations.shelfCatalogButton.attr("disabled", true)
    $frequentLocations.windowStatus.text("Shelf Catalog")
}

// When book search button is clicked, changes to the screen
function revealSearchMenu() {
    $frequentLocations.shelfCatalogScreen.slideToggle(1000)
    setTimeout(function slideSearchMenu() {
        $frequentLocations.bookSearchScreen.slideToggle(1000)
    },1500)
    $frequentLocations.shelfCatalogButton.removeAttr("disabled")
    $frequentLocations.bookSearchButton.attr("disabled", true)
    $frequentLocations.windowStatus.text("Book Search")
}

//////////////////////////////////// TO DO ////////////////////////////////////////////
// shelfObjects
// shelfName: {"url_ID": [BookTitle, Author(s), descripion]}
// (`<li id="s${counter}">Title: <span class='bookTitle'>${bookInformation[0]}</span><br>Author: ${bookInformation[1][0]}</li>`)







/* ~~~~~~~~~~~~~~~~~~~~ Assigning The Click Listeners ~~~~~~~~~~~~~~~~~~~~ */
// Event listener on the search box to look up book results
$frequentLocations.searchForm.on("submit", searchBook);
// Click listener for Search button slide toggle
$frequentLocations.bookSearchButton.on("click", revealSearchMenu)
// Click listener for Catalog button slide toggle
$frequentLocations.shelfCatalogButton.on("click", revealCatalogMenu)
// Event listener for create shelf button
$frequentLocations.shelfCreationForm.on("submit", createShelf);
// Event listener for book storing
$frequentLocations.addForm.on("submit", addBookToShelf)
// Event Listener for displaying books on shelf
$frequentLocations.shelfSelectionForm.on("submit", listBookStored)
// If remove book from shelf is clicked
$frequentLocations.removeButton.on("click", () => {
    delete shelfObjects[bookShelf][shelfBookID]
    console.log(shelfObjects);
})


/* ~~~~~~~~~~~~~~~~~~~~ Initializes Screen to Proper Conditions ~~~~~~~~~~~~~~~~~~~~ */
// Example Pushes On Screen
function initializeScreen() {
    // $frequentLocations.searchResults.append(`<li>Title: <span class='bookTitle'>This will be filled by a book title</span><br>Author: This will contain one author's name</li>`)
    // $frequentLocations.shelfResults.append(`<li>Title: <span class='bookTitle'>This will be filled by a book title that will be added to this shelf</span><br>Author: This will contain one author's name</li>`)
    //Initially hide shelf menu 
    $frequentLocations.shelfCatalogScreen.slideToggle()
    //$frequentLocations.bookSearchScreen.slideToggle()
    updateDropdownList()
}

// Calls for the function above
initializeScreen();