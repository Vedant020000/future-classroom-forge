
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Clock, Users, BookOpen } from "lucide-react";

export const CreateLessonPlanPage = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    subject: "",
    grade: "",
    duration: "",
    outline: "",
    objectives: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Sparkles className="h-8 w-8 text-blue-400" />
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Lesson Plan Generator</h1>
          <p className="text-gray-400">Create engaging lesson plans with AI assistance</p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center gap-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNumber
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-400"
              }`}
            >
              {stepNumber}
            </div>
            <span className={`text-sm ${step >= stepNumber ? "text-white" : "text-gray-400"}`}>
              {stepNumber === 1 && "Basic Info"}
              {stepNumber === 2 && "Outline & Objectives"}
              {stepNumber === 3 && "AI Questions"}
            </span>
            {stepNumber < 3 && (
              <div className={`w-8 h-0.5 ${step > stepNumber ? "bg-blue-600" : "bg-gray-700"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                {step === 1 && "Step 1: Basic Information"}
                {step === 2 && "Step 2: Lesson Outline & Objectives"}
                {step === 3 && "Step 3: AI Enhancement Questions"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {step === 1 && "Provide the fundamental details about your lesson"}
                {step === 2 && "Define your lesson structure and learning goals"}
                {step === 3 && "Answer AI questions to personalize your lesson plan"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {step === 1 && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white">Lesson Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        placeholder="e.g., Introduction to Fractions"
                        className="bg-gray-700 border-gray-600 text-white"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-white">Subject</Label>
                      <Select onValueChange={(value) => handleInputChange("subject", value)}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="mathematics">Mathematics</SelectItem>
                          <SelectItem value="science">Science</SelectItem>
                          <SelectItem value="history">History</SelectItem>
                          <SelectItem value="english">English Language Arts</SelectItem>
                          <SelectItem value="art">Art</SelectItem>
                          <SelectItem value="music">Music</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="grade" className="text-white">Grade Level</Label>
                      <Select onValueChange={(value) => handleInputChange("grade", value)}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select grade" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="k">Kindergarten</SelectItem>
                          <SelectItem value="1">1st Grade</SelectItem>
                          <SelectItem value="2">2nd Grade</SelectItem>
                          <SelectItem value="3">3rd Grade</SelectItem>
                          <SelectItem value="4">4th Grade</SelectItem>
                          <SelectItem value="5">5th Grade</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="duration" className="text-white">Duration</Label>
                      <Select onValueChange={(value) => handleInputChange("duration", value)}>
                        <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent className="bg-gray-700 border-gray-600">
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}

              {step === 2 && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="outline" className="text-white">Lesson Outline</Label>
                    <Textarea
                      id="outline"
                      value={formData.outline}
                      onChange={(e) => handleInputChange("outline", e.target.value)}
                      placeholder="Provide a brief outline of your lesson structure..."
                      className="bg-gray-700 border-gray-600 text-white min-h-32"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="objectives" className="text-white">Learning Objectives</Label>
                    <Textarea
                      id="objectives"
                      value={formData.objectives}
                      onChange={(e) => handleInputChange("objectives", e.target.value)}
                      placeholder="What should students learn or be able to do by the end of this lesson?"
                      className="bg-gray-700 border-gray-600 text-white min-h-32"
                    />
                  </div>
                </>
              )}

              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center p-6 bg-gray-700 rounded-lg">
                    <Sparkles className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">AI Enhancement in Progress</h3>
                    <p className="text-gray-400">
                      Our AI is analyzing your lesson plan and will ask targeted questions to create
                      the most effective teaching experience for your students.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="p-4 bg-blue-600/20 border border-blue-600/30 rounded-lg">
                      <h4 className="text-white font-medium mb-2">Sample AI Question:</h4>
                      <p className="text-gray-300 mb-3">
                        "Based on your math lesson about fractions, would you like me to include
                        visual aids like pie charts or fraction bars to help students understand the concept better?"
                      </p>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">Yes, include visual aids</Button>
                        <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">No, keep it simple</Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1}
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Previous
                </Button>
                <Button
                  onClick={handleNext}
                  disabled={step === 3}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {step === 3 ? "Generate Plan" : "Next"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.title ? "bg-green-400" : "bg-gray-600"}`} />
                <span className="text-sm text-gray-300">Basic Information</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${formData.outline ? "bg-green-400" : "bg-gray-600"}`} />
                <span className="text-sm text-gray-300">Lesson Outline</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-600" />
                <span className="text-sm text-gray-300">AI Enhancement</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-2">
                <Clock className="h-4 w-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">AI generation typically takes 2-3 minutes</p>
              </div>
              <div className="flex gap-2">
                <Users className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Include student data for personalized suggestions</p>
              </div>
              <div className="flex gap-2">
                <BookOpen className="h-4 w-4 text-purple-400 mt-0.5 flex-shrink-0" />
                <p className="text-gray-300">Detailed outlines produce better results</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
