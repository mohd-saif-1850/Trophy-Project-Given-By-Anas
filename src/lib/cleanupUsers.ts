import { UserModel } from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";

export async function startUserCleanupJob() {

  setInterval(async () => {
    try {
      const now = new Date();
      const deleted = await UserModel.deleteMany({
        verified: false,
        $or: [
          { expiresAt: { $lt: now } },
          { otpExpiry: { $lt: now } },
        ],
      });
      if (deleted.deletedCount > 0) {
        console.log(`Deleted ${deleted.deletedCount} unverified users`);
      }
    } catch (error) {
      console.error("Error cleaning unverified users:", error);
    }
  }, 10 * 60 * 1000);
}
