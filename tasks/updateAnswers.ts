import { updateAnswers } from "../src/database/updateHistories";

// Main execution
(async function main() {
  try {
    await updateAnswers();
  } catch (error) {
    console.error("❌ Error updating answers:", error);
  } finally {
    process.exit();
  }
})();
