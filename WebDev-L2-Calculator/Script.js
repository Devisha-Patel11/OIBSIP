
// Selecting HTML Elements
const input = document.getElementById("inputbox");
const buttons = document.querySelectorAll(".buttons button");

// Variables
let expression = "";
let justCalculated = false;


// Display Function
function updateDisplay() {
    input.value = expression;
}


// Custom Calculation Engine (No eval)
function calculate(exp) {

    // Convert expression into tokens
    const tokens = exp.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/%]/g);

    if (!tokens || tokens.join("") !== exp) {
        throw new Error("Invalid Expression");
    }

    let position = 0;

    // Addition and Subtraction
    function parseExpression() {
        let result = parseTerm();

        while (position < tokens.length) {
            const operator = tokens[position];

            if (operator !== "+" && operator !== "-") {
                break;
            }

            position++;

            const nextValue = parseTerm();

            switch (operator) {
                case "+":
                    result += nextValue;
                    break;

                case "-":
                    result -= nextValue;
                    break;
            }
        }

        return result;
    }

    // Multiplication, Division and Modulo
    function parseTerm() {
        let result = parseFactor();

        while (position < tokens.length) {
            const operator = tokens[position];

            if (!["*", "/", "%"].includes(operator)) {
                break;
            }

            position++;

            const nextValue = parseFactor();

            switch (operator) {
                case "*":
                    result *= nextValue;
                    break;

                case "/":
                    if (nextValue === 0) {
                        throw new Error("Cannot divide by zero");
                    }
                    result /= nextValue;
                    break;

                case "%":
                    if (nextValue === 0) {
                        throw new Error("Cannot modulo by zero");
                    }
                    result %= nextValue;
                    break;
            }
        }

        return result;
    }

    // Numbers and Unary Operators
    function parseFactor() {

        let sign = 1;

        if (tokens[position] === "-") {
            sign = -1;
            position++;
        } else if (tokens[position] === "+") {
            position++;
        }

        const value = tokens[position];

        if (!value || !/^(?:\d+\.?\d*|\.\d+)$/.test(value)) {
            throw new Error("Invalid Expression");
        }

        position++;

        return sign * Number(value);
    }

    const result = parseExpression();

    if (position !== tokens.length || !Number.isFinite(result)) {
        throw new Error("Invalid Expression");
    }

    // Avoid floating point display issues
    return Number(result.toPrecision(12));
}


// Button Click Events
buttons.forEach(button => {

    button.addEventListener("click", () => {

        const action = button.dataset.action;
        const value = button.dataset.value;

        // Clear All
        if (action === "clear") {
            expression = "";
            justCalculated = false;
            updateDisplay();
            return;
        }

        // Delete Last Character
        if (action === "delete") {
            expression = expression.slice(0, -1);
            justCalculated = false;
            updateDisplay();
            return;
        }

        // Calculate Result
        if (action === "calculate") {

            if (expression === "") return;

            try {
                const result = calculate(expression);

                expression = String(result);
                justCalculated = true;

            } catch (error) {
                expression = error.message;
                justCalculated = true;
            }

            updateDisplay();
            return;
        }

        // Ignore buttons without a value
        if (value === undefined) return;

        // Start new calculation after result or error
        if (justCalculated) {

            if (/^\d+$/.test(value) || value === ".") {
                expression = "";
            }

            justCalculated = false;
        }

        // Decimal Point Validation
        if (value === ".") {

            const currentNumber = expression.split(/[+\-*/%]/).pop();

            if (currentNumber.includes(".")) return;

            if (currentNumber === "") {
                expression += "0";
            }

            expression += ".";
        }

        // Numeric Input
        else if (/^\d+$/.test(value)) {
            expression += value;
        }

        // Operator Handling
        else if (["+", "-", "*", "/", "%"].includes(value)) {

            const lastChar = expression.slice(-1);

            if (expression === "") {

                if (value === "-") {
                    expression = "-";
                } else {
                    return;
                }

            } else if (["+", "-", "*", "/", "%"].includes(lastChar)) {

                // Allow negative numbers after operators
                if (
                    value === "-" &&
                    ["*", "/", "%"].includes(lastChar)
                ) {
                    expression += value;
                }

                // Replace previous operator
                else if (lastChar !== "-" || value !== "-") {
                    expression = expression.slice(0, -1) + value;
                }

            } else {
                expression += value;
            }
        }

        updateDisplay();
    });

});
