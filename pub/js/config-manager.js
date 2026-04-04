// Configuration Manager JavaScript Functions

// Show Add Configuration Dialog
function showAddDialog() {
    document.getElementById('modalTitle').textContent = 'Add Configuration';
    document.getElementById('configKey').value = '';
    document.getElementById('configValue').value = '';
    document.getElementById('configKey').readOnly = false;
    document.getElementById('isEncrypted').checked = false;
    // Set action to 'add' for new configurations
    document.getElementById('configForm').setAttribute('data-action', 'add');
    document.getElementById('editModal').style.display = 'block';
}

// Show Edit Configuration Dialog
function editConfig(key) {
    document.getElementById('modalTitle').textContent = 'Edit Configuration';
    document.getElementById('configKey').value = key;
    document.getElementById('configKey').readOnly = true;
    // Set action to 'edit' for existing configurations
    document.getElementById('configForm').setAttribute('data-action', 'edit');
    
    // Fetch current value and encrypted status
    fetch('/invoke/WxConfigStore.pub/getConfigValue', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            key: key
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.value) {
            document.getElementById('configValue').value = data.value;
        }
        // Set encrypted checkbox based on the encrypted field
        if (data.encrypted === 'true' || data.encrypted === true) {
            document.getElementById('isEncrypted').checked = true;
        } else {
            document.getElementById('isEncrypted').checked = false;
        }
    })
    .catch(error => {
        console.error('Error fetching config:', error);
        alert('Error fetching configuration: ' + error.message);
    });
    
    document.getElementById('editModal').style.display = 'block';
}

// Close Modal
function closeModal() {
    document.getElementById('editModal').style.display = 'none';
}

// Save Configuration
function saveConfig(event) {
    event.preventDefault();
    
    const key = document.getElementById('configKey').value;
    const value = document.getElementById('configValue').value;
    const encrypted = document.getElementById('isEncrypted').checked;
    // Get the action from the form's data attribute
    const action = document.getElementById('configForm').getAttribute('data-action') || 'add';
    
    // Call webMethods service via AJAX
    fetch('/invoke/WxConfigStore.pub/setConfig', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
            name: key,
            value: value,
            encrypted: encrypted ? 'true' : 'false',
            action: action
        })
    })
    .then(response => response.json())
    .then(data => {
        if(data.success === 'true' || data.success === true) {
            alert('Configuration saved successfully');
            closeModal();
            location.reload(); // Reload page to show updated config
        } else {
            alert('Error: ' + (data.message || 'Failed to save configuration'));
        }
    })
    .catch(error => {
        alert('Error: ' + error.message);
    });
}

// Delete Configuration
function deleteConfig(key) {
    if(confirm('Delete configuration: ' + key + '?')) {
        fetch('/invoke/WxConfigStore.pub/deleteConfig', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name: key})
        })
        .then(response => response.json())
        .then(data => {
            if(data.success === 'true' || data.success === true) {
                alert('Configuration deleted successfully');
                location.reload(); // Reload page to show updated list
            } else {
                alert('Error: ' + (data.message || 'Failed to delete configuration'));
            }
        })
        .catch(error => {
            alert('Error: ' + error.message);
        });
    }
}

// Reload Configurations
function reloadConfigs() {
    location.reload();
}

// Export Configurations
function exportConfigs() {
    window.location.href = '/invoke/WxConfigStore.pub/exportConfig';
}

// Filter Configurations
function filterConfigs() {
    const searchValue = document.getElementById('searchBox').value.toLowerCase();
    const table = document.getElementById('configTable');
    const rows = table.getElementsByTagName('tbody')[0].getElementsByTagName('tr');
    
    for (let i = 0; i < rows.length; i++) {
        const key = rows[i].getElementsByClassName('config-key')[0];
        const value = rows[i].getElementsByClassName('config-value')[0];
        
        if (key && value) {
            const keyText = key.textContent || key.innerText;
            const valueText = value.textContent || value.innerText;
            
            if (keyText.toLowerCase().indexOf(searchValue) > -1 || 
                valueText.toLowerCase().indexOf(searchValue) > -1) {
                rows[i].style.display = '';
            } else {
                rows[i].style.display = 'none';
            }
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('editModal');
    if (event.target == modal) {
        closeModal();
    }
}

// Close modal on Escape key
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
});

// Made with Bob
