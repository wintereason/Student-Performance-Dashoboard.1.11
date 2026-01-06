import { useState } from 'react';
import { seedDatabase } from '../services/seedDatabase';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Database, Loader } from 'lucide-react';

export function DatabaseSeeder() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSeedDatabase = async () => {
    setIsLoading(true);
    setMessage(null);
    
    try {
      const result = await seedDatabase();
      if (result.success) {
        setMessage({ type: 'success', text: '✅ Database seeded successfully! Refresh the page to see the data.' });
      } else {
        setMessage({ type: 'error', text: `❌ ${result.message}` });
      }
    } catch (error) {
      setMessage({ type: 'error', text: '❌ Failed to seed database' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-blue-400" />
          Database Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-300">
          Click the button below to populate the database with sample students, subjects, and exam data.
        </p>
        
        <button
          onClick={handleSeedDatabase}
          disabled={isLoading}
          className={`w-full px-4 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors ${
            isLoading
              ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin h-4 w-4" />
              Seeding Database...
            </>
          ) : (
            'Seed Database with Sample Data'
          )}
        </button>

        {message && (
          <div className={`p-3 rounded-lg text-sm ${
            message.type === 'success'
              ? 'bg-green-900/30 text-green-400 border border-green-700/30'
              : 'bg-red-900/30 text-red-400 border border-red-700/30'
          }`}>
            {message.text}
          </div>
        )}

        <div className="text-xs text-slate-400 space-y-1 pt-2 border-t border-slate-700">
          <p><strong>This will insert:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>8 Sample Students (with varying GPAs and attendance)</li>
            <li>5 Subjects (Mathematics, Physics, Chemistry, English, Computer Science)</li>
            <li>10 Exam Records (CT-1 and CT-2 for each subject)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
