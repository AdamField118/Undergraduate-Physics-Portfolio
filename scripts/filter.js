// Filter functionality
document.getElementById('filter').addEventListener('change', function() {
    const filter = this.value;
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        if (filter === 'all' || card.dataset.topic === filter) {
            card.style.display = 'inline-block';
        } else {
            card.style.display = 'none';
        }
    });
});

// Keyboard accessibility for cards
document.querySelectorAll('.card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const link = this.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
        }
    });
});