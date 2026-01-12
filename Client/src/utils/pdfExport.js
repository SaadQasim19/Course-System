import jsPDF from 'jspdf';

export const exportProfileToPDF = (user, enrolledCourses) => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Course Management System', 105, 20, { align: 'center' });
    
    // User Info
    doc.setFontSize(16);
    doc.text('Student Profile', 20, 40);
    
    doc.setFontSize(12);
    doc.text(`Name: ${user.fullName}`, 20, 55);
    doc.text(`Registration Number: ${user.regNumber}`, 20, 65);
    doc.text(`Semester: ${user.semester}`, 20, 75);
    doc.text(`Total Enrolled Courses: ${enrolledCourses.length}`, 20, 85);
    
    // Enrolled Courses
    doc.setFontSize(14);
    doc.text('Enrolled Courses:', 20, 100);
    
    doc.setFontSize(10);
    let y = 110;
    
    if (enrolledCourses.length === 0) {
        doc.text('No courses enrolled yet.', 20, y);
    } else {
        enrolledCourses.forEach((course, index) => {
            doc.text(`${index + 1}. ${course.code} - ${course.title}`, 20, y);
            doc.text(`   Credits: ${course.credits}`, 20, y + 7);
            y += 17;
            
            if (y > 270) {
                doc.addPage();
                y = 20;
            }
        });
    }
    
    doc.save(`${user.regNumber}_Profile.pdf`);
};
