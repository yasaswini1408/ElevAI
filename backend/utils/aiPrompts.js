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

module.exports = { generateParsingPrompt };