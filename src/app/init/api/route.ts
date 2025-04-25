// pages/init/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { User } from '@/models/user';
import { Task } from '@/models/task';
import { SkillTracker } from '@/models/skillTracker';
import dbConnect from '@/lib/dbConnect';
import { faker } from '@faker-js/faker';

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Create one user with skills
    const skills = Array.from({ length: 6 }, () => faker.lorem.word());
    const user = await User.create({
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: 'hashedpassword',
      currentRole: faker.person.jobTitle(),
      purpose: ['Learning', 'Development'],
      skillTracker: [], // Initialize as empty
      badges: ['Beginner'],
    });

    // Create tasks for each skill
    const allTasks = [];
    for (const skill of skills) {
      const tasks = await Task.insertMany(
        Array.from({ length: 20 }, () => ({
          skill,
          topic: faker.lorem.words(3),
          level: faker.helpers.arrayElement(['beginner', 'intermediate', 'advanced']),
          difficulty: faker.helpers.arrayElement(['easy', 'medium', 'hard']),
          content: faker.lorem.sentence(),
          task: faker.lorem.sentence(),
          links: [],
          createdAt: faker.date.between({ from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), to: new Date() }),
        }))
      );
      allTasks.push(...tasks);
    }

    console.log(`✅ Created ${allTasks.length} tasks`);

    // Create skill trackers
    const skillTrackerIds = [];
    for (const skill of skills) {
      const skillTasks = allTasks.filter(task => task.skill === skill);

      const tasksDone = Array.from({ length: 100 }, () => {
        const task = faker.helpers.arrayElement(skillTasks);
        const startTime = faker.date.between({ from: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000), to: new Date() });
        const endTime = faker.date.between({ from: startTime, to: new Date() }); // Ensure endTime is after startTime

        return {
          topic: task.topic,
          taskId: task._id,
          startTime,
          endTime,
          feedback: faker.lorem.sentence(),
          rating: faker.number.int({ min: 1, max: 5 }),
        };
      });

      const skillTracker = await SkillTracker.create({
        userId: user._id,
        skill,
        tasksDone,
        testsTaken: [],
        progress: faker.number.int({ min: 0, max: 100 }),
      });

      skillTrackerIds.push(skillTracker._id);
    }

    // Update user with skillTracker ObjectIDs
    await User.findByIdAndUpdate(user._id, { skillTracker: skillTrackerIds });

    console.log(`✅ Linked ${skillTrackerIds.length} SkillTrackers to user ${user.email}`);

    return NextResponse.json({
      message: 'Data initialized successfully',
      user,
      skillTrackers: skillTrackerIds,
      tasks: allTasks,
    });

  } catch (error) {
    console.error('❌ Error initializing data:', error);
    return NextResponse.json({ message: 'Error initializing data', error }, { status: 500 });
  }
}
