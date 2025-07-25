// == CyberNova OSINT Frontend ==
(function(){
    // Matrix background animation
    const matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.position = 'fixed';
    matrixCanvas.style.top = '0';
    matrixCanvas.style.left = '0';
    matrixCanvas.style.width = '100vw';
    matrixCanvas.style.height = '100vh';
    matrixCanvas.style.zIndex = '0';
    matrixCanvas.style.pointerEvents = 'none';
    matrixCanvas.id = 'matrix-canvas';
    document.getElementById('matrix-bg').appendChild(matrixCanvas);
    let ctx, w, h, cols, ypos;
    function resizeMatrix() {
        matrixCanvas.width = window.innerWidth;
        matrixCanvas.height = window.innerHeight;
        w = matrixCanvas.width;
        h = matrixCanvas.height;
        cols = Math.floor(w / 20);
        ypos = Array(cols).fill(0);
        ctx = matrixCanvas.getContext('2d');
    }
    resizeMatrix();
    window.addEventListener('resize', resizeMatrix);
    function matrixDraw() {
        ctx.fillStyle = 'rgba(10,10,19,0.15)';
        ctx.fillRect(0, 0, w, h);
        ctx.font = '18px Share Tech Mono, monospace';
        for (let i = 0; i < cols; i++) {
            const text = String.fromCharCode(0x30A0 + Math.random() * 96);
            ctx.fillStyle = ['#a259ff','#43e97b','#00c6fb'][i%3];
            ctx.fillText(text, i * 20, ypos[i] * 20);
            if (Math.random() > 0.975) ypos[i] = 0;
            else ypos[i]++;
            if (ypos[i] * 20 > h) ypos[i] = 0;
        }
        requestAnimationFrame(matrixDraw);
    }
    matrixDraw();

    // Floating particles
    function createParticle() {
        const p = document.createElement('div');
        p.className = 'particle';
        const size = Math.random() * 8 + 4;
        p.style.width = p.style.height = size + 'px';
        p.style.background = ['#a259ff','#43e97b','#00c6fb'][Math.floor(Math.random()*3)];
        p.style.top = Math.random() * 100 + 'vh';
        p.style.left = Math.random() * 100 + 'vw';
        p.style.opacity = Math.random() * 0.5 + 0.3;
        p.style.filter = 'blur(' + (Math.random()*2+1) + 'px)';
        p.style.transition = 'top 12s linear, left 12s linear';
        document.body.appendChild(p);
        setTimeout(() => {
            p.style.top = Math.random() * 100 + 'vh';
            p.style.left = Math.random() * 100 + 'vw';
        }, 100);
        setTimeout(() => p.remove(), 12000);
    }
    setInterval(createParticle, 900);
    for(let i=0;i<12;i++) createParticle();

    // Typewriter intro
    const typewriter = document.getElementById('typewriter');
    const introText = 'Welcome to CyberNova OSINT Terminal\nElite Hacker Dashboard.\nType a code or number to begin your scan...';
    let twIdx = 0;
    function typeWriterAnim() {
        if (twIdx <= introText.length) {
            typewriter.textContent = introText.slice(0, twIdx);
            twIdx++;
            let delay = 32 + Math.random()*40;
            if (introText[twIdx-1] === '\n') delay = 400;
            setTimeout(typeWriterAnim, delay);
        }
    }
    setTimeout(typeWriterAnim, 600);

    // Form handling (AJAX)
    const form = document.getElementById('lookup-form');
    const phoneInput = document.getElementById('phone');
    const loading = document.getElementById('loading');
    const result = document.getElementById('result');
    function showLoading(show) {
        loading.classList.toggle('hidden', !show);
    }
    function showResult(data) {
        result.innerHTML = '';
        if (data.error) {
            result.innerHTML = `<div class='result-card' style='color:#ff4a4a;'>${data.error}</div>`;
        } else if (typeof data === 'object') {
            for (const k in data) {
                result.innerHTML += `<div class='result-card'><b>${k}:</b> <span>${data[k]}</span></div>`;
            }
        } else {
            result.innerHTML = `<div class='result-card'>${data}</div>`;
        }
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = phoneInput.value.trim();
        if (!/^\d{4,20}$/.test(phone)) {
            showResult({error: 'Enter a valid code or number (4-20 digits)'});
            return;
        }
        showLoading(true);
        result.innerHTML = '';
        fetch('api.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({phone})
        })
        .then(r => r.json())
        .then(data => showResult(data))
        .catch(() => showResult({error: 'Network error'}))
        .finally(() => showLoading(false));
    });
    // UI animation for input focus
    phoneInput.addEventListener('focus', function() {
        this.classList.add('input-focus');
    });
    phoneInput.addEventListener('blur', function() {
        this.classList.remove('input-focus');
    });
})();