const API_URL = 'https://reqres.in/api/users';
const API_KEY = 'reqres-free-v1';
let currentPage = 1;
let totalPages = 1;
let users = [];
let localUsers = [];

const mockUsers = [
    {
        id: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        avatar: 'https://reqres.in/img/faces/1-image.jpg',
        job: 'Developer'
    },
    {
        id: 2,
        first_name: 'Jane',
        last_name: 'Smith',
        email: 'jane.smith@example.com',
        avatar: 'https://reqres.in/img/faces/2-image.jpg',
        job: 'Designer'
    }
];

document.addEventListener('DOMContentLoaded', () => {
    loadUsersFromSessionStorage();
    fetchUsers(currentPage);
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('userForm').addEventListener('submit', handleAddUser);
    document.getElementById('editForm').addEventListener('submit', handleEditUser);
    document.getElementById('closeModal').addEventListener('click', closeModal);
    document.getElementById('prevPage').addEventListener('click', () => changePage(currentPage - 1));
    document.getElementById('nextPage').addEventListener('click', () => changePage(currentPage + 1));
    document.getElementById('searchInput').addEventListener('input', handleSearch);
    document.getElementById('closePopup').addEventListener('click', closePopup);
}

function showLoading() {
    document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
    document.getElementById('loading').classList.add('hidden');
}

function showError(message) {
    const errorDiv = document.getElementById('error');
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 3000);
}

function showPopup(title, message) {
    document.getElementById('popupTitle').textContent = title;
    document.getElementById('popupMessage').textContent = message;
    document.getElementById('popup').classList.remove('hidden');
}

function closePopup() {
    document.getElementById('popup').classList.add('hidden');
}

function loadUsersFromSessionStorage() {
    const cachedUsers = sessionStorage.getItem('localUsers');
    if (cachedUsers) {
        localUsers = JSON.parse(cachedUsers);
        users = [...localUsers];
        renderUsers(users);
    }
}

function saveUsersToSessionStorage() {
    sessionStorage.setItem('localUsers', JSON.stringify(localUsers));
}

async function fetchUsers(page, retries = 2) {
    showLoading();
    const url = `${API_URL}?page=${page}`;
    try {
        const response = await fetch(url, {
            headers: { 'x-api-key': API_KEY }
        });
        if (!response.ok) {
            if (response.status === 429 && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, 1000));
                return fetchUsers(page, retries - 1);
            }
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        if (!data || !data.data || typeof data.total_pages !== 'number') {
            throw new Error('Invalid API response');
        }
        
        users = [...localUsers, ...data.data.filter(apiUser => 
            !localUsers.some(localUser => localUser.id === apiUser.id)
        )];
        totalPages = data.total_pages;
        currentPage = page;
        saveUsersToSessionStorage();
        renderUsers(users);
        updatePagination();
    } catch (error) {
        console.error('Fetch users error:', error);
        let errorMessage = `Failed to fetch users: ${error.message}`;
        if (error.message.includes('429')) {
            errorMessage = 'Rate limit exceeded. Please try again later.';
        }
        showError(errorMessage);
        
        if (users.length === 0) {
            users = [...localUsers, ...mockUsers];
            renderUsers(users);
            totalPages = 1;
            currentPage = 1;
        }
        updatePagination();
    } finally {
        hideLoading();
    }
}

function renderUsers(usersToRender) {
    const userList = document.getElementById('userList');
    userList.innerHTML = '';
    
    if (usersToRender.length === 0) {
        userList.innerHTML = '<p>No users available.</p>';
        return;
    }
    
    usersToRender.forEach(user => {
        const userCard = document.createElement('div');
        userCard.className = 'user-card';
        userCard.innerHTML = `
            <img src="${user.avatar || 'https://reqres.in/img/faces/1-image.jpg'}" alt="${user.first_name || user.name || 'User'}">
            <h3>${user.first_name || user.name || 'Unknown'} ${user.last_name || ''}</h3>
            <p>${user.email || 'N/A'}</p>
            <p>Job: ${user.job || 'N/A'}</p>
            <button class="edit" onclick="openEditModal(${user.id})">Edit</button>
            <button class="delete" onclick="deleteUser(${user.id})">Delete</button>
        `;
        userList.appendChild(userCard);
    });
}

function updatePagination() {
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
    document.getElementById('pageInfo').textContent = `Page ${currentPage} of ${totalPages}`;
}

async function handleAddUser(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const job = document.getElementById('job').value;
    
    showLoading();
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ name, job })
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const newUser = await response.json();
        
        const userToAdd = {
            id: parseInt(newUser.id) || Date.now(),
            first_name: name,
            last_name: '',
            email: `${name.toLowerCase().replace(/\s/g, '')}@example.com`,
            avatar: 'https://reqres.in/img/faces/1-image.jpg',
            job,
            isLocal: true
        };
        
        localUsers.unshift(userToAdd);
        users.unshift(userToAdd);
        saveUsersToSessionStorage();
        renderUsers(users);
        document.getElementById('userForm').reset();
        showPopup('Success', 'User added successfully!');
    } catch (error) {
        console.error('Add user error:', error);
        showError(`Failed to add user: ${error.message}`);
    } finally {
        hideLoading();
    }
}

function openEditModal(id) {
    const user = users.find(u => u.id === id);
    if (user) {
        document.getElementById('editId').value = id;
        document.getElementById('editName').value = user.first_name || user.name || '';
        document.getElementById('editJob').value = user.job || '';
        document.getElementById('editModal').classList.remove('hidden');
    } else {
        showError('User not found');
    }
}

async function handleEditUser(e) {
    e.preventDefault();
    const id = document.getElementById('editId').value;
    const name = document.getElementById('editName').value;
    const job = document.getElementById('editJob').value;
    
    showLoading();
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify({ name, job })
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const updatedUser = await response.json();
        
        const userIndex = users.findIndex(u => u.id === parseInt(id));
        if (userIndex !== -1) {
            const isLocal = users[userIndex].isLocal || false;
            users[userIndex] = {
                ...users[userIndex],
                first_name: name,
                job,
                isLocal
            };
            
            if (isLocal) {
                const localIndex = localUsers.findIndex(u => u.id === parseInt(id));
                if (localIndex !== -1) {
                    localUsers[localIndex] = users[userIndex];
                    saveUsersToSessionStorage();
                }
            }
            renderUsers(users);
            closeModal();
            showPopup('Success', 'User updated successfully!');
        }
    } catch (error) {
        console.error('Update user error:', error);
        showError(`Failed to update user: ${error.message}`);
    } finally {
        hideLoading();
    }
}

async function deleteUser(id) {
    showLoading();
    try {
        const isLocal = users.find(u => u.id === id)?.isLocal || false;
        
        if (!isLocal) {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE',
                headers: { 'x-api-key': API_KEY }
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        users = users.filter(u => u.id !== id);
        localUsers = localUsers.filter(u => u.id !== id);
        saveUsersToSessionStorage();
        renderUsers(users);
        showPopup('Success', 'User deleted successfully!');
    } catch (error) {
        console.error('Delete user error:', error);
        showError(`Failed to delete user: ${error.message}`);
    } finally {
        hideLoading();
    }
}

function closeModal() {
    document.getElementById('editModal').classList.add('hidden');
    document.getElementById('editForm').reset();
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filteredUsers = users.filter(user =>
        (user.first_name || user.name || '').toLowerCase().includes(searchTerm) ||
        (user.last_name || '').toLowerCase().includes(searchTerm) ||
        (user.email || '').toLowerCase().includes(searchTerm)
    );
    renderUsers(filteredUsers);
}

function changePage(page) {
    if (page >= 1 && page <= totalPages) {
        fetchUsers(page);
    }
}
