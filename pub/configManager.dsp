<!DOCTYPE html>
<html>
<head>
    <meta http-equiv='Content-Type' content='text/html; charset=UTF-8'>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Configuration Manager</title>
    <link rel="stylesheet" href="css/config-styles.css">
    <script src="js/config-manager.js"></script>
</head>
<body>
    %ifvar key%
        %invoke wm.server.globalvariables:getGlobalVariableValue%
        %endinvoke%
    %endif%
    
    <div class="header">
        <h1>Configuration Manager</h1>
        <div class="env-display">
            Environment: <span class="env-badge" id="envValue">%value value encode(html)%</span>
        </div>
    </div>
    
    <form name="getEnvForm" method="POST" style="display:none;">
        <input type="hidden" name="key" value="Environment">
        <input type="hidden" name="packageName" value="WxConfigStore">
    </form>
    
    <script>
        // Submit form on page load to get environment value
        if (!document.getElementById('envValue').textContent.trim()) {
            document.getEnvForm.submit();
        }
    </script>

    <div class="toolbar">
        <button onclick="showAddDialog()">+ Add Configuration</button>
        <button onclick="reloadConfigs()">🔄 Reload</button>
        <button onclick="exportConfigs()">📥 Export</button>
        <input type="text" id="searchBox" placeholder="Search..." onkeyup="filterConfigs()">
    </div>

    <div class="config-grid">
        <table id="configTable">
            <thead>
                <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Encrypted</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                %invoke WxConfigStore.pub:getAllConfigs%
                    %loop configs%
                        <tr data-key="%value name encode(htmlattr)%">
                            <td class="config-key">%value name encode(html)%</td>
                            <td class="config-value">                                
                                %ifvar encrypted equals('true')%
                                    <span class="encrypted">••••••••</span>
                                %else%
                                    %value value encode(html)%
                                %endif%
                            </td>
                            <td>                                
                                %ifvar encrypted equals('true')%
                                    <span class="badge encrypted">🔒 Yes</span>
                                %else%
                                    <span class="badge">No</span>
                                %endif%
                            </td>
                            <td class="actions">
                                <button onclick="editConfig('%value name encode(javascript)%')">✏️ Edit</button>
                                <button onclick="deleteConfig('%value name encode(javascript)%')">🗑️ Delete</button>
                            </td>
                        </tr>
                    %endloop%
                %endinvoke%
            </tbody>
        </table>
    </div>

    <!-- Add/Edit Modal -->
    <div id="editModal" class="modal">
        <div class="modal-content">
            <span class="close" onclick="closeModal()">&times;</span>
            <h2 id="modalTitle">Add Configuration</h2>
            <form id="configForm" onsubmit="saveConfig(event)">
                <label>Key:</label>
                <input type="text" id="configKey" required>
                
                <label>Value:</label>
                <input type="text" id="configValue" required>
                
                <label>
                    <input type="checkbox" id="isEncrypted">
                    Encrypt this value
                </label>
                
                <div class="form-actions">
                    <button type="submit">Save</button>
                    <button type="button" onclick="closeModal()">Cancel</button>
                </div>
            </form>
        </div>
    </div>
</body>
</html>