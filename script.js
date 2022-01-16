// Set array containing the colours of buttons to click
const buttonColours = ["red", "blue", "green", "yellow"];

// Keep track of whether game has started or not
let gameStarted = false;

// Initialise level at 0 before game start
let level = 0;

// Empty array to hold random sequence of buttons - decided by program
let gamePattern = [];

// Empty array to hold buttons clicked - decided by user
let userClickedPattern = [];

// jQuery to listen for keypress which starts the game
$(document).keypress(function () {

    // Remove 'You reached level...' text from display, shown after game over
    $("#hi-score").text("");

    // If game not started, prepare game and start
    if (gameStarted === false) {

        // Change the title to display first level on game start
        $("#level-title").text(`Level: ${level}`);
        
        // Call the function that flashes random button colours for user to click
        nextSequence();
        
        // Game has now begun
        gameStarted = true;
    }

});

// Upon clicking any button on the page:
$(".btn").click(function () {

    // Grab the id of the button that the user clicked and store it...
    let userChosenColour = $(this).attr("id");
    
    // ...then put that button's corresponding id into empty array
    userClickedPattern.push(userChosenColour);

    // Call function to check last user clicks against decided pattern
    checkAnswer(userClickedPattern.length - 1);
    
    // Call functions to play sounds and highlight buttons when clicked
    playSound(userChosenColour);
    animateClick(userChosenColour);

});

// Main function governing game flow, displaying random sequence to be recalled by user
function nextSequence() {

    // Reset user array in preparation for the next level
    userClickedPattern = [];

    // Increment level each time function is called and then display that level
    level++;

    // Display current level to user
    $("#level-title").text(`Level: ${level}`);

    // Store a random number between 1-4 (or 0-3!)
    let randomNumber = Math.floor(Math.random() * 4);
    
    // Use random number to select a random colour from array
    let randomChosenColor = buttonColours[randomNumber];
    
    // Push the randomly chosen colour into an array, ready to be matched up by user
    gamePattern.push(randomChosenColor);

    // Concatenate id of button and its colour to run flashing animation
    $("#" + randomChosenColor).fadeIn(100).fadeOut(100).fadeIn(100);
    
    // Play sound of button when button flashes at random
    playSound(randomChosenColor);

}

// Play sound when button is clicked
function playSound(name) {
    let audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

// Invoke a grey flashing effect when buttons are clicked
function animateClick(currentColour) {

    // Add 'pressed' class from CSS to whatever button was clicked...
    $("#" + currentColour).addClass("pressed");

    //...then remove that class almost immediately to simulate flash effect
    setTimeout(function () {
        $("#" + currentColour).removeClass("pressed");
    }, 100);

}

// Check answers from user match button sequences determined by program
function checkAnswer(currentLevel) {

    // Read inputs from each array (user and program), then check for match
    if (gamePattern[currentLevel] === userClickedPattern[currentLevel]) {
        console.log("Correct");
        // If button clicked does not match button highlighted by program:
    } else {
        // Run game over logic
        gameOver();
    }

    // Game continuation: check arrays to see if user AND program have had a 'turn'
    if (gamePattern.length === userClickedPattern.length) {
        // Then, show the next button to be clicked (after 1 second delay)
        setTimeout(function () {
            nextSequence();
        }, 1000);
    }

}

// Function resets level to 0, game to 'not started', and no button sequence decided
function restartGame() {
    level = 0;
    gameStarted = false;
    gamePattern = [];
}

function gameOver() {

    // Play error sound
    let incorrectSound = new Audio("sounds/wrong.mp3");
    incorrectSound.play();

    // Display a red background flash to user 
    $("body").addClass("game-over");
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 100);

    // Show 'game over' message to user
    $("#level-title").text("Game Over😭 Press any Key to Restart");
    
    // Show highest level reached by the user (append span for different colour)
    $("#hi-score").text(`You reached `).append(`<span>level ${level}</span>`);

    // Call function to reset 'gamePattern' array & key variables 
    restartGame();

}
