for(let i = 1; i <= 5; i++) {          // outer loop for rows
            for(let j = 1; j <= i; j++) {      // inner loop for stars
                console.log("* ");
            }
            console.log();
        }


//...............

function generatePattern() {
    // Get the input value from the user
    const lines = document.getElementById('rowInput').value;
    const displayArea = document.getElementById('patternDisplay');
    
    let pattern = "";
    
    // Outer loop for each row
    for (let i = 1; i <= lines; i++) {
        // Inner loop to add stars for each row
        for (let j = 1; j <= i; j++) {
            pattern += "* ";
        }
        // Move to the next line after completing a row
        pattern += "\n";
    }
    
    // Display the final pattern in the <pre> tag
    displayArea.innerText = pattern;
}

    