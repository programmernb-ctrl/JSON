/** @format */
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { LOGGER } from './logger.mjs';

dotenv.config();

const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

async function updateJSON() {
	try {
		const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/commits`, {
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
				Accept: 'application/vnd.github+json',
			},
		});

		if (!response.ok) {
			return;
		}

		const commits = await response.json();
		const lastCommit = commits[0];

		if (!lastCommit) {
			LOGGER.warn("No Commits found in the repository.");
			return;
		}

		const commitInfo = {
			sha: lastCommit.sha,
			updatedAt: lastCommit.commit.author.date,
			commit: lastCommit.commit.message,
			tree: lastCommit.commit.tree
		};

		if (!fs.existsSync('dist')) {
			fs.mkdirSync('dist');
		}

		let data = {};
		if (fs.existsSync('dist/data.json')) {
			data = JSON.parse(fs.readFileSync('dist/data.json', 'utf-8'));
		}

		data.data = commitInfo;

		fs.writeFileSync('dist/data.json', JSON.stringify(data, null, 2));

		LOGGER.info(':: JSON updated with the latest commit information'); // Assuming log method in LOGGER
	} catch (error) {
		LOGGER.error(error.message, ':: Error fetching commit data:');
	}
}

updateJSON();
