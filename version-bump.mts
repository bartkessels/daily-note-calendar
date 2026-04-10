import {readFileSync, writeFileSync} from "fs";

const targetVersion = process.env.npm_package_version;

if (!targetVersion) {
	throw new Error("npm_package_version environment variable is not set");
}

// Read minAppVersion from manifest.json and bump version to target version
interface Manifest {
	version: string;
	minAppVersion: string;
	id: string;
	name: string;
	description: string;
	author: string;
	authorUrl: string;
	isDesktopOnly: boolean;
}

const manifest: Manifest = JSON.parse(readFileSync("manifest.json", "utf8"));
const { minAppVersion } = manifest;
manifest.version = targetVersion;
writeFileSync("manifest.json", JSON.stringify(manifest, null, "\t"));

// Update versions.json with target version and minAppVersion from manifest.json
interface Versions {
	[version: string]: string;
}

const versions: Versions = JSON.parse(readFileSync("versions.json", "utf8"));
versions[targetVersion] = minAppVersion;
writeFileSync("versions.json", JSON.stringify(versions, null, "\t"));
