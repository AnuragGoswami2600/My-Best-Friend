
function startJourney() {
    document.getElementById("about").scrollIntoView({
        behavior: "smooth"
    });
}

function showSurprise() {
    const message = document.getElementById("surprise");

    if (message.style.display === "block") {
        message.style.display = "none";
    } else {
        message.style.display = "block";
    }
}

console.log("My Bestie Website Loaded Successfully ❤️");
