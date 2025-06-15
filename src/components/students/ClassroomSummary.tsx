
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wand2, Users, Calendar, RefreshCw } from "lucide-react";
import { useClassroomSummary } from "@/hooks/useClassroomSummary";
import { formatDistanceToNow } from "date-fns";

export const ClassroomSummary = () => {
  const { summary, isLoading, generateSummary, isGenerating } = useClassroomSummary();

  if (isLoading) {
    return (
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5 text-primary" />
            Classroom AI Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-secondary rounded w-3/4"></div>
            <div className="h-4 bg-secondary rounded w-1/2"></div>
            <div className="h-4 bg-secondary rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Wand2 className="h-5 w-5 text-primary" />
              Classroom AI Summary
            </CardTitle>
            <CardDescription>
              AI-generated insights about your students to help with lesson planning
            </CardDescription>
          </div>
          <Button
            onClick={() => generateSummary()}
            disabled={isGenerating}
            variant="outline"
            size="sm"
            className="border-border"
          >
            {isGenerating ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            {isGenerating ? 'Generating...' : summary ? 'Regenerate' : 'Generate Summary'}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary ? (
          <>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <Badge variant="secondary" className="bg-secondary">
                <Users className="h-3 w-3 mr-1" />
                {summary.student_count} Students
              </Badge>
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                Generated {formatDistanceToNow(new Date(summary.generated_at), { addSuffix: true })}
              </div>
            </div>
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-foreground leading-relaxed">
                {summary.summary}
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Wand2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p className="text-lg font-medium mb-2">No classroom summary yet</p>
            <p className="text-sm mb-4">
              Generate an AI-powered summary of your students to get insights for lesson planning
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
