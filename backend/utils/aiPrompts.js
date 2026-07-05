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
    You are an ATS (Applicant Tracking System) expert. 
    Find important keywords and phrases from the job description that are missing from the resume.
    
    Very important rules:
    - Return ONLY the JSON object, nothing else
    - No markdown, no backticks, no explanation text
    - Focus on exact phrases ATS systems look for, not just skills
    - Include soft skills phrases, technical terms, and industry keywords
    
    Job Title: ${jobTitle}
    
    Resume Text: ${resumeText}
    
    Job Description: ${jobDescription}
    
    Return exactly this structure:
    {
      "missingKeywords": [
        {
          "keyword": "exact phrase to add",
          "reason": "why this keyword matters for ATS"
        }
      ],
      "coveragePercentage": 75
    }
  `;
};



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

module.exports = {
  generateParsingPrompt,generateSkillsGapPrompt,generateATSKeywordsPrompt,
  generateGeneralATSPrompt,generateShortlistPrompt
};