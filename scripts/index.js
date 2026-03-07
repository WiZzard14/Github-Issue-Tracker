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
    showLoader();

    fetch("https://phi-lab-server.vercel.app/api/v1/lab/issues")
        .then(res => res.json())
        .then(data => {
            allIssues = data.data;
            displayIssues(allIssues);
            updateIssueCount(allIssues);
            hideLoader();
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

const searchIssues = () => {
    const searchText = document.getElementById("search-input").value.trim();

    if (searchText === "") {
        displayIssues(allIssues);
        updateIssueCount(allIssues);
        return;
    }

    showLoader();

    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`)
        .then(res => res.json())
        .then(data => {
            displayIssues(data.data);
            updateIssueCount(data.data);
            hideLoader();
        });
}

const showLoader = () => {
    document.getElementById("loader").classList.remove("hidden");
}

const hideLoader = () => {
    document.getElementById("loader").classList.add("hidden");
}

document.getElementById("search-input").addEventListener("input", function () {
    searchIssues();
});

const displayIssues = (issues) => {
    const issueContainer = document.getElementById("issue-container");
    issueContainer.innerHTML = "";

    if (issues.length === 0) {
        issueContainer.innerHTML = `
            <div class="col-span-full text-center py-10 text-gray-500">
                No issues found
            </div>
        `;
        return;
    }

    for (let issue of issues) {
        const card = document.createElement("div");

        let statusImage = "./assets/Open-Status.png";
        let topBorderColor = "bg-gray-400";

        if (issue.status.toLowerCase() === "open") {
            statusImage = "./assets/Open-Status.png";
            topBorderColor = "bg-green-500";
        }
        else if (issue.status.toLowerCase() === "closed") {
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
            <div class="bg-white rounded-md border border-gray-200 shadow-sm overflow-hidden h-full">
                
                <div class="h-1 w-full ${topBorderColor}"></div>

                <div class="p-4 flex flex-col justify-between min-h-[240px]">
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <img src="${statusImage}" alt="status" class="w-4 h-4">

                            <span class="text-[10px] px-3 py-1 rounded-full ${priorityClass}">
                                ${issue.priority}
                            </span>
                        </div>

                        <h3 onclick="loadIssueDetails(${issue.id})" class="text-[13px] font-semibold text-gray-800 leading-5 mb-2 cursor-pointer hover:text-blue-600">
                            ${issue.title}
                        </h3>

                        <p class="text-[11px] text-gray-400 leading-4 mb-3 h-[32px] overflow-hidden">
                            ${issue.description}
                        </p>

                        <div class="flex flex-wrap gap-2">
                            ${labelsHTML}
                        </div>
                    </div>

                    <div class="border-t border-gray-100 pt-3 mt-4 text-[11px] text-gray-400">
                        <p>#${issue.id} by ${issue.author}</p>
                        <p>${createdDate}</p>
                    </div>
                </div>
            </div>
        `;

        issueContainer.appendChild(card);
    }
}

const loadIssueDetails = (id) => {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => showIssueModal(data.data));
}

const showIssueModal = (issue) => {
    document.getElementById("modal-title").innerText = issue.title;
    document.getElementById("modal-author").innerText = `Opened by ${issue.author}`;
    document.getElementById("modal-date").innerText = new Date(issue.createdAt).toLocaleDateString();
    document.getElementById("modal-description").innerText = issue.description;
    document.getElementById("modal-assignee").innerText = issue.assignee ? issue.assignee : "Not assigned yet";

    const modalStatus = document.getElementById("modal-status");
    modalStatus.innerText = issue.status.charAt(0).toUpperCase() + issue.status.slice(1);

    if (issue.status.toLowerCase() === "open") {
        modalStatus.className = "px-3 py-1 rounded-full bg-green-600 text-white text-xs font-medium";
    } else {
        modalStatus.className = "px-3 py-1 rounded-full bg-purple-600 text-white text-xs font-medium";
    }

    const modalPriority = document.getElementById("modal-priority");
    modalPriority.innerText = issue.priority.toUpperCase();

    if (issue.priority.toLowerCase() === "high") {
        modalPriority.className = "inline-block px-4 py-1 rounded-full text-white text-sm font-medium bg-red-500";
    } 
    else if (issue.priority.toLowerCase() === "medium") {
        modalPriority.className = "inline-block px-4 py-1 rounded-full text-white text-sm font-medium bg-orange-400";
    } 
    else {
        modalPriority.className = "inline-block px-4 py-1 rounded-full text-white text-sm font-medium bg-gray-500";
    }

    let labelsHTML = "";

    for (let label of issue.labels) {
        let labelClass = "bg-yellow-100 text-yellow-600";

        if (label.toLowerCase() === "bug") {
            labelClass = "bg-red-100 text-red-500";
        }

        labelsHTML += `
            <span class="text-[11px] px-3 py-1 rounded-full ${labelClass}">
                ${label.toUpperCase()}
            </span>
        `;
    }

    document.getElementById("modal-labels").innerHTML = labelsHTML;

    document.getElementById("issue_modal").showModal();
}



