#!/usr/bin/env node

import fs from "fs";
import { loadImage, createCanvas } from "canvas";
import { ditherImage } from "epdoptimize";

async function main() {
    const jsonArgs = process.argv[2];
    if (!jsonArgs) {
        console.error("Usage: node index.js '<json_config>'");
        process.exit(1);
    }

    let config;
    try {
        config = JSON.parse(jsonArgs);
    } catch (e) {
        console.error("Failed to parse JSON configuration:", e.message);
        process.exit(1);
    }

    const { 
        src, dest, palette, brightness, contrast, saturation, conversion,
        width, height, background_color,
        draw_x, draw_y, draw_w, draw_h
    } = config;

    if (!src || !dest || !palette) {
        console.error("Missing required parameters: src, dest, palette");
        process.exit(1);
    }

    try {
        const img = await loadImage(src);
        
        const finalWidth = width || img.width;
        const finalHeight = height || img.height;
        
        const sourceCanvas = createCanvas(finalWidth, finalHeight);
        const sourceCtx = sourceCanvas.getContext("2d");

        // 1. Fill background
        if (background_color) {
            sourceCtx.fillStyle = background_color;
            sourceCtx.fillRect(0, 0, finalWidth, finalHeight);
        }

        // 2. Draw image with scaling and offset
        sourceCtx.drawImage(
            img,
            draw_x ?? 0,
            draw_y ?? 0,
            draw_w ?? img.width,
            draw_h ?? img.height
        );

        const destCanvas = createCanvas(finalWidth, finalHeight);

        const options = {
            palette: palette,
            ...conversion,
        };

        // Blend in brightness, contrast, saturation into toneMapping
        if (
            brightness !== undefined ||
            contrast !== undefined ||
            saturation !== undefined
        ) {
            options.toneMapping = {
                mode: "contrast",
                exposure: brightness ?? 1.0,
                contrast: contrast ?? 1.0,
                saturation: saturation ?? 1.0,
                ...(options.toneMapping || {}),
            };
        }

        await ditherImage(sourceCanvas, destCanvas, options);

        const out = fs.createWriteStream(dest);
        const stream = destCanvas.createPNGStream();
        stream.pipe(out);

        await new Promise((resolve, reject) => {
            out.on("finish", resolve);
            out.on("error", reject);
        });
        console.log(`Successfully converted ${src} to ${dest}`);
    } catch (e) {
        console.error("Conversion failed:", e.stack || e.message);
        process.exit(1);
    }
}

main();
