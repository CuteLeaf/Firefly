/* This is a script to create a new post markdown file with front-matter */

import fs from "fs"
import path from "path"
import { pinyin } from "pinyin-pro"

function getDate() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, "0")
  const day = String(today.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

const args = process.argv.slice(2)

if (args.length === 0) {
  console.error(`Error: No filename argument provided
Usage: npm run new-post -- <filename>`)
  process.exit(1) // Terminate the script and return error code 1
}

let fileName = args[0]

// Add .md extension if not present
const fileExtensionRegex = /\.(md|mdx)$/i
if (!fileExtensionRegex.test(fileName)) {
  fileName += ".md"
}

const targetDir = "./src/content/posts/"
const fullPath = path.join(targetDir, fileName)

// Generate slug from filename: strip extension, strip trailing /index
let slug = fileName.replace(fileExtensionRegex, "")
if (slug.endsWith("/index")) {
  slug = slug.slice(0, -"/index".length)
}

// Convert Chinese characters to pinyin, keep other chars as-is
slug = slug
  .split("/")
  .map((segment) => {
    if (!/[一-鿿]/.test(segment)) return segment
    // Process character by character: Chinese → pinyin, others → keep
    const chars = [...segment]
    const parts = []
    let buf = ""
    for (const ch of chars) {
      if (/[一-鿿]/.test(ch)) {
        if (buf) { parts.push(buf); buf = "" }
        parts.push(pinyin(ch, { toneType: "none", type: "array" })[0])
      } else {
        buf += ch
      }
    }
    if (buf) parts.push(buf)
    return parts
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
  })
  .join("/")

if (fs.existsSync(fullPath)) {
  console.error(`Error: File ${fullPath} already exists `)
  process.exit(1)
}

// recursive mode creates multi-level directories
const dirPath = path.dirname(fullPath)
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
}

const content = `---
title: ${args[0]}
published: ${getDate()}
description: ''
image: ''
tags: []
category: ''
draft: false
lang: ''
slug: ${slug}
---
`

fs.writeFileSync(path.join(targetDir, fileName), content)

console.log(`Post ${fullPath} created`)
