const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const uploadContent = document.getElementById('upload-content');
const resultContent = document.getElementById('result-content');
const downloadLink = document.getElementById('download-link');
const oldSizeSpan = document.getElementById('old-size');
const newSizeSpan = document.getElementById('new-size');
const resetBtn = document.getElementById('reset-btn');

// Fix 1: Click handler ko check karna hoga ki click kahan hua hai
dropZone.addEventListener('click', (e) => {
    // Agar click download link ya reset button par nahi hua, tabhi picker khule
    if (e.target !== downloadLink && e.target !== resetBtn) {
        fileInput.click();
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const originalSize = (file.size / (1024 * 1024)).toFixed(2);
        oldSizeSpan.innerText = originalSize;
        compressImage(file);
    }
});

function compressImage(file) {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            // 0.6 quality compression
            const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
            
            const head = 'data:image/jpeg;base64,';
            const imgFileSize = Math.round((dataUrl.length - head.length) * 3 / 4) / (1024 * 1024);
            newSizeSpan.innerText = imgFileSize.toFixed(2);

            showResult(dataUrl);
        };
    };
}

function showResult(dataUrl) {
    uploadContent.style.display = 'none';
    resultContent.style.display = 'block';
    downloadLink.href = dataUrl;
    downloadLink.download = "BentoArchitect_Compressed.jpg";
}

// Fix 2: Download link par click event ko propagate hone se rokna
downloadLink.addEventListener('click', (e) => {
    e.stopPropagation(); 
});

resetBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    uploadContent.style.display = 'block';
    resultContent.style.display = 'none';
    fileInput.value = '';
});