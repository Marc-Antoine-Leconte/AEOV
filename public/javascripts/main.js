// Button click functions for AEOV application

function createInstance() {
    alert('Create Instance button clicked!');
    // Add your create instance logic here
    console.log('Creating new instance...');
    
    // Example: You could make an AJAX request or redirect to a route
    // window.location.href = '/create-instance';
}

function searchInstance() {
    const instanceCode = document.getElementById('instanceCode').value;
    
    if (!instanceCode.trim()) {
        alert('Please enter an instance code');
        return;
    }
    
    alert(`Searching for instance: ${instanceCode}`);
    console.log('Searching for instance:', instanceCode);
    
    // Add your search logic here
    // Example: Make an AJAX request to search for the instance
    // fetch(`/search-instance/${instanceCode}`)
    //     .then(response => response.json())
    //     .then(data => console.log(data));
}

function joinInstance(instanceName) {
    const confirmed = confirm(`Do you want to join instance: ${instanceName}?`);
    
    if (confirmed) {
        alert(`Joining instance: ${instanceName}`);
        console.log('Joining instance:', instanceName);
        
        // Add your join instance logic here
        // window.location.href = `/join-instance/${instanceName}`;
    }
}