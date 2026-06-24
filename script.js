let tasks = [];

// Add Task
function addTask() {
    let task = document.getElementById("task").value;
    let deadline = document.getElementById("deadline").value;

    if (!task || !deadline) {
        alert("Please fill all fields");
        return;
    }

    tasks.push({ task, deadline });

    displayTasks();

    document.getElementById("task").value = "";
    document.getElementById("deadline").value = "";
}

// Show tasks
function displayTasks() {
    document.getElementById("taskList").innerHTML =
        tasks.map((t, i) => 
        `${i + 1}. ${t.task} (Deadline: ${t.deadline})`
        ).join("<br>");
}

// Generate AI Plan
async function generatePlan() {

    if (tasks.length === 0) {
        alert("Add some tasks first");
        return;
    }

    document.getElementById("result").innerHTML =
        "Generating AI plan... 🤖";

    const prompt = `
You are an AI productivity assistant.

User Tasks:
${JSON.stringify(tasks)}

Create:
1. Priority order (high → low)
2. Step by step daily plan
3. What to do first
4. Warnings for urgent tasks
5. Simple explanation
`;

    const API_KEY = "AQ.Ab8RN6JEzWSpr4I2mApkDs__cDBD0H73VcL6PoM4i6I57tKDAw";

    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            }
        );

        const data = await response.json();

        let output = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

// remove markdown symbols
output = output
    .replace(/###/g, "")
    .replace(/##/g, "")
    .replace(/#/g, "")
    .replace(/\*/g, "")
    .replace(/`/g, "");

        document.getElementById("result").innerHTML =
            output ? output.replace(/\n/g, "<br>") : "No response from AI";

    } catch (error) {
        console.log(error);
        document.getElementById("result").innerHTML =
            "Error: Something went wrong with API";
    }
}
