const axios = require('axios');
const fetchFromJSearch = async (skills, location) => {
  try {
    console.log('Fetching jobs from JSearch...');
    const query = skills.slice(0, 3).join(' ') + ' developer';
    const response = await axios.get(
      'https://jsearch.p.rapidapi.com/search',
      {
        params: {
          query: query,
          page: '1',
          num_pages: '1',
          country: 'in',
          date_posted: 'all'
        },
        headers: {
          'x-rapidapi-key': process.env.RAPIDAPI_KEY,
          'x-rapidapi-host': 'jsearch.p.rapidapi.com',
          'Accept': 'application/json'
        }
      }
    );

    console.log('JSearch status:', response.status);
    console.log('JSearch data keys:', Object.keys(response.data || {}));
    let rawJobs = [];
    if (response.data && Array.isArray(response.data.data)) {
      rawJobs = response.data.data;
    } else {
      console.log('JSearch unexpected format:', JSON.stringify(response.data).slice(0, 200));
      return [];
    }

    const jobs = rawJobs.map(job => ({
      title: job.job_title || '',
      company: job.employer_name || '',
      description: job.job_description || '',
      location: job.job_city || job.job_country || 'Remote',
      requirements: job.job_required_skills || [],
      applyLink: job.job_apply_link || '',
      source: 'JSearch',
      sourceId: job.job_id || ''
    }));
    console.log(`JSearch returned ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.log('JSearch error status:', error.response?.status);
    console.log('JSearch error message:', error.message);
    console.log('JSearch error data:', JSON.stringify(error.response?.data || {}).slice(0, 300));
    return [];
  }
};;


const fetchFromAdzuna = async (skills) => {
  try {
    console.log('Fetching jobs from Adzuna...');
    const query = skills.slice(0, 3).join(' ');
    const response = await axios.get(
      'https://api.adzuna.com/v1/api/jobs/gb/search/1',
      {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          what: query,
          results_per_page: 20
        }
      }
    );

    const jobs = response.data.results.map(job => ({
      title: job.title || '',
      company: job.company?.display_name || '',
      description: job.description || '',
      location: job.location?.display_name || 'Remote',
      requirements: [],
      applyLink: job.redirect_url || '',
      source: 'Adzuna',
      sourceId: job.id?.toString() || ''
    }));

    console.log(`Adzuna returned ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.log('Adzuna error status:', error.response?.status);
    console.log('Adzuna error message:', error.message);
    return [];
  }
};

const fetchFromRemoteOK = async (skills) => {
  try {
    console.log('Fetching jobs from RemoteOK...');
    const response = await axios.get(
      'https://remoteok.com/api',
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json'
        },
        timeout: 15000
      }
    );

    const rawData = response.data;
    if (!Array.isArray(rawData) || rawData.length < 2) {
      console.log('RemoteOK returned empty or invalid data');
      return [];
    }
    const jobsRaw = rawData.slice(1);
    const skillsLower = skills.map(s => s.toLowerCase());

    const jobs = jobsRaw
      .filter(job => {
        if (!job.position || !job.company) return false;
        const tags = (job.tags || []).map(t => t.toLowerCase());
        return tags.some(tag => skillsLower.some(skill => tag.includes(skill)));
      })
      .slice(0, 20) 
      .map(job => ({
        title: job.position || '',
        company: job.company || '',
        description: job.description || '',
        location: 'Remote',
        requirements: Array.isArray(job.tags) ? job.tags : [],
        applyLink: job.url || '',
        source: 'RemoteOK',
        sourceId: job.id?.toString() || ''
      }));
    console.log(`RemoteOK returned ${jobs.length} jobs`);
    return jobs;
  } catch (error) {
    console.log('RemoteOK error:', error.message);
    return [];
  }
};

const deduplicateJobs = (allJobs) => {
  const seen = new Set();
  const unique = [];
  for (const job of allJobs) {
    if (!job.title || !job.company) continue;
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
    fetchFromAdzuna(skills),
    fetchFromRemoteOK(skills)
  ]);

  const allJobs = [...jsearchJobs, ...adzunaJobs, ...remoteokJobs];
  const uniqueJobs = deduplicateJobs(allJobs);
  return uniqueJobs;
};

module.exports = { fetchJobsFromAllSources };