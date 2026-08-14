const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const chatBox = document.getElementById("chatBox");

const pdfFile = document.getElementById("pdfFile");
const fileName = document.getElementById("fileName");


/* --------------------------------
   Add message to chat
-------------------------------- */

function addMessage(text, type) {

    const message = document.createElement("div");

    message.className = `message ${type}`;

    message.textContent = text;

    chatBox.appendChild(message);

    chatBox.scrollTop = chatBox.scrollHeight;
}


/* --------------------------------
   PDF file selection
-------------------------------- */

pdfFile.addEventListener("change", () => {

    if (pdfFile.files.length > 0) {

        const file = pdfFile.files[0];

        if (file.type !== "application/pdf") {

            alert("Please select a PDF file.");

            pdfFile.value = "";

            fileName.textContent = "Choose file";

            return;
        }

        fileName.textContent = file.name;

    } else {

        fileName.textContent = "Choose file";
    }
});


/* --------------------------------
   Ask question
-------------------------------- */

async function askQuestion() {

    const question = questionInput.value.trim();


    /* Check question */

    if (!question) {

        alert("Please enter a question.");

        questionInput.focus();

        return;
    }


    /* Display user question */

    addMessage(question, "user");


    /* Clear input */

    questionInput.value = "";


    /* Disable button */

    askButton.disabled = true;

    askButton.textContent = "Thinking...";


    try {

        const response = await fetch(
            "https://ask-my-notes-s8ou.onrender.com/ask",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    question: question
                })
            }
        );


        /* Check server response */

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );
        }


        /* Convert response to JSON */

        const data = await response.json();


        /* Display answer */

        if (data.answer) {

            addMessage(data.answer, "bot");

        } else {

            addMessage(
                "The server did not return an answer.",
                "bot"
            );
        }


    } catch (error) {

        console.error("API Error:", error);

        addMessage(
            "Unable to connect to the backend. Please try again.",
            "bot"
        );

    } finally {

        /* Enable button again */

        askButton.disabled = false;

        askButton.textContent = "Ask";
    }
}


/* --------------------------------
   Ask button
-------------------------------- */

askButton.addEventListener(
    "click",
    askQuestion
);


/* --------------------------------
   Ctrl + Enter
-------------------------------- */

questionInput.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Enter" &&
            (event.ctrlKey || event.metaKey)
        ) {

            event.preventDefault();

            askQuestion();
        }
    }
);