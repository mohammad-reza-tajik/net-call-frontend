import fs from "node:fs/promises";
import {execSync} from "node:child_process";


execSync("npx tailwindcss -i styles/globals.css -o public/offline.css -c ./tailwind.offline.config.ts --minify", (error, stdout, stderr) => {
    if (error) {
        console.log(error);
        return;
    }
    if (stderr) {
        console.log(stderr);
        return;
    }
    console.log(stdout);
});


try {
    const cssContent = await fs.readFile("public/offline.css", "utf-8");
    const htmlContent = await fs.readFile("public/offline.html", "utf-8");
    await fs.writeFile("public/offline.html", htmlContent.replace("<!-- inject built css -->", `<style>${cssContent}</style>`));
    console.log("Injected CSS into offline.html");
    await fs.unlink("public/offline.css");
    console.log("Deleted offline.css");
} catch (e) {
    console.log(e);
}





