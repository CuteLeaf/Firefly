import { execFile } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { promisify } from "node:util";
import { removeFileExtension, url } from "./url-utils";

const execFileAsync = promisify(execFile);

export type TypstCompileOptions = {
	typstRelativePath: string;
	entryFilePath?: string;
	entryId: string;
};

export type TypstPdfResult = {
	pdfUrl: string | null;
	outputPath: string;
	error?: string;
};

export async function compileTypstToPdf(
	options: TypstCompileOptions,
): Promise<TypstPdfResult> {
	const { typstRelativePath, entryFilePath = "", entryId } = options;
	const projectRoot = process.cwd();
	const entryDir = entryFilePath
		? path.dirname(path.join(projectRoot, entryFilePath))
		: projectRoot;
	const typstFile = path.isAbsolute(typstRelativePath)
		? typstRelativePath
		: path.resolve(entryDir, typstRelativePath);

	const exists = await fs.promises
		.stat(typstFile)
		.then((stats) => stats)
		.catch(() => null);
	if (!exists) {
		return {
			pdfUrl: null,
			outputPath: "",
			error: `Typst file not found: ${typstFile}`,
		};
	}

	const baseName = path.basename(typstFile, path.extname(typstFile));
	const safeSlug = removeFileExtension(entryId).replace(/[\\/]+/g, "-");
	const outputDir = path.join(projectRoot, "public", "typst", safeSlug);
	const outputPath = path.join(outputDir, `${baseName}.pdf`);
	const publicUrl = url(`/typst/${safeSlug}/${baseName}.pdf`);

	await fs.promises.mkdir(outputDir, { recursive: true });

	const outputStat = await fs.promises
		.stat(outputPath)
		.catch(() => null as fs.Stats | null);
	const inputMtime = exists.mtimeMs;
	const outputMtime = outputStat?.mtimeMs ?? 0;

	let errorMessage: string | undefined;
	if (outputMtime < inputMtime) {
		try {
			await execFileAsync("typst", [
				"compile",
				typstFile,
				outputPath,
				"--format",
				"pdf",
			]);
		} catch (error) {
			const typedError = error as NodeJS.ErrnoException & {
				stderr?: string;
				stdout?: string;
			};
			if (typedError.code === "ENOENT") {
				errorMessage =
					"Typst CLI not found. Install it and ensure it is on your PATH.";
			} else {
				const stderr = typedError.stderr || typedError.message;
				errorMessage = `Typst compile failed: ${stderr}`;
			}
		}
	}

	const finalExists = await fs.promises
		.stat(outputPath)
		.catch(() => null as fs.Stats | null);

	return {
		pdfUrl: finalExists ? publicUrl : null,
		outputPath,
		error: errorMessage,
	};
}
