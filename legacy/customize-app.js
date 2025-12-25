// Customize App Main Module
// Main application initialization and coordination module

// Main application initialization
function initializeApp() {
    // Debug: Check all storage data
    console.log('=== CUSTOMIZE PAGE DEBUG ===');
    console.log('sessionStorage capturedPhotos:', sessionStorage.getItem('capturedPhotos'));
    console.log('sessionStorage capturedImages:', sessionStorage.getItem('capturedImages'));
    console.log('localStorage capturedPhotos:', localStorage.getItem('capturedPhotos'));
    console.log('localStorage capturedImages:', localStorage.getItem('capturedImages'));
    console.log('localStorage selectedLayout:', localStorage.getItem('selectedLayout'));
    console.log('captureTime:', sessionStorage.getItem('captureTime'));
    
    // Initialize DOM elements cache
    CoreState.initializeDOMElements();
    
    // Load captured photos from sessionStorage
    PhotoManager.loadCapturedPhotos();
    
    // Get selected layout from localStorage
    const selectedLayout = localStorage.getItem('selectedLayout');
    if (!selectedLayout) {
        console.warn('No layout selected, defaulting to layout_strip_4');
        localStorage.setItem('selectedLayout', 'layout_strip_4');
    }
    
    // Get capture time from sessionStorage
    const storedTime = sessionStorage.getItem('captureTime');
    if (storedTime) {
        CoreState.setCaptureTime(new Date(storedTime));
    }
    
    // Load available frames based on selected layout
    FrameEditor.loadFrames();
    
    // Display photos
    PhotoManager.displayPhotos();
    
    // Update frame dimensions
    PhotoManager.updateFrameDimensions();
    
    // Update overlays
    PhotoManager.updateOverlays();
    
    // Initialize frame overlay
    PhotoManager.updateFrameOverlay();
}

// Setup all event listeners
function setupEventListeners() {
    // Setup event listeners for each module
    FrameEditor.setupFrameEditorEventListeners();
    ExportManager.setupExportManagerEventListeners();
}

// Global functions for HTML onclick handlers (maintain backward compatibility)
function closeColorPickerModal() {
    // Frame color functionality is temporarily disabled
    console.warn('Frame color functionality is temporarily disabled');
}

function applyColorSelection() {
    // Frame color functionality is temporarily disabled
    console.warn('Frame color functionality is temporarily disabled');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
});

// Export main app functions for potential external use
window.customizeApp = {
    initializeApp,
    setupEventListeners,
    
    // Re-export key functions from modules for backward compatibility
    loadCapturedPhotos: PhotoManager.loadCapturedPhotos,
    displayPhotos: PhotoManager.displayPhotos,
    handleDownload: ExportManager.handleDownload,
    hasPhotos: PhotoManager.hasPhotos,
    showCropModal: FrameEditor.showCropModal,
    closeCropModal: FrameEditor.closeCropModal,
    applyCrop: FrameEditor.applyCrop
};

// Make functions globally available for HTML onclick handlers
window.closeColorPickerModal = closeColorPickerModal;
window.applyColorSelection = applyColorSelection;