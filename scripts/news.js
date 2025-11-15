// News & Updates functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('News page initialized');
    
    // DOM Elements
    const featuredNews = document.getElementById('featuredNews');
    const newsList = document.getElementById('newsList');
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const newsModal = document.getElementById('newsModal');
    const closeNewsModal = document.getElementById('closeNewsModal');
    const newsSearch = document.getElementById('newsSearch');
    const clearSearch = document.getElementById('clearSearch');
    
    // News data
    let allNews = [];
    let filteredNews = [];
    let currentFilter = 'all';
    let currentPage = 1;
    const itemsPerPage = 10;
    
    // Initialize news page
    initializeNewsPage();
    
    // Load more button
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', loadMoreNews);
    }
    
    // Close news modal
    if (closeNewsModal) {
        closeNewsModal.addEventListener('click', function() {
            newsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        });
    }
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === newsModal) {
            newsModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Search functionality
    if (newsSearch) {
        newsSearch.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase().trim();
            filterNewsBySearch(searchTerm);
            
            // Show/hide clear button
            if (clearSearch) {
                clearSearch.style.display = searchTerm ? 'block' : 'none';
            }
        });
    }
    
    if (clearSearch) {
        clearSearch.addEventListener('click', function() {
            if (newsSearch) {
                newsSearch.value = '';
                filterNewsBySearch('');
                this.style.display = 'none';
                newsSearch.focus();
            }
        });
    }
    
    // Category filter buttons
    document.querySelectorAll('.category-filter-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            // Update active button
            document.querySelectorAll('.category-filter-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            currentFilter = this.getAttribute('data-category');
            currentPage = 1;
            filterNews();
        });
    });
    
    function initializeNewsPage() {
        // Load news data
        setTimeout(() => {
            loadNewsData();
        }, 1000);
    }
    
    function loadNewsData() {
        // Realistic municipality news data
        allNews = [
            {
                id: 1,
                title: 'Digital Transformation Initiative Launched',
                excerpt: 'Municipality launches new digital platform for citizen services with online applications and real-time tracking',
                content: `<h4>Digital Transformation Initiative</h4>
                         <p>The municipality is proud to announce the launch of our comprehensive digital transformation initiative. This platform will streamline all government services and make them accessible online.</p>
                         
                         <h4>Key Features:</h4>
                         <ul>
                             <li>Online application for all government services</li>
                             <li>Real-time application tracking</li>
                             <li>Digital payment integration</li>
                             <li>Mobile app availability</li>
                             <li>Document upload facility</li>
                             <li>SMS/Email notifications</li>
                         </ul>
                         
                         <p>The new system will reduce processing times from weeks to just a few days, making government services more efficient and citizen-friendly.</p>
                         
                         <h4>Implementation Timeline:</h4>
                         <p><strong>Phase 1:</strong> October 2023 - Basic services online<br>
                         <strong>Phase 2:</strong> January 2024 - Mobile app launch<br>
                         <strong>Phase 3:</strong> April 2024 - Full digital integration</p>
                         
                         <p>For any queries regarding the new digital platform, please contact our helpdesk at <strong>01-4211999</strong> or email <strong>digital@gov.np</strong></p>`,
                category: 'announcement',
                date: '2023-10-15',
                image: 'https://tse1.mm.bing.net/th/id/OIP.iiJEhbK_0odSUmeoen4sxgHaEH?pid=Api&P=0&h=180',
                views: 2345,
                featured: true,
                attachments: [
                    { name: 'Digital Initiative Brochure', type: 'pdf', url: '#' },
                    { name: 'Implementation Plan', type: 'doc', url: '#' }
                ]
            },
            {
                id: 2,
                title: 'Property Tax Collection Schedule 2025',
                excerpt: 'Annual property tax collection schedule announced for fiscal year 2024 with online payment options',
                content: `<h4>Property Tax Collection Schedule 2024</h4>
                         <p>The municipality has released the property tax collection schedule for the fiscal year 2024. All property owners are requested to pay their taxes within the specified timeline to avoid penalties.</p>
                         
                         <h4>Collection Schedule:</h4>
                         <div class="schedule-table">
                             <div class="schedule-row header">
                                 <div class="schedule-cell">Ward No.</div>
                                 <div class="schedule-cell">Collection Period</div>
                                 <div class="schedule-cell">Due Date</div>
                             </div>
                             <div class="schedule-row">
                                 <div class="schedule-cell">1-5</div>
                                 <div class="schedule-cell">Jan 1 - Jan 31, 2024</div>
                                 <div class="schedule-cell">Feb 15, 2024</div>
                             </div>
                             <div class="schedule-row">
                                 <div class="schedule-cell">6-10</div>
                                 <div class="schedule-cell">Feb 1 - Feb 28, 2024</div>
                                 <div class="schedule-cell">Mar 15, 2024</div>
                             </div>
                         </div>
                         
                         <h4>Payment Methods:</h4>
                         <ul>
                             <li><strong>Online:</strong> Through municipality portal with eSewa, Khalti, or bank transfer</li>
                             <li><strong>Bank:</strong> At any designated bank counter</li>
                             <li><strong>Office:</strong> Cash payment at municipal office</li>
                         </ul>`,
                category: 'announcement',
                date: '2023-10-12',
                image: 'https://tse4.mm.bing.net/th/id/OIP.n-u9BtWbuTeWQjhd_lEJiwHaD4?pid=Api&P=0&h=180',
                views: 1876,
                featured: true,
                attachments: [
                    { name: 'Tax Schedule 2024', type: 'pdf', url: '#' },
                    { name: 'Payment Guidelines', type: 'pdf', url: '#' }
                ]
            },
            {
                id: 3,
                title: 'Road Construction Project in Ward 7',
                excerpt: 'New 5.2 km road construction project approved for better connectivity in residential areas',
                content: `<h4>Road Construction Project - Ward 7</h4>
                         <p>The municipality has approved a major road construction project in Ward 7 to improve connectivity and transportation facilities for residents.</p>
                         
                         <h4>Project Details:</h4>
                         <ul>
                             <li><strong>Total Length:</strong> 5.2 kilometers</li>
                             <li><strong>Project Cost:</strong> NPR 25,000,000</li>
                             <li><strong>Duration:</strong> 8 months (November 2023 - June 2024)</li>
                             <li><strong>Contractor:</strong> ABC Construction Pvt. Ltd.</li>
                         </ul>
                         
                         <h4>Affected Areas:</h4>
                         <p>The construction will affect the following areas temporarily. Alternative routes have been arranged.</p>
                         <ul>
                             <li>Main Street - Ward 7 (Partial closure)</li>
                             <li>Residential Lane 5-8 (Detour available)</li>
                             <li>Market Access Road (Night work only)</li>
                         </ul>`,
                category: 'development',
                date: '2023-10-10',
                image: 'https://tse2.mm.bing.net/th/id/OIP.PmtHk3onHnBRK2XvGlw4uAHaFk?pid=Api&P=0&h=180',
                views: 945,
                featured: true,
                attachments: [
                    { name: 'Project Map', type: 'pdf', url: '#' },
                    { name: 'Traffic Diversion Plan', type: 'pdf', url: '#' }
                ]
            },
            {
                id: 4,
                title: 'Public Health Camp for Senior Citizens',
                excerpt: 'Free health checkup camp organized for senior citizens with specialist doctors',
                content: `<h4>Public Health Camp for Senior Citizens</h4>
                         <p>The municipality, in collaboration with Nepal Red Cross Society, is organizing a free health checkup camp exclusively for senior citizens (age 60+).</p>
                         
                         <h4>Camp Details:</h4>
                         <ul>
                             <li><strong>Date:</strong> October 25, 2023</li>
                             <li><strong>Time:</strong> 8:00 AM - 4:00 PM</li>
                             <li><strong>Venue:</strong> Municipal Health Center, Ward No. 6</li>
                             <li><strong>Registration:</strong> Free, on-spot registration available</li>
                         </ul>
                         
                         <h4>Available Services:</h4>
                         <ul>
                             <li>General health checkup</li>
                             <li>Blood pressure and sugar testing</li>
                             <li>Eye examination</li>
                             <li>Dental checkup</li>
                             <li>Free basic medicines</li>
                         </ul>`,
                category: 'health',
                date: '2023-10-05',
                image: 'https://via.placeholder.com/400x200/e74c3c/ffffff?text=Health+Camp',
                views: 2234,
                featured: false,
                attachments: [
                    { name: 'Health Camp Brochure', type: 'pdf', url: '#' }
                ]
            },
            {
                id: 5,
                title: 'Scholarship Program for Underprivileged Students',
                excerpt: 'Educational scholarship applications open for economically disadvantaged students',
                content: `<h4>Educational Scholarship Program 2024</h4>
                         <p>The municipality is pleased to announce the scholarship program for underprivileged students for the academic year 2024. Applications are now open.</p>
                         
                         <h4>Scholarship Categories:</h4>
                         <ul>
                             <li><strong>School Level:</strong> NPR 5,000 per year</li>
                             <li><strong>+2 Level:</strong> NPR 10,000 per year</li>
                             <li><strong>Bachelor Level:</strong> NPR 15,000 per year</li>
                         </ul>
                         
                         <h4>Application Deadline:</h4>
                         <p><strong>November 30, 2023</strong></p>
                         
                         <p>Apply online through our portal or visit the Education Department at the municipal office.</p>`,
                category: 'education',
                date: '2023-10-03',
                image: 'https://via.placeholder.com/400x200/9b59b6/ffffff?text=Scholarship',
                views: 1890,
                featured: false,
                attachments: [
                    { name: 'Scholarship Application Form', type: 'pdf', url: '#' }
                ]
            }
        ];

        // Add more sample news
        for (let i = 6; i <= 20; i++) {
            const categories = ['announcement', 'development', 'health', 'education', 'tender', 'event', 'holiday'];
            const titles = [
                'New Public Park Construction',
                'Mobile Health Clinic Service',
                'Street Light Installation',
                'Adult Literacy Program',
                'Sewage System Upgrade Tender',
                'Cultural Festival Organization',
                'Tax Rebate Announcement',
                'Sports Competition for Youth',
                'Drainage Cleaning Campaign'
            ];
            
            allNews.push({
                id: i,
                title: `${titles[Math.floor(Math.random() * titles.length)]} - Update ${i}`,
                excerpt: `This is detailed information about the latest development project number ${i} in our municipality.`,
                content: `<p>This is comprehensive information about the ongoing project. The municipality is committed to transparent communication with all citizens about development works and public services.</p>`,
                category: categories[Math.floor(Math.random() * categories.length)],
                date: `2023-09-${28 - Math.floor(i/2)}`,
                image: `https://via.placeholder.com/400x200/34495e/ffffff?text=News+${i}`,
                views: Math.floor(Math.random() * 2000) + 100,
                featured: i <= 8,
                attachments: []
            });
        }
        
        // Sort news by date (newest first)
        allNews.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        filterNews();
        updateLoadMoreButton();
    }
    
    function filterNews() {
        if (currentFilter === 'all') {
            filteredNews = allNews;
        } else {
            filteredNews = allNews.filter(news => news.category === currentFilter);
        }
        
        currentPage = 1;
        displayNews();
        updateLoadMoreButton();
    }
    
    function filterNewsBySearch(searchTerm) {
        if (!searchTerm) {
            filterNews();
            return;
        }
        
        filteredNews = allNews.filter(news => 
            news.title.toLowerCase().includes(searchTerm) ||
            news.excerpt.toLowerCase().includes(searchTerm) ||
            news.content.toLowerCase().includes(searchTerm) ||
            getCategoryName(news.category).toLowerCase().includes(searchTerm)
        );
        
        currentPage = 1;
        displayNews();
        updateLoadMoreButton();
    }
    
    function displayNews() {
        displayFeaturedNews();
        displayNewsList();
    }
    
    function displayFeaturedNews() {
        if (!featuredNews) return;
        
        const featuredItems = filteredNews.filter(news => news.featured).slice(0, 4);
        
        if (featuredItems.length === 0) {
            featuredNews.innerHTML = '<p class="no-results">No featured news available.</p>';
            return;
        }
        
        featuredNews.innerHTML = featuredItems.map(news => `
            <div class="featured-news-item" onclick="openNewsModal(${news.id})">
                <img src="${news.image}" alt="${news.title}" class="featured-news-image">
                <div class="featured-news-content">
                    <span class="featured-news-badge ${news.category}">${getCategoryName(news.category)}</span>
                    <h3 class="featured-news-title">${news.title}</h3>
                    <p class="featured-news-excerpt">${news.excerpt}</p>
                    <div class="featured-news-meta">
                        <span><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                        <span><i class="far fa-eye"></i> ${news.views} views</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function displayNewsList() {
        if (!newsList) return;
        
        const startIndex = 0;
        const endIndex = currentPage * itemsPerPage;
        const newsToShow = filteredNews.slice(startIndex, endIndex);
        
        if (currentPage === 1) {
            newsList.innerHTML = '';
        }
        
        if (newsToShow.length === 0) {
            newsList.innerHTML = `
                <div class="no-results" style="text-align: center; padding: 40px;">
                    <i class="fas fa-newspaper" style="font-size: 3rem; color: #ccc; margin-bottom: 15px;"></i>
                    <h3>No News Available</h3>
                    <p>There are no news items ${currentFilter !== 'all' ? 'in this category' : ''} at the moment.</p>
                </div>
            `;
            return;
        }
        
        newsList.innerHTML += newsToShow.map(news => `
            <div class="news-list-item" onclick="openNewsModal(${news.id})">
                <div class="news-list-icon">
                    <i class="fas fa-${getCategoryIcon(news.category)}"></i>
                </div>
                <div class="news-list-content">
                    <h4 class="news-list-title">${news.title}</h4>
                    <p class="news-list-excerpt">${news.excerpt}</p>
                    <div class="news-list-meta">
                        <span><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
                        <span><i class="far fa-folder"></i> ${getCategoryName(news.category)}</span>
                        <span><i class="far fa-eye"></i> ${news.views} views</span>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    function loadMoreNews() {
        currentPage++;
        displayNewsList();
        updateLoadMoreButton();
    }
    
    function updateLoadMoreButton() {
        if (!loadMoreBtn) return;
        
        const totalItems = filteredNews.length;
        const displayedItems = currentPage * itemsPerPage;
        
        if (displayedItems >= totalItems) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }
    }
    
    console.log('News functionality initialized');
});

// Global function to open news modal
function openNewsModal(newsId) {
    const news = window.allNews?.find(n => n.id === newsId);
    if (!news) return;
    
    const modalTitle = document.getElementById('newsModalTitle');
    const modalMeta = document.getElementById('newsModalMeta');
    const modalContent = document.getElementById('newsModalContent');
    const modalAttachments = document.getElementById('newsModalAttachments');
    const newsModal = document.getElementById('newsModal');
    
    if (!modalTitle || !modalMeta || !modalContent || !modalAttachments || !newsModal) return;
    
    // Update modal content
    modalTitle.textContent = news.title;
    modalMeta.innerHTML = `
        <span class="news-date"><i class="far fa-calendar"></i> ${formatDate(news.date)}</span>
        <span class="news-category"><i class="far fa-folder"></i> ${getCategoryName(news.category)}</span>
        <span class="news-views"><i class="far fa-eye"></i> ${news.views} views</span>
    `;
    modalContent.innerHTML = news.content;
    
    // Update attachments
    if (news.attachments && news.attachments.length > 0) {
        let attachmentsHTML = '<h4>Attachments:</h4>';
        news.attachments.forEach(attachment => {
            const icon = attachment.type === 'pdf' ? 'fa-file-pdf' : 'fa-file-word';
            attachmentsHTML += `
                <a href="${attachment.url}" class="attachment-item" target="_blank">
                    <i class="far ${icon} attachment-icon"></i>
                    <span>${attachment.name}</span>
                </a>
            `;
        });
        modalAttachments.innerHTML = attachmentsHTML;
    } else {
        modalAttachments.innerHTML = '';
    }
    
    // Show modal
    newsModal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    
    // Increment views
    news.views++;
    
    // Update views in the news items
    updateNewsViews(news.id, news.views);
}

function updateNewsViews(newsId, newViews) {
    // Update featured news views
    const featuredItem = document.querySelector(`.featured-news-item[onclick="openNewsModal(${newsId})"] .featured-news-meta span:last-child`);
    if (featuredItem) {
        featuredItem.innerHTML = `<i class="far fa-eye"></i> ${newViews} views`;
    }
    
    // Update list news views
    const listItem = document.querySelector(`.news-list-item[onclick="openNewsModal(${newsId})"] .news-list-meta span:last-child`);
    if (listItem) {
        listItem.innerHTML = `<i class="far fa-eye"></i> ${newViews} views`;
    }
}

// Share functionality
function shareOnFacebook() {
    const url = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.getElementById('newsModalTitle').textContent);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&quote=${title}`, '_blank');
}

function shareOnTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(document.getElementById('newsModalTitle').textContent);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

function shareOnLinkedIn() {
    const url = encodeURIComponent(window.location.href);
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

function copyNewsLink() {
    const tempInput = document.createElement('input');
    tempInput.value = window.location.href;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand('copy');
    document.body.removeChild(tempInput);
    
    showToast('Link copied to clipboard!');
}

function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// Utility functions
function getCategoryName(category) {
    const names = {
        'announcement': 'Announcement',
        'development': 'Development',
        'health': 'Health',
        'education': 'Education',
        'tender': 'Tender',
        'event': 'Event',
        'holiday': 'Holiday'
    };
    return names[category] || 'General';
}

function getCategoryIcon(category) {
    const icons = {
        'announcement': 'bullhorn',
        'development': 'hard-hat',
        'health': 'heartbeat',
        'education': 'graduation-cap',
        'tender': 'file-contract',
        'event': 'calendar-alt',
        'holiday': 'umbrella-beach'
    };
    return icons[category] || 'newspaper';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}