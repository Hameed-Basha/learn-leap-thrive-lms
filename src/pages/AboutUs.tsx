
import { PageContainer } from '@/components/Layout/PageContainer';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

const AboutUs = () => {
  // Team data
  const team = [
    {
      name: 'Sarah Johnson',
      role: 'Founder & CEO',
      bio: 'Former professor with 15+ years in education technology. Passionate about making quality education accessible to everyone.',
      avatar: '/images/team/sarah.jpg',
    },
    {
      name: 'David Chen',
      role: 'Head of Technology',
      bio: 'Expert in EdTech with experience at leading learning platforms. Focused on creating intuitive and powerful learning tools.',
      avatar: '/images/team/david.jpg',
    },
    {
      name: 'Maria Rodriguez',
      role: 'Education Director',
      bio: 'With a Ph.D. in Educational Psychology, Maria ensures our learning methodologies are effective and engaging.',
      avatar: '/images/team/maria.jpg',
    },
    {
      name: 'James Wilson',
      role: 'UX/UI Designer',
      bio: 'Award-winning designer focused on creating beautiful and accessible learning experiences for all users.',
      avatar: '/images/team/james.jpg',
    },
  ];

  return (
    <PageContainer title="About Us" withSidebar={false}>
      <div className="max-w-4xl mx-auto">
        {/* Mission Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-6 text-center">Our Mission</h2>
          <p className="text-lg mb-6 text-gray-700">
            At LearnLeap, we believe that everyone deserves access to quality education. Our mission is to empower individuals to reach their full potential through accessible, engaging, and effective online learning experiences.
          </p>
          <p className="text-lg mb-6 text-gray-700">
            We strive to break down barriers to education by providing a platform where learners can connect with expert instructors, engage with interactive content, and track their progress every step of the way.
          </p>
          <div className="aspect-video overflow-hidden rounded-xl mt-8">
            <img
              src="/images/about-mission.jpg"
              alt="Students learning together"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-6 text-center">Our Story</h2>
          <p className="text-lg mb-6 text-gray-700">
            LearnLeap was founded in 2022 by Sarah Johnson, a former university professor who saw the need for a more personalized and effective online learning platform. What started as a small project to help her own students has grown into a global platform serving thousands of learners worldwide.
          </p>
          <p className="text-lg mb-6 text-gray-700">
            Our journey has been guided by a simple principle: learning should be accessible, engaging, and effective. With this in mind, we've built a platform that puts the learner at the center of everything we do.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            <div className="rounded-xl overflow-hidden">
              <img
                src="/images/about-story-1.jpg"
                alt="Early days of LearnLeap"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="rounded-xl overflow-hidden">
              <img
                src="/images/about-story-2.jpg"
                alt="LearnLeap team meeting"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-6 text-center">Our Team</h2>
          <p className="text-lg mb-10 text-gray-700 text-center max-w-3xl mx-auto">
            LearnLeap is powered by a passionate team of educators, technologists, and designers who share a common vision: to transform online education for the better.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <Card key={member.name} className="border-none shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="flex justify-center pb-2">
                  <Avatar className="w-24 h-24">
                    <AvatarImage src={member.avatar} alt={member.name} />
                    <AvatarFallback className="bg-[#00C4B4]/10 text-[#00C4B4] text-xl">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                </CardHeader>
                <CardContent className="text-center">
                  <h3 className="font-bold text-lg text-[#1A3C34]">{member.name}</h3>
                  <p className="text-[#00C4B4] font-medium mb-2">{member.role}</p>
                  <p className="text-gray-600 text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h2 className="text-3xl font-bold text-[#1A3C34] mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-[#1A3C34] p-6 rounded-xl text-white">
              <h3 className="font-bold text-xl mb-3">Accessibility</h3>
              <p>We believe that education should be accessible to everyone, regardless of background, location, or circumstances.</p>
            </div>
            <div className="bg-[#00C4B4] p-6 rounded-xl text-white">
              <h3 className="font-bold text-xl mb-3">Quality</h3>
              <p>We are committed to providing high-quality learning experiences that are engaging, effective, and enjoyable.</p>
            </div>
            <div className="bg-[#F4D03F] p-6 rounded-xl text-[#1A3C34]">
              <h3 className="font-bold text-xl mb-3">Innovation</h3>
              <p>We continuously seek new ways to improve the learning experience through innovative technology and pedagogy.</p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default AboutUs;
