/** @format */

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import axios from 'axios';

import { LOGGER } from './logger.mjs';

dotenv.config();

const REPO_OWNER = process.env.REPO_OWNER;
const REPO_NAME = process.env.REPO_NAME;

const BASE_URL = 'https://api.github.com';

async function updateJSON() {
	try {
		const response = await axios.get(`${BASE_URL}/repos/${REPO_OWNER}/${REPO_NAME}/commits`, {
			headers: {
				'X-GitHub-Api-Version': '2022-11-28',
				Accept: 'application/vnd.github+json',
			},
		});

		const lastCommit = response.data[0];
		const commitInfo = {
			sha: lastCommit.sha,
			updatedAt: lastCommit.commit.author.date,
		};

		const data = JSON.parse(fs.readFileSync('dist/data.json', 'utf-8')); // Ensuring it's never null

		data.data = commitInfo;

		fs.writeFileSync('dist/data.json', JSON.stringify(data, null, 2));

		LOGGER.info(':: JSON updated with the latest commit information'); // Assuming log method in LOGGER
	} catch (error) {
		LOGGER.error(error.message, ':: Error fetching commit data:');
	}
}

updateJSON();
