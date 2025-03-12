import { db } from "@/config/firebase";
import { collection, query, getDocs, where } from "firebase/firestore";

export const getDashboard = async (user) => {
  try {
    if (!user?.uid) return { totalDecisions: 0 };

    const dashboardRef = collection(db, "dashboard");
    const q = query(dashboardRef, where("userId", "==", user.uid));

    const dashboardDocs = await getDocs(q);

    if (dashboardDocs.empty) {
      console.log("No dashboard data found.");
      return { totalDecisions: 0 };
    }

    const dashboardData = dashboardDocs.docs[0].data(); 

    return {
      totalDecisions: dashboardData.totalDecisions || 0,
    };
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    return { totalDecisions: 0 };
  }
};
