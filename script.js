        // Navigation
        const navItems = document.querySelectorAll('.nav-item');
        const pages = document.querySelectorAll('.page');

        navItems.forEach(item => {
            item.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all items
                navItems.forEach(nav => nav.classList.remove('active'));
                
                // Add active class to clicked item
                this.classList.add('active');
                
                // Hide all pages
                pages.forEach(page => page.classList.add('hidden'));
                
                // Show selected page
                const pageName = this.getAttribute('data-page');
                document.getElementById(`page-${pageName}`).classList.remove('hidden');
            });
        });