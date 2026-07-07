const axios = require('axios');
const fetchFromJSearch = async (skills, location) => {
    try {
        console.log("Fetching jobs from JSearch...");

        const query = `${skills.slice(0, 3).join(" ")} developer`;

        const response = await axios.get(
            "https://jsearch.p.rapidapi.com/search-v2",
            {
                params: {
                    query,
                    num_pages: 1,
                    country: "in",          // India
                    date_posted: "all",
                },
                headers: {
                    "x-rapidapi-key": process.env.RAPIDAPI_KEY,
                    "x-rapidapi-host": "jsearch.p.rapidapi.com",
                    "Content-Type": "application/json",
                },
            }
        );

        // console.log("========== JSEARCH RESPONSE ==========");
        // console.dir(response.data, { depth: null });
        // console.log("======================================");

        const jobs = response.data.data.map((job) => ({
            title: job.job_title || "",
            company: job.employer_name || "",
            description: job.job_description || "",
            location: job.job_city || job.job_country || "Remote",
            requirements: job.job_required_skills || [],
            applyLink: job.job_apply_link || "",
            source: "JSearch",
            sourceId: job.job_id || "",
        }));

        console.log(`JSearch returned ${jobs.length} jobs`);

        return jobs;
    } catch (error) {
        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);
        return [];
    }
};

const fetchFromAdzuna = async (skills, location) => {
    try {
        console.log('Fetching jobs from Adzuna...');
        const query = skills.slice(0, 3).join(' ');
        const country = 'in';
        const response = await axios.get(
            `https://api.adzuna.com/v1/api/jobs/${country}/search/1`,
            {
                params: {
                    app_id: process.env.ADZUNA_APP_ID,
                    app_key: process.env.ADZUNA_APP_KEY,
                    what: query,
                    where: location || 'India',
                    results_per_page: 20,
                    content_type: 'application/json'
                }
            }
        );

        const jobs = response.data.results.map(job => ({
            title: job.title || '',
            company: job.company?.display_name || '',
            description: job.description || '',
            location: job.location?.display_name || 'India',
            requirements: [],
            applyLink: job.redirect_url || '',
            source: 'Adzuna',
            sourceId: job.id || ''
        }));

        console.log(`Adzuna returned ${jobs.length} jobs`);
        return jobs;

    } catch (error) {
        console.log('Adzuna fetch error:', error.message);

        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);


        return [];

    }
};

const fetchFromRemoteOK = async (skills) => {
    try {
        console.log('Fetching jobs from RemoteOK...');
        const tag = skills[0]?.toLowerCase().replace('.', '').replace(' ', '-') || 'dev';
        const response = await axios.get(`https://remoteok.com/api?tag=${tag}`, {
            headers: {
                'User-Agent': 'ElevAI Job Matcher App'
            }
        });

        const jobsRaw = response.data.slice(1);
        const jobs = jobsRaw.map(job => ({
            title: job.position || '',
            company: job.company || '',
            description: job.description || '',
            location: 'Remote',
            requirements: job.tags || [],
            applyLink: job.url || '',
            source: 'RemoteOK',
            sourceId: job.id?.toString() || ''
        }));

        console.log(`RemoteOK returned ${jobs.length} jobs`);
        return jobs;

    } catch (error) {
        console.log('RemoteOK fetch error:', error.message);


        console.log("Status:", error.response?.status);
        console.log("Data:", error.response?.data);
        console.log("Message:", error.message);


        return [];
    }
};

const deduplicateJobs = (allJobs) => {
    const seen = new Set();
    const unique = [];

    for (const job of allJobs) {
        const fingerprint = `${job.title.toLowerCase().trim()}-${job.company.toLowerCase().trim()}`;
        if (!seen.has(fingerprint)) {
            seen.add(fingerprint);
            unique.push(job);
        }
    }

    console.log(`After deduplication: ${unique.length} unique jobs from ${allJobs.length} total`);
    return unique;
};


const fetchJobsFromAllSources = async (skills, location) => {
    const [jsearchJobs, adzunaJobs, remoteokJobs] = await Promise.all([
        fetchFromJSearch(skills, location),
        fetchFromAdzuna(skills, location),
        fetchFromRemoteOK(skills)
    ]);

    const allJobs = [...jsearchJobs, ...adzunaJobs, ...remoteokJobs];
    const uniqueJobs = deduplicateJobs(allJobs);
    return uniqueJobs;
};

module.exports = { fetchJobsFromAllSources };