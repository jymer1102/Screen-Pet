const pet = document.getElementById('pet');
const pupils = document.querySelectorAll('.pupil');
const eyes = document.querySelectorAll('.eye');

let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

// --- Dragging Logic (Mouse & Touch) ---
function dragStart(e) {
    if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
    } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
    }
    
    if (e.target === pet || pet.contains(e.target)) {
        isDragging = true;
    }
}

function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();
        
        if (e.type === "touchmove") {
            currentX = e.touches[0].clientX - initialX;
            currentY = e.touches[0].clientY - initialY;
        } else {
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, pet);
    }
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

// Event Listeners for Dragging
window.addEventListener("touchstart", dragStart, { passive: false });
window.addEventListener("touchend", dragEnd, { passive: false });
window.addEventListener("touchmove", drag, { passive: false });

window.addEventListener("mousedown", dragStart);
window.addEventListener("mouseup", dragEnd);
window.addEventListener("mousemove", drag);


// --- Eye Tracking Logic ---
window.addEventListener('mousemove', (e) => {
    pupils.forEach(pupil => {
        const rect = pupil.getBoundingClientRect();
        const pupilX = rect.left + rect.width / 2;
        const pupilY = rect.top + rect.height / 2;
        
        const angle = Math.atan2(e.clientY - pupilY, e.clientX - pupilX);
        const distance = Math.min(6, Math.hypot(e.clientX - pupilX, e.clientY - pupilY) / 15);
        
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        pupil.style.transform = `translate(${x}px, ${y}px)`;
    });
});


// --- Automatic Blinking Loop ---
function randomBlink() {
    setTimeout(() => {
        eyes.forEach(eye => eye.classList.add('blink'));
        
        setTimeout(() => {
            eyes.forEach(eye => eye.classList.remove('blink'));
            randomBlink(); // Loop next random blink
        }, 150);
        
    }, Math.random() * 4000 + 2000); // Blinks randomly every 2 to 6 seconds
}

// Start the blinking look on launch
randomBlink();
