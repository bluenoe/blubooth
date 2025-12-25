// Export Manager Module
// Handles image export, download, and canvas rendering functionality

// Function to analyze background brightness at logo position
function analyzeBackgroundBrightness(ctx, canvasWidth, canvasHeight) {
    try {
        // Sample area where logo will be placed (bottom center)
        const sampleWidth = Math.min(200, canvasWidth * 0.3);
        const sampleHeight = 50;
        const sampleX = (canvasWidth - sampleWidth) / 2;
        const sampleY = canvasHeight - sampleHeight - 10;
        
        // Get image data from the sample area
        const imageData = ctx.getImageData(sampleX, sampleY, sampleWidth, sampleHeight);
        const data = imageData.data;
        
        let totalBrightness = 0;
        let pixelCount = 0;
        
        // Calculate average brightness using luminance formula
        for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const alpha = data[i + 3];
            
            // Skip transparent pixels
            if (alpha > 0) {
                // Calculate luminance (perceived brightness)
                const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
                totalBrightness += luminance;
                pixelCount++;
            }
        }
        
        if (pixelCount === 0) return 128; // Default to medium brightness
        
        const averageBrightness = totalBrightness / pixelCount;
        return averageBrightness;
    } catch (error) {
        console.warn('Error analyzing background brightness:', error);
        return 128; // Default to medium brightness
    }
}

// Function to draw overlays (logo and time) on canvas
async function drawOverlays(ctx, canvasWidth, canvasHeight) {
    try {
        const { showLogo, logoLanguage } = CoreState.getLogoSettings();
        const { showTime, timeFormat } = CoreState.getTimeSettings();
        
        // Draw logo if enabled
        if (showLogo) {
            const logoText = CoreState.logoTranslations[logoLanguage] || 'BLUBOOTH';
            
            // Calculate font size to match CSS preview exactly
            // CSS uses 0.85rem (13.6px) on a typical preview size
            // Scale proportionally based on canvas size vs preview size
            const previewElement = document.querySelector('.photo-frame-wrapper');
            const previewHeight = previewElement ? previewElement.offsetHeight : 830;
            const scaleFactor = canvasHeight / previewHeight;
            const logoFontSize = 12 * scaleFactor; // 0.75rem = 12px scaled to canvas
            
            // Analyze background brightness to determine text color
            const backgroundBrightness = analyzeBackgroundBrightness(ctx, canvasWidth, canvasHeight);
            const isDarkBackground = backgroundBrightness < 128; // Threshold for dark/light
            
            // Set font properties for logo - matching CSS preview exactly
            ctx.font = `600 ${logoFontSize}px Georgia, 'Times New Roman', serif`;
            
            // Auto-adjust text color based on background brightness
            if (isDarkBackground) {
                ctx.fillStyle = '#FFFFFF'; // White text on dark background
                ctx.strokeStyle = '#000000'; // Black outline for contrast
            } else {
                ctx.fillStyle = '#000000'; // Black text on light background
                ctx.strokeStyle = '#FFFFFF'; // White outline for contrast
            }
            
            ctx.lineWidth = Math.max(1, logoFontSize * 0.05); // Proportional outline width
            
            // Apply letter spacing by drawing each character separately
            const letterSpacing = logoFontSize * 0.0625; // Match CSS letter-spacing: 1px scaled
            const upperCaseText = logoText.toUpperCase(); // Match CSS text-transform: uppercase
            
            // Calculate total width with letter spacing
            let totalWidth = 0;
            for (let i = 0; i < upperCaseText.length; i++) {
                const charWidth = ctx.measureText(upperCaseText[i]).width;
                totalWidth += charWidth;
                if (i < upperCaseText.length - 1) totalWidth += letterSpacing;
            }
            
            // Position at bottom center (matching CSS: left: 50%, transform: translateX(-50%))
            let logoX = (canvasWidth - totalWidth) / 2;
            const logoY = canvasHeight - (15 * scaleFactor); // Scale bottom margin to match CSS bottom: 15px
            
            // Draw each character with letter spacing
            for (let i = 0; i < upperCaseText.length; i++) {
                const char = upperCaseText[i];
                const charWidth = ctx.measureText(char).width;
                
                // Draw character with outline and fill
                ctx.strokeText(char, logoX, logoY);
                ctx.fillText(char, logoX, logoY);
                
                logoX += charWidth + letterSpacing;
            }
        }
        
        // Draw time if enabled
        if (showTime) {
            const timeString = CoreState.formatTime(CoreState.getCaptureTime(), timeFormat);
            
            // Calculate font size to match CSS preview exactly
            // CSS uses 0.55rem (8.8px) on a typical preview size
            // Scale proportionally based on canvas size vs preview size
            const previewElement = document.querySelector('.photo-frame-wrapper');
            const previewHeight = previewElement ? previewElement.offsetHeight : 830;
            const scaleFactor = canvasHeight / previewHeight;
            const timeFontSize = 8.8 * scaleFactor; // 0.55rem = 8.8px scaled to canvas
            
            // Analyze background brightness to determine text color
            const backgroundBrightness = analyzeBackgroundBrightness(ctx, canvasWidth, canvasHeight);
            const isDarkBackground = backgroundBrightness < 128;
            
            // Set font properties for time - matching CSS preview exactly
            ctx.font = `400 ${timeFontSize}px Arial, sans-serif`;
            
            // Auto-adjust text color based on background brightness
            if (isDarkBackground) {
                ctx.fillStyle = '#FFFFFF'; // White text on dark background
                ctx.strokeStyle = '#000000'; // Black outline for contrast
            } else {
                ctx.fillStyle = '#000000'; // Black text on light background
                ctx.strokeStyle = '#FFFFFF'; // White outline for contrast
            }
            
            ctx.lineWidth = Math.max(1, timeFontSize * 0.05); // Proportional outline width
            
            // Calculate text width for center positioning
            const textWidth = ctx.measureText(timeString).width;
            
            // Position at bottom center, below logo (matching CSS positioning)
            const textX = (canvasWidth - textWidth) / 2; // Center horizontally
            const textY = canvasHeight - (15 * scaleFactor); // Scale bottom margin to match CSS bottom: 15px
            
            // Draw text with outline
            ctx.strokeText(timeString, textX, textY);
            ctx.fillText(timeString, textX, textY);
        }
    } catch (error) {
        console.warn('Error drawing overlays:', error);
    }
}

// Main download function
async function handleDownload() {
    const capturedPhotos = CoreState.getCapturedPhotos();
    if (capturedPhotos.length === 0) {
        alert('Không có ảnh để tải xuống. Vui lòng chụp ảnh trước.');
        return;
    }
    
    try {
        CoreState.domElements.downloadBtn.disabled = true;
        CoreState.domElements.downloadBtn.textContent = 'Đang tạo file...';
        
        // Get layout configuration for proper dimensions
        const selectedLayout = localStorage.getItem('selectedLayout') || 'layout_strip_4';
        const config = CoreState.layoutConfigs[selectedLayout];
        
        // Calculate proper dimensions
        let targetWidth, targetHeight;
        if (config.paperWidth && config.paperHeight) {
            // Convert from pixels or inches to proper canvas size
            if (config.paperWidth.includes('px')) {
                targetWidth = parseInt(config.paperWidth);
                targetHeight = parseInt(config.paperHeight);
            } else {
                // Convert inches to pixels at 300 DPI
                targetWidth = parseFloat(config.paperWidth) * 300;
                targetHeight = parseFloat(config.paperHeight) * 300;
            }
        } else {
            // Fallback dimensions based on display size
            targetWidth = CoreState.domElements.photoFrameWrapper.offsetWidth * 3;
            targetHeight = CoreState.domElements.photoFrameWrapper.offsetHeight * 3;
        }
        
        console.log('Target dimensions:', targetWidth + 'x' + targetHeight);
        
        // Create final canvas with target dimensions
        const finalCanvas = document.createElement('canvas');
        const finalCtx = finalCanvas.getContext('2d');
        
        finalCanvas.width = targetWidth;
        finalCanvas.height = targetHeight;
        
        // Fill with white background
        finalCtx.fillStyle = '#ffffff';
        finalCtx.fillRect(0, 0, targetWidth, targetHeight);
        
        // Draw photos using the exact same logic as displayPhotos
        const photoPromises = capturedPhotos.map((photoSrc, i) => {
            return new Promise((resolve, reject) => {
                if (i >= config.frames) {
                    resolve(); // Skip if more photos than frames
                    return;
                }
                
                const img = new Image();
                img.crossOrigin = 'anonymous';
                img.onload = () => {
                    try {
                        // Calculate photo position and size based on layout
                        let photoX, photoY, photoWidth, photoHeight;
                        
                        if (config.layout === 'grid') {
                            // Grid layout calculation
                            const cols = Math.ceil(Math.sqrt(config.frames));
                            const rows = Math.ceil(config.frames / cols);
                            const cellWidth = targetWidth / cols;
                            const cellHeight = targetHeight / rows;
                            
                            const col = i % cols;
                            const row = Math.floor(i / cols);
                            
                            photoX = col * cellWidth;
                            photoY = row * cellHeight;
                            photoWidth = cellWidth;
                            photoHeight = cellHeight;
                        } else if (config.photoPositions && config.photoPositions[i]) {
                            // Absolute positioning layout - use same logic as displayPhotos
                            const posX = (parseFloat(config.photoPositions[i].x) / parseFloat(config.paperWidth)) * 100;
                            const posY = (parseFloat(config.photoPositions[i].y) / parseFloat(config.paperHeight)) * 100;
                            const photoW = (parseFloat(config.photoWidth) / parseFloat(config.paperWidth)) * 100;
                            const photoH = (parseFloat(config.photoHeight) / parseFloat(config.paperHeight)) * 100;
                            
                            // Convert percentage to actual canvas coordinates
                            photoX = (posX / 100) * targetWidth;
                            photoY = (posY / 100) * targetHeight;
                            photoWidth = (photoW / 100) * targetWidth;
                            photoHeight = (photoH / 100) * targetHeight;
                        } else {
                            // Strip layout - divide width equally
                            photoWidth = targetWidth / config.frames;
                            photoHeight = targetHeight;
                            photoX = i * photoWidth;
                            photoY = 0;
                        }
                        
                        // Draw photo with object-fit: cover behavior
                        const imgAspect = img.width / img.height;
                        const frameAspect = photoWidth / photoHeight;
                        
                        let drawWidth, drawHeight, drawX, drawY;
                        
                        if (imgAspect > frameAspect) {
                            // Image is wider - fit to height and crop width
                            drawHeight = photoHeight;
                            drawWidth = drawHeight * imgAspect;
                            drawX = photoX - (drawWidth - photoWidth) / 2;
                            drawY = photoY;
                        } else {
                            // Image is taller - fit to width and crop height
                            drawWidth = photoWidth;
                            drawHeight = drawWidth / imgAspect;
                            drawX = photoX;
                            drawY = photoY - (drawHeight - photoHeight) / 2;
                        }
                        
                        // Create clipping path for the photo area
                        finalCtx.save();
                        finalCtx.beginPath();
                        finalCtx.rect(photoX, photoY, photoWidth, photoHeight);
                        finalCtx.clip();
                        
                        // Draw the image
                        finalCtx.drawImage(img, drawX, drawY, drawWidth, drawHeight);
                        
                        finalCtx.restore();
                        
                        resolve();
                    } catch (error) {
                        console.error('Error drawing photo', i, ':', error);
                        resolve(); // Continue with other photos
                    }
                };
                img.onerror = () => {
                    console.error('Failed to load photo', i);
                    resolve(); // Continue with other photos
                };
                img.src = photoSrc;
            });
        });
        
        // Wait for all photos to be drawn
        await Promise.all(photoPromises);
        
        // Draw frame if selected (after photos, so frame overlays on top)
        const selectedFrame = CoreState.getSelectedFrame();
        if (selectedFrame) {
            try {
                const frameImg = new Image();
                frameImg.crossOrigin = 'anonymous';
                await new Promise((resolve, reject) => {
                    frameImg.onload = resolve;
                    frameImg.onerror = reject;
                    frameImg.src = selectedFrame;
                });
                
                // Draw frame directly without color filter (since frame color functionality is disabled)
                finalCtx.drawImage(frameImg, 0, 0, targetWidth, targetHeight);
            } catch (error) {
                console.warn('Failed to load frame image:', error);
            }
        }
        
        // Draw black border if no frame is selected
        if (!selectedFrame) {
            finalCtx.strokeStyle = '#000000';
            finalCtx.lineWidth = 7;
            finalCtx.strokeRect(3.5, 3.5, targetWidth - 7, targetHeight - 7);
        }
        
        // Draw overlays (logo and time) if enabled
        const { showLogo } = CoreState.getLogoSettings();
        const { showTime } = CoreState.getTimeSettings();
        if (showLogo || showTime) {
            await drawOverlays(finalCtx, targetWidth, targetHeight);
        }
        
        console.log('Canvas created successfully:', finalCanvas.width + 'x' + finalCanvas.height);
        
        // Create download link with professional filename format
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const filename = `blubooth-${day}-${month}-${year}.jpg`;
        
        const link = document.createElement('a');
        link.download = filename;
        link.href = finalCanvas.toDataURL('image/jpeg', 0.95);
        
        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        CoreState.domElements.downloadBtn.textContent = 'Tải xuống thành công!';
        setTimeout(() => {
            CoreState.domElements.downloadBtn.textContent = 'Tải Xuống Ảnh';
        }, 2000);
        
    } catch (error) {
        console.error('Error generating download:', error);
        alert('Có lỗi xảy ra khi tạo file tải xuống. Vui lòng thử lại.');
    } finally {
        CoreState.domElements.downloadBtn.disabled = false;
    }
}

// Setup export manager event listeners
function setupExportManagerEventListeners() {
    // Download button
    CoreState.domElements.downloadBtn.addEventListener('click', handleDownload);
}

// Export ExportManager functions
window.ExportManager = {
    handleDownload,
    drawOverlays,
    analyzeBackgroundBrightness,
    setupExportManagerEventListeners
};