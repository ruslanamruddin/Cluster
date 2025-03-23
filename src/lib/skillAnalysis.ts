
import { Skill } from '@/components/ProfileCard';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// This is a mock implementation that would be replaced with actual AI API call
export const analyzeSkills = async (
  resumeText: string,
  linkedInUrl: string,
  additionalInfo: string
): Promise<Skill[]> => {
  console.log('Analyzing skills from provided information');
  console.log('Resume text length:', resumeText.length);
  console.log('LinkedIn URL:', linkedInUrl);
  console.log('Additional info:', additionalInfo);
  
  // Simulate API call delay
  await sleep(2000);
  
  // For demo purposes, we'll generate some skills based on the input
  // In a real implementation, this would call an AI service
  const mockSkills: Skill[] = [];
  
  // More comprehensive skill categories
  const progLanguages = [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C#', 'C++', 'Go', 
    'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'Dart', 'Scala'
  ];
  
  const webTech = [
    'React', 'Angular', 'Vue', 'Next.js', 'Node.js', 'Express', 'Django', 
    'Flask', 'Rails', 'GraphQL', 'REST APIs', 'Redux', 'CSS', 'HTML', 
    'Sass', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'WebSockets'
  ];
  
  const dataScience = [
    'Machine Learning', 'Deep Learning', 'Data Analysis', 'TensorFlow', 
    'PyTorch', 'Pandas', 'NumPy', 'R', 'Data Visualization', 'SQL', 
    'Statistics', 'Computer Vision', 'NLP', 'Jupyter', 'Big Data'
  ];
  
  const devOps = [
    'Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Azure', 'GCP', 'Terraform', 
    'Jenkins', 'GitLab CI', 'GitHub Actions', 'Linux', 'Bash', 'Monitoring'
  ];
  
  const design = [
    'UI Design', 'UX Design', 'Figma', 'Sketch', 'Adobe XD', 'Photoshop', 
    'Illustrator', 'Wireframing', 'Prototyping', 'User Research', 'Accessibility'
  ];
  
  const mobile = [
    'iOS Development', 'Android Development', 'React Native', 'Flutter', 
    'SwiftUI', 'Jetpack Compose', 'Mobile UI Design', 'App Store Optimization'
  ];
  
  const softSkills = [
    'Project Management', 'Team Leadership', 'Communication', 'Problem Solving', 
    'Critical Thinking', 'Agile Methodology', 'Scrum', 'Time Management', 
    'Collaboration', 'Presentation Skills', 'Client Relations'
  ];
  
  const allSkills = [
    ...progLanguages, 
    ...webTech, 
    ...dataScience, 
    ...devOps, 
    ...design, 
    ...mobile, 
    ...softSkills
  ];
  
  // Extract skills that appear in the inputs
  const combinedText = `${resumeText} ${linkedInUrl} ${additionalInfo}`.toLowerCase();
  
  // More sophisticated skill extraction - look for whole words and common variations
  for (const skill of allSkills) {
    const skillLower = skill.toLowerCase();
    const skillRegex = new RegExp(`\\b${skillLower}\\b|\\b${skillLower}[.,-]|${skillLower}\\b`, 'i');
    
    if (skillRegex.test(combinedText)) {
      // Improved skill level determination based on context clues in the text
      let level: Skill['level'] = 'intermediate';
      
      const expertClues = ['expert', 'advanced', 'senior', 'lead', '5+ years', 'extensive experience'];
      const beginnerClues = ['beginner', 'basic', 'learning', 'junior', 'novice', 'entry'];
      
      if (expertClues.some(clue => combinedText.includes(clue) && combinedText.includes(skillLower))) {
        level = 'expert';
      } else if (beginnerClues.some(clue => combinedText.includes(clue) && combinedText.includes(skillLower))) {
        level = 'beginner';
      }
      
      mockSkills.push({
        name: skill,
        level: level
      });
    }
  }
  
  // If no skills were found, provide some default ones
  if (mockSkills.length === 0) {
    mockSkills.push(
      { name: 'JavaScript', level: 'intermediate' },
      { name: 'React', level: 'beginner' },
      { name: 'HTML/CSS', level: 'expert' },
      { name: 'UI/UX Design', level: 'intermediate' },
      { name: 'Communication', level: 'expert' }
    );
  }
  
  console.log('Identified skills:', mockSkills);
  
  return mockSkills;
};

// Helper to group skills by category
export const categorizeSkills = (skills: Skill[]): Record<string, Skill[]> => {
  const categories: Record<string, Skill[]> = {
    'Programming Languages': [],
    'Web Technologies': [],
    'Data Science': [],
    'DevOps': [],
    'Design': [],
    'Mobile': [],
    'Soft Skills': [],
    'Other': []
  };
  
  skills.forEach(skill => {
    const name = skill.name.toLowerCase();
    
    if (['javascript', 'typescript', 'python', 'java', 'c#', 'c++', 'go', 'rust', 'ruby', 'php', 'swift', 'kotlin'].some(lang => name.includes(lang))) {
      categories['Programming Languages'].push(skill);
    } else if (['react', 'angular', 'vue', 'node', 'express', 'django', 'html', 'css', 'tailwind', 'bootstrap'].some(tech => name.includes(tech))) {
      categories['Web Technologies'].push(skill);
    } else if (['machine learning', 'data', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'statistics', 'ai'].some(term => name.includes(term))) {
      categories['Data Science'].push(skill);
    } else if (['docker', 'kubernetes', 'ci/cd', 'aws', 'azure', 'gcp', 'devops'].some(term => name.includes(term))) {
      categories['DevOps'].push(skill);
    } else if (['ui', 'ux', 'design', 'figma', 'sketch', 'adobe', 'photoshop'].some(term => name.includes(term))) {
      categories['Design'].push(skill);
    } else if (['ios', 'android', 'mobile', 'flutter', 'react native'].some(term => name.includes(term))) {
      categories['Mobile'].push(skill);
    } else if (['management', 'leadership', 'communication', 'problem solving', 'agile', 'scrum'].some(term => name.includes(term))) {
      categories['Soft Skills'].push(skill);
    } else {
      categories['Other'].push(skill);
    }
  });
  
  // Remove empty categories
  Object.keys(categories).forEach(key => {
    if (categories[key].length === 0) {
      delete categories[key];
    }
  });
  
  return categories;
};
