class PhotoGallery {
    constructor() {
        this.gallery = document.getElementById('gallery');
        this.urlInput = document.getElementById('imageUrlInput');
        this.addBtn = document.getElementById('addBtn');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImage = document.querySelector('.lightbox-image');
        this.closeBtn = document.querySelector('.close');
        this.prevBtn = document.querySelector('.nav-btn.prev');
        this.nextBtn = document.querySelector('.nav-btn.next');
        
        this.photos = this.loadPhotos();
        this.currentIndex = 0;
        
        this.init();
    }
    
    init() {
        this.addBtn.addEventListener('click', () => this.addPhoto());
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addPhoto();
        });
        
        this.closeBtn.addEventListener('click', () => this.closeLightbox());
        this.prevBtn.addEventListener('click', () => this.prevPhoto());
        this.nextBtn.addEventListener('click', () => this.nextPhoto());
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) this.closeLightbox();
        });
        
        this.renderGallery();
    }
    
    addPhoto() {
        const url = this.urlInput.value.trim();
        
        if (!url) {
            alert('Please paste an image URL');
            return;
        }
        
        // Validate URL
        if (!this.isValidUrl(url)) {
            alert('Please enter a valid URL');
            return;
        }
        
        // Add photo
        this.photos.push({
            id: Date.now(),
            url: url
        });
        
        this.savePhotos();
        this.renderGallery();
        this.urlInput.value = '';
        this.urlInput.focus();
    }
    
    deletePhoto(id) {
        this.photos = this.photos.filter(photo => photo.id !== id);
        this.savePhotos();
        this.renderGallery();
    }
    
    renderGallery() {
        this.gallery.innerHTML = '';
        
        this.photos.forEach((photo, index) => {
            const item = document.createElement('div');
            item.className = 'gallery-item';
            item.innerHTML = `
                <img src="${photo.url}" alt="Gallery photo" onerror="this.parentElement.remove()">
                <button class="gallery-item-delete" data-id="${photo.id}">×</button>
            `;
            
            item.querySelector('img').addEventListener('click', () => {
                this.currentIndex = index;
                this.openLightbox();
            });
            
            item.querySelector('.gallery-item-delete').addEventListener('click', (e) => {
                e.stopPropagation();
                this.deletePhoto(photo.id);
            });
            
            this.gallery.appendChild(item);
        });
    }
    
    openLightbox() {
        if (this.photos.length === 0) return;
        this.lightboxImage.src = this.photos[this.currentIndex].url;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    nextPhoto() {
        this.currentIndex = (this.currentIndex + 1) % this.photos.length;
        this.lightboxImage.src = this.photos[this.currentIndex].url;
    }
    
    prevPhoto() {
        this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
        this.lightboxImage.src = this.photos[this.currentIndex].url;
    }
    
    isValidUrl(string) {
        try {
            new URL(string);
            return true;
        } catch (_) {
            return false;
        }
    }
    
    savePhotos() {
        localStorage.setItem('gallery_photos', JSON.stringify(this.photos));
    }
    
    loadPhotos() {
        const saved = localStorage.getItem('gallery_photos');
        return saved ? JSON.parse(saved) : [];
    }
}

// Initialize gallery when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new PhotoGallery();
});
