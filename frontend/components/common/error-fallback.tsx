import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorFallback({ title = 'Something went wrong', message = 'Please try again later.', onRetry }: ErrorFallbackProps) {
  return (
    <Card className="border border-red-900 bg-red-950 m-4">
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <CardTitle className="text-red-400">{title}</CardTitle>
        </div>
        <CardDescription className="text-red-300">{message}</CardDescription>
      </CardHeader>
      {onRetry && (
        <CardContent>
          <Button onClick={onRetry} variant="outline" className="border-red-700 text-red-400 hover:bg-red-900">
            Try again
          </Button>
        </CardContent>
      )}
    </Card>
  );
}
