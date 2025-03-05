import { initializeTables } from "./manageTables";

// Main execution
(async function main() {
  try {
    await initializeTables();
  } catch (error) {
    console.error("❌ Error initializing tables:", error);
  } finally {
    process.exit();
  }
})();
