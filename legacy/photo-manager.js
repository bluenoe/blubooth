// Photo Manager Module
// Handles photo loading, display, upload, and management functionality

// Photo loading and management functions
function loadCapturedPhotos() {
    // Try both possible keys for backward compatibility
    let storedPhotos = sessionStorage.getItem('capturedPhotos') || sessionStorage.getItem('capturedImages');
    
    if (storedPhotos) {
        try {
            const photos = JSON.parse(storedPhotos);
            CoreState.setCapturedPhotos(photos);
            console.log('Loaded photos:', photos.length, 'images');
        } catch (error) {
            console.error('Error parsing captured photos:', error);
            CoreState.setCapturedPhotos([]);
        }
    }
    
    // Also try localStorage as fallback
    const capturedPhotos = CoreState.getCapturedPhotos();
    if (capturedPhotos.length === 0) {
        storedPhotos = localStorage.getItem('capturedPhotos') || localStorage.getItem('capturedImages');
        if (storedPhotos) {
            try {
                const photos = JSON.parse(storedPhotos);
                CoreState.setCapturedPhotos(photos);
                console.log('Loaded photos from localStorage:', photos.length, 'images');
            } catch (error) {
                console.error('Error parsing captured photos from localStorage:', error);
                CoreState.setCapturedPhotos([]);
            }
        }
    }
    
    // If no photos, show placeholder message
    if (CoreState.getCapturedPhotos().length === 0) {
        showNoPhotosMessage();
    }
}

function showNoPhotosMessage() {
    // Remove the no-photos message to provide clean preview area
    CoreState.domElements.photoStrip.innerHTML = '';
}

function displayPhotos() {
    const capturedPhotos = CoreState.getCapturedPhotos();
    if (capturedPhotos.length === 0) {
        showNoPhotosMessage();
        return;
    }
    
    // Get selected layout
    const selectedLayout = localStorage.getItem('selectedLayout') || 'layout_strip_4';
    const config = CoreState.layoutConfigs[selectedLayout];
    
    // Clear existing content
    CoreState.domElements.photoStrip.innerHTML = '';
    
    // Handle grid layout (6-grid) differently
    if (config.layout === 'grid') {
        CoreState.domElements.photoStrip.classList.add('grid-layout');
        
        // Create photo elements for grid layout
        for (let i = 0; i < config.frames; i++) {
            const photoDiv = createPhotoElement(i, config, capturedPhotos);
            CoreState.domElements.photoStrip.appendChild(photoDiv);
        }
    } else {
        // Remove grid layout class for absolute positioning
        CoreState.domElements.photoStrip.classList.remove('grid-layout');
        
        // Create photo elements with absolute positioning
        for (let i = 0; i < config.frames; i++) {
            const photoDiv = createPhotoElement(i, config, capturedPhotos);
            
            // Apply absolute positioning if photoPositions are defined
            if (config.photoPositions && config.photoPositions[i]) {
                const posX = (parseFloat(config.photoPositions[i].x) / parseFloat(config.paperWidth)) * 100;
                const posY = (parseFloat(config.photoPositions[i].y) / parseFloat(config.paperHeight)) * 100;
                const photoW = (parseFloat(config.photoWidth) / parseFloat(config.paperWidth)) * 100;
                const photoH = (parseFloat(config.photoHeight) / parseFloat(config.paperHeight)) * 100;

                photoDiv.style.position = 'absolute';
                photoDiv.style.left = `${posX}%`;
                photoDiv.style.top = `${posY}%`;
                photoDiv.style.width = `${photoW}%`;
                photoDiv.style.height = `${photoH}%`;
            }
            
            CoreState.domElements.photoStrip.appendChild(photoDiv);
        }
    }
    
    // Apply frame overlay after photos are displayed
    updateFrameOverlay();
}

function createPhotoElement(index, config, capturedPhotos) {
    const photoDiv = document.createElement('div');
    photoDiv.className = 'captured-photo';
    photoDiv.dataset.photoIndex = index;
    
    if (index < capturedPhotos.length) {
        const img = document.createElement('img');
        img.src = capturedPhotos[index];
        img.alt = `Photo ${index + 1}`;
        
        if (config.layout !== 'grid') {
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
        }
        
        photoDiv.appendChild(img);
        
        // Add interactive overlay
        const overlay = createInteractiveOverlay();
        photoDiv.appendChild(overlay);
    } else {
        photoDiv.innerHTML = `
            <div class="empty-photo-slot">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="16"/>
                    <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
                <span>Thêm ảnh ${index + 1}</span>
            </div>
        `;
        photoDiv.classList.add('empty-slot');
        
        if (config.layout !== 'grid') {
            photoDiv.style.display = 'flex';
            photoDiv.style.alignItems = 'center';
            photoDiv.style.justifyContent = 'center';
            photoDiv.style.border = '2px dashed var(--gray-300)';
            photoDiv.style.borderRadius = '6px';
        }
    }
    
    // Add click event for photo interaction
    photoDiv.addEventListener('click', (e) => handlePhotoClick(e, index));
    
    return photoDiv;
}

function createInteractiveOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'photo-interactive-overlay';
    overlay.innerHTML = `
        <div class="photo-actions">
            <button class="photo-action-btn change-photo" title="Thay đổi ảnh">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M14.828 14.828a4 4 0 0 1-5.656 0M9 10h.01M15 10h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9Z"/>
                </svg>
            </button>
        </div>
    `;
    return overlay;
}

// Photo upload functionality
function handlePhotoUpload(event) {
    const files = event.target.files;
    if (!files || files.length === 0) {
        return;
    }
    
    // Clear existing photos
    CoreState.setCapturedPhotos([]);
    
    // Process each selected file
    const filePromises = Array.from(files).map(file => {
        return new Promise((resolve, reject) => {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                console.warn('Skipping non-image file:', file.name);
                resolve(null);
                return;
            }
            
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = new Image();
                img.onload = function() {
                    // Validate aspect ratio
                    const validation = CoreState.validateAspectRatio(img.width, img.height);
                    
                    if (!validation.valid) {
                        const cropChoice = confirm(
                            `Ảnh "${file.name}" có tỷ lệ ${validation.ratio} không được hỗ trợ.\n\n` +
                            'Các tỷ lệ được chấp nhận: 1:1, 4:3, 3:4, 16:9, 9:16\n\n' +
                            'Bạn có muốn cắt ảnh thủ công không?\n' +
                            '(Nhấn OK để mở công cụ cắt ảnh, Cancel để tự động điều chỉnh)'
                        );
                        
                        if (cropChoice) {
                            // Show crop modal
                            showCropModal(file, img);
                            resolve(null); // Don't process automatically
                            return;
                        }
                        // If user chooses Cancel, continue with auto-padding
                    }
                    
                    // Set target dimensions based on selected layout
                    const selectedLayout = localStorage.getItem('selectedLayout') || 'layout_strip_4';
                    const config = CoreState.layoutConfigs[selectedLayout];
                    let targetWidth = 800;
                    let targetHeight = 600;
                    
                    // Use layout-specific dimensions if available
                    if (config.photoWidth && config.photoHeight) {
                        const widthPx = parseInt(config.photoWidth);
                        const heightPx = parseInt(config.photoHeight);
                        if (!isNaN(widthPx) && !isNaN(heightPx)) {
                            targetWidth = Math.min(widthPx, 800);
                            targetHeight = Math.min(heightPx, 600);
                        }
                    }
                    
                    // Process image with smart padding
                    const processedDataUrl = processImageWithPadding(img, targetWidth, targetHeight);
                    resolve(processedDataUrl);
                };
                img.onerror = () => reject(new Error('Failed to load image'));
                img.src = e.target.result;
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsDataURL(file);
        });
    });
    
    // Wait for all files to be processed
    Promise.all(filePromises)
        .then(results => {
            // Filter out null results and add to capturedPhotos
            const validPhotos = results.filter(result => result !== null);
            CoreState.setCapturedPhotos(validPhotos);
            
            if (validPhotos.length > 0) {
                // Update capture time
                CoreState.setCaptureTime(new Date());
                
                // Save to storage
                sessionStorage.setItem('capturedPhotos', JSON.stringify(validPhotos));
                sessionStorage.setItem('captureTime', CoreState.getCaptureTime().toISOString());
                
                // Display the uploaded photos
                displayPhotos();
                
                // Update overlays
                updateOverlays();
                
                console.log(`Successfully uploaded ${validPhotos.length} photos`);
            } else {
                alert('No valid image files were selected. Please choose image files (JPG, PNG, etc.).');
            }
        })
        .catch(error => {
            console.error('Error processing uploaded files:', error);
            alert('Error processing uploaded files. Please try again.');
        })
        .finally(() => {
            // Reset file input
            CoreState.domElements.photoUpload.value = '';
        });
}

// Smart image processing with padding
function processImageWithPadding(img, targetWidth, targetHeight) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, targetWidth, targetHeight);
    
    // Calculate scaling to fit within target dimensions
    const scale = Math.min(targetWidth / img.width, targetHeight / img.height);
    const scaledWidth = img.width * scale;
    const scaledHeight = img.height * scale;
    
    // Center the image
    const x = (targetWidth - scaledWidth) / 2;
    const y = (targetHeight - scaledHeight) / 2;
    
    // Draw image with padding
    ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
    
    return canvas.toDataURL('image/jpeg', 0.9);
}

// Photo interaction functions
function handlePhotoClick(event, photoIndex) {
    event.stopPropagation();
    
    // Check if clicked on action button
    const target = event.target.closest('.photo-action-btn');
    if (target) {
        if (target.classList.contains('change-photo')) {
            openPhotoChangeModal(photoIndex);
        }
        return;
    }
    
    // If photo exists, show options modal
    const capturedPhotos = CoreState.getCapturedPhotos();
    if (photoIndex < capturedPhotos.length) {
        openPhotoOptionsModal(photoIndex);
    } else {
        // If empty slot, add new photo
        addNewPhoto(photoIndex);
    }
}

// Photo modal functions
function openPhotoOptionsModal(photoIndex) {
    const capturedPhotos = CoreState.getCapturedPhotos();
    const modal = document.createElement('div');
    modal.className = 'photo-modal-overlay';
    modal.innerHTML = `
        <div class="photo-modal">
            <div class="photo-modal-header">
                <h3>Tùy chọn ảnh ${photoIndex + 1}</h3>
                <button class="close-modal" onclick="closePhotoModal()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>
            <div class="photo-modal-content">
                <div class="photo-preview">
                    <img src="${capturedPhotos[photoIndex]}" alt="Photo ${photoIndex + 1}">
                </div>
                <div class="photo-modal-actions">
                    <button class="modal-btn primary change-photo-btn" onclick="openPhotoChangeModal(${photoIndex}); closePhotoModal();">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M7 10L12 5L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M12 5V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                        <span class="btn-text">
                            <strong>Chọn ảnh mới</strong>
                            <small>Tải lên từ thiết bị</small>
                        </span>
                    </button>
                    <button class="modal-btn danger" onclick="deletePhoto(${photoIndex}); closePhotoModal();">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"></polyline>
                            <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                        </svg>
                        Xóa ảnh
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click outside to close
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closePhotoModal();
        }
    });
}

function openPhotoChangeModal(photoIndex) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    throw new Error('File is not an image');
                }
                
                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error('File size too large');
                }
                
                // Ensure capturedPhotos array is initialized
                let capturedPhotos = CoreState.getCapturedPhotos();
                if (!Array.isArray(capturedPhotos)) {
                    capturedPhotos = [];
                }
                
                // Ensure array is large enough
                while (capturedPhotos.length <= photoIndex) {
                    capturedPhotos.push(null);
                }
                
                const dataUrl = await fileToDataUrl(file);
                capturedPhotos[photoIndex] = dataUrl;
                CoreState.setCapturedPhotos(capturedPhotos);
                sessionStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
                displayPhotos();
                showToast('Ảnh đã được thay đổi thành công!');
            } catch (error) {
                console.error('Error changing photo:', error);
                let errorMessage = 'Lỗi khi thay đổi ảnh. Vui lòng thử lại.';
                
                if (error.message === 'File is not an image') {
                    errorMessage = 'Vui lòng chọn file ảnh hợp lệ.';
                } else if (error.message === 'File size too large') {
                    errorMessage = 'Kích thước file quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.';
                } else if (error.message === 'Failed to read file') {
                    errorMessage = 'Không thể đọc file ảnh. Vui lòng thử lại.';
                }
                
                showToast(errorMessage, 'error');
            }
        }
        // Safely remove input element
        try {
            if (document.body.contains(input)) {
                document.body.removeChild(input);
            }
        } catch (removeError) {
            console.warn('Could not remove input element:', removeError);
        }
    });
    
    document.body.appendChild(input);
    input.click();
}

function addNewPhoto(photoIndex) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';
    
    input.addEventListener('change', async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                // Validate file type
                if (!file.type.startsWith('image/')) {
                    throw new Error('File is not an image');
                }
                
                // Validate file size (max 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    throw new Error('File size too large');
                }
                
                // Ensure capturedPhotos array is initialized
                let capturedPhotos = CoreState.getCapturedPhotos();
                if (!Array.isArray(capturedPhotos)) {
                    capturedPhotos = [];
                }
                
                // Ensure array is large enough
                while (capturedPhotos.length <= photoIndex) {
                    capturedPhotos.push(null);
                }
                
                const dataUrl = await fileToDataUrl(file);
                capturedPhotos[photoIndex] = dataUrl;
                CoreState.setCapturedPhotos(capturedPhotos);
                sessionStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
                displayPhotos();
                showToast('Ảnh đã được thêm thành công!');
            } catch (error) {
                console.error('Error adding photo:', error);
                let errorMessage = 'Lỗi khi thêm ảnh. Vui lòng thử lại.';
                
                if (error.message === 'File is not an image') {
                    errorMessage = 'Vui lòng chọn file ảnh hợp lệ.';
                } else if (error.message === 'File size too large') {
                    errorMessage = 'Kích thước file quá lớn. Vui lòng chọn ảnh nhỏ hơn 10MB.';
                } else if (error.message === 'Failed to read file') {
                    errorMessage = 'Không thể đọc file ảnh. Vui lòng thử lại.';
                }
                
                showToast(errorMessage, 'error');
            }
        }
        // Safely remove input element
        try {
            if (document.body.contains(input)) {
                document.body.removeChild(input);
            }
        } catch (removeError) {
            console.warn('Could not remove input element:', removeError);
        }
    });
    
    document.body.appendChild(input);
    input.click();
}

function deletePhoto(photoIndex) {
    if (confirm('Bạn có chắc chắn muốn xóa ảnh này?')) {
        const capturedPhotos = CoreState.getCapturedPhotos();
        capturedPhotos.splice(photoIndex, 1);
        CoreState.setCapturedPhotos(capturedPhotos);
        sessionStorage.setItem('capturedPhotos', JSON.stringify(capturedPhotos));
        displayPhotos();
        showToast('Ảnh đã được xóa!');
    }
}

function closePhotoModal() {
    const modal = document.querySelector('.photo-modal-overlay');
    if (modal) {
        document.body.removeChild(modal);
    }
}

// Convert file to data URL
function fileToDataUrl(file) {
    return new Promise((resolve, reject) => {
        // Validate file before processing
        if (!file) {
            reject(new Error('No file provided'));
            return;
        }
        
        if (!file.type.startsWith('image/')) {
            reject(new Error('File is not an image'));
            return;
        }
        
        const reader = new FileReader();
        
        // Set timeout to prevent hanging
        const timeout = setTimeout(() => {
            reader.abort();
            reject(new Error('File reading timeout'));
        }, 30000); // 30 seconds timeout
        
        reader.onload = (e) => {
            clearTimeout(timeout);
            if (e.target.result) {
                resolve(e.target.result);
            } else {
                reject(new Error('Failed to read file content'));
            }
        };
        
        reader.onerror = () => {
            clearTimeout(timeout);
            reject(new Error('Failed to read file'));
        };
        
        reader.onabort = () => {
            clearTimeout(timeout);
            reject(new Error('File reading was aborted'));
        };
        
        try {
            reader.readAsDataURL(file);
        } catch (error) {
            clearTimeout(timeout);
            reject(new Error('Failed to start file reading'));
        }
    });
}

// Show toast notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Trigger animation
    setTimeout(() => toast.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(toast)) {
                document.body.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Utility function to check if photos are available
function hasPhotos() {
    const capturedPhotos = CoreState.getCapturedPhotos();
    return capturedPhotos && capturedPhotos.length > 0;
}

// Update frame dimensions
function updateFrameDimensions() {
    const selectedLayout = localStorage.getItem('selectedLayout') || 'layout_strip_4';
    const config = CoreState.layoutConfigs[selectedLayout];
    if (config && config.cssClass) {
        // Remove all possible layout classes
        Object.values(CoreState.layoutConfigs).forEach(layoutConfig => {
            if (layoutConfig.cssClass) {
                CoreState.domElements.photoFrameWrapper.classList.remove(layoutConfig.cssClass);
            }
        });
        
        // Add the current layout class
        CoreState.domElements.photoFrameWrapper.classList.add(config.cssClass);
        
        console.log(`Frame dimensions updated to: ${config.paperWidth} x ${config.paperHeight} (${config.cssClass})`);
    }
}

// Update overlays
function updateOverlays() {
    const { showLogo, logoLanguage } = CoreState.getLogoSettings();
    const { showTime, timeFormat } = CoreState.getTimeSettings();
    
    // Update logo overlay
    if (showLogo) {
        CoreState.domElements.logoText.textContent = CoreState.logoTranslations[logoLanguage];
        CoreState.domElements.logoOverlay.classList.add('show');
    } else {
        CoreState.domElements.logoOverlay.classList.remove('show');
    }
    
    // Update time overlay
    if (showTime) {
        const timeString = CoreState.formatTime(CoreState.getCaptureTime(), timeFormat);
        CoreState.domElements.timeText.textContent = timeString;
        CoreState.domElements.timeOverlay.classList.add('show');
    } else {
        CoreState.domElements.timeOverlay.classList.remove('show');
    }
}

// Update frame overlay (moved from frame-editor.js to avoid circular dependency)
function updateFrameOverlay() {
    const frameOverlay = CoreState.domElements.frameOverlay;
    const selectedFrame = CoreState.getSelectedFrame();
    
    if (!frameOverlay) {
        console.error('Frame overlay element not found');
        return;
    }
    
    if (selectedFrame && selectedFrame !== '') {
        // Create or update the frame image
        let frameImg = frameOverlay.querySelector('img');
        if (!frameImg) {
            frameImg = document.createElement('img');
            frameOverlay.appendChild(frameImg);
        }
        
        frameImg.src = selectedFrame;
        frameImg.alt = 'Frame overlay';
        frameOverlay.style.display = 'block';
    } else {
        // Hide frame overlay if no frame is selected
        frameOverlay.style.display = 'none';
        
        // Remove frame image if it exists
        const frameImg = frameOverlay.querySelector('img');
        if (frameImg) {
            frameImg.remove();
        }
    }
}

// Export PhotoManager functions
window.PhotoManager = {
    loadCapturedPhotos,
    displayPhotos,
    handlePhotoUpload,
    hasPhotos,
    updateFrameDimensions,
    updateOverlays,
    updateFrameOverlay,
    
    // Photo interaction functions
    handlePhotoClick,
    openPhotoOptionsModal,
    openPhotoChangeModal,
    addNewPhoto,
    deletePhoto,
    closePhotoModal,
    
    // Utility functions
    showToast,
    fileToDataUrl,
    processImageWithPadding
};

// Make functions globally available for HTML onclick handlers
window.openPhotoChangeModal = openPhotoChangeModal;
window.closePhotoModal = closePhotoModal;
window.deletePhoto = deletePhoto;