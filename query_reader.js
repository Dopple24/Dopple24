const urlParams = new URLSearchParams(window.location.search);

// Get a specific parameter
const id = urlParams.get('id');

console.log('ID parameter:', id);