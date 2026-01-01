import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Card } from "./ui/card";

interface EditMarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentId: number;
  subjectId: number;
  subjectName: string;
  initialValues: {
    assignment: number;
    test: number;
    project: number;
    quiz: number;
  };
  onSave: (updatedData: any) => void;
}

export function EditMarksModal({
  isOpen,
  onClose,
  studentId,
  subjectId,
  subjectName,
  initialValues,
  onSave,
}: EditMarksModalProps) {
  const [assignment, setAssignment] = useState(initialValues.assignment);
  const [test, setTest] = useState(initialValues.test);
  const [project, setProject] = useState(initialValues.project);
  const [quiz, setQuiz] = useState(initialValues.quiz);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setAssignment(initialValues.assignment);
      setTest(initialValues.test);
      setProject(initialValues.project);
      setQuiz(initialValues.quiz);
      setError("");
    }
  }, [isOpen, initialValues]);

  // Auto-calculate totals
  const totalMarks = assignment + test + project + quiz;
  const maxMarks = 100;
  const percentage = (totalMarks / maxMarks) * 100;

  const handleSave = async () => {
    // Validate values
    if (assignment < 0 || assignment > 20) {
      setError("Assignment must be between 0 and 20");
      return;
    }
    if (test < 0 || test > 25) {
      setError("Test must be between 0 and 25");
      return;
    }
    if (project < 0 || project > 25) {
      setError("Project must be between 0 and 25");
      return;
    }
    if (quiz < 0 || quiz > 15) {
      setError("Quiz must be between 0 and 15");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/subjects/student/${studentId}/subject/${subjectId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            assignment,
            test,
            project,
            quiz,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to update marks");
        return;
      }

      // Transform response data to match expected format
      const responseData = result.data;
      onSave({
        id: subjectId,
        assignment: responseData.assignment,
        test: responseData.test,
        project: responseData.project,
        quiz: responseData.quiz,
        marks: responseData.marks,
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Error updating marks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-slate-800 border-slate-700 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-100">Edit Marks</DialogTitle>
          <DialogDescription className="text-slate-400">
            {subjectName} - Student ID: {studentId}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Component Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            {/* Assignment */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Assignment (0-20)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="20"
                  value={assignment === 0 ? "" : assignment}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  onChange={(e) => setAssignment(e.target.value === "" ? 0 : Math.max(0, Math.min(20, parseFloat(e.target.value) || 0)))}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setAssignment(0);
                    }
                  }}
                  className="bg-slate-700 border-slate-600 text-slate-100 flex-1"
                />
                <span className="text-slate-400">/20</span>
              </div>
            </div>

            {/* Test */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Test (0-25)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="25"
                  value={test === 0 ? "" : test}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  onChange={(e) => setTest(e.target.value === "" ? 0 : Math.max(0, Math.min(25, parseFloat(e.target.value) || 0)))}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setTest(0);
                    }
                  }}
                  className="bg-slate-700 border-slate-600 text-slate-100 flex-1"
                />
                <span className="text-slate-400">/25</span>
              </div>
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Project (0-25)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="25"
                  value={project === 0 ? "" : project}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  onChange={(e) => setProject(e.target.value === "" ? 0 : Math.max(0, Math.min(25, parseFloat(e.target.value) || 0)))}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setProject(0);
                    }
                  }}
                  className="bg-slate-700 border-slate-600 text-slate-100 flex-1"
                />
                <span className="text-slate-400">/25</span>
              </div>
            </div>

            {/* Quiz */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Quiz (0-15)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  min="0"
                  max="15"
                  value={quiz === 0 ? "" : quiz}
                  onFocus={(e) => {
                    if (e.target.value === "0") {
                      e.target.value = "";
                    }
                  }}
                  onChange={(e) => setQuiz(e.target.value === "" ? 0 : Math.max(0, Math.min(15, parseFloat(e.target.value) || 0)))}
                  onBlur={(e) => {
                    if (e.target.value === "") {
                      setQuiz(0);
                    }
                  }}
                  className="bg-slate-700 border-slate-600 text-slate-100 flex-1"
                />
                <span className="text-slate-400">/15</span>
              </div>
            </div>
          </div>

          {/* Auto-Calculated Summary */}
          <Card className="bg-slate-700/50 border-slate-600 p-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-100">Auto-Calculated Values</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-slate-400">Total Marks</p>
                  <p className="text-2xl font-bold text-blue-400">{totalMarks.toFixed(1)}/100</p>
                </div>
                <div>
                  <p className="text-sm text-slate-400">Percentage</p>
                  <p
                    className={`text-2xl font-bold ${
                      percentage >= 80
                        ? "text-green-400"
                        : percentage >= 60
                        ? "text-yellow-400"
                        : "text-red-400"
                    }`}
                  >
                    {percentage.toFixed(1)}%
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-400 pt-2">
                <p>🔄 Total = Assignment + Test + Project + Quiz</p>
                <p>🔄 Percentage = (Total / 100) × 100</p>
                <p>🔄 Updates live in Student Marks History & Pie Chart</p>
              </div>
            </div>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-900/30 border border-red-700 text-red-300 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 transition disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
