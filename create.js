const loading = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const container = document.getElementById("users-container");
const postResult = document.getElementById("post-result");

let allUsers = [];

// Task 12.2 & 12.4: Load and display users
async function loadUsers() {
    try {
        showLoading();
        const response = await fetch("https://jsonplaceholder.typicode.com/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        allUsers = await response.json();
        displayUsers(allUsers);
        populateCityFilter(allUsers);
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
    }
}

function showLoading() {
    loading.classList.remove("hidden");
    container.innerHTML = "";
}

function hideLoading() {
    loading.classList.add("hidden");
}

function showError(message) {
    errorDiv.textContent = `Error: ${message}`;
    errorDiv.classList.remove("hidden");
}

function displayUsers(users) {
    container.innerHTML = users.map(user => `
        <div class="user-card">
            <h2>${user.name}</h2>
            <p>📧 ${user.email}</p>
            <p>🏢 ${user.company.name}</p>
            <p>📍 ${user.address.city}</p>
        </div>
    `).join("");
}

// Task 12.4: Populate city filter dropdown
function populateCityFilter(users) {
    const cityFilter = document.getElementById("city-filter");
    const cities = [...new Set(users.map(u => u.address.city))].sort();
    cityFilter.innerHTML = '<option value="">All Cities</option>' +
        cities.map(city => `<option value="${city}">${city}</option>`).join("");
}

// Task 12.3: Create Post
async function createPost(title, body, userId) {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body, userId })
    });

    if (!response.ok) {
        throw new Error("Failed to create post");
    }

    return response.json();
}

// Initialize app and set up event listeners
async function init() {
    await loadUsers();

    // Search
    document.getElementById("search").addEventListener("input", (e) => {
        const query = e.target.value.toLowerCase();
        let filtered = allUsers.filter(user =>
            user.name.toLowerCase().includes(query) ||
            user.email.toLowerCase().includes(query)
        );
        applySortAndFilter(filtered);
    });

    // Sort
    document.getElementById("sort").addEventListener("change", () => {
        applySortAndFilter(allUsers);
    });

    // City Filter
    document.getElementById("city-filter").addEventListener("change", () => {
        applySortAndFilter(allUsers);
    });

    // Post Form
    document.getElementById("post-form").addEventListener("submit", async (e) => {
        e.preventDefault();
        const title = document.getElementById("post-title").value.trim();
        const body = document.getElementById("post-body").value.trim();
        const userId = parseInt(document.getElementById("post-userId").value, 10);

        try {
            const result = await createPost(title, body, userId);
            postResult.innerHTML = `<strong>Post Created (ID: ${result.id}):</strong><br>
                Title: ${result.title}<br>
                Body: ${result.body}<br>
                User ID: ${result.userId}`;
            postResult.classList.remove("hidden");
        } catch (err) {
            postResult.innerHTML = `<strong>Error:</strong> ${err.message}`;
            postResult.style.borderColor = "red";
            postResult.style.background = "#ffe6e6";
            postResult.classList.remove("hidden");
        }
    });
}

// Apply current sort and city filter to a user list
function applySortAndFilter(users) {
    const query = document.getElementById("search").value.toLowerCase();
    const city = document.getElementById("city-filter").value;
    const sort = document.getElementById("sort").value;

    let filtered = users;

    // Apply city filter
    if (city) {
        filtered = filtered.filter(u => u.address.city === city);
    }

    // Apply search again (in case called independently)
    if (query) {
        filtered = filtered.filter(u =>
            u.name.toLowerCase().includes(query) ||
            u.email.toLowerCase().includes(query)
        );
    }

    // Apply sort
    filtered.sort((a, b) => {
        return sort === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
    });

    displayUsers(filtered);
}

// Start the app
init();