// dbOperations.js
import { db, auth } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp, addDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

// Create a user
export const createUser = async (userId, userData) => {
  try {
    await setDoc(doc(db, "user", userId), {
      role: userData.role,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      status: "active",
      createdAt: serverTimestamp(),
      studentNumber: userData.studentNumber || null,
      staffNumber: userData.staffNumber || null
    });
    console.log("User created successfully");
  } catch (error) {
    console.error("Error creating user:", error);
  }
};

// Create a program
export const createProgram = async (programId, programData) => {
  try {
    await setDoc(doc(db, "program", programId), {
      programCode: programData.programCode,
      programName: programData.programName,
      createdAt: serverTimestamp()
    });
    console.log("Program created successfully");
  } catch (error) {
    console.error("Error creating program:", error);
  }
};

// Create a class
export const createClass = async (classId, classData) => {
  try {
    await setDoc(doc(db, "class", classId), {
      programId: classData.programId,
      className: classData.className,
      academicYear: classData.academicYear,
      createdAt: serverTimestamp()
    });
    console.log("Class created successfully");
  } catch (error) {
    console.error("Error creating class:", error);
  }
};

// Create a course
export const createCourse = async (courseId, courseData) => {
  try {
    await setDoc(doc(db, "course", courseId), {
      code: courseData.code,
      name: courseData.name,
      lecturerId: courseData.lecturerId,
      classId: courseData.classId,
      academicYear: courseData.academicYear,
      academicTerm: courseData.academicTerm,
      createdAt: serverTimestamp()
    });
    console.log("Course created successfully");
  } catch (error) {
    console.error("Error creating course:", error);
  }
};

// Create an enrollment
export const createEnrollment = async (courseId, userId, role) => {
  try {
    const enrollmentId = `${courseId}_${userId}`;
    await setDoc(doc(db, "enrollment", enrollmentId), {
      courseId: courseId,
      userId: userId,
      roleInCourse: role,
      createdAt: serverTimestamp()
    });
    console.log("Enrollment created successfully");
  } catch (error) {
    console.error("Error creating enrollment:", error);
  }
};

// Create an assignment
export const createAssignment = async (assignmentId, assignmentData) => {
  try {
    await setDoc(doc(db, "assignment", assignmentId), {
      courseId: assignmentData.courseId,
      title: assignmentData.title,
      description: assignmentData.description,
      openAt: assignmentData.openAt,
      dueAt: assignmentData.dueAt,
      maxPoints: assignmentData.maxPoints,
      allowedFormats: ["pdf", "java", "txt", "py", "html"],
      createdAt: serverTimestamp()
    });
    console.log("Assignment created successfully");
  } catch (error) {
    console.error("Error creating assignment:", error);
  }
};

// Create a submission
export const createSubmission = async (assignmentId, studentId, attemptNo, submissionData) => {
    try {
      const submissionId = `${assignmentId}_${studentId}_${attemptNo}`;
      await setDoc(doc(db, "submission", submissionId), {
        assignmentId: assignmentId,
        courseId: submissionData.courseId,
        studentId: studentId,
        attemptNo: attemptNo,
        submittedAt: serverTimestamp(),
        status: "pending",
        artifactUrls: submissionData.artifactUrls || [],
        textAnswer: submissionData.textAnswer || null,
        codeLanguage: submissionData.codeLanguage || null,
        checksum: submissionData.checksum || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      console.log("Submission created successfully");
      return submissionId; // Return ID for use in related collections
    } catch (error) {
      console.error("Error creating submission:", error);
      throw error;
    }
  };
  
  // Create a grade
  export const createGrade = async (submissionId, gradeData) => {
    try {
      await setDoc(doc(db, "grade", submissionId), {
        submissionId: submissionId,
        score: gradeData.score,
        letterGrade: gradeData.letterGrade || null,
        graderType: gradeData.graderType, // "ai" or "manual"
        graderVersion: gradeData.graderVersion || null,
        feedback: gradeData.feedback || null,
        confidence: gradeData.confidence || null,
        gradedAt: serverTimestamp()
      });
      console.log("Grade created successfully");
    } catch (error) {
      console.error("Error creating grade:", error);
      throw error;
    }
  };
  
  // Create a grade event
  export const createGradeEvent = async (gradeEventData) => {
    try {
    await addDoc(collection(db, "gradeEvent"), {
        submissionId: gradeEventData.submissionId,
        actorId: gradeEventData.actorId || null,
        source: gradeEventData.source, // "ai" | "regrade" | "manual_override"
        deltaScore: gradeEventData.deltaScore || null,
        notes: gradeEventData.notes,
        createdAt: serverTimestamp()
      });
      console.log("Grade event created successfully");
    } catch (error) {
      console.error("Error creating grade event:", error);
      throw error;
    }
  };

// Create Firebase Auth user (email/password) and link to existing Firestore user doc
export const createAuthUserAndLink = async (userId, email, password) => {
  try {
    const credentials = await createUserWithEmailAndPassword(auth, email, password);
    const authUid = credentials.user.uid;
    await setDoc(
      doc(db, "user", userId),
      {
        authUid: authUid,
        email: email,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    console.log(`Auth created and linked for user ${userId}`);
    return authUid;
  } catch (error) {
    console.error("Error creating auth user and linking:", error);
    throw error;
  }
};

// Update an existing Firestore user with a provided authUid (manual linking)
export const updateUserAuthUid = async (userId, authUid) => {
  try {
    await setDoc(
      doc(db, "user", userId),
      {
        authUid: authUid,
        updatedAt: serverTimestamp()
      },
      { merge: true }
    );
    console.log(`authUid linked for user ${userId}`);
  } catch (error) {
    console.error("Error updating user authUid:", error);
    throw error;
  }
};
  
  // Create AI evidence
  export const createAIEvidence = async (submissionId, evidenceData) => {
    try {
      await setDoc(doc(db, "aiEvidence", submissionId), {
        submissionId: submissionId,
        rubricJson: evidenceData.rubricJson || {},
        logsUrl: evidenceData.logsUrl,
        similarityScore: evidenceData.similarityScore || null,
        flags: evidenceData.flags || {}
      });
      console.log("AI evidence created successfully");
    } catch (error) {
      console.error("Error creating AI evidence:", error);
      throw error;
    }
  };
  
  // Example of how to use these functions together
  export const submitAssignmentWithGrading = async (assignmentId, studentId, submissionData) => {
    try {
      // Create submission
      const submissionId = await createSubmission(assignmentId, studentId, 1, submissionData);
  
      // If AI grading is enabled, create grade and AI evidence
      if (submissionData.useAIGrading) {
        await createGrade(submissionId, {
          score: 0, // Initial score
          graderType: "ai",
          graderVersion: "1.0"
        });
  
        await createAIEvidence(submissionId, {
          rubricJson: {},
          logsUrl: `logs/${submissionId}`,
          flags: {
            formatValid: true,
            plagiarismSuspected: false
          }
        });
      }
  
      return submissionId;
    } catch (error) {
      console.error("Error in submission process:", error);
      throw error;
    }
  };
