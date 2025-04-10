
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Course } from '@/data/mockData';
import { useNavigate } from 'react-router-dom';
import { Users, Clock } from 'lucide-react';

interface CourseCardProps {
  course: Course;
}

export const CourseCard = ({ course }: CourseCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="overflow-hidden flex flex-col h-full">
      <div className="h-48 overflow-hidden">
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader>
        <CardTitle className="line-clamp-1">{course.title}</CardTitle>
        <CardDescription>{course.instructor}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{course.description}</p>
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Users className="h-4 w-4 mr-1" />
          <span>{course.enrollmentCount} students</span>
        </div>
        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>{course.duration}</span>
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        {course.progress !== undefined ? (
          <div className="w-full">
            <div className="flex justify-between text-xs mb-1">
              <span>Progress</span>
              <span>{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2 mb-3" />
            <Button 
              className="w-full" 
              onClick={() => navigate(`/courses/${course.id}`)}
            >
              {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => navigate(`/courses/${course.id}`)}
          >
            View Course
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
