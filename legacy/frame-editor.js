// Frame Editor Module
// Handles frame selection, loading, and editing functionality

// Frame loading and management
function loadFrames() {
    CoreState.domElements.frameGrid.innerHTML = '<div class="loading">Loading frames...</div>';
    
    // Add "No Frame" option
    const noFrameOption = createFrameOption(null, 'No Frame');
    CoreState.domElements.frameGrid.innerHTML = '';
    CoreState.domElements.frameGrid.appendChild(noFrameOption);
    
    // Load frames based on selected layout
    const selectedLayout = localStorage.getItem('selectedLayout') || 'layout_strip_4';
    const frameDir = CoreState.frameDirectories[selectedLayout];
    if (frameDir) {
        loadFramesFromDirectory(frameDir);
    }
}

function loadFramesFromDirectory(directory) {
    // Since we can't directly read directory contents in browser,
    // we'll try to load known frame files
    const knownFrames = {
        '2-vertical': ['1.png', '2.png', '3.png'],
        '3-vertical': ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png'],
        '4-vertical': ['1.png', '2.png', '3.png', '4.png', '5.png', '6.png', '7.png'],
        '6-grid': ['playful-dots.png']
    };
    
    const frames = knownFrames[directory] || [];
    
    frames.forEach(frameName => {
        const framePath = `../assets/frames/${directory}/${frameName}`;
        loadFrameImage(framePath, frameName);
    });
}

function loadFrameImage(framePath, frameName) {
    const img = new Image();
    img.onload = function() {
        const frameOption = createFrameOption(framePath, frameName);
        CoreState.domElements.frameGrid.appendChild(frameOption);
    };
    img.onerror = function() {
        console.log(`Frame not found: ${framePath}`);
    };
    img.src = framePath;
}

function createFrameOption(framePath, frameName) {
    const frameOption = document.createElement('div');
    frameOption.className = framePath ? 'frame-thumbnail' : 'frame-thumbnail no-frame';
    
    if (framePath) {
        const img = document.createElement('img');
        img.src = framePath;
        img.alt = frameName;
        frameOption.appendChild(img);
        frameOption.dataset.framePath = framePath;
    } else {
        frameOption.textContent = frameName;
        frameOption.dataset.framePath = '';
    }
    
    frameOption.addEventListener('click', () => {
        selectFrame(framePath, frameOption);
    });
    
    return frameOption;
}

function selectFrame(framePath, frameElement) {
    // Remove previous selection
    document.querySelectorAll('.frame-thumbnail').forEach(thumb => {
        thumb.classList.remove('selected');
    });
    
    // Add selection to clicked frame
    frameElement.classList.add('selected');
    
    // Update selected frame
    CoreState.setSelectedFrame(framePath);
    
    // Update frame overlay to show selected frame
    PhotoManager.updateFrameOverlay();
}

// Image cropping functionality
let currentCropImage = null;
let currentCropFile = null;
let cropSelection = { x: 0, y: 0, width: 100, height: 100 };
let isDragging = false;
let isResizing = false;
let dragStart = { x: 0, y: 0 };
let resizeHandle = null;

function showCropModal(file, img) {
    currentCropFile = file;
    currentCropImage = img;
    
    const modal = document.getElementById('cropModal');
    const canvas = document.getElementById('cropCanvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    const maxWidth = 500;
    const maxHeight = 400;
    const scale = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    
    canvas.width = img.width * scale;
    canvas.height = img.height * scale;
    
    // Draw image
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    // Initialize crop selection (center 80% of image)
    const margin = 0.1;
    cropSelection = {
        x: canvas.width * margin,
        y: canvas.height * margin,
        width: canvas.width * (1 - 2 * margin),
        height: canvas.height * (1 - 2 * margin)
    };
    
    updateCropSelection();
    modal.style.display = 'flex';
    
    // Add event listeners
    setupCropEventListeners();
}

function closeCropModal() {
    const modal = document.getElementById('cropModal');
    modal.style.display = 'none';
    removeCropEventListeners();
}

function updateCropSelection() {
    const selection = document.getElementById('cropSelection');
    const canvas = document.getElementById('cropCanvas');
    const canvasRect = canvas.getBoundingClientRect();
    const container = canvas.parentElement;
    const containerRect = container.getBoundingClientRect();
    
    // Calculate position relative to container
    const offsetX = canvasRect.left - containerRect.left;
    const offsetY = canvasRect.top - containerRect.top;
    
    selection.style.left = (offsetX + cropSelection.x) + 'px';
    selection.style.top = (offsetY + cropSelection.y) + 'px';
    selection.style.width = cropSelection.width + 'px';
    selection.style.height = cropSelection.height + 'px';
}

function setupCropEventListeners() {
    const selection = document.getElementById('cropSelection');
    const handles = document.querySelectorAll('.crop-handle');
    
    // Selection drag
    selection.addEventListener('mousedown', startDrag);
    
    // Handle resize
    handles.forEach(handle => {
        handle.addEventListener('mousedown', startResize);
    });
    
    // Global mouse events
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', stopDragResize);
}

function removeCropEventListeners() {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', stopDragResize);
}

function startDrag(e) {
    if (e.target.classList.contains('crop-handle')) return;
    isDragging = true;
    dragStart = { x: e.clientX - cropSelection.x, y: e.clientY - cropSelection.y };
    e.preventDefault();
}

function startResize(e) {
    isResizing = true;
    resizeHandle = e.target.classList[1]; // crop-handle-nw, etc.
    dragStart = { x: e.clientX, y: e.clientY };
    e.preventDefault();
    e.stopPropagation();
}

function handleMouseMove(e) {
    const canvas = document.getElementById('cropCanvas');
    
    if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        
        // Keep within canvas bounds
        cropSelection.x = Math.max(0, Math.min(newX, canvas.width - cropSelection.width));
        cropSelection.y = Math.max(0, Math.min(newY, canvas.height - cropSelection.height));
        
        updateCropSelection();
    } else if (isResizing) {
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;
        
        const oldSelection = { ...cropSelection };
        
        switch (resizeHandle) {
            case 'crop-handle-nw':
                cropSelection.x = Math.max(0, oldSelection.x + deltaX);
                cropSelection.y = Math.max(0, oldSelection.y + deltaY);
                cropSelection.width = oldSelection.width - (cropSelection.x - oldSelection.x);
                cropSelection.height = oldSelection.height - (cropSelection.y - oldSelection.y);
                break;
            case 'crop-handle-ne':
                cropSelection.y = Math.max(0, oldSelection.y + deltaY);
                cropSelection.width = Math.min(canvas.width - oldSelection.x, oldSelection.width + deltaX);
                cropSelection.height = oldSelection.height - (cropSelection.y - oldSelection.y);
                break;
            case 'crop-handle-sw':
                cropSelection.x = Math.max(0, oldSelection.x + deltaX);
                cropSelection.width = oldSelection.width - (cropSelection.x - oldSelection.x);
                cropSelection.height = Math.min(canvas.height - oldSelection.y, oldSelection.height + deltaY);
                break;
            case 'crop-handle-se':
                cropSelection.width = Math.min(canvas.width - oldSelection.x, oldSelection.width + deltaX);
                cropSelection.height = Math.min(canvas.height - oldSelection.y, oldSelection.height + deltaY);
                break;
        }
        
        // Ensure minimum size
        cropSelection.width = Math.max(50, cropSelection.width);
        cropSelection.height = Math.max(50, cropSelection.height);
        
        updateCropSelection();
        dragStart = { x: e.clientX, y: e.clientY };
    }
}

function stopDragResize() {
    isDragging = false;
    isResizing = false;
    resizeHandle = null;
}

function applyCrop() {
    if (!currentCropImage) return;
    
    const canvas = document.getElementById('cropCanvas');
    const scale = currentCropImage.width / canvas.width;
    
    // Create crop canvas
    const cropCanvas = document.createElement('canvas');
    const cropCtx = cropCanvas.getContext('2d');
    
    const cropWidth = cropSelection.width * scale;
    const cropHeight = cropSelection.height * scale;
    const cropX = cropSelection.x * scale;
    const cropY = cropSelection.y * scale;
    
    cropCanvas.width = cropWidth;
    cropCanvas.height = cropHeight;
    
    // Draw cropped image
    cropCtx.drawImage(
        currentCropImage,
        cropX, cropY, cropWidth, cropHeight,
        0, 0, cropWidth, cropHeight
    );
    
    // Convert to data URL and add to photos
    const croppedDataUrl = cropCanvas.toDataURL('image/jpeg', 0.9);
    const capturedPhotos = CoreState.getCapturedPhotos();
    capturedPhotos.push(croppedDataUrl);
    CoreState.setCapturedPhotos(capturedPhotos);
    
    // Update display
    PhotoManager.displayPhotos();
    PhotoManager.updateOverlays();
    
    // Save to storage
    sessionStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
    
    closeCropModal();
}

// Handle logo toggle
function handleLogoToggle() {
    const { logoLanguage } = CoreState.getLogoSettings();
    const isChecked = CoreState.domElements.showLogoCheckbox.checked;
    CoreState.setLogoSettings(isChecked, logoLanguage);
    PhotoManager.updateOverlays();
}

// Handle logo language change
function handleLogoLanguageChange() {
    const { showLogo } = CoreState.getLogoSettings();
    const selectedLanguage = CoreState.domElements.logoLanguageSelect.value;
    CoreState.setLogoSettings(showLogo, selectedLanguage);
    PhotoManager.updateOverlays();
}

// Handle time toggle
function handleTimeToggle() {
    const { timeFormat } = CoreState.getTimeSettings();
    const isChecked = CoreState.domElements.showTimeCheckbox.checked;
    CoreState.setTimeSettings(isChecked, timeFormat);
    PhotoManager.updateOverlays();
}

// Handle time format change
function handleTimeFormatChange() {
    const { showTime } = CoreState.getTimeSettings();
    const selectedFormat = CoreState.domElements.timeFormatSelect.value;
    CoreState.setTimeSettings(showTime, selectedFormat);
    PhotoManager.updateOverlays();
}

// Handle reset
function handleReset() {
    // Reset all customizations to default
    CoreState.setSelectedFrame(null);
    CoreState.setLogoSettings(true, 'en');
    CoreState.setTimeSettings(false, 'date');
    
    // Update UI
    CoreState.domElements.showLogoCheckbox.checked = true;
    CoreState.domElements.logoLanguageSelect.value = 'en';
    CoreState.domElements.showTimeCheckbox.checked = false;
    CoreState.domElements.timeFormatSelect.value = 'date';
    
    // Remove frame selections
    document.querySelectorAll('.frame-thumbnail').forEach(thumb => {
        thumb.classList.remove('selected');
    });
    
    // Update overlays
    PhotoManager.updateFrameOverlay();
    PhotoManager.updateOverlays();
}

// Event listener setup for frame editor
function setupFrameEditorEventListeners() {
    // Logo options
    CoreState.domElements.showLogoCheckbox.addEventListener('change', handleLogoToggle);
    CoreState.domElements.logoLanguageSelect.addEventListener('change', handleLogoLanguageChange);
    
    // Time options
    CoreState.domElements.showTimeCheckbox.addEventListener('change', handleTimeToggle);
    CoreState.domElements.timeFormatSelect.addEventListener('change', handleTimeFormatChange);
    
    // Reset button
    CoreState.domElements.resetBtn.addEventListener('click', handleReset);
    
    // Photo upload
    CoreState.domElements.uploadBtn.addEventListener('click', () => {
        CoreState.domElements.photoUpload.click();
    });
    CoreState.domElements.photoUpload.addEventListener('change', PhotoManager.handlePhotoUpload);
}

// Export FrameEditor functions
window.FrameEditor = {
    loadFrames,
    selectFrame,
    
    // Crop functionality
    showCropModal,
    closeCropModal,
    applyCrop,
    
    // Event handlers
    handleLogoToggle,
    handleLogoLanguageChange,
    handleTimeToggle,
    handleTimeFormatChange,
    handleReset,
    
    // Setup
    setupFrameEditorEventListeners
};

// Make functions globally available for HTML onclick handlers
window.closeCropModal = closeCropModal;
window.applyCrop = applyCrop;
window.showCropModal = showCropModal;