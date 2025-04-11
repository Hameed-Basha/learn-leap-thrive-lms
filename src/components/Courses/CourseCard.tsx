
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/services/courseService';
import { useNavigate } from 'react-router-dom';
import { Users, Clock, Star, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();
  
  // Calculate random rating between 4.0 and 5.0 for demo purposes
  const rating = (4 + Math.random()).toFixed(1);
  
  return (
    <Card className="overflow-hidden flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={course.thumbnail || '/placeholder.svg'}
          alt={course.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
        {course.level && (
          <Badge className="absolute top-2 right-2 bg-[#00C4B4]">
            {course.level}
          </Badge>
        )}
      </div>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-1 mb-1">
          <Star className="w-4 h-4 fill-[#F4D03F] text-[#F4D03F]" />
          <span className="text-sm font-medium">{rating}</span>
        </div>
        <CardTitle className="line-clamp-1 text-[#1A3C34]">{course.title}</CardTitle>
        <CardDescription className="flex items-center gap-1">
          <span>by</span> {course.instructor_name || 'Unknown Instructor'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Users className="h-4 w-4 mr-1" />
          <span>{course.enrollment_count || 0} students</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4 mr-1" />
          <span>{course.level}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {course.progress !== undefined ? (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2 mb-3 bg-gray-100">
              <div 
                className="h-full bg-[#00C4B4]" 
                style={{ width: `${course.progress}%` }}
              />
            </Progress>
            <Button 
              className="w-full bg-[#00C4B4] hover:bg-[#00A8A0] text-white transition-all hover:shadow"
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full bg-[#00C4B4] hover:bg-[#00A8A0] text-white transition-all hover:shadow"
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            Enroll Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
