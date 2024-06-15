import fs from "node:fs/promises";

const swContent = await fs.readFile("./public/sw.js", "utf-8");

const updatedContent = swContent.replaceAll("version", Date.now().toString());

await fs.writeFile("./public/sw.js", updatedContent, "utf-8");