const API_URL = 'http://localhost:5000';
let coursesData = {}; 

document.addEventListener('DOMContentLoaded', function() {
    
    // --- Elements ---
    const loginPage = document.getElementById('login-page');
    const createAccountPage = document.getElementById('create-account-page');
    const studentPortal = document.getElementById('student-portal');
    const teacherPortal = document.getElementById('teacher-portal');
    
    const loginButton = document.getElementById('login-button');
    const createAccountButton = document.getElementById('create-account-btn');
    const createAccountLink = document.querySelector('.create-account-link');
    const goToLogin = document.getElementById('go-to-login');
    const errorMessage = document.getElementById('error-message');

    // --- MAIN INITIALIZATION ---
    initApp();

    async function initApp() {
        await fetchAllCourses();
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser) {
            if (currentUser.role === 'student') showStudentPortal(currentUser);
            else if (currentUser.role === 'teacher') showTeacherPortal(currentUser);
        } else {
            showLoginPage();
        }
    }

    // --- FETCH DATA LOGIC ---
    async function fetchAllCourses() {
        try {
            const response = await fetch(`${API_URL}/courses`);
            const data = await response.json();
            coursesData = {}; 
            data.forEach(course => {
                const sem = course.semester;
                if (!coursesData[sem]) coursesData[sem] = [];
                coursesData[sem].push(course);
            });
            console.log("✅ Courses Data Ready:", coursesData);
        } catch (error) { console.error("❌ Error fetching courses:", error); }
    }

    // --- PORTAL DISPLAY FUNCTIONS ---
    function showLoginPage() {
        hideAllPages();
        loginPage.classList.add('active');
        errorMessage.classList.add('hidden');
        document.getElementById('login-reg-number').value = '';
        document.getElementById('login-password').value = '';
    }

    function showCreateAccountPage() {
        hideAllPages();
        createAccountPage.classList.add('active');
    }

    function showStudentPortal(user) {
        hideAllPages();
        studentPortal.classList.add('active');
        document.getElementById('student-display-name').textContent = user.fullName;
        document.getElementById('student-semester').textContent = user.semester;
        
        // Profile
        document.getElementById('profile-name').textContent = user.fullName;
        document.getElementById('profile-reg-number').textContent = user.regNumber;
        document.getElementById('profile-role').textContent = 'Student';
        document.getElementById('profile-semester').textContent = user.semester;
        
        loadStudentCourses(user);
    }

    function showTeacherPortal(user) {
        hideAllPages();
        teacherPortal.classList.add('active');
        document.getElementById('teacher-display-name').textContent = user.fullName;
        
        // Profile
        document.getElementById('teacher-profile-name').textContent = user.fullName;
        document.getElementById('teacher-profile-reg-number').textContent = user.regNumber;
        document.getElementById('teacher-profile-role').textContent = 'Teacher';
        
        loadTeacherCourses(user);
    }

    function hideAllPages() {
        loginPage.classList.remove('active');
        createAccountPage.classList.remove('active');
        studentPortal.classList.remove('active');
        teacherPortal.classList.remove('active');
    }

    // --- RENDERING LOGIC ---
    window.loadStudentCourses = function(user) {
        const semester = user.semester || 'BCS-I';
        const enrolledCourses = user.enrolledCourses || [];

        document.getElementById('current-semester').textContent = semester;
        document.getElementById('profile-courses-count').textContent = enrolledCourses.length;

        const enrolledContainer = document.getElementById('enrolled-courses');
        const profileCoursesContainer = document.getElementById('profile-courses');
        
        if (enrolledCourses.length === 0) {
            enrolledContainer.innerHTML = '<p class="no-courses">No courses enrolled yet.</p>';
            profileCoursesContainer.innerHTML = '<p class="no-courses">No courses enrolled yet.</p>';
        } else {
            enrolledContainer.innerHTML = enrolledCourses.map(c => createCourseCard(c, 'student-enrolled')).join('');
            profileCoursesContainer.innerHTML = enrolledCourses.map(c => createCourseCard(c, 'profile')).join('');
        }

        const availableContainer = document.getElementById('available-courses');
        const semesterCourses = coursesData[semester] || [];
        const availableFiltered = semesterCourses.filter(c => !enrolledCourses.some(ec => ec.code === c.code));

        if (availableFiltered.length === 0) {
            availableContainer.innerHTML = '<p class="no-courses">No new courses available.</p>';
        } else {
            availableContainer.innerHTML = availableFiltered.map(c => createCourseCard(c, 'student-available', semester)).join('');
        }
    }

    window.loadTeacherCourses = function(user) {
        const teachingCourses = user.enrolledCourses || [];
        document.getElementById('teaching-courses-count').textContent = teachingCourses.length;
        document.getElementById('teacher-courses-count-profile').textContent = teachingCourses.length;

        const teachingContainer = document.getElementById('teaching-courses');
        if (teachingCourses.length === 0) {
            teachingContainer.innerHTML = '<p class="no-courses">No courses assigned yet.</p>';
        } else {
            teachingContainer.innerHTML = teachingCourses.map(c => createCourseCard(c, 'teacher-enrolled')).join('');
        }

        const availableContainer = document.querySelector('#teacher-portal #available-courses');
        let allCourses = [];
        Object.keys(coursesData).forEach(sem => {
            coursesData[sem].forEach(c => allCourses.push({...c, semester: sem}));
        });
        const availableFiltered = allCourses.filter(c => !teachingCourses.some(tc => tc.code === c.code));

        if (availableFiltered.length === 0) {
            availableContainer.innerHTML = '<p class="no-courses">No courses available.</p>';
        } else {
            availableContainer.innerHTML = `
                <h2>Available Courses (${availableFiltered.length})</h2>
                <div class="courses-container">
                    ${availableFiltered.map(c => createCourseCard(c, 'teacher-available')).join('')}
                </div>
            `;
        }
    }

    // Helper for Cards
    function createCourseCard(course, type, semesterOverride) {
        const semester = course.semester || semesterOverride || 'N/A';
        let html = `
            <div class="course-card ${type.includes('enrolled') ? 'enrolled-course' : ''}">
                <div class="course-code">${course.code}</div>
                <div class="course-title">${course.title}</div>
                <div class="course-credits">${course.credits} Credits</div>
                ${type.includes('teacher') ? `<div class="course-semester">Semester: ${semester}</div>` : ''}
        `;

        if (type === 'student-enrolled') {
            html += `
                <button class="description-btn" onclick="openCourseModal('${course.code}')">View Description & Video</button>
                <button class="drop-btn" onclick="dropCourse('${course.code}')">Drop Course</button>
            `;
        } else if (type === 'student-available') {
            html += `
                <button class="description-btn" onclick="openCourseModal('${course.code}')">View Description</button>
                <button class="enroll-btn" onclick="enrollCourse('${course.code}', '${course.title}', '${course.credits}', '${semester}')">Enroll Now</button>
            `;
        } else if (type === 'teacher-enrolled') {
            html += `
                <div class="teacher-actions">
                    <button class="description-btn" onclick="openCourseModal('${course.code}')">View Description</button>
                    <button class="drop-btn" onclick="dropCourse('${course.code}')">Drop Course</button>
                </div>
            `;
        } else if (type === 'teacher-available') {
            html += `
                <button class="description-btn" onclick="openCourseModal('${course.code}')">View Description</button>
                <button class="enroll-btn" onclick="enrollCourse('${course.code}', '${course.title}', '${course.credits}', '${semester}')">Enroll as Teacher</button>
            `;
        }
        html += `</div>`;
        return html;
    }

    // --- EVENT LISTENERS ---
    loginButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const regNumber = document.getElementById('login-reg-number').value.trim();
        const password = document.getElementById('login-password').value.trim();
        if (!regNumber || !password) return alert('Fill all fields');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ regNumber, password })
            });
            if (res.ok) {
                const user = await res.json();
                localStorage.setItem('currentUser', JSON.stringify(user));
                if (Object.keys(coursesData).length === 0) await fetchAllCourses();
                if (user.role === 'student') showStudentPortal(user);
                else showTeacherPortal(user);
            } else {
                errorMessage.classList.remove('hidden');
            }
        } catch (err) { alert("Server Error"); }
    });

    createAccountButton.addEventListener('click', async (e) => {
        e.preventDefault();
        const fullName = document.getElementById('full-name').value.trim();
        const regNumber = document.getElementById('reg-number').value.trim();
        const password = document.getElementById('password').value.trim();
        const role = document.getElementById('role').value;
        const semester = document.getElementById('semester').value;

        if (!fullName || !regNumber || !password) return alert("Fill details");
        const newUser = { fullName, regNumber, password, role, semester: role === 'student' ? semester : null };

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (res.ok) {
                alert("Account Created");
                showLoginPage();
            } else {
                const data = await res.json();
                alert(data.message);
            }
        } catch (err) { alert("Server Error"); }
    });

    createAccountLink.addEventListener('click', showCreateAccountPage);
    goToLogin.addEventListener('click', showLoginPage);
    document.getElementById('logout-student').addEventListener('click', () => { localStorage.removeItem('currentUser'); showLoginPage(); });
    document.getElementById('logout-teacher').addEventListener('click', () => { localStorage.removeItem('currentUser'); showLoginPage(); });

    document.getElementById('role').addEventListener('change', function() {
        const sg = document.getElementById('semester-group');
        this.value === 'student' ? sg.style.display = 'block' : sg.style.display = 'none';
    });

    // Navigation Tabs
    setupTabs('#student-portal');
    setupTabs('#teacher-portal');
    function setupTabs(portalId) {
        const buttons = document.querySelectorAll(`${portalId} .nav-btn`);
        const pages = document.querySelectorAll(`${portalId} .portal-page`);
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const target = btn.getAttribute('data-page');
                buttons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                pages.forEach(p => p.classList.remove('active'));
                document.getElementById(`${target}-page`).classList.add('active');
            });
        });
    }
    document.getElementById('back-to-courses-btn').addEventListener('click', () => {
        document.querySelector('#student-portal [data-page="courses"]').click();
    });

    // --- NEW: PDF DOWNLOAD LISTENER 📄 ---
    // Ye code ab button click ko sunega aur PDF banayega
    document.getElementById('download-description-btn').addEventListener('click', function() {
        // Check if jsPDF library is loaded
        if (!window.jspdf) {
            alert("Error: jsPDF Library not found. Please check index.html");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        // Modal se data uthao
        const title = document.getElementById('modal-course-title').textContent;
        const code = document.getElementById('modal-course-code').textContent;
        const credits = document.getElementById('modal-course-credits').textContent;
        const description = document.getElementById('modal-course-description').textContent;

        // PDF mein likho
        doc.setFontSize(18);
        doc.text(title, 10, 10);
        
        doc.setFontSize(12);
        doc.text(`Course Code: ${code}`, 10, 20);
        doc.text(`Credits: ${credits}`, 10, 30);
        
        doc.text("Description:", 10, 40);
        
        // Long Text Handling (Wrap Text)
        const splitDescription = doc.splitTextToSize(description, 180);
        doc.text(splitDescription, 10, 50);

        // Download
        doc.save(`${code}_Description.pdf`);
    });
});

// --- GLOBAL ACTIONS ---
async function runAggregation() {
    const list = document.getElementById('agg-list');
    list.innerHTML = '<li>Running Query... ⏳</li>';
    try {
        const res = await fetch(`${API_URL}/analytics/high-credits`);
        const data = await res.json();
        list.innerHTML = '';
        if(data.length === 0) list.innerHTML = '<li>No Results.</li>';
        data.forEach(item => {
            list.innerHTML += `<li style="border-bottom:1px solid #ddd; padding:5px;"><b>${item.code}</b>: ${item.title} <span style="background:#d1fae5; padding:2px;">${item.credits}</span></li>`;
        });
    } catch(e) { list.innerHTML = '<li>Error running query.</li>'; }
}

async function enrollCourse(code, title, credits, semester) {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) return alert("Login First");
    const courseData = { code, title, credits, semester, description: "Course description from DB" };
    try {
        const res = await fetch(`${API_URL}/enroll`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ regNumber: currentUser.regNumber, course: courseData })
        });
        if (res.ok) {
            const result = await res.json();
            currentUser.enrolledCourses = result.enrolledCourses;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert(`✅ Successfully enrolled in ${code}`);
            if (currentUser.role === 'student') window.loadStudentCourses(currentUser);
            else window.loadTeacherCourses(currentUser);
        } else {
            const data = await res.json();
            alert(data.message);
        }
    } catch (e) { console.error(e); alert("Connection Error"); }
}

async function dropCourse(code) {
    if(!confirm("Are you sure you want to drop this course?")) return;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    try {
        const res = await fetch(`${API_URL}/drop`, {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ regNumber: currentUser.regNumber, courseCode: code })
        });
        if (res.ok) {
            const result = await res.json();
            currentUser.enrolledCourses = result.enrolledCourses;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            alert(`🗑️ Course Dropped`);
            if (currentUser.role === 'student') window.loadStudentCourses(currentUser);
            else window.loadTeacherCourses(currentUser);
        }
    } catch (e) { console.error(e); }
}

function openCourseModal(code) {
    let course = null;
    for (const sem in coursesData) {
        const found = coursesData[sem].find(c => c.code === code);
        if (found) { course = found; break; }
    }
    if (!course) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        course = currentUser.enrolledCourses.find(c => c.code === code);
    }
    if(course) {
        document.getElementById('modal-course-title').textContent = course.title;
        document.getElementById('modal-course-code').textContent = course.code;
        document.getElementById('modal-course-credits').textContent = course.credits + " Credits";
        document.getElementById('modal-course-description').textContent = course.description || "No description.";
        
        const videoContainer = document.getElementById('video-container');
        const player = document.getElementById('youtube-player');
        if (course.videoLink) {
            const videoId = course.videoLink.split('v=')[1]?.split('&')[0];
            if (videoId) {
                player.src = `https://www.youtube.com/embed/${videoId}`;
                videoContainer.style.display = 'block';
            } else { videoContainer.style.display = 'none'; }
        } else {
            videoContainer.style.display = 'none';
            player.src = "";
        }
        document.getElementById('course-modal').style.display = 'block';
    }
}

function closeCourseModal() { 
    document.getElementById('course-modal').style.display = 'none'; 
    document.getElementById('youtube-player').src = "";
}
window.onclick = function(e) { if(e.target == document.getElementById('course-modal')) closeCourseModal(); }