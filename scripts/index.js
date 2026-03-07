let allIssues = [];

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", function () {
    const username = document.getElementById("usernameInput").value;
    const password = document.getElementById("passwordInput").value;

    if (username === "admin" && password === "admin123") {
        document.getElementById("loginSection").classList.add("hidden");
        document.getElementById("mainSection").classList.remove("hidden");
        loadIssues();
    } else {
        alert("Wrong username or password");
    }
});

const loadIssues = () => {
    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;
            displayIssues(allIssues);
            updateIssueCount(allIssues);
        });
}

const updateIssueCount = (issues) => {
    document.getElementById("issue-count").innerText = issues.length + " Issues";
}

const removeActiveBtn = () => {
    document.getElementById("all-btn").className = "bg-white text-gray-500 text-[12px] font-medium px-8 py-2 rounded-sm border border-gray-200";
    document.getElementById("open-btn").className = "bg-white text-gray-500 text-[12px] font-medium px-8 py-2 rounded-sm border border-gray-200";
    document.getElementById("closed-btn").className = "bg-white text-gray-500 text-[12px] font-medium px-8 py-2 rounded-sm border border-gray-200";
}

const showAllIssues = () => {
    removeActiveBtn();
    document.getElementById("all-btn").className = "bg-[#4f1eff] text-white text-[12px] font-medium px-8 py-2 rounded-sm";
    displayIssues(allIssues);
    updateIssueCount(allIssues);
}

const showOpenIssues = () => {
    removeActiveBtn();
    document.getElementById("open-btn").className = "bg-[#4f1eff] text-white text-[12px] font-medium px-8 py-2 rounded-sm";

    const openIssues = allIssues.filter(issue => issue.status.toLowerCase() === "open");
    displayIssues(openIssues);
    updateIssueCount(openIssues);
}

const showClosedIssues = () => {
    removeActiveBtn();
    document.getElementById("closed-btn").className = "bg-[#4f1eff] text-white text-[12px] font-medium px-8 py-2 rounded-sm";

    const closedIssues = allIssues.filter(issue => issue.status.toLowerCase() === "closed");
    displayIssues(closedIssues);
    updateIssueCount(closedIssues);
}

const displayIssues = (issues) => {
    const issueContainer = document.getElementById("issue-container");
    issueContainer.innerHTML = "";

    for (let issue of issues) {
        const card = document.createElement("div");

        let statusImage = "./assets/Open-Status.png";
        let topBorderColor = "bg-green-500";

        if (issue.status.toLowerCase() === "closed") {
            statusImage = "./assets/Closed- Status .png";
            topBorderColor = "bg-purple-500";
        }

        let priorityClass = "bg-gray-100 text-gray-500";

        if (issue.priority.toLowerCase() === "high") {
            priorityClass = "bg-red-100 text-red-500";
        } 
        else if (issue.priority.toLowerCase() === "medium") {
            priorityClass = "bg-orange-100 text-orange-500";
        } 
        else if (issue.priority.toLowerCase() === "low") {
            priorityClass = "bg-gray-100 text-gray-500";
        }

        let labelsHTML = "";

        for (let label of issue.labels) {

            let labelClass = "bg-yellow-100 text-yellow-600";

            if (label.toLowerCase() === "bug") {
                labelClass = "bg-red-100 text-red-500";
            }

            labelsHTML += `
                <span class="text-[10px] px-3 py-1 rounded-full ${labelClass}">
                    ${label.toUpperCase()}
                </span>
            `;
        }

        const createdDate = new Date(issue.createdAt).toLocaleDateString();

        card.innerHTML = `
            <div class="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden flex flex-col h-[260px]">
                
                <div class="h-[3px] ${topBorderColor}"></div>

                <div class="p-4 flex-grow">
                    <div class="flex items-center justify-between mb-3">
                        <div class="flex items-center gap-2">
                            <img src="${statusImage}" alt="status" class="w-4 h-4">
                        </div>

                        <span class="text-[10px] px-2 py-1 rounded-full ${priorityClass}">
                            ${issue.priority}
                        </span>
                    </div>

                    <h3 class="text-[13px] font-semibold text-gray-800 leading-5 mb-2 cursor-pointer">
                        ${issue.title}
                    </h3>

                    <p class="text-[11px] text-gray-400 leading-4 mb-3 h-[32px] overflow-hidden">
                        ${issue.description}
                    </p>

                    <div class="flex flex-wrap gap-2">
                        ${labelsHTML}
                    </div>
                </div>

                <div class="border-t border-gray-100 px-4 py-3 text-[11px] text-gray-400">
                    <p>#${issue.id} by ${issue.author}</p>
                    <p>${createdDate}</p>
                </div>
            </div>
        `;

        issueContainer.appendChild(card);
    }
}



