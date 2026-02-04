import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/utils/db';
import { User, IPose } from '@/models/user';

export async function POST(req: NextRequest) {
    await connectDB();

    let body;
    try {
        body = await req.json();
    } catch (error) {
        return NextResponse.json({ message: 'Invalid JSON' }, { status: 400 });
    }

    const { email, poseData } = body;

    if (!email || !poseData) {
        return NextResponse.json({ message: 'Missing email or poseData' }, { status: 400 });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (!user.customPoses) {
            user.customPoses = [];
        }

        const newPose: IPose = {
            keypoints: poseData.keypoints || [],
            createdAt: new Date(),
        };

        user.customPoses.push(newPose);
        await user.save();

        console.log("Pose saved for user:", email);

        return NextResponse.json(
            {
                message: 'Pose saved successfully',
                pose: newPose,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Error saving pose:", error);
        return NextResponse.json(
            { message: 'Server error', error: error.message },
            { status: 500 }
        );
    }
}
