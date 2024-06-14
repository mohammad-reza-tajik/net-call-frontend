import fs from "node:fs/promises";

const swContent = await fs.readFile("./public/sw.js", "utf-8");

const updatedContent = swContent.replace(/static-v(\d+)/g, (_, version) => {
    return `static-v${parseInt(version) + 1}`;
})

await fs.writeFile("./public/sw.js", updatedContent, "utf-8");