import { db } from './firebase.js';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';

// Enroll user123 as student in course_general_class123
(async () => {
  try {
    const courseId = 'course_general_class123';
    const userId = 'user123';
    const enrollmentId = `${courseId}_${userId}`;
    
    await setDoc(doc(db, 'enrollment', enrollmentId), {
      courseId: courseId,
      userId: userId,
      roleInCourse: 'student',
      createdAt: serverTimestamp()
    });
    
    console.log(`Enrolled user123 in ${courseId}`);
  } catch (error) {
    console.error('Error enrolling student:', error);
  }
})();
