
export async function canGenerateReport(userId, UserModel) {
  const user = await UserModel.findById(userId);
  if (!user) throw new Error("User not found");

  const lastReport = user.reports?.[user.reports.length - 1];

    //   if (process.env.NODE_ENV === "development") {
    //     return { allowed: true }; 
    //   }

  if (lastReport) {
    const now = new Date();
    const diffDays = (now - lastReport.generatedAt) / (1000 * 60 * 60 * 24);

    if (diffDays < 2) {
      return { allowed: false, lastReport };
    }
  }

  return { allowed: true };
}


// async function generateReport(userId, reportData) {
//   const user = await User.findById(userId);

//   user.reports.push({ data: reportData });
//   user.reportCount = (user.reportCount || 0) + 1;
//   user.updatedAt = new Date();

//   await user.save();
//   return user.reports[user.reports.length - 1];
// }
