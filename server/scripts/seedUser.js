const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');
require('dotenv').config();

const seedUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Post.deleteMany({});
    console.log('Cleared existing data');

    // Create demo users with professional profiles
    const demoUsers = [
      {
        name: 'John Doe',
        email: 'demo@linkedin.com',
        password: 'demo123',
        bio: 'Software Engineer at TechCorp | Full-Stack Developer with 5+ years of experience in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev'
      },
      {
        name: 'Sarah Johnson',
        email: 'sarah@techstartup.com',
        password: 'password123',
        bio: 'Product Manager at InnovateTech | Building the Future of AI. Former consultant at McKinsey. MBA from Stanford. Passionate about user-centric design and data-driven decision making.',
        location: 'New York, NY',
        website: 'https://sarahjohnson.com'
      },
      {
        name: 'Mike Chen',
        email: 'mike@datainsights.com',
        password: 'password123',
        bio: 'Senior Data Scientist | Machine Learning Expert | PhD in Computer Science from Stanford. Specializing in recommendation systems and natural language processing.',
        location: 'Seattle, WA',
        website: 'https://mikechen.ai'
      },
      {
        name: 'Lisa Williams',
        email: 'lisa@creativeagency.com',
        password: 'password123',
        bio: 'Senior UX Designer | Design Systems Lead | 8+ years creating inclusive and accessible digital experiences. Currently leading design systems at a Fortune 500 company.',
        location: 'Austin, TX',
        website: 'https://lisawilliams.design'
      }
    ];

    const savedUsers = [];
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      savedUsers.push(user);
      console.log(`Created user: ${userData.name}`);
    }

    // Create LinkedIn-style demo posts
    const demoPosts = [
      {
        content: "🚀 Excited to share that our team just shipped a major feature that reduces API response time by 40%! \n\nKey improvements:\n✅ Optimized database queries\n✅ Implemented Redis caching\n✅ Refactored critical endpoints\n\nThe impact on user experience has been incredible. Sometimes the best features are the ones users never notice - they just work faster and better.\n\n#SoftwareEngineering #Performance #TechLeadership #WebDevelopment",
        author: savedUsers[0]._id
      },
      {
        content: "Just wrapped up an incredible user research session for our upcoming AI-powered feature 🤖\n\n5 key insights that completely changed our product direction:\n1️⃣ Users want transparency in AI decisions\n2️⃣ Customization > Automation for power users\n3️⃣ Trust is built through consistent, predictable results\n4️⃣ Progressive disclosure reduces cognitive overload\n5️⃣ Error states need clear recovery paths\n\nReminder: Build WITH your users, not FOR them. Their feedback is pure gold! 💡\n\n#ProductManagement #UserResearch #AI #UXDesign #CustomerFirst",
        author: savedUsers[1]._id
      },
      {
        content: "📊 Fascinating analysis from our latest A/B test results!\n\nWe tested 3 different recommendation algorithms on our e-commerce platform:\n\n🔍 Collaborative Filtering: +12% CTR\n🧠 Deep Learning Model: +18% CTR  \n🔥 Hybrid Approach: +25% CTR\n\nThe hybrid model combining collaborative filtering with content-based features delivered the best results. But here's the kicker - it also improved user satisfaction scores by 15%!\n\nData science isn't just about accuracy metrics. It's about creating real value for users.\n\n#DataScience #MachineLearning #ABTesting #RecommendationSystems #Python",
        author: savedUsers[2]._id
      },
      {
        content: "🎨 Design System Update: We just released v3.0 of our component library!\n\nWhat's new:\n• 50+ accessible components with WCAG 2.1 compliance\n• Dark mode support across all elements\n• Figma tokens that sync directly with our CSS variables\n• Comprehensive documentation with live examples\n• Mobile-first responsive patterns\n\nThe best part? Our engineering team can now build consistent UIs 3x faster, and our design-to-development handoff is seamless.\n\nDesign systems aren't just about pretty components - they're about scaling good design decisions across teams.\n\n#DesignSystems #UXDesign #Accessibility #DesignOps #UserExperience",
        author: savedUsers[3]._id
      },
      {
        content: "💭 Weekend reflection: Why code reviews are actually about more than just code...\n\nAfter 5 years of leading engineering teams, I've learned that the best code reviews:\n\n✨ Share knowledge and best practices\n✨ Build team culture and mentorship\n✨ Catch edge cases before they become bugs\n✨ Ensure consistency across the codebase\n✨ Create learning opportunities for everyone\n\nIt's not about finding faults - it's about collective code ownership and continuous improvement.\n\nWhat's your best code review tip? Drop it in the comments! 👇\n\n#CodeReview #SoftwareEngineering #TeamLeadership #BestPractices #ContinuousImprovement",
        author: savedUsers[0]._id
      },
      {
        content: "🌟 Celebrating our amazing UX team today!\n\nWe just completed the most comprehensive user journey mapping exercise I've ever been part of. Over 6 weeks, we:\n\n→ Interviewed 50+ users across 5 personas\n→ Mapped 12 different user journeys\n→ Identified 25+ pain points and opportunities\n→ Created actionable insights for Q4 roadmap\n\nThe result? A clear vision for improving user satisfaction by 30% and reducing support tickets by 40%.\n\nGreat UX isn't accidental - it's the result of deep empathy, rigorous research, and cross-functional collaboration.\n\n#UXResearch #UserJourney #CustomerExperience #ProductStrategy #DesignThinking",
        author: savedUsers[3]._id
      }
    ];

    for (const postData of demoPosts) {
      // Create posts with random timestamps within the last 7 days
      const post = new Post({
        ...postData,
        createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000)
      });
      await post.save();
      console.log('Demo post created:', post.content.substring(0, 50) + '...');
    }

    console.log('\n✅ Demo data seeded successfully!');
    console.log('\nLogin credentials:');
    console.log('Email: demo@linkedin.com');
    console.log('Password: demo123');
    console.log('\nOther test accounts:');
    console.log('sarah@techstartup.com / password123');
    console.log('mike@datainsights.com / password123');
    console.log('lisa@creativeagency.com / password123');
    
  } catch (error) {
    console.error('Error seeding demo user:', error);
  } finally {
    mongoose.connection.close();
  }
};

// Run the seed function
seedUser();
