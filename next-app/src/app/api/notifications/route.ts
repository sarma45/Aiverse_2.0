import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Notification from '@/lib/models/Notification';
import { getCurrentUser } from '@/lib/authUtils';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const notifications = await Notification.find({ user: decoded.id }).sort('-createdAt');
    return NextResponse.json({ status: 'success', data: { notifications } });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await dbConnect();
    
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = await getCurrentUser();
    if (!decoded) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    
    const body = await req.json();
    const { notificationId } = body;

    await Notification.findOneAndUpdate(
      { _id: notificationId, user: decoded.id },
      { isRead: true }
    );

    return NextResponse.json({ status: 'success', message: 'Notification marked as read' });
  } catch (error: unknown) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
