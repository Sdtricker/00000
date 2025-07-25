// == Dark Froxty Frontend ==
(function(){
    // Security: Disable right-click, inspect, view-source
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('keydown', function(e) {
        if (
            (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) || // DevTools
            (e.ctrlKey && e.key === 'U') || // View source
            (e.key === 'F12')
        ) {
            e.preventDefault();
        }
    });
    // Form handling
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
            result.innerHTML = `<span style='color:#ff4a4a;'>${data.error}</span>`;
        } else {
            result.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
        }
        result.classList.add('result-animate');
        setTimeout(()=>result.classList.remove('result-animate'), 700);
    }
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        const phone = phoneInput.value.trim();
        if (!/^\d{10,15}$/.test(phone)) {
            showResult({error: 'Enter a valid phone number (10-15 digits)'});
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
        this.parentElement.classList.add('input-focus');
    });
    phoneInput.addEventListener('blur', function() {
        this.parentElement.classList.remove('input-focus');
    });
})();