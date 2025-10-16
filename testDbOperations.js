import { createUser, createProgram, createClass, createCourse, createEnrollment, createAssignment, createSubmission, createGrade, createAuthUserAndLink } from './dbOperation.js';

// Test createUser
(async () => {
  try {
    await createUser("user123", {
      role: "student",
      email: "student@example.com",
      firstName: "John",
      lastName: "Doe",
      phone: "1234567890",
      studentNumber: "S12345"
    });

    await createAuthUserAndLink("user123", "student@example.com", "Student#12345");

    // Create a lecturer user referenced by lecturerId in course
    await createUser("lecturer123", {
      role: "lecturer",
      email: "lecturer@example.com",
      firstName: "Alice",
      lastName: "Ng",
      phone: "0987654321",
      staffNumber: "L98765"
    });

    await createAuthUserAndLink("lecturer123", "lecturer@example.com", "Lecturer#98765");

    await createProgram("program123", {
      programCode: "CS101",
      programName: "Computer Science"
    });

    await createClass("class123", {
      programId: "program123",
      className: "CS101-A",
      academicYear: "2023"
    });

    await createCourse("course123", {
      code: "CS101",
      name: "Introduction to Computer Science",
      lecturerId: "lecturer123",
      classId: "class123",
      academicYear: "2023",
      academicTerm: "Fall"
    });

    await createEnrollment("course123", "user123", "student");

    await createAssignment("assignment123", {
      courseId: "course123",
      title: "Assignment 1",
      description: "Solve the given problems.",
      openAt: new Date(),
      dueAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
      maxPoints: 100
    });

    const submissionId = await createSubmission("assignment123", "user123", 1, {
      courseId: "course123",
      artifactUrls: ["https://example.com/artifact1"],
      textAnswer: "This is my answer.",
      codeLanguage: "javascript",
      checksum: "abc123",
      useAIGrading: true
    });

    await createGrade(submissionId, {
      score: 95,
      letterGrade: "A",
      graderType: "manual",
      feedback: "Great work!"
    });

    console.log("All operations completed successfully.");
  } catch (error) {
    console.error("Error during testing:", error);
  }
})();
