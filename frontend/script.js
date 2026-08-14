const questionInput = document.getElementById("questionInput");
const askButton = document.getElementById("askButton");
const chatBox = document.getElementById("chatBox");

function addMessage(text, type) {
    const message = document.createElement("div");

    message.className = `message ${type}`;
    message.textContent = text;

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function askQuestion() {

    const question = questionInput.value.trim();

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    addMessage(question, "user");

    questionInput.value = "";

    askButton.disabled = true;
    askButton.textContent = "Thinking...";

    try {

        const response = await fetch("http://127.0.0.1:8000/ask", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                question: question
            })
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();

        addMessage(data.answer, "bot");

    } catch (error) {

        console.error("API Error:", error);

        addMessage(
            "Unable to connect to the backend.",
            "bot"
        );

    } finally {

        askButton.disabled = false;
        askButton.textContent = "Ask";
    }
}

askButton.addEventListener("click", askQuestion);

questionInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter" && (event.ctrlKey || event.metaKey)) {
        askQuestion();
    }

});