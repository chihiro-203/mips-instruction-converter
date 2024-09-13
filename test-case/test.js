const fs = require('fs');

// Function to read data from case.txt and write to output file
function processInstructions() {
    // Read the content of case.txt
    fs.readFile('case.txt', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            return;
        }

        // Split data by blank lines (two newlines separate different instruction types)
        let blocks = data.split(/\n\s*\n/);

        let result = blocks.map(block => {
            // Split each block by commas, trim spaces and filter out empty lines
            let instructions = block.split(',')
                                    .map(instr => instr.trim())
                                    .filter(instr => instr.length > 0);
            return JSON.stringify(instructions); // Convert array to string
        });

        // Write the result to output.txt
        fs.writeFile('result.txt', result.join(",\n"), (err) => {
            if (err) {
                console.error("Error writing to file:", err);
            } else {
                console.log("Data has been successfully written to result.txt");
            }
        });
    });
}

// Run the function to process the instructions
processInstructions();
