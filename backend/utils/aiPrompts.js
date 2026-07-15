const generateParsingPrompt = (rawResumeText) => {
  return `
    You are a resume parser. Analyze the resume text below and extract information into JSON format.
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation text
    - If you cannot find information for a field, use an empty array []
    
    Return exactly this structure:
    {
      "skills": ["skill1", "skill2"],
      "experience": [
        {
          "role": "job title here",
          "company": "company name here",
          "duration": "how long they worked"
        }
      ],
      "education": [
        {
          "degree": "degree name here",
          "institution": "college or university name",
          "score": "CGPA or percentage if mentioned"
        }
      ]
    }
    
    Resume Text:
    ${rawResumeText}
  `;
};


const generateSkillsGapPrompt = (resumeSkills, jobRequirements, jobTitle) => {
  return `
    You are a career advisor. Compare the candidate's skills against the job requirements below.
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation text
    - Be smart about matching - "ReactJS" and "React.js" are the same skill
    
    Job Title: ${jobTitle}
    
    Candidate Skills: ${resumeSkills.join(', ')}
    
    Job Requirements: ${jobRequirements.join(', ')}
    
    Return exactly this structure:
    {
      "matched": ["skills that candidate has which job needs"],
      "missing": ["skills job needs but candidate doesnt have"],
      "extra": ["skills candidate has that are not in requirements but still useful"]
    }
  `;
};



const generateATSKeywordsPrompt = (resumeText, jobDescription, jobTitle) => {
  return `
    You are an expert ATS (Applicant Tracking System) analyst.
    
    Your job is to carefully compare the resume text against the job description and find SPECIFIC keywords and phrases that:
    1. Appear in the job description as requirements
    2. Are completely absent from the resume text
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation
    - Be very specific — only list keywords that are genuinely missing
    - Do not list skills the candidate already has
    - Focus on exact phrases ATS systems match on
    - The coveragePercentage should reflect how many of the job's key requirements are already in the resume
    
    Job Title: ${jobTitle}
    
    Job Description:
    ${jobDescription}
    
    Resume Text:
    ${resumeText}
    
    Return exactly this structure:
    {
      "missingKeywords": [
        {
          "keyword": "exact phrase missing from resume",
          "reason": "why this specific keyword matters for this job"
        }
      ],
      "coveragePercentage": 75
    }
  `
}



const generateGeneralATSPrompt = (resumeText, targetRole) => {
  return `
    You are an ATS expert. Analyze this resume for a ${targetRole} role.
    Find common ATS keywords that are missing from this resume.
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation text
    
    Resume Text: ${resumeText}
    
    Return exactly this structure:
    {
      "missingKeywords": [
        {
          "keyword": "exact phrase to add",
          "reason": "why this keyword matters for ATS"
        }
      ],
      "coveragePercentage": 65
    }
  `;
};



const generateShortlistPrompt = (matchPercentage, missingSkills, jobTitle, yearsRequired) => {
  return `
    You are a hiring expert. Based on the data below, estimate how likely this candidate is to get shortlisted.
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation text
    - Be honest and realistic in your assessment
    - This is just an estimate, not a guarantee
    
    Job Title: ${jobTitle}
    Semantic Match Score: ${matchPercentage}%
    Missing Required Skills: ${missingSkills.join(', ') || 'None'}
    Experience Required: ${yearsRequired || 'Not specified'}
    
    Return exactly this structure:
    {
      "likelihood": "High",
      "reasoning": "one sentence explaining why"
    }
    
    Rules for likelihood:
    - High: match above 75% and less than 2 missing critical skills
    - Medium: match between 50-75% or 2-3 missing skills
    - Low: match below 50% or more than 3 missing critical skills
  `;
};


const generateCoverLetterPrompt = (resumeData, jobTitle, company, jobDescription) => {
  return `
    You are a professional cover letter writer. Write a cover letter for this candidate.
    
    Very important rules:
    - Return ONLY the cover letter text, nothing else
    - No markdown, no backticks
    - Keep it to 3 paragraphs
    - Make it sound human and genuine, not robotic
    - Use the candidate's actual experience and skills
    
    Candidate Skills: ${resumeData.skills.join(', ')}
    
    Candidate Experience: ${JSON.stringify(resumeData.experience)}
    
    Candidate Education: ${JSON.stringify(resumeData.education)}
    
    Job Title: ${jobTitle}
    Company: ${company}
    Job Description: ${jobDescription}
  `;
};


const generateExperienceLevelPrompt = (resumeText, experience) => {
  return `
    You are a resume analyst. Based on the resume text and experience below, classify this candidate.
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation
    
    Experience entries: ${JSON.stringify(experience)}
    
    Resume Text: ${resumeText.substring(0, 3000)}
    
    Return exactly this structure:
    {
      "level": "fresher",
      "totalMonths": 0,
      "reasoning": "one line explanation"
    }
    
    Rules for level:
    - "fresher" = student, no work experience, only internships under 6 months
    - "junior" = 6 months to 2 years of work experience
    - "experienced" = more than 2 years of work experience
    
    Be accurate — look at actual job durations not just number of entries.
  `
}


module.exports = {
  generateParsingPrompt,generateSkillsGapPrompt,generateATSKeywordsPrompt,
  generateGeneralATSPrompt,generateShortlistPrompt,generateCoverLetterPrompt,generateExperienceLevelPrompt
};