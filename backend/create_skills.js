import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function createSkills() {
  try {
    console.log('Creating test skills...');
    
    const skills = [
      { name: 'JavaScript' },
      { name: 'React' },
      { name: 'Node.js' },
      { name: 'Python' },
      { name: 'SQL' },
      { name: 'Project Management' },
      { name: 'UI/UX Design' },
      { name: 'DevOps' },
      { name: 'Machine Learning' },
      { name: 'Mobile Development' },
      { name: 'TypeScript' },
      { name: 'Vue.js' },
      { name: 'Angular' },
      { name: 'PHP' },
      { name: 'Java' },
      { name: 'C++' },
      { name: 'Go' },
      { name: 'Rust' },
      { name: 'Docker' },
      { name: 'Kubernetes' }
    ];

    for (const skill of skills) {
      await prisma.skill.upsert({
        where: { name: skill.name },
        update: skill,
        create: skill
      });
    }

    console.log('✅ Test skills created successfully!');
  } catch (error) {
    console.error('❌ Error creating skills:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createSkills();
