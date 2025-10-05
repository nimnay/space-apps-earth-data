import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.type || !data.location || !data.description || !data.severity) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Generate a unique report ID
    const reportId = `ER${Date.now()}`;

    // Log the report (replace this with your database storage logic)
    console.log('Emergency Report Received:', {
      id: reportId,
      ...data,
      timestamp: new Date().toISOString(),
    });

    // Send notifications for critical reports
    if (data.severity === 'critical' || data.severity === 'high') {
      // TODO: Implement notification system
      console.log('High priority alert triggered');
    }

    return NextResponse.json({
      message: 'Report submitted successfully',
      reportId,
    }, { status: 201 });

  } catch (error) {
    console.error('Error processing report:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}