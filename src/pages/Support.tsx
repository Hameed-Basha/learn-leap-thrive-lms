
import { PageContainer } from '@/components/Layout/PageContainer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { MessageCircle, Mail, Phone, HelpCircle, FileText, BookOpen, School } from 'lucide-react';

const Support = () => {
  // FAQ data
  const faqs = [
    {
      question: "How do I enroll in a course?",
      answer: "To enroll in a course, navigate to the Courses page, select the course you're interested in, and click the 'Enroll Now' button. If you're not logged in, you'll be prompted to create an account first."
    },
    {
      question: "Can I access my courses on mobile devices?",
      answer: "Yes! All LearnLeap courses are fully responsive and can be accessed on smartphones, tablets, laptops, and desktop computers."
    },
    {
      question: "How do I track my progress in a course?",
      answer: "Your progress is automatically tracked as you complete lessons and assessments. You can view your overall progress on your Dashboard, and detailed progress within each course page."
    },
    {
      question: "How do I download my certificates?",
      answer: "After completing a course, you'll receive a certificate of completion. You can download your certificates from the 'My Certificates' section in your Dashboard."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit and debit cards, PayPal, and bank transfers for our premium courses. All payments are processed securely through our payment partners."
    },
    {
      question: "Can I get a refund if I'm not satisfied with a course?",
      answer: "Yes, we offer a 30-day money-back guarantee for all our premium courses. If you're not satisfied for any reason, contact our support team within 30 days of purchase."
    },
  ];

  return (
    <PageContainer title="Support & Help Center" withSidebar={false}>
      <div className="max-w-4xl mx-auto">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-[#1A3C34] to-[#00C4B4] rounded-xl p-8 mb-12 text-white text-center">
          <HelpCircle className="w-16 h-16 mx-auto mb-4" />
          <h2 className="text-3xl font-bold mb-4">How can we help you?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Browse our help resources or contact our support team for assistance.
          </p>
          <div className="relative max-w-lg mx-auto">
            <Input 
              type="text" 
              placeholder="Search for answers..." 
              className="pl-4 pr-10 py-6 rounded-full text-black bg-white/95 border-0 shadow-lg" 
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Support Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <BookOpen className="h-8 w-8 text-[#00C4B4]" />
              <CardTitle className="text-lg">Course Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Get help with course access, content, and technical issues.</p>
              <Button variant="outline" className="w-full">View Guides</Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <FileText className="h-8 w-8 text-[#00C4B4]" />
              <CardTitle className="text-lg">Account & Billing</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Help with your account, payments, and subscription issues.</p>
              <Button variant="outline" className="w-full">View Guides</Button>
            </CardContent>
          </Card>
          
          <Card className="transition-all hover:shadow-md">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
              <School className="h-8 w-8 text-[#00C4B4]" />
              <CardTitle className="text-lg">Certificates</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Information about course certificates and accreditation.</p>
              <Button variant="outline" className="w-full">View Guides</Button>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1A3C34] mb-6">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-lg font-medium text-[#1A3C34]">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-2xl font-bold text-[#1A3C34] mb-6">Contact Us</h2>
            <p className="text-gray-600 mb-6">
              Can't find what you're looking for? Our support team is here to help.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Mail className="h-6 w-6 text-[#00C4B4] mt-1" />
                <div>
                  <h3 className="font-medium text-[#1A3C34]">Email Support</h3>
                  <p className="text-gray-600">support@learnleap.com</p>
                  <p className="text-sm text-gray-500">Response within 24 hours</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <MessageCircle className="h-6 w-6 text-[#00C4B4] mt-1" />
                <div>
                  <h3 className="font-medium text-[#1A3C34]">Live Chat</h3>
                  <p className="text-gray-600">Available Mon-Fri, 9am-5pm EST</p>
                  <Button variant="link" className="p-0 h-auto text-[#00C4B4]">Start Chat</Button>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <Phone className="h-6 w-6 text-[#00C4B4] mt-1" />
                <div>
                  <h3 className="font-medium text-[#1A3C34]">Phone Support</h3>
                  <p className="text-gray-600">+1 (555) 123-4567</p>
                  <p className="text-sm text-gray-500">Available for Premium Members</p>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-[#1A3C34] mb-6">Send a Message</h2>
            <form className="space-y-4">
              <div>
                <Input type="text" placeholder="Your Name" className="w-full" />
              </div>
              <div>
                <Input type="email" placeholder="Email Address" className="w-full" />
              </div>
              <div>
                <Input type="text" placeholder="Subject" className="w-full" />
              </div>
              <div>
                <Textarea placeholder="Your Message" className="w-full h-32" />
              </div>
              <Button className="w-full bg-[#00C4B4] hover:bg-[#00A8A0]">Send Message</Button>
            </form>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default Support;
