import { habitService } from './src/main/services/habit.service';

async function test() {
  try {
    const habit = await habitService.createHabit({
      name: 'Test Habit',
      category: 'BODY',
      color: '#6366f1',
      icon: 'star',
      frequency: 'DAILY'
    });
    console.log('Success:', habit);
  } catch (err) {
    console.error('Error:', err);
  }
}

test();
