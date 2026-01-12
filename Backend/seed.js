import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/courseSystem')
    .then(() => console.log("Connected to MongoDB for Seeding"))
    .catch(err => console.log("Connection Error:", err));

const CourseSchema = new mongoose.Schema({
    code: String,
    title: String,
    credits: String,
    description: String,
    semester: String
});

const Course = mongoose.model('Course', CourseSchema);

const courses = [
    // BCS-I
    { semester: "BCS-I", code: "CSC101", title: "Application of Information and Communication Technology", credits: "3(2,1)", description: "This course introduces fundamental concepts of Information and Communication Technologies and their applications." },
    { semester: "BCS-I", code: "CSC103", title: "Programming Fundamentals", credits: "4(3,1)", description: "Covers basic programming concepts, algorithms, and structured programming using a high-level language." },
    { semester: "BCS-I", code: "HUM112", title: "Islamic Studies", credits: "2(2,0)", description: "Study of basic Islamic teachings and culture." },
    { semester: "BCS-I", code: "HUM104", title: "Functional English", credits: "3(3,0)", description: "Focuses on improving English grammar, vocabulary, and communication skills for daily use." },
    { semester: "BCS-I", code: "HUM122", title: "Fundamentals of Psychology", credits: "2(2,0)", description: "An overview of the field of psychology, focusing on basic theories and principles." },
    { semester: "BCS-I", code: "HUM208", title: "Civics and Community Engagement", credits: "2(2,0)", description: "Examines citizenship, civic responsibility, and community involvement." },
    
    // BCS-II
    { semester: "BCS-II", code: "CSC102", title: "Discrete Structures", credits: "3", description: "Introduction to mathematical structures essential for computer science, including logic, sets, and relations, using a high-level language." },
    { semester: "BCS-II", code: "MGT250", title: "Introduction to Entrepreneurship", credits: "2(2,0)", description: "Covers the process of starting a new business venture and the characteristics of successful entrepreneurs." },
    { semester: "BCS-II", code: "PHY124", title: "Applied Physics", credits: "3(2,1)", description: "Application of physics principles in technological and engineering contexts." },
    { semester: "BCS-II", code: "HUM120", title: "Expository Writing", credits: "3", description: "Develops skills in clear, persuasive, and analytical writing." },
    { semester: "BCS-II", code: "CSC241", title: "Object Oriented Programming", credits: "4(3,1)", description: "In-depth study of OOP concepts like encapsulation, inheritance, and polymorphism." },

    // BCS-III
    { semester: "BCS-III", code: "CSC270", title: "Database Systems", credits: "4(3,1)", description: "Covers relational database design, SQL, and database management systems." },
    { semester: "BCS-III", code: "CSC275", title: "Computer Networks", credits: "3(2,1)", description: "Introduction to network architecture, protocols, and communication standards." },
    { semester: "BCS-III", code: "CSC210", title: "Professional Practices", credits: "2", description: "Ethical, legal, and social issues in the field of computing." },
    { semester: "BCS-III", code: "MTH104", title: "Calculus and Analytic Geometry", credits: "3", description: "Study of limits, derivatives, integrals, and coordinate geometry." },
    { semester: "BCS-III", code: "CSC280", title: "Data Structures and Algorithms", credits: "4(3,1)", description: "Analysis and implementation of fundamental data structures and algorithms." },

    // BCS-IV
    { semester: "BCS-IV", code: "CSC211", title: "Advanced Data Structures", credits: "4(3,1)", description: "Further exploration of complex data structures like heaps, graphs, and advanced tree structures." },
    { semester: "BCS-IV", code: "CSC323", title: "Operating Systems", credits: "3(2,1)", description: "Covers the fundamental principles, design, and implementation of operating systems." },
    { semester: "BCS-IV", code: "CSC262", title: "Artificial Intelligence", credits: "3(2,1)", description: "Introduction to the core concepts of AI, including search, knowledge representation, and machine learning." },
    { semester: "BCS-IV", code: "CSC316", title: "Advanced Database Systems", credits: "3(2,1)", description: "Topics include database tuning, transaction management, and distributed databases." },
    { semester: "BCS-IV", code: "CSC325", title: "Software Engineering", credits: "3(2,1)", description: "Covers the methodologies, tools, and techniques for developing quality software systems." },

    // BCS-V
    { semester: "BCS-V", code: "MTH262", title: "Statistics and Probability Theory", credits: "3", description: "Introduction to statistical inference, probability distributions, and data analysis." },
    { semester: "BCS-V", code: "CSC301", title: "Design and Analysis of Algorithms", credits: "3", description: "Formal techniques for analyzing the efficiency of algorithms and advanced algorithmic paradigms." },
    { semester: "BCS-V", code: "MTH105", title: "Multivariable Calculus", credits: "3", description: "Extends calculus concepts to functions of multiple variables, including partial derivatives and multiple integrals." },
    { semester: "BCS-V", code: "CSC336", title: "Web Technologies", credits: "3(2,1)", description: "In-depth study of client-side and server-side web development technologies and frameworks." },
    { semester: "BCS-V", code: "AIC354", title: "Machine Learning Fundamentals", credits: "3(2,1)", description: "Core concepts of machine learning, including supervised and unsupervised learning algorithms." },
    { semester: "BCS-V", code: "HUM121", title: "Technical and Business Writing", credits: "3", description: "Focuses on developing clear and effective technical documentation and business correspondence." },

    // BCS-VI
    { semester: "BCS-VI", code: "CSC312", title: "Theory of Automata", credits: "3", description: "Study of abstract machines and formal languages, including finite automata, pushdown automata, and Turing machines." },
    { semester: "BCS-VI", code: "CSC315", title: "Theory of Programming Languages", credits: "3", description: "Exploration of programming language design principles, semantics, and compilation techniques." },
    { semester: "BCS-VI", code: "CSC303", title: "Mobile Application Development", credits: "3(2,1)", description: "Covers the design and development of mobile applications for various platforms." },
    { semester: "BCS-VI", code: "CSC354", title: "Machine Learning", credits: "3", description: "Advanced topics in machine learning, including deep learning, reinforcement learning, and model evaluation." },
    { semester: "BCS-VI", code: "CSC365", title: "Computer Graphics", credits: "3(2,1)", description: "Fundamentals of 2D and 3D computer graphics, rendering, and modeling techniques." },
    { semester: "BCS-VI", code: "CSC370", title: "Network Security", credits: "3(2,1)", description: "Principles and practices of securing computer networks, including cryptography and firewalls." },

    // BCS-VII
    { semester: "BCS-VII", code: "CSC432", title: "Information Security", credits: "3(3,0)", description: "Comprehensive study of information security principles, risk management, and security policies." },
    { semester: "BCS-VII", code: "CSC498", title: "Senior Design Project-I", credits: "2(0,2)", description: "The first phase of a culminating, multi-semester project." },
    { semester: "BCS-VII", code: "CSC441", title: "Compiler Construction", credits: "3(2,1)", description: "Covers the theory and practice of building compilers, including lexical analysis and parsing." },
    { semester: "BCS-VII", code: "MGT210", title: "Fundamentals of Marketing", credits: "3", description: "Introduction to the concepts and strategies of marketing." },
    { semester: "BCS-VII", code: "CSC356", title: "Human Computer Interaction", credits: "3(2,1)", description: "Principles of designing effective and usable user interfaces." },
    { semester: "BCS-VII", code: "CSC445", title: "Parallel Computing", credits: "3(2,1)", description: "Techniques and architectures for parallel processing and high-performance computing." },

    // BCS-VIII
    { semester: "BCS-VIII", code: "CSC334", title: "Parallel and Distributed Computing", credits: "3(2,1)", description: "Advanced topics in parallel and distributed systems, including cloud and grid computing." },
    { semester: "BCS-VIII", code: "MGT350", title: "Human Resource Management", credits: "3", description: "Study of managing personnel, including recruitment, training, and performance evaluation." },
    { semester: "BCS-VIII", code: "CSC499", title: "Senior Design Project II", credits: "4(0,4)", description: "The final phase and completion of the senior design project." },
    { semester: "BCS-VIII", code: "CSC450", title: "Cloud Computing", credits: "3(2,1)", description: "Covers cloud architecture, virtualization, and services (IaaS, PaaS, SaaS)." },
    { semester: "BCS-VIII", code: "CSC460", title: "Big Data Analytics", credits: "3(2,1)", description: "Techniques and tools for analyzing large datasets to extract valuable insights." }
];

const seedDB = async () => {
    try {
        await Course.deleteMany({}); 
        console.log("✅ Old courses cleared.");
        
        await Course.insertMany(courses);
        console.log("✅ All courses added successfully!");
        
        mongoose.connection.close();
        console.log("🔌 Connection closed.");
    } catch (err) {
        console.log("❌ Error during seeding:", err);
    }
};

seedDB();
