
import { UserProfile } from '@/components/ProfileCard';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedHours: number;
}

// This is a mock implementation that would be replaced with actual AI API call
export const delegateTasks = async (
  projectIdea: string,
  teamMembers: UserProfile[]
): Promise<Task[]> => {
  console.log('Delegating tasks based on project idea and team members');
  console.log('Project idea:', projectIdea);
  console.log('Team members:', teamMembers.map(m => m.name));
  
  // Simulate API call delay
  await sleep(2500);
  
  // For demo purposes, we'll generate tasks based on common hackathon project patterns
  // In a real implementation, this would call an AI service
  const tasks: Task[] = [];
  
  // Generate a unique ID
  const generateId = () => Math.random().toString(36).substring(2, 11);
  
  // Simple algorithm to match skills to tasks
  const assignTaskToMember = (taskType: string): string => {
    // Find the best match based on skills
    for (const member of teamMembers) {
      const hasMatchingSkill = member.skills.some(skill => 
        taskType.toLowerCase().includes(skill.name.toLowerCase())
      );
      
      if (hasMatchingSkill) {
        return member.id;
      }
    }
    
    // If no match found, assign randomly
    return teamMembers[Math.floor(Math.random() * teamMembers.length)].id;
  };
  
  // Common task types for hackathon projects
  const frontendTasks = [
    {
      title: 'Design UI wireframes',
      description: 'Create wireframes for all main screens using Figma or similar tool.',
      difficulty: 'medium' as const,
      estimatedHours: 4
    },
    {
      title: 'Implement landing page',
      description: 'Develop the main landing page with responsive design.',
      difficulty: 'medium' as const,
      estimatedHours: 5
    },
    {
      title: 'Build user authentication UI',
      description: 'Create login, registration, and profile forms with validation.',
      difficulty: 'medium' as const,
      estimatedHours: 3
    },
    {
      title: 'Create component library',
      description: 'Build reusable UI components following design system principles.',
      difficulty: 'hard' as const,
      estimatedHours: 6
    }
  ];
  
  const backendTasks = [
    {
      title: 'Set up database schema',
      description: 'Design and implement the database structure for the application.',
      difficulty: 'medium' as const,
      estimatedHours: 3
    },
    {
      title: 'Implement user authentication API',
      description: 'Create endpoints for user registration, login, and profile management.',
      difficulty: 'hard' as const,
      estimatedHours: 5
    },
    {
      title: 'Build API endpoints',
      description: 'Develop RESTful API endpoints for the core functionality.',
      difficulty: 'hard' as const,
      estimatedHours: 6
    },
    {
      title: 'Integration with external services',
      description: 'Connect the application with necessary third-party APIs.',
      difficulty: 'medium' as const,
      estimatedHours: 4
    }
  ];
  
  const aiMlTasks = [
    {
      title: 'Train classification model',
      description: 'Develop and train a machine learning model for data classification.',
      difficulty: 'hard' as const,
      estimatedHours: 8
    },
    {
      title: 'Build recommendation system',
      description: 'Implement an algorithm for personalized recommendations.',
      difficulty: 'hard' as const,
      estimatedHours: 7
    },
    {
      title: 'Data preprocessing pipeline',
      description: 'Create scripts to clean and prepare data for analysis.',
      difficulty: 'medium' as const,
      estimatedHours: 4
    }
  ];
  
  const projectManagementTasks = [
    {
      title: 'Create project documentation',
      description: 'Document the project, including setup instructions and API docs.',
      difficulty: 'easy' as const,
      estimatedHours: 3
    },
    {
      title: 'Prepare demo presentation',
      description: 'Create slides and script for the final project presentation.',
      difficulty: 'easy' as const,
      estimatedHours: 2
    }
  ];
  
  // Determine which task types to include based on the project idea
  const shouldIncludeAiMl = projectIdea.toLowerCase().includes('ai') || 
                            projectIdea.toLowerCase().includes('machine learning') ||
                            projectIdea.toLowerCase().includes('data');
  
  // Add frontend tasks
  frontendTasks.forEach(task => {
    tasks.push({
      id: generateId(),
      title: task.title,
      description: task.description,
      assignedTo: assignTaskToMember('frontend UI React Angular Vue JavaScript TypeScript HTML CSS'),
      difficulty: task.difficulty,
      estimatedHours: task.estimatedHours
    });
  });
  
  // Add backend tasks
  backendTasks.forEach(task => {
    tasks.push({
      id: generateId(),
      title: task.title,
      description: task.description,
      assignedTo: assignTaskToMember('backend API database Node.js Express Django Python Java'),
      difficulty: task.difficulty,
      estimatedHours: task.estimatedHours
    });
  });
  
  // Add AI/ML tasks if applicable
  if (shouldIncludeAiMl) {
    aiMlTasks.forEach(task => {
      tasks.push({
        id: generateId(),
        title: task.title,
        description: task.description,
        assignedTo: assignTaskToMember('machine learning AI data science Python TensorFlow PyTorch'),
        difficulty: task.difficulty,
        estimatedHours: task.estimatedHours
      });
    });
  }
  
  // Add project management tasks
  projectManagementTasks.forEach(task => {
    tasks.push({
      id: generateId(),
      title: task.title,
      description: task.description,
      assignedTo: assignTaskToMember('project management documentation presentation communication'),
      difficulty: task.difficulty,
      estimatedHours: task.estimatedHours
    });
  });
  
  // Add some custom tasks based on project idea keywords
  if (projectIdea.toLowerCase().includes('mobile')) {
    tasks.push({
      id: generateId(),
      title: 'Implement responsive mobile design',
      description: 'Ensure the application works well on all mobile devices and screen sizes.',
      assignedTo: assignTaskToMember('mobile UI responsive React Native Flutter'),
      difficulty: 'medium',
      estimatedHours: 5
    });
  }
  
  if (projectIdea.toLowerCase().includes('chat') || projectIdea.toLowerCase().includes('message')) {
    tasks.push({
      id: generateId(),
      title: 'Build real-time chat functionality',
      description: 'Implement a real-time messaging system using WebSockets.',
      assignedTo: assignTaskToMember('websocket chat real-time Socket.io'),
      difficulty: 'hard',
      estimatedHours: 7
    });
  }
  
  if (projectIdea.toLowerCase().includes('payment') || projectIdea.toLowerCase().includes('e-commerce')) {
    tasks.push({
      id: generateId(),
      title: 'Integrate payment gateway',
      description: 'Set up and test payment processing with Stripe or similar service.',
      assignedTo: assignTaskToMember('payment API Stripe e-commerce'),
      difficulty: 'hard',
      estimatedHours: 6
    });
  }
  
  console.log('Generated tasks:', tasks);
  
  return tasks;
};

// In a real implementation, this would call an AI API like OpenAI
// export const delegateTasks = async (
//   projectIdea: string,
//   teamMembers: UserProfile[]
// ): Promise<Task[]> => {
//   try {
//     const response = await fetch('/api/delegate-tasks', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({
//         projectIdea,
//         teamMembers
//       }),
//     });
//
//     if (!response.ok) {
//       throw new Error('Failed to delegate tasks');
//     }
//
//     const data = await response.json();
//     return data.tasks;
//   } catch (error) {
//     console.error('Error delegating tasks:', error);
//     throw error;
//   }
// };
