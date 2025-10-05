"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";

interface ReportForm {
  type: string;
  location: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  contact: string;
  imageUrl?: string;
}

interface SubmissionStatus {
  state: 'idle' | 'submitting' | 'success' | 'error';
  message?: string;
  reportId?: string;
}

export default function ReportPage() {
  const searchParams = new URLSearchParams(window?.location?.search);
  const initialLat = searchParams.get('lat');
  const initialLng = searchParams.get('lng');
  
  const [formData, setFormData] = useState<ReportForm>({
    type: "wildfire",
    location: initialLat && initialLng ? `${initialLat}, ${initialLng}` : "",
    description: "",
    severity: "medium",
    contact: "",
  });

  const [status, setStatus] = useState<SubmissionStatus>({
    state: 'idle'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ state: 'submitting' });

    try {
      const response = await fetch('/api/report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit report');
      }

      setStatus({ 
        state: 'success', 
        message: 'Your report has been submitted successfully. Emergency services have been notified.',
        reportId: data.reportId 
      });

      // Reset form after successful submission
      setFormData({
        type: "wildfire",
        location: "",
        description: "",
        severity: "medium",
        contact: "",
      });

      // Reset status after 5 seconds
      setTimeout(() => {
        setStatus({ state: 'idle' });
      }, 5000);

    } catch (error) {
      setStatus({ 
        state: 'error', 
        message: error instanceof Error ? error.message : 'Failed to submit report'
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <AlertTriangle className="w-8 h-8 text-red-500" />
          <h1 className="text-3xl font-bold">Report Environmental Emergency</h1>
        </div>
        
        {status.state === 'success' && (
          <Card className="p-4 mb-6 bg-green-500/10 border-green-500 flex items-center gap-3">
            <CheckCircle className="text-green-500 w-5 h-5" />
            <div>
              <p className="font-medium text-green-500">Report Submitted Successfully</p>
              <p className="text-sm text-muted-foreground">Report ID: {status.reportId}</p>
            </div>
          </Card>
        )}

        {status.state === 'error' && (
          <Card className="p-4 mb-6 bg-red-500/10 border-red-500">
            <p className="text-red-500">{status.message}</p>
          </Card>
        )}

        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">Emergency Type</label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                disabled={status.state === 'submitting'}
                required
              >
                <option value="wildfire">Wildfire</option>
                <option value="smoke">Heavy Smoke</option>
                <option value="ash">Falling Ash</option>
                <option value="airQuality">Poor Air Quality</option>
                <option value="other">Other Environmental Emergency</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Location</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-background"
                placeholder="Enter address or coordinates"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                disabled={status.state === 'submitting'}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Severity Level</label>
              <select
                className="w-full p-2 border rounded-md bg-background"
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as ReportForm["severity"] })}
                disabled={status.state === 'submitting'}
                required
              >
                <option value="low">Low - Monitoring Required</option>
                <option value="medium">Medium - Immediate Attention Needed</option>
                <option value="high">High - Dangerous Situation</option>
                <option value="critical">Critical - Life-Threatening</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Description</label>
              <textarea
                className="w-full p-2 border rounded-md bg-background min-h-[100px]"
                placeholder="Describe the situation in detail..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                disabled={status.state === 'submitting'}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">Contact Information (Optional)</label>
              <input
                type="text"
                className="w-full p-2 border rounded-md bg-background"
                placeholder="Phone number or email for follow-up"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                disabled={status.state === 'submitting'}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setFormData({
                    type: "wildfire",
                    location: "",
                    description: "",
                    severity: "medium",
                    contact: "",
                  });
                  setStatus({ state: 'idle' });
                }}
                disabled={status.state === 'submitting'}
              >
                Clear Form
              </Button>
              <Button 
                type="submit" 
                className="bg-red-500 hover:bg-red-600"
                disabled={status.state === 'submitting'}
              >
                {status.state === 'submitting' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Emergency Report'
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}