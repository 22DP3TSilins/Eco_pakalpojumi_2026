import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./eco_pakalpojumi.db');

db.serialize(() => {
  // Insert challenges
  const challenges = [
    { title: 'Zero Waste Week', description: 'Go one week without producing any waste.', reward: '10% discount on next purchase' },
    { title: 'Bike to Work', description: 'Bike to work for 5 days this week.', reward: 'Free eco-bag' },
    { title: 'Plant a Tree', description: 'Plant a tree in your community.', reward: 'Virtual badge' }
  ];

  const stmt1 = db.prepare('INSERT INTO challenges (title, description, reward) VALUES (?, ?, ?)');
  challenges.forEach(challenge => {
    stmt1.run(challenge.title, challenge.description, challenge.reward);
  });
  stmt1.finalize();

  // Insert education posts
  const posts = [
    { title: 'The Importance of Recycling', content: 'Recycling helps reduce waste and conserve resources...', type: 'Article', date: '2024-01-01' },
    { title: 'Renewable Energy Basics', content: 'Learn about solar, wind, and other renewable sources...', type: 'Guide', date: '2024-01-02' },
    { title: 'Sustainable Living Tips', content: 'Simple ways to live more sustainably every day.', type: 'Tips', date: '2024-01-03' }
  ];

  const stmt2 = db.prepare('INSERT INTO education_posts (title, content, type, date) VALUES (?, ?, ?, ?)');
  posts.forEach(post => {
    stmt2.run(post.title, post.content, post.type, post.date);
  });
  stmt2.finalize();

  console.log('Sample challenges and education posts inserted');
});

db.close();