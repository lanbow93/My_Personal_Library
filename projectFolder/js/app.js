// https://www.googleapis.com/books/v1/volumes?q={search+terms} << Find book by search terms
// https://www.googleapis.com/books/v1/volumes/YJjdtQEACAAJ << Find book by ID


function bookSearch() {
    console.log("This function runs!")
    const search = $("#search").val();
    $("#results").innerhtml("");
    console.log(search)

    $.ajax({
        url: "https://www.googleapis.com/books/v1/volumes?q=" + search
    })
}

$("#button").on("click", bookSearch)