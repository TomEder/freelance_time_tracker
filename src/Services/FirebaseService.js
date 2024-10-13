import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebase";

const db = getFirestore();

// Function to get the currently authenticated user
const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user);
      } else {
        reject(new Error("No user is logged in"));
      }
      unsubscribe();
    });
  });
};

// Sign in with Google
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

// Sign out the user
export const signOutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
    throw error;
  }
};

// Fetch a single project by ID
export const fetchProject = async (projectId) => {
  try {
    const currentUser = await getCurrentUser();
    const projectDoc = doc(db, `users/${currentUser.uid}/projects`, projectId);
    const projectSnap = await getDoc(projectDoc);
    return projectSnap.exists() ? projectSnap.data() : null;
  } catch (error) {
    console.error("Error fetching project:", error);
    throw error;
  }
};

// Fetch all projects for the currently authenticated user
export const fetchAllProjects = async () => {
  try {
    const currentUser = await getCurrentUser();
    const projectsCollection = collection(
      db,
      `users/${currentUser.uid}/projects`
    );
    const projectSnapshot = await getDocs(projectsCollection);
    return projectSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching all projects:", error);
    throw error;
  }
};

// Update a specific project by ID with new data
export const updateProject = async (projectId, updatedData) => {
  try {
    const currentUser = await getCurrentUser();
    const projectRef = doc(db, `users/${currentUser.uid}/projects`, projectId);
    await updateDoc(projectRef, updatedData);
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const deleteProject = async (projectId) => {
  try {
    const currentUser = await getCurrentUser();
    const projectRef = doc(db, `users/${currentUser.uid}/projects`, projectId);
    await deleteDoc(projectRef);
  } catch (error) {
    console.error("Error deleting project: ", error);
    throw error;
  }
};

// Add a new project to the currently authenticated user's collection
export const addNewProject = async (newProjectData) => {
  try {
    const currentUser = await getCurrentUser();
    const projectCollection = collection(
      db,
      `users/${currentUser.uid}/projects`
    );
    return await addDoc(projectCollection, newProjectData);
  } catch (error) {
    console.error("Error adding new project:", error);
    throw error;
  }
};

// Update earnings and billing period for a project
export const updateEarnings = async (projectId, elapsedTime, payPerHour) => {
  try {
    const currentUser = await getCurrentUser();
    const projectRef = doc(db, `users/${currentUser.uid}/projects`, projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) throw new Error("Project not found");

    const projectData = projectSnap.data();
    const payPerHour = Number(projectData.payPerHour);
    const elapsedHours = Number(elapsedTime) / 3600; // Convert seconds to hours
    let sessionEarnings = elapsedHours * payPerHour; // Ensure payPerHour is valid

    sessionEarnings = Number(sessionEarnings.toFixed(1)); // Round to 1 decimal places

    console.log(
      `Elapsed hours: ${elapsedHours}, Pay per hour: ${payPerHour}, Session earnings: ${sessionEarnings}`
    );

    // Get the current date to find or create the correct billing period
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // getMonth is 0-indexed
    const currentYear = currentDate.getFullYear();

    // Find the current billing period
    let billingPeriods = projectData.billingPeriod || [];
    let currentBillingPeriod = billingPeriods.find(
      (period) => period.month === currentMonth && period.year === currentYear
    );

    // If no billing period exists for the current month, create one
    if (!currentBillingPeriod) {
      currentBillingPeriod = {
        hours: 0,
        earnings: 0,
        month: currentMonth,
        year: currentYear,
      };
      billingPeriods.push(currentBillingPeriod);
    } else {
      currentBillingPeriod.earnings = currentBillingPeriod.earnings || 0;
    }

    // Update the current billing period's hours and earnings
    currentBillingPeriod.hours += elapsedHours;
    currentBillingPeriod.earnings += sessionEarnings;

    // Recalculate total earnings by summing all billing period earnings
    const totalEarnings = billingPeriods.reduce(
      (acc, period) => acc + (period.earnings || 0),
      0
    );

    console.log("Updated billing periods:", billingPeriods);

    // Push updated billing periods and earnings to Firebase
    await updateDoc(projectRef, {
      earnings: totalEarnings,
      billingPeriod: billingPeriods,
    });

    return {
      totalEarnings,
      billingPeriods,
    };
  } catch (error) {
    console.error("Error updating earnings:", error);
    throw error;
  }
};
