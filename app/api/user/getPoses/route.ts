import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { User } from '@/models/user';

export async function GET(req: NextRequest) {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');

    if (!email) {
        return NextResponse.json({ message: 'Missing email' }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        return NextResponse.json(
            {
                message: 'Poses retrieved successfully',
                poses: user.customPoses || [],
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error retrieving poses:", error);
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
