let inputList = [];     // List of input elements
let cursorPosition = 0; // Tracks index within inputList
let scrollOffset = 0;   // Tracks the horizontal scroll position to keep cursor visible

// Determines if an element should be treated as a single unit
function isGroupedElement(index) {
    const element = inputList[index];
    return ['log', 'ln', 'sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'cosec', 'sec', 'cot', '√'].includes(element);
}

// Adds function elements to `inputList` as a whole
function addFunction(value) {
    inputList.splice(cursorPosition, 0, value + '(');  // Adds the function (e.g., `log(`)
    inputList.splice(cursorPosition + 1, 0, ')');      // Adds `)` as a separate element
    cursorPosition += 1;                               // Position cursor inside the parentheses
    updateDisplay();
}

// Cursor navigation handling for left and right buttons
function moveCursor(direction) {
    if (direction === 'left' && cursorPosition > 0) {
        if (isGroupedElement(cursorPosition - 1)) {
            cursorPosition -= 1; // Move by one unit for grouped elements
        } else {
            cursorPosition -= 1; // Move normally for single characters
        }
    } else if (direction === 'right' && cursorPosition < inputList.length) {
        if (isGroupedElement(cursorPosition)) {
            cursorPosition += 1; // Move by one unit for grouped elements
        } else {
            cursorPosition += 1; // Move normally for single characters
        }
    }
    updateCursorPosition();
}

// Clears all elements from the display and resets cursor position
function clearAll() {
    inputList = [];
    cursorPosition = 0;
    scrollOffset = 0;
    updateDisplay();
}

// Deletes the element before the cursor
function backspace() {
    if (cursorPosition > 0) {
        inputList.splice(cursorPosition - 1, 1); // Remove element before cursor
        cursorPosition -= 1;  // Move cursor back
        updateDisplay();
    }
}

// Brackets handling
function bracket() {
    inputList.splice(cursorPosition, 0, '(');
    inputList.splice(cursorPosition + 1, 0, ')');      // Adds `)` as a separate element
    cursorPosition += 1;                               // Position cursor inside the parentheses
    updateDisplay();
}

// Displays current input on screen and updates cursor
function updateDisplay() {
    const screen = document.querySelector('.screen1');
    screen.value = inputList.join('');

    updateCursorPosition();
}

// Update cursor position and adjust scroll if needed
function updateCursorPosition() {
    const screen = document.querySelector('.screen1');
    const cursor = document.querySelector('.cursor');

    // Join characters up to cursorPosition to measure width up to cursor
    const textBeforeCursor = inputList.slice(0, cursorPosition).join('');
    const textWidth = getTextWidth(textBeforeCursor, '100px Arial');
    const screenWidth = screen.clientWidth;

    // Adjust scrollOffset if cursor goes beyond the visible screen area
    if (textWidth > screenWidth + scrollOffset) {
        // Move scroll to the right to keep cursor visible
        scrollOffset = textWidth - screenWidth;
    } else if (textWidth < scrollOffset) {
        // Move scroll to the left if cursor is moved back within visible area
        scrollOffset = textWidth;
    }

    // Apply scrollOffset to display
    screen.scrollLeft = scrollOffset;
    
    // Position cursor based on calculated text width
    cursor.style.left = `${Math.min(textWidth - scrollOffset, screenWidth - 2)}px`;
}

// Calculates text width for cursor positioning
function getTextWidth(text, font) {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    context.font = font;
    return context.measureText(text).width;
}

// Toggles between DEG and RAD
async function DEG_RAD() {
  try {
    const mode = await eel.toggle_deg_rad()();  // async/await 形式で呼び出す
    const button = document.getElementById("DEG_RAD");
    button.textContent = mode;  // ボタンのテキストをモードに合わせて設定
    button.className = mode;    // ボタンのクラスもモードに合わせて設定
    //console.log("Mode switched to1:", mode);  // モードが切り替わったことを確認
  } catch (error) {
    console.error("Failed to toggle mode:", error);
  }
}

// Event listener setup for all buttons, including AC and BS
document.querySelectorAll('.calculator button').forEach(button => {
    button.addEventListener('click', () => {
        const value = button.textContent;
        const buttonClass = button.className;

        if (buttonClass === 'left') {
            moveCursor('left'); // Move cursor left
        } else if (buttonClass === 'right') {
            moveCursor('right'); // Move cursor right
        } else if (buttonClass === 'AC') {
            clearAll(); // Clear all elements
        } else if (buttonClass === 'BS') {
            backspace(); // Delete single element
        } else if (buttonClass === 'bracket') {
            bracket();
        } else if (buttonClass === 'pie') {
            inputList.splice(cursorPosition, 0, 'π');
            cursorPosition += 1;
            updateDisplay();
        }
        else if (buttonClass === 'e') {
            inputList.splice(cursorPosition, 0, 'e');
            cursorPosition += 1;
            updateDisplay();
        }
        else if (buttonClass === 'tfunc' || buttonClass === 'close' || buttonClass === 'DEG'|| buttonClass === 'RAD' || buttonClass === 'equal') {
            return;
        } else if (buttonClass === 'DEG' || buttonClass === 'RAD') {
            DEG_RAD();
        } else if (['log', 'ln', 'sin', 'cos', 'tan', 'arcsin', 'arccos', 'arctan', 'cosec', 'sec', 'cot', '√'].includes(value)) {
            addFunction(value);  // Add function like log or sin
        } else if (buttonClass === 'fraction') {
            alert('未実装です。');
        } else {
            // Add other elements normally
            inputList.splice(cursorPosition, 0, value);
            cursorPosition += 1;
            updateDisplay();
        }
    });
});